import { Oid } from "./oid";
import { Reflog } from "./ref-log";
import { Repository } from "./repository";
import { Signature } from "./signature";

/** Atomically update multiple references after acquiring their locks. */
export class Transaction {
    static create(repo: Repository): Promise<Transaction>;

    lockRef(refname: string): number;
    setTarget(refname: string, target: Oid, signature: Signature | null, message: string | null): number;
    setSymbolicTarget(refname: string, target: string, signature: Signature | null, message: string | null): number;
    setReflog(refname: string, reflog: Reflog): number;
    remove(refname: string): number;
    commit(): number;
}
