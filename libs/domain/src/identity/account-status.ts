export const AccountStatus = {
  INVITED: 'INVITED',
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED',
} as const;

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];

const VALUES = new Set<string>(Object.values(AccountStatus));

export function isAccountStatus(value: string): value is AccountStatus {
  return VALUES.has(value);
}
