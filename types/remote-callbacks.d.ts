export class RemoteCallbacks {
    version?: number | undefined;
    credentials?: Function | undefined;
    certificateCheck?: Function | undefined;
    /** Progress callback for push operations */
    pushTransferProgress?: PushTransferProgressCallback;
    /** Called for each pushed ref with the remote's rejection message, or null on success. */
    pushUpdateReference?: (refName: string, status: string | null) => unknown;
    /** Progress callback for fetch and clone operations */
    transferProgress?: (progress: IndexerProgress) => unknown;
    transport?: Function | undefined;
    payload?: undefined;
}

/** The third argument is currently unreliable in this fork; use object counts for progress. */
export type PushTransferProgressCallback = (
    pushedObjects: number,
    totalObjects: number,
    pushedBytes: number,
) => unknown;

export interface IndexerProgress {
    indexedDeltas: () => number;
    indexedObjects: () => number;
    localObjects: () => number;
    receivedBytes: () => number;
    receivedObjects: () => number;
    totalDeltas: () => number;
    totalObjects: () => number;
}
