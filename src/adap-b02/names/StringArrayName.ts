import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

// Helper function to escape regex special characters
const escapeRegex = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const ESCAPE_CHARACTER_REGEX = escapeRegex(ESCAPE_CHARACTER);

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.components = source;
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        const DELIMITER_REGEX = escapeRegex(delimiter);

        const escapedComponents = this.components.map(c => {
            // 1. Escape the escape character itself (e.g., '\' becomes '\\')
            let escaped = c.replace(new RegExp(ESCAPE_CHARACTER_REGEX, 'g'), ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            // 2. Escape the delimiter (e.g., '.' becomes '\.')
            escaped = escaped.replace(new RegExp(DELIMITER_REGEX, 'g'), ESCAPE_CHARACTER + delimiter);
            return escaped;
        });

        return escapedComponents.join(delimiter);
    }

    public asDataString(): string {
        return this.asString(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }
    
}