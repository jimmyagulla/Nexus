import { ErrorCode } from '../errors/error-code';
import {
  ExpenseReportRequest,
  prepareExpenseReportDetails,
  prepareExpenseReportProof,
  prepareExpenseReportRevision,
} from './prepare-expense-report';

const pdf = Uint8Array.from([...'%PDF-1.7\n'].map((c) => c.charCodeAt(0)));
const csv = Uint8Array.from([...'a;b\n1;2\n'].map((c) => c.charCodeAt(0)));

const request: ExpenseReportRequest = {
  date: '2026-09-28',
  category: 'TRAVEL',
  paymentMethod: 'PERSONAL_CARD',
  amount: '68,00',
  vatRate: 10,
  description: '  Montpellier – Lyon  ',
  project: ' Client Valette ',
};

describe('prepareExpenseReportDetails', () => {
  it('checks every field and computes the VAT amount from its rate', () => {
    const details = prepareExpenseReportDetails(request);

    expect({
      date: details.date.value,
      amount: details.amount.value,
      vat: details.vat && { rate: details.vat.rate, amount: details.vat.amount.value },
      description: details.description.value,
      project: details.project?.value,
    }).toEqual({
      date: '2026-09-28',
      amount: '68.00',
      vat: { rate: 10, amount: '6.18' },
      description: 'Montpellier – Lyon',
      project: 'Client Valette',
    });
  });

  it('keeps an expense without VAT nor project', () => {
    const details = prepareExpenseReportDetails({ ...request, vatRate: null, project: '  ' });

    expect([details.vat, details.project]).toEqual([null, null]);
  });

  it('refuses a VAT rate outside the list', () => {
    expect(() => prepareExpenseReportDetails({ ...request, vatRate: 5.5 })).toThrow(ErrorCode.INVALID_INFORMATION);
  });

  it('requires a date, a category, a payment method, an amount and a description', () => {
    expect(() => prepareExpenseReportDetails({ ...request, date: '' })).toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(() => prepareExpenseReportDetails({ ...request, category: '' })).toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(() => prepareExpenseReportDetails({ ...request, paymentMethod: ' ' })).toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(() => prepareExpenseReportDetails({ ...request, amount: '' })).toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(() => prepareExpenseReportDetails({ ...request, description: ' ' })).toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses an unknown category or payment method', () => {
    expect(() => prepareExpenseReportDetails({ ...request, category: 'TAXI' })).toThrow(ErrorCode.INVALID_INFORMATION);
    expect(() => prepareExpenseReportDetails({ ...request, paymentMethod: 'CHEQUE' })).toThrow(ErrorCode.INVALID_INFORMATION);
  });

  it('refuses a description above 250 characters and a project above 50', () => {
    expect(() => prepareExpenseReportDetails({ ...request, description: 'a'.repeat(251) })).toThrow(ErrorCode.INVALID_INFORMATION);
    expect(() => prepareExpenseReportDetails({ ...request, project: 'p'.repeat(51) })).toThrow(ErrorCode.INVALID_INFORMATION);
    expect(prepareExpenseReportDetails({ ...request, description: 'a'.repeat(250), project: 'p'.repeat(50) }).project?.value).toHaveLength(50);
  });
});

describe('prepareExpenseReportProof', () => {
  it('reads the real format of the receipt', () => {
    expect(prepareExpenseReportProof({ fileName: 'billet.pdf', content: pdf })).toMatchObject({
      fileName: 'billet.pdf', format: 'PDF', sizeBytes: pdf.length,
    });
  });

  it('refuses a spreadsheet, even a genuine one', () => {
    expect(() => prepareExpenseReportProof({ fileName: 'notes.csv', content: csv })).toThrow(ErrorCode.UNSUPPORTED_FILE_FORMAT);
  });

  it('refuses a file whose content does not match its name', () => {
    expect(() => prepareExpenseReportProof({ fileName: 'photo.png', content: pdf })).toThrow(ErrorCode.UNSUPPORTED_FILE_FORMAT);
  });

  it('refuses an empty file and a file above 10 MB', () => {
    expect(() => prepareExpenseReportProof({ fileName: 'vide.pdf', content: new Uint8Array() })).toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(() => prepareExpenseReportProof({ fileName: 'gros.pdf', content: new Uint8Array(10 * 1024 * 1024 + 1) })).toThrow(ErrorCode.FILE_TOO_LARGE);
  });
});

describe('prepareExpenseReportRevision', () => {
  it('keeps the choice about the receipt already attached', () => {
    expect(prepareExpenseReportRevision({ details: request, proof: null, keepProof: true })).toMatchObject({
      proof: null, keepProof: true,
    });
  });
});
