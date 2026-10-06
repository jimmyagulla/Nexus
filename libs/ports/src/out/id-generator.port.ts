export interface IIdGenerator {
  next(): string;
}

export const IIdGenerator = Symbol('IIdGenerator');
