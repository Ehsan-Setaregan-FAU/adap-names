import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

// Helper functions (needed for escaping/parsing)
const escapeRegex = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const ESCAPE_CHARACTER_REGEX = escapeRegex(ESCAPE_CHARACTER);

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    // --- PROTECTED ASSERTION METHODS (The internal contract logic) ---

    protected assertValidIndex(i: number, max: number, message: string): void {
        // P1: Index for access/mutation must be within [0, length-1]
        IllegalArgumentException.assert(i >= 0 && i < max, message);
    }

    protected assertValidInsertionIndex(i: number, max: number, message: string): void {
        // P2: Index for insertion must be within [0, length]
        IllegalArgumentException.assert(i >= 0 && i <= max, message);
    }

    protected assertValidComponent(c: string, message: string): void {
        // P3: Component must not be null/undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, message);
    }
    
    protected checkClassInvariant(): void {
        // CI1: Delimiter must be a single character
        InvalidStateException.assert(this.delimiter !== null && this.delimiter.length === 1, "Class Invariant failed: Delimiter must be a single character.");
    }
    
    // --- ABSTRACT PRIMITIVES (Inheritance Interface) ---
    // These remain abstract because they depend on the storage implementation (array vs string)
    protected abstract getComponentList(): string[];
    protected abstract setComponentList(components: string[]): void;

    // --- CONCRETE METHODS (Composed Logic) ---
    // These are implemented HERE so subclasses inherit them.

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // Precondition on constructor
        IllegalArgumentException.assert(delimiter !== null && delimiter !== undefined, "Delimiter must be provided (Precondition).");
        this.delimiter = delimiter;
        // Class Invariant is checked *after* initialization
        this.checkClassInvariant();
    }

    public asString(delimiter: string = this.delimiter): string {
        // Precondition on argument
        IllegalArgumentException.assert(delimiter !== null && delimiter !== undefined, "Delimiter must be provided (Precondition).");

        const components = this.getComponentList();
        const DELIMITER_REGEX = escapeRegex(delimiter);
        
        const escapedComponents = components.map(c => {
            let escaped = c.replace(new RegExp(ESCAPE_CHARACTER_REGEX, 'g'), ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            escaped = escaped.replace(new RegExp(DELIMITER_REGEX, 'g'), ESCAPE_CHARACTER + delimiter);
            return escaped;
        });
        
        return escapedComponents.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        return this.asString(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        // Precondition
        IllegalArgumentException.assert(other !== null && other !== undefined, "Other name must be provided (Precondition).");
        return this.asDataString() === other.asDataString();
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getComponentList().length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.getComponentList().length;
    }

    public getComponent(i: number): string {
        // Precondition
        this.assertValidIndex(i, this.getNoComponents(), `Precondition failed: Index ${i} is invalid for getComponent.`);
        return this.getComponentList()[i];
    }

    public setComponent(i: number, c: string): void {
        const initialCount = this.getNoComponents();
        // Preconditions
        this.assertValidIndex(i, initialCount, `Precondition failed: Index ${i} is invalid for setComponent.`);
        this.assertValidComponent(c, "Precondition failed: Component must be valid.");

        // Execute mutation
        const components = this.getComponentList();
        components[i] = c;
        this.setComponentList(components);

        // Postcondition: Count must not change
        MethodFailedException.assert(this.getNoComponents() === initialCount, "Postcondition failed: Component count changed unexpectedly.");
        this.checkClassInvariant();
    }

    public insert(i: number, c: string): void {
        const initialCount = this.getNoComponents();
        // Preconditions
        this.assertValidInsertionIndex(i, initialCount, `Precondition failed: Index ${i} is invalid for insert.`);
        this.assertValidComponent(c, "Precondition failed: Component must be valid.");

        // Execute mutation
        const components = this.getComponentList();
        components.splice(i, 0, c);
        this.setComponentList(components);

        // Postcondition: Count must increase by one
        MethodFailedException.assert(this.getNoComponents() === initialCount + 1, "Postcondition failed: Component count did not increase.");
        this.checkClassInvariant();
    }

    public append(c: string): void {
        this.insert(this.getNoComponents(), c); // Use insert at the end
    }

    public remove(i: number): void {
        const initialCount = this.getNoComponents();
        // Precondition
        this.assertValidIndex(i, initialCount, `Precondition failed: Index ${i} is invalid for remove.`);

        // Execute mutation
        const components = this.getComponentList();
        components.splice(i, 1);
        this.setComponentList(components);

        // Postcondition: Count must decrease by one
        MethodFailedException.assert(this.getNoComponents() === initialCount - 1, "Postcondition failed: Component count did not decrease.");
        this.checkClassInvariant();
    }

    public concat(other: Name): void {
        const initialCount = this.getNoComponents();
        // Precondition
        IllegalArgumentException.assert(other !== null && other !== undefined, "Other name must be provided (Precondition).");

        // Execute mutation
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }

        // Postcondition: Count must be old count + other name's component count
        MethodFailedException.assert(this.getNoComponents() === initialCount + other.getNoComponents(), "Postcondition failed: Component count is incorrect after concat.");
        this.checkClassInvariant();
    }
    
    // Abstract clone method to be implemented by subclasses
    public abstract clone(): Name;
}