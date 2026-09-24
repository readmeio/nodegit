import { Oid } from "./oid";
import { Repository } from "./repository";

/** The source of data supplied to a registered filter callback. */
export class FilterSource {
    repo(): Promise<Repository | null>;
    path(): string | undefined;
    filemode(): number;
    id(): Oid | undefined;
    mode(): number;
    flags(): number;
}
