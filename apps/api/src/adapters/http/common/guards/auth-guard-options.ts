export const AUTH_GUARD_OPTIONS = Symbol('AUTH_GUARD_OPTIONS');

export interface AuthGuardOptions {
  allowed: boolean;
}
