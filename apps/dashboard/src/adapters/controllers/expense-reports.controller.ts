import {
  CalendarDate,
  DEFAULT_EXPENSE_REPORT_SORT,
  DEFAULT_EXPENSE_REPORT_SORT_DIRECTION,
  EXPENSE_REPORT_CATEGORIES,
  ExpenseAmount,
  ExpenseReportCategory,
  ExpenseReportList,
  ExpenseReportListCriteria,
  ExpenseReportProofLink,
  ExpenseReportProofUpload,
  ExpenseReportRequest,
  ExpenseReportSort,
  ExpenseReportSummary,
  isExpenseVatRate,
} from '@hexagonal-monorepo-template/domain';
import {
  IListExpenseReportsFromSession,
  IReviseExpenseReportFromSession,
  ISubmitExpenseReportFromSession,
  IViewExpenseReportProofFromSession,
} from '@hexagonal-monorepo-template/ports';

/**
 * What the expense reports screen shows, as the person sets it: the domain
 * criteria themselves, but for the categories the search matches (the
 * controller resolves them from the labels) and an ordering that stays
 * unchosen until a column is sorted. The amount bounds are kept as typed.
 */
export type ExpenseReportsListState = Omit<
  ExpenseReportListCriteria,
  'searchCategories' | 'sort'
> & {
  /** Column the list is ordered by; null keeps the default order. */
  sort: ExpenseReportSort | null;
};

/** Nothing searched, filtered nor sorted: every report of the person, as the screen opens. */
export const EVERY_EXPENSE_REPORT: ExpenseReportsListState = {
  search: '',
  categories: [],
  statuses: [],
  projects: [],
  proofs: [],
  from: null,
  to: null,
  minAmount: null,
  maxAmount: null,
  sort: null,
  direction: DEFAULT_EXPENSE_REPORT_SORT_DIRECTION,
};

/** Labels the search also matches, so that "parking" finds the parking expenses. */
export interface ExpenseReportSearchVocabulary {
  categories: Readonly<Record<ExpenseReportCategory, string>>;
}

/**
 * The expense report form as filled in. `vatRate` is the rate in percent as
 * text, anything else meaning no VAT; without a new receipt, `keepProof`
 * tells whether the receipt already attached stays.
 */
export interface ExpenseReportForm {
  date: string;
  category: string;
  paymentMethod: string;
  amount: string;
  vatRate: string;
  description: string;
  project: string;
  proof: File | null;
  keepProof: boolean;
}

export class ExpenseReportsController {
  constructor(
    private readonly listFromSession: IListExpenseReportsFromSession,
    private readonly submitFromSession: ISubmitExpenseReportFromSession,
    private readonly reviseFromSession: IReviseExpenseReportFromSession,
    private readonly viewProofFromSession: IViewExpenseReportProofFromSession,
    private readonly vocabulary: ExpenseReportSearchVocabulary,
  ) {}

  /** The criteria a state asks for; also the cache key of the list. */
  criteriaFor(state: ExpenseReportsListState): ExpenseReportListCriteria {
    const search = state.search.trim();
    return {
      search,
      searchCategories: this.matchingCategories(search),
      categories: [...state.categories].sort(),
      statuses: [...state.statuses].sort(),
      projects: [...state.projects].sort(),
      proofs: [...state.proofs].sort(),
      from: this.calendarDayOf(state.from),
      to: this.calendarDayOf(state.to),
      minAmount: this.amountOf(state.minAmount),
      maxAmount: this.amountOf(state.maxAmount),
      sort: state.sort ?? DEFAULT_EXPENSE_REPORT_SORT,
      direction: state.sort === null ? DEFAULT_EXPENSE_REPORT_SORT_DIRECTION : state.direction,
    };
  }

  listExpenseReports(criteria: ExpenseReportListCriteria): Promise<ExpenseReportList> {
    return this.listFromSession.execute(criteria);
  }

  async submitExpenseReport(form: ExpenseReportForm): Promise<ExpenseReportSummary> {
    return this.submitFromSession.execute({
      details: this.requestOf(form),
      proof: await this.uploadOf(form.proof),
    });
  }

  async reviseExpenseReport(
    expenseReportId: string,
    form: ExpenseReportForm,
  ): Promise<ExpenseReportSummary> {
    return this.reviseFromSession.execute({
      expenseReportId,
      revision: {
        details: this.requestOf(form),
        proof: await this.uploadOf(form.proof),
        keepProof: form.keepProof,
      },
    });
  }

  viewProof(expenseReportId: string): Promise<ExpenseReportProofLink> {
    return this.viewProofFromSession.execute(expenseReportId);
  }

  private requestOf(form: ExpenseReportForm): ExpenseReportRequest {
    const rate = Number(form.vatRate);
    return {
      date: form.date,
      category: form.category,
      paymentMethod: form.paymentMethod,
      amount: form.amount,
      vatRate: isExpenseVatRate(rate) ? rate : null,
      description: form.description,
      project: form.project,
    };
  }

  private async uploadOf(file: File | null): Promise<ExpenseReportProofUpload | null> {
    return file === null
      ? null
      : { fileName: file.name, content: new Uint8Array(await file.arrayBuffer()) };
  }

  /** The day when it is a real one, null otherwise. */
  private calendarDayOf(day: string | null): string | null {
    try {
      return day === null ? null : CalendarDate.parse(day).value;
    } catch {
      return null;
    }
  }

  /** "12,5" → "12.50"; a bound that is not an amount restricts nothing. */
  private amountOf(amount: string | null): string | null {
    return amount === null ? null : (ExpenseAmount.read(amount)?.value ?? null);
  }

  private matchingCategories(search: string): ExpenseReportCategory[] {
    const term = this.comparable(search);
    if (term === '') {
      return [];
    }
    return EXPENSE_REPORT_CATEGORIES.filter((category) =>
      this.comparable(this.vocabulary.categories[category]).includes(term),
    );
  }

  /** Case and accents never prevent a match. */
  private comparable(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
