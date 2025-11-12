import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

// escape special regex characters so they can be used safely in patterns
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

    // return the name as a single string, escaping delimiters if needed
    public asString(delimiter: string = this.delimiter): string {
        const DELIMITER_REGEX = escapeRegex(delimiter);

        const escapedComponents = this.components.map(c => {
            // escape backslashes first
            let escaped = c.replace(new RegExp(ESCAPE_CHARACTER_REGEX, 'g'), ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            // then escape the delimiter itself
            escaped = escaped.replace(new RegExp(DELIMITER_REGEX, 'g'), ESCAPE_CHARACTER + delimiter);
            return escaped;
        });

        return escapedComponents.join(delimiter);
    }

    // convert to a string using the default delimiter
    public asDataString(): string {
        return this.asString(DEFAULT_DELIMITER);
    }

    // get the current delimiter character
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // check if there are no components
    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    // number of components
    public getNoComponents(): number {
        return this.components.length;
    }

    // return the component at index i
    public getComponent(i: number): string {
        return this.components[i];
    }

    // update a specific component
    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    // insert a component at a specific index
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    // add a new component to the end
    public append(c: string): void {
        this.components.push(c);
    }

    // remove a component by index
    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    // merge another Name into this one
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }
}