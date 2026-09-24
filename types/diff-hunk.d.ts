/** One hunk within a native diff patch. */
export class DiffHunk {
    oldStart(): number;
    oldLines(): number;
    newStart(): number;
    newLines(): number;
    headerLen(): number;
    header(): string | null;
}
