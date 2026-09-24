import { Config, Libgit2, Remote, RemoteCallbacks, Repository, StatusFile, TransferProgress, Treebuilder } from "../..";

async function useRepository(path: string): Promise<void> {
    const repo = await Repository.open(path);
    const config: Config = await repo.config();
    const entry = await config.getEntry("user.name");
    const name: string = entry.name();
    const statuses: StatusFile[] = await repo.getStatus();
    const builder: Treebuilder = await Treebuilder.create(repo, null);
    void builder;
    void name;
    void statuses;
    repo.free();
    repo.free();
    // @ts-expect-error Explicit disposal is synchronous, not a Promise.
    const result: Promise<void> = repo.free();
    void result;
}

const callbacks: RemoteCallbacks = {
    pushUpdateReference: (refName, status) => {
        if (status !== null) console.error(refName, status);
    },
    pushTransferProgress: (current, total) => console.log(current, total),
    transferProgress: progress => console.log(progress.totalObjects(), progress.receivedObjects()),
};
function getProgress(progress: TransferProgress): number {
    return progress.totalObjects();
}
const mappedLimit: void = Libgit2.opts(Libgit2.OPT.SET_MWINDOW_MAPPED_LIMIT, 1024);
const currentLimit: number = Libgit2.opts(Libgit2.OPT.GET_MWINDOW_MAPPED_LIMIT);
void callbacks;
void getProgress;
void mappedLimit;
void currentLimit;
const completion: Remote.COMPLETION = Remote.COMPLETION.DOWNLOAD;
void completion;
void useRepository;
