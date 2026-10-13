import { ExpenseReportSnapshot } from '@hexagonal-monorepo-template/domain';
import { ExpenseReportResponseDto } from './dto/expense-report-response.dto';

export function toExpenseReportResponse(
  snapshot: ExpenseReportSnapshot,
): ExpenseReportResponseDto {
  return {
    id: snapshot.id,
    companyId: snapshot.companyId,
    employeeId: snapshot.employeeId,
    label: snapshot.label,
    status: snapshot.status,
    total: snapshot.total,
    receipts: snapshot.receipts.map((receipt) => ({ ...receipt })),
    expenses: snapshot.expenses.map((expense) => ({ ...expense })),
  };
}
