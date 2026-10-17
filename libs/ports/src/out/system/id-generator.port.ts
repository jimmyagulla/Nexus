/** Hands out the identifiers of the records an adapter creates. */
export interface IIdGenerator {
  next(): string;
}

export const IIdGenerator = Symbol('IIdGenerator');
