import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

// Utility to escape regex meta characters so they can be used safely in patterns
const escapeRegex = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const ESCAPE_CHARACTER_REGEX = escapeRegex(ESCAPE_CHARACTER);

export abstract class AbstractName implements Name {
    protected delimiter: string = DEFAULT_DELIMITER;

    // --- PRIMITIVE METHODS ---
    // These must be implemented by subclasses, since they define how the internal
    // component list is stored and updated.
    protected abstract getComponentList(): string[];
    protected abstract setComponentList(components: string[]): void;

    // --- CONSTRUCTION & CLONING ---
    // Base constructor; subclasses can pass a different delimiter if needed.
    protected constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }
    
    // clone() must be implemented in the subclasses because each concrete type
    // knows how to recreate its own representation.
    public abstract clone(): Name;

    // --- GENERAL METHODS BUILT ON TOP OF THE PRIMITIVES ---
    
    // Convert components to a string, escaping delimiter characters as needed.
    public asString(delimiter: string = this.delimiter): string {
        const components = this.getComponentList();
        const DELIMITER_REGEX = escapeRegex(delimiter);
        
        const escapedComponents = components.map(c => {
            // escape the escape character itself
            let escaped = c.replace(new RegExp(ESCAPE_CHARACTER_REGEX, 'g'), ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            // escape the delimiter so it’s not misinterpreted
            escaped = escaped.replace(new RegExp(DELIMITER_REGEX, 'g'), ESCAPE_CHARACTER + delimiter);
            return escaped;
        });
        
        return escapedComponents.join(delimiter);
    }

    // Fallback string representation
    public toString(): string {
        return this.asDataString();
    }
    
    // Convert to a string using the default delimiter format
    public asDataString(): string {
        return this.asString(DEFAULT_DELIMITER);
    }

    // Compare two names based on their serialized form
    public isEqual(other: Name): boolean {
        return this.asDataString() === other.asDataString();
    }

    // Simple hash function based on the serialized form
    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    // True when there are no components
    public isEmpty(): boolean {
        return this.getComponentList().length === 0;
    }

    // Return the delimiter currently being used
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // Number of components in the name
    public getNoComponents(): number {
        return this.getComponentList().length;
    }

    // Get a specific component by index
    public getComponent(i: number): string {
        return this.getComponentList()[i];
    }

    // Replace a component at a given index
    public setComponent(i: number, c: string): void {
        const components = this.getComponentList();
        components[i] = c;
        this.setComponentList(components);
    }

    // Insert a component into a specific position
    public insert(i: number, c: string): void {
        const components = this.getComponentList();
        components.splice(i, 0, c);
        this.setComponentList(components);
    }

    // Append a new component at the end
    public append(c: string): void {
        const components = this.getComponentList();
        components.push(c);
        this.setComponentList(components);
    }

    // Remove a component from the given index
    public remove(i: number): void {
        const components = this.getComponentList();
        components.splice(i, 1);
        this.setComponentList(components);
    }

    // Append all components from another Name instance
    public concat(other: Name): void {
        const components = this.getComponentList();
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        this.setComponentList(components);
    }
}