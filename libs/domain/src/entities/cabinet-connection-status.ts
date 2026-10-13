export const CabinetConnectionStatus = {
  INVITATION_SENT: 'INVITATION_SENT',
  CONNECTED: 'CONNECTED',
  REVOKED: 'REVOKED',
} as const;

export type CabinetConnectionStatus =
  (typeof CabinetConnectionStatus)[keyof typeof CabinetConnectionStatus];
