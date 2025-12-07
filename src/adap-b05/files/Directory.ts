import { Node } from "./Node";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); 
    }

    /**
     * Override findNodes to search recursively in children
     */
    public findNodes(bn: string): Set<Node> {
        // 1. Check self first (using super implementation)
        let result: Set<Node>;
        try {
            result = super.findNodes(bn);
        } catch (error) {
             // Escalate internal error to ServiceFailureException
             throw new ServiceFailureException("Directory integrity failed", error as Exception);
        }

        // 2. Search recursively in all children
        for (const child of this.childNodes) {
            try {
                const childResults = child.findNodes(bn);
                // Add found nodes to our result set
                childResults.forEach(node => result.add(node));
            } catch (error) {
                // Handle the BuggyFile exception here by escalating it
                throw new ServiceFailureException("Search failed in child node", error as Exception);
            }
        }
        
        return result;
    }
}