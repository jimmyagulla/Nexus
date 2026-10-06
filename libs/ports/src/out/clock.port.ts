export interface IClock {
  now(): Date;
}

export const IClock = Symbol('IClock');
