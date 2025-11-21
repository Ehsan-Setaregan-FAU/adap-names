import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = source;
    }

    // --- REQUIRED ABSTRACT METHODS ---
    // These simply expose the internal component list to the base class.

    protected getComponentList(): string[] {
        return this.components;
    }

    protected setComponentList(components: string[]): void {
        this.components = components;
    }

    // --- CLONE METHOD ---
    // Creates a new instance with the same delimiter and a copied component list.
    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }
}