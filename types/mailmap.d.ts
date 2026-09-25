import { Repository } from "./repository";
import { Signature } from "./signature";

/** Resolves names and addresses against Git mailmap entries. */
export class Mailmap {
    static create(): Promise<Mailmap>;
    static fromBuffer(buffer: string, length: number): Promise<Mailmap>;
    static fromRepository(repo: Repository): Promise<Mailmap>;

    addEntry(realName: string, realEmail: string, replaceName: string, replaceEmail: string): Promise<void>;
    resolve(name: string, email: string): Promise<{ real_name: string | null; real_email: string | null }>;
    resolveSignature(signature: Signature): Promise<Signature>;
}
