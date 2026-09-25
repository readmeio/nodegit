import { Oid } from "./oid";
import { Repository } from "./repository";

export const Utils: {
    /** Adapt a lookup method to also accept an already-loaded object. */
    lookupWrapper<T>(
        objectType: new (...args: any[]) => T,
        lookupFunction?: (repo: Repository, id: string | Oid) => Promise<T>,
    ): (repo: Repository, id: string | Oid | T, callback?: (error: Error | null, result?: T) => void) => Promise<T>;
    /** Shallow-merge own enumerable properties, with later objects taking precedence. */
    shallowClone<T extends object>(source: T): T;
    shallowClone<T extends object, U extends object>(first: T, second: U): T & U;
    shallowClone<T extends object, U extends object, V extends object>(first: T, second: U, third: V): T & U & V;
    shallowClone(...sources: object[]): object;
};
