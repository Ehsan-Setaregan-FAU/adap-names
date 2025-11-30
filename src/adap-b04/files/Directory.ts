import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        // Precondition: Child node must not be null
        IllegalArgumentException.assert(cn !== null && cn !== undefined, "Child node cannot be null");
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        // Precondition: Child node must not be null and must exist
        IllegalArgumentException.assert(cn !== null && cn !== undefined, "Child node cannot be null");
        IllegalArgumentException.assert(this.childNodes.has(cn), "Cannot remove a child node that does not exist");
        
        this.childNodes.delete(cn); 
    }

}