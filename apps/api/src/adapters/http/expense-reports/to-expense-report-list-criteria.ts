import {
  DEFAULT_EXPENSE_REPORT_SORT,
  DEFAULT_EXPENSE_REPORT_SORT_DIRECTION,
  ExpenseReportListCriteria,
} from '@hexagonal-monorepo-template/domain';
import { ListExpenseReportsQueryDto } from './dto/list-expense-reports-query.dto';

/** The criteria a list query asks for; what it leaves out restricts nothing. */
export function toExpenseReportListCriteria(
  query: ListExpenseReportsQueryDto,
): ExpenseReportListCriteria {
  return {
    search: query.search ?? '',
    searchCategories: query.searchCategories ?? [],
    categories: query.categories ?? [],
    statuses: query.statuses ?? [],
    projects: query.projects ?? [],
    proofs: query.proofs ?? [],
    from: query.from ?? null,
    to: query.to ?? null,
    minAmount: query.minAmount ?? null,
    maxAmount: query.maxAmount ?? null,
    sort: query.sort ?? DEFAULT_EXPENSE_REPORT_SORT,
    direction: query.direction ?? DEFAULT_EXPENSE_REPORT_SORT_DIRECTION,
  };
}
