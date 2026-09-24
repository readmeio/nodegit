import { Buf } from "./buf";
import { FilterSource } from "./filter-source";

/** Callbacks may return an error code directly or asynchronously. */
export interface RegisteredFilter {
    attributes?: string;
    check(source: FilterSource, attributeValue: string): number | void | Promise<number | void>;
    apply(to: Buf, from: Buf, source: FilterSource): number | void | Promise<number | void>;
}

export const FilterRegistry: {
    register(name: string, filter: RegisteredFilter, priority: number): Promise<number>;
    unregister(name: string): Promise<number>;
};
