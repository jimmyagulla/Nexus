const LEAVE_TYPES: readonly string[] = ['congés payés', 'rtt'];

export function isLeaveType(type: string): boolean {
  return LEAVE_TYPES.includes(type.trim().toLowerCase());
}
