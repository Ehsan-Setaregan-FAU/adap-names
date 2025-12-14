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

    // --- PROTECTED ASSERTION METHODS ---

    protected assertValidIndex(i: number, max: number, message: string): void {
        IllegalArgumentException.assert(i >= 0 && i < max, message);
    }

    protected assertValidInsertionIndex(i: number, max: number, message: string): void {
        IllegalArgumentException.assert(i >= 0 && i <= max, message);
    }

    protected assertValidComponent(c: string, message: string): void {
        IllegalArgumentException.assert(c !== null && c !== undefined, message);
    }
    
    protected checkClassInvariant(): void {
        InvalidStateException.assert(this.delimiter !== null && this.delimiter.length === 1, "Class Invariant failed: Delimiter must be a single character.");
    }
    
    // --- ABSTRACT PRIMITIVES ---
    protected abstract getComponentList(): string[];
    protected abstract setComponentList(components: string[]): void;

    // --- CONCRETE METHODS ---

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(delimiter !== null && delimiter !== undefined, "Delimiter must be provided (Precondition).");
        this.delimiter = delimiter;
        this.checkClassInvariant();
    }

    public asString(delimiter: string = this.delimiter): string {
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
        this.assertValidIndex(i, this.getNoComponents(), `Precondition failed: Index ${i} is invalid for getComponent.`);
        return this.getComponentList()[i];
    }

    // --- IMMUTABLE MUTATORS ---
    // According to the requirement: "Make all value objects immutable objects"

    public setComponent(i: number, c: string): Name {
        const initialCount = this.getNoComponents();
        this.assertValidIndex(i, initialCount, `Precondition failed: Index ${i} is invalid for setComponent.`);
        this.assertValidComponent(c, "Precondition failed: Component must be valid.");

        // Clone first to ensure immutability
        const clone = this.clone() as AbstractName;
        const components = clone.getComponentList();
        
        // Mutate the clone
        components[i] = c;
        clone.setComponentList(components);

        MethodFailedException.assert(clone.getNoComponents() === initialCount, "Postcondition failed: Component count changed unexpectedly.");
        return clone;
    }

    public insert(i: number, c: string): Name {
        const initialCount = this.getNoComponents();
        this.assertValidInsertionIndex(i, initialCount, `Precondition failed: Index ${i} is invalid for insert.`);
        this.assertValidComponent(c, "Precondition failed: Component must be valid.");

        // Clone first
        const clone = this.clone() as AbstractName;
        const components = clone.getComponentList();

        // Mutate the clone
        components.splice(i, 0, c);
        clone.setComponentList(components);

        MethodFailedException.assert(clone.getNoComponents() === initialCount + 1, "Postcondition failed: Component count did not increase.");
        return clone;
    }

    public append(c: string): Name {
        return this.insert(this.getNoComponents(), c);
    }

    public remove(i: number): Name {
        const initialCount = this.getNoComponents();
        this.assertValidIndex(i, initialCount, `Precondition failed: Index ${i} is invalid for remove.`);

        // Clone first
        const clone = this.clone() as AbstractName;
        const components = clone.getComponentList();

        // Mutate the clone
        components.splice(i, 1);
        clone.setComponentList(components);

        MethodFailedException.assert(clone.getNoComponents() === initialCount - 1, "Postcondition failed: Component count did not decrease.");
        return clone;
    }

    public concat(other: Name): Name {
        IllegalArgumentException.assert(other !== null && other !== undefined, "Other name must be provided (Precondition).");

        // Clone 'this' to start accumulating changes
        const clone = this.clone() as AbstractName;
        const components = clone.getComponentList();

        // Append components from 'other' to the clone's list
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        clone.setComponentList(components);

        return clone;
    }
    
    public abstract clone(): Name;
}