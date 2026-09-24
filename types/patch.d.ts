import { Blob } from "./blob";
import { ConvenientPatch } from "./convenient-patch";
import { Diff } from "./diff";
import { DiffDelta } from "./diff-delta";
import { DiffHunk } from "./diff-hunk";
import { DiffLine } from "./diff-line";
import { DiffOptions } from "./diff-options";

/** Native patch object, distinct from the convenient patch wrapper. */
export class Patch {
    static fromBlobs(oldBlob: Blob | null, oldPath: string | null, newBlob: Blob | null, newPath: string | null, options?: DiffOptions): Promise<Patch>;
    static fromDiff(diff: Diff, index: number): Promise<Patch>;
    static convenientFromDiff(diff: Diff, indexes?: number[]): Promise<ConvenientPatch[]>;

    getDelta(): DiffDelta;
    getHunk(index: number): Promise<{ hunk: DiffHunk; linesInHunk: number }>;
    getLineInHunk(hunkIndex: number, lineIndex: number): Promise<DiffLine>;
    lineStats(): { total_context: number; total_additions: number; total_deletions: number };
    numHunks(): number;
    numLinesInHunk(index: number): number;
    owner(): Diff;
    size(includeContext: number, includeHunkHeaders: number, includeFileHeaders: number): number;
}
