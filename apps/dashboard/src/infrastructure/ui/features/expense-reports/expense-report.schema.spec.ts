import { expenseReportSchema, type ExpenseReportValues } from './expense-report.schema';

const values: ExpenseReportValues = {
  date: '2026-09-28', category: 'TRAVEL', paymentMethod: 'PERSONAL_CARD', amount: '68,00', vatRate: '10',
  description: 'Montpellier – Lyon', project: '', proof: null, keepProof: false,
};

/** The first refusal of each field, the one the form shows. */
async function problems(overrides: Partial<ExpenseReportValues>): Promise<Record<string, string>> {
  const result = await expenseReportSchema.safeParseAsync({ ...values, ...overrides });
  const first: Record<string, string> = {};
  for (const issue of result.error?.issues ?? []) {
    first[String(issue.path[0])] ??= issue.message;
  }
  return first;
}

describe('expenseReportSchema', () => {
  it('accepts a complete report without receipt', async () => {
    expect(await problems({})).toEqual({});
  });

  it('requires a date, a category, an amount and a description', async () => {
    expect(await problems({ date: '', category: '', amount: '', description: '  ' })).toEqual({
      date: 'REQUIRED_INFORMATION', category: 'REQUIRED_INFORMATION', amount: 'REQUIRED_INFORMATION', description: 'REQUIRED_INFORMATION',
    });
  });

  it('refuses a malformed or zero amount, and texts too long', async () => {
    expect(await problems({ amount: '12,345' })).toEqual({ amount: 'INVALID_INFORMATION' });
    expect(await problems({ amount: '0' })).toEqual({ amount: 'INVALID_INFORMATION' });
    expect(await problems({ description: 'd'.repeat(251), project: 'p'.repeat(51) })).toEqual({
      description: 'INVALID_INFORMATION', project: 'INVALID_INFORMATION',
    });
  });

  it('refuses a receipt that is not a PDF, a JPG or a PNG', async () => {
    const csv = new File(['a;b'], 'notes.csv', { type: 'text/csv' });

    expect(await problems({ proof: csv })).toEqual({ proof: 'UNSUPPORTED_FILE_FORMAT' });
  });
});
