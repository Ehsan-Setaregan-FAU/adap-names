import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        // Precondition: File must be closed to be opened
        InvalidStateException.assert(this.state === FileState.CLOSED, "Cannot open a file that is not closed");
        
        // Do something
        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        // Precondition: File must be open to be read
        InvalidStateException.assert(this.state === FileState.OPEN, "Cannot read from a closed or deleted file");
        
        // read something
        return new Int8Array();
    }

    public close(): void {
        // Precondition: File must be open to be closed
        InvalidStateException.assert(this.state === FileState.OPEN, "Cannot close a file that is not open");
        
        // do something
        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}