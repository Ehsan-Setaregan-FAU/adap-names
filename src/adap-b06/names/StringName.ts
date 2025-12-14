import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { ESCAPE_CHARACTER } from "../common/Printable"; 

// Helper functions (needed for parsing and composing the string state)
const escapeRegex = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const ESCAPE_CHARACTER_REGEX = escapeRegex(ESCAPE_CHARACTER);

export class StringName extends AbstractName {

    protected name: string = "";

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
    }

    // --- IMPLEMENTATION OF ABSTRACT PRIMITIVES ---

    protected getComponentList(): string[] {
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

    protected setComponentList(components: string[]): void {
        const DELIMITER_REGEX = escapeRegex(this.delimiter);

        const escapedComponents = components.map(c => {
            let escaped = c.replace(new RegExp(ESCAPE_CHARACTER_REGEX, 'g'), ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            escaped = escaped.replace(new RegExp(DELIMITER_REGEX, 'g'), ESCAPE_CHARACTER + this.delimiter);
            return escaped;
        });

        this.name = escapedComponents.join(this.delimiter);
    }

    // --- CLONEABLE IMPLEMENTATION ---
    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }
}