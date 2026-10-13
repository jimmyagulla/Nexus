export const EmployeeStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type EmployeeStatus =
  (typeof EmployeeStatus)[keyof typeof EmployeeStatus];

const VALUES = new Set<string>(Object.values(EmployeeStatus));

export function isEmployeeStatus(value: string): value is EmployeeStatus {
  return VALUES.has(value);
}
