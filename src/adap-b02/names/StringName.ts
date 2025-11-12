import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

// escape regex special characters so we can safely build dynamic patterns
const escapeRegex = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const ESCAPE_CHARACTER_REGEX = escapeRegex(ESCAPE_CHARACTER);

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    // split internal string into its component parts
    private getComponents(): string[] {
        if (this.name === "") {
            return [];
        }

        const components: string[] = [];
        let currentComponent = "";
        let isEscaped = false;

        for (let i = 0; i < this.name.length; i++) {
            const char = this.name[i];

            if (isEscaped) {
                currentComponent += char;
                isEscaped = false;
            } else if (char === ESCAPE_CHARACTER) {
                isEscaped = true;
            } else if (char === this.delimiter) {
                components.push(currentComponent);
                currentComponent = "";
            } else {
                currentComponent += char;
            }
        }
        components.push(currentComponent);
        return components;
    }

    // rebuild internal string from a list of components
    private setComponents(components: string[]): void {
        const DELIMITER_REGEX = escapeRegex(this.delimiter);

        const escapedComponents = components.map(c => {
            let escaped = c.replace(new RegExp(ESCAPE_CHARACTER_REGEX, 'g'), ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            escaped = escaped.replace(new RegExp(DELIMITER_REGEX, 'g'), ESCAPE_CHARACTER + this.delimiter);
            return escaped;
        });

        this.name = escapedComponents.join(this.delimiter);
        this.noComponents = components.length;
    }

    constructor(source: string, delimiter?: string) {
        if (delimiter) {
            this.delimiter = delimiter;
        }
        this.name = source;
        this.noComponents = this.getComponents().length;
    }

    // return the full name as a string, optionally using a different delimiter
    public asString(delimiter: string = this.delimiter): string {
        if (delimiter === this.delimiter) {
            return this.name;
        }

        const components = this.getComponents();
        const NEW_DELIMITER_REGEX = escapeRegex(delimiter);

        const escapedComponents = components.map(c => {
            let escaped = c.replace(new RegExp(ESCAPE_CHARACTER_REGEX, 'g'), ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            escaped = escaped.replace(new RegExp(NEW_DELIMITER_REGEX, 'g'), ESCAPE_CHARACTER + delimiter);
            return escaped;
        });
        return escapedComponents.join(delimiter);
    }

    // returns string using the default delimiter
    public asDataString(): string {
        return this.asString(DEFAULT_DELIMITER);
    }

    // get current delimiter
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // check if name has any components
    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    // number of components in the name
    public getNoComponents(): number {
        return this.noComponents;
    }

    // get a specific component
    public getComponent(i: number): string {
        return this.getComponents()[i];
    }

    // replace a component at a specific index
    public setComponent(i: number, c: string): void {
        const components = this.getComponents();
        components[i] = c;
        this.setComponents(components);
    }

    // insert a new component at index i
    public insert(i: number, c: string): void {
        const components = this.getComponents();
        components.splice(i, 0, c);
        this.setComponents(components);
    }

    // add a new component to the end
    public append(c: string): void {
        const components = this.getComponents();
        components.push(c);
        this.setComponents(components);
    }

    // remove a component by index
    public remove(i: number): void {
        const components = this.getComponents();
        components.splice(i, 1);
        this.setComponents(components);
    }

    // concatenate with another Name
    public concat(other: Name): void {
        const components = this.getComponents();
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        this.setComponents(components);
    }
}
