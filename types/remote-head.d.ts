import { Oid } from "./oid";

/** An advertised reference from a connected remote. */
export class RemoteHead {
    local(): number;
    oid(): Oid;
    loid(): Oid;
    name(): string | null;
    symrefTarget(): string | null;
}
