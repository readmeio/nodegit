import { AnnotatedCommit } from "./annotated-commit";
import { Blob } from "./blob";
import { CheckoutOptions } from "./checkout-options";
import { Commit } from "./commit";
import { Config } from "./config";
import { DiffLine } from "./diff-line";
import { DiffOptions } from "./diff-options";
import { Error } from "./error";
import { FetchOptions } from "./fetch-options";
import { Index } from "./index_";
import { Merge } from "./merge";
import { MergeOptions } from "./merge-options";
import { Odb } from "./odb";
import { Oid } from "./oid";
import { Refdb } from "./ref-db";
import { Reference } from "./reference";
import { Rebase, RebaseOptions } from "./rebase";
import { Remote } from "./remote";
import { Revwalk } from "./rev-walk";
import { Signature } from "./signature";
import { StatusFile } from "./status-file";
import { StatusOptions } from "./status-options";
import { Submodule } from "./submodule";
import { Tag } from "./tag";
import { Tree } from "./tree";
import { Treebuilder } from "./tree-builder";
import { Worktree } from "./worktree";

export interface RepositoryInitOptions {
    description?: string;
    flags?: number;
    initialHead?: string;
    mode?: number;
    originUrl?: string;
    templatePath?: string;
    version?: number;
    workdirPath?: string;
}

export interface RepositoryStatistics {
    repositorySize: {
        commits: { count: number; size: number };
        trees: { count: number; size: number; entries: number };
        blobs: { count: number; size: number };
        annotatedTags: { count: number };
        references: { count: number };
    };
    biggestObjects: {
        commits: { maxSize: number; maxParents: number };
        trees: { maxEntries: number };
        blobs: { maxSize: number };
    };
    historyStructure: { maxDepth: number; maxTagDepth: number };
    biggestCheckouts: {
        numDirectories: number;
        maxPathDepth: number;
        maxPathLength: number;
        numFiles: number;
        totalFileSize: number;
        numSymlinks: number;
        numSubmodules: number;
    };
}

export class Repository {
    /** Find the repository from a starting path and return its absolute path. */
    static discover(startPath: string, acrossFs: number, ceilingDirs?: string | null): Promise<string>;
    static getReferences(repo: Repository, type: Reference.TYPE, refNamesOnly?: false): Promise<Reference[]>;
    static getReferences(repo: Repository, type: Reference.TYPE, refNamesOnly: true): Promise<string[]>;
    static init(path: string, isBare: number): Promise<Repository>;
    static initExt(repoPath: string, options?: RepositoryInitOptions): Promise<Repository>;
    static open(path: string): Promise<Repository>;
    static openBare(barePath: string): Promise<Repository>;
    static openExt(path: string, flags?: number, ceilingDirs?: string): Promise<Repository>;
    static openFromWorktree(wt: Worktree): Promise<Repository>;
    static wrapOdb(odb: Odb): Promise<Repository>;

    cleanup(): Promise<void>;
    commitParents(): Promise<Commit[]>;
    commondir(): string;
    config(): Promise<Config>;
    configSnapshot(): Promise<Config>;
    detachHead(): number;
    fetchheadForeach(callback: (refName: string, remoteUrl: string, oid: Oid, isMerge: number) => number | void | Promise<number | void>): Promise<void>;
    /** Release the native repository. This instance must not be used after free(). */
    free(): void;

    getNamespace(): string | undefined;
    getSubmodules(): Promise<Submodule[]>;
    head(): Promise<Reference>;
    headDetached(): number;
    headDetachedForWorktree(name: string): number;
    headForWorktree(name: string): Promise<Reference>;
    headUnborn(): number;
    ident(): { name: string | null; email: string | null };
    index(): Promise<Index>;
    isBare(): number;
    isEmpty(): number;
    isShallow(): number;
    isWorktree(): number;
    itemPath(item: number): Promise<string>;
    mergeheadForeach(callback: (oid: Oid) => number | void | Promise<number | void>): Promise<void>;
    messageRemove(): number;
    odb(): Promise<Odb>;
    oidType(): number;
    path(): string;
    refdb(): Promise<Refdb>;
    refreshReferences(): Promise<void>;
    setHead(refname: string): Promise<void>;
    setHeadDetached(commitish: Oid): number;
    setHeadDetachedFromAnnotated(commitish: AnnotatedCommit): number;
    setIdent(name: string, email: string): number;
    setIndex(index?: Index | null): void;
    setNamespace(nmspace: string): number;
    setWorkdir(workdir: string, updateGitLink: number): number;
    state(): number;
    stateCleanup(): number;
    statistics(): Promise<RepositoryStatistics>;
    submoduleCacheAll(): void;
    submoduleCacheClear(): void;
    workdir(): string | undefined;
    /**
     * Creates a branch with the passed in name pointing to the commit
     */
    createBranch(name: string, commit: Commit | string | Oid, force?: boolean): Promise<Reference>;
    /**
     * Look up a refs's commit.
     */
    getReferenceCommit(name: string | Reference): Promise<Commit>;
    /**
     * Look up a branch. Alias for getReference
     */
    getBranch(name: string | Reference): Promise<Reference>;
    /**
     * Look up a branch's most recent commit. Alias to getReferenceCommit
     */
    getBranchCommit(name: string | Reference): Promise<Commit>;
    /**
     * Gets the branch that HEAD currently points to Is an alias to head()
     */
    getCurrentBranch(): Promise<Reference>;
    /**
     * Lookup the reference with the given name.
     */
    getReference(name: string | Reference): Promise<Reference>;
    /**
     * Lookup references for a repository.
     */
    getReferences(): Promise<Reference[]>;
    /**
     * Lookup reference names for a repository.
     */
    getReferenceNames(type: Reference.TYPE): Promise<string[]>;
    getCommit(string: string | Commit | Oid): Promise<Commit>;
    /**
     * Retrieve the blob represented by the oid.
     */
    getBlob(string: string | Oid): Promise<Blob>;
    /**
     * Retrieve the tree represented by the oid.
     */
    getTree(string: string | Oid): Promise<Tree>;
    createTag(string: string | Oid, name: string, message: string): Promise<Tag>;
    /**
     * Creates a new lightweight tag
     */
    createLightweightTag(string: string | Oid, name: string): Promise<Reference>;
    /**
     * Retrieve the tag represented by the oid.
     */
    getTag(string: string | Oid): Promise<Tag>;
    /**
     * Retrieve the tag represented by the tag name.
     */
    getTagByName(Short: string): Promise<Tag>;
    /**
     * Deletes a tag from a repository by the tag name.
     */
    deleteTagByName(Short: string): Promise<number>;
    /**
     * Instantiate a new revision walker for browsing the Repository"s history. See also Commit.prototype.history()
     */
    createRevWalk(): Revwalk;
    /**
     * Retrieve the master branch commit.
     */
    getMasterCommit(): Promise<Commit>;
    /**
     * Retrieve the commit that HEAD is currently pointing to
     */
    getHeadCommit(): Promise<Commit>;
    createCommit(
        updateRef: string | null,
        author: Signature,
        committer: Signature,
        message: string,
        Tree: Tree | Oid | string,
        parents?: Array<string | Commit | Oid>,
    ): Promise<Oid>;
    createCommitWithSignature(
        updateRef: string | null,
        author: Signature,
        committer: Signature,
        message: string,
        Tree: Tree | Oid | string,
        parents: Array<string | Commit | Oid>,
        onSignature: (
            data: string,
        ) =>
            | Promise<{ code: Error.CODE; field?: string | undefined; signedData: string }>
            | { code: Error.CODE; field?: string | undefined; signedData: string },
    ): Promise<Oid>;
    /**
     * Creates a new commit on HEAD from the list of passed in files
     */
    createCommitOnHead(filesToAdd: string[], author: Signature, committer: Signature, message: string): Promise<Oid>;
    createCommitBuffer(
        author: Signature,
        committer: Signature,
        message: string,
        treeOid: Tree | Oid | string,
        parents?: Array<string | Commit | Oid>,
    ): Promise<string>;
    /**
     * Create a blob from a buffer
     */
    createBlobFromBuffer(buffer: Buffer): Promise<Oid>;
    /** The JS wrapper ignores tree and currently calls Treebuilder.create(null), which rejects at runtime. */
    treeBuilder(tree?: Tree): Promise<Treebuilder>;
    /**
     * Gets the default signature for the default user and now timestamp
     */
    defaultSignature(): Signature;
    /**
     * Lists out the names of remotes in the given repository.
     */
    getRemoteNames(): Promise<string[]>;
    /**
     * Lists out the remotes in the given repository.
     */
    getRemotes(): Promise<Remote[]>;
    /**
     * Gets a remote from the repo
     */
    getRemote(remote: string | Remote): Promise<Remote>;
    /**
     * Fetches from a remote
     */
    fetch(remote: string | Remote, fetchOptions?: FetchOptions): Promise<void>;
    /**
     * Fetches from all remotes. This is done in series due to deadlocking issues with fetching from many remotes that can happen.
     */
    fetchAll(fetchOptions?: FetchOptions): Promise<void>;
    mergeBranches(
        to: string | Reference,
        from: string | Reference,
        signature?: Signature,
        mergePreference?: Merge.PREFERENCE,
        mergeOptions?: MergeOptions,
        mergeBranchOptions?: {
            processMergeMessageCallback?: (message: string) => string | Promise<string>;
            signingCb?: (data: string) =>
                | { code: Error.CODE; field?: string; signedData: string }
                | Promise<{ code: Error.CODE; field?: string; signedData: string }>;
        },
    ): Promise<Oid | string>;
    /**
     * Rebases a branch onto another branch
     */
    rebaseBranches(
        branch: string | Reference,
        upstream: string | Reference,
        onto?: string | Reference | null,
        signature?: Signature | null,
        beforeNextFn?: (rebase: Rebase) => void | Promise<void>,
        beforeFinishFn?: (summary: {
            ontoName: string;
            ontoSha: string;
            originalHeadName: string;
            originalHeadSha: string;
            rebase: Rebase;
            rewritten: string[][] | null;
        }) => void | Promise<void>,
        rebaseOptions?: RebaseOptions,
    ): Promise<Commit>;
    continueRebase(
        signature?: Signature | null,
        beforeNextFn?: (rebase: Rebase) => void | Promise<void>,
        beforeFinishFn?: (summary: {
            ontoName: string;
            ontoSha: string;
            originalHeadName: string;
            originalHeadSha: string;
            rebase: Rebase;
            rewritten: string[][] | null;
        }) => void | Promise<void>,
        rebaseOptions?: RebaseOptions,
    ): Promise<Commit>;
    /**
     * Get the status of a repo to it's working directory
     */
    getStatus(opts?: StatusOptions): Promise<StatusFile[]>;
    /**
     * Return StatusFile wrappers with status and headToIndex/indexToWorkdir deltas (not raw StatusEntry objects).
     */
    getStatusExt(opts?: StatusOptions): Promise<StatusFile[]>;
    /**
     * Get the names of the submodules in the repository.
     */
    getSubmoduleNames(): Promise<string[]>;
    /**
     * This will set the HEAD to point to the reference and then attempt to update the index and working tree to match the content of the latest commit on that reference
     */
    checkoutRef(reference: Reference, opts?: CheckoutOptions): Promise<void>;
    /**
     * This will set the HEAD to point to the local branch and then attempt to update the index and working tree to match the content of the latest commit on that branch
     */
    checkoutBranch(branch: string | Reference, opts?: CheckoutOptions): Promise<void | false>;
    /**
     * Stages or unstages line selection of a specified file
     */
    stageFilemode(filePath: string | string[], stageNew: boolean, additionalDiffOptions?: DiffOptions): Promise<void>;
    /**
     * Stages or unstages line selection of a specified file
     */
    stageLines(filePath: string, selectedLines: DiffLine[], isSelectionStaged: boolean, additionalDiffOptions?: DiffOptions): Promise<void>;
    /**
     * Returns true if the repository is in the default NONE state.
     */
    isDefaultState(): boolean;
    /**
     * Returns true if the repository is in the APPLY_MAILBOX or APPLY_MAILBOX_OR_REBASE state.
     */
    isApplyingMailbox(): boolean;
    /**
     * Returns true if the repository is in the BISECT state.
     */
    isBisecting(): boolean;
    /**
     * Returns true if the repository is in the CHERRYPICK state.
     */
    isCherrypicking(): boolean;
    /**
     * Returns true if the repository is in the MERGE state.
     */
    isMerging(): boolean;
    /**
     * Returns true if the repository is in the REBASE, REBASE_INTERACTIVE, or REBASE_MERGE state.
     */
    isRebasing(): boolean;
    /**
     * Returns true if the repository is in the REVERT state.
     */
    isReverting(): boolean;
    /**
     * Discard line selection of a specified file. Assumes selected lines are unstaged.
     */
    discardLines(filePath: string, selectedLines: DiffLine[], additionalDiffOptions?: DiffOptions): Promise<void>;
    /**
     * Grabs a fresh copy of the index from the repository. Invalidates all previously grabbed indexes
     */
    refreshIndex(): Promise<Index>;
}

export namespace Repository {
    const enum INIT_FLAG {
        BARE = 1,
        NO_REINIT = 2,
        NO_DOTGIT_DIR = 4,
        MKDIR = 8,
        MKPATH = 16,
        EXTERNAL_TEMPLATE = 32,
        RELATIVE_GITLINK = 64,
    }
}
