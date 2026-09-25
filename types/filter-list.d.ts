/// <reference types="node" />
import { Blob } from "./blob";
import { Repository } from "./repository";

/** An ordered set of filters loaded for a repository path. */
export class FilterList {
    static load(repo: Repository, blob: Blob | null, path: string, mode: number, flags: number): Promise<FilterList | null>;

    applyToBlob(blob: Blob): Promise<string>;
    applyToData(data: string | Buffer): Promise<string>;
    applyToFile(repo: Repository, path: string): Promise<string>;
}
