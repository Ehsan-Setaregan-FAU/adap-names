import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        // Calls the AbstractName constructor, which sets the delimiter and checks the Class Invariant.
        super(delimiter); 
        this.components = source;
    }

    // --- IMPLEMENTATION OF ABSTRACT PRIMITIVES (Inheritance Interface) ---

    /**
     * Primitive: Provides the list of components (Read access to state).
     * This is required by AbstractName.
     */
    protected getComponentList(): string[] {
        return this.components;
    }

    /**
     * Primitive: Updates the list of components (Write access to state).
     * This is required by AbstractName.
     */
    protected setComponentList(components: string[]): void {
        this.components = components;
    }

    // --- CLONEABLE IMPLEMENTATION ---
    // This public method is implemented here because it must return the specific type StringArrayName (subclass).
    public clone(): Name {
        // Returns a deep copy of the current instance
        return new StringArrayName([...this.components], this.delimiter);
    }
    
    // All other methods (asString, append, remove, etc.) are inherited from AbstractName.
    // The previous throw new Error methods are now deleted as they are redundant.
}