export const NotificationType = {
  EXPENSE_REPORT_SUBMITTED: 'note.soumise',
  EXPENSE_REPORT_INFORMATION_REQUESTED: 'note.information',
  EXPENSE_REPORT_VALIDATED: 'note.validee',
  EXPENSE_REPORT_REFUSED: 'note.refusee',
  EXPENSE_REPORT_REIMBURSED: 'note.remboursee',
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export type NotificationRecipient =
  | { kind: 'USER'; userId: string }
  | { kind: 'EMPLOYERS' };

export type NotificationTarget = { kind: 'EXPENSE_REPORT'; id: string };

export type Notification = {
  id: string;
  type: NotificationType;
  recipient: NotificationRecipient;
  companyId: string;
  target: NotificationTarget;
  createdAt: Date;
  read: boolean;
};
