import { ExpenseReport } from '../entities/expense-report';
import {
  Notification,
  NotificationRecipient,
  NotificationType,
} from './notification';

export type NotificationDraft = Omit<Notification, 'id'>;

export function toExpenseReportNotification(
  type: NotificationType,
  report: ExpenseReport,
  createdAt: Date,
): NotificationDraft {
  return {
    type,
    recipient: recipientOf(type, report),
    companyId: report.companyId,
    target: { kind: 'EXPENSE_REPORT', id: report.id },
    createdAt,
    read: false,
  };
}

function recipientOf(
  type: NotificationType,
  report: ExpenseReport,
): NotificationRecipient {
  return type === NotificationType.EXPENSE_REPORT_SUBMITTED
    ? { kind: 'EMPLOYERS' }
    : { kind: 'USER', userId: report.employeeId };
}
