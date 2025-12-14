import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        // Calls the AbstractName constructor, which sets the delimiter and checks the Class Invariant.
        super(delimiter); 
        this.components = source;
    }

    // --- IMPLEMENTATION OF ABSTRACT PRIMITIVES ---

    protected getComponentList(): string[] {
        return this.components;
    }

    protected setComponentList(components: string[]): void {
        this.components = components;
    }

    // --- CLONEABLE IMPLEMENTATION ---
    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }
}