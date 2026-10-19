import { describe, expect, it } from 'vitest';
import {
  ExpenseReportListCriteria,
  ExpenseReportSort,
  prepareExpenseReportRevision,
  prepareExpenseReportSubmission,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryHttpClient } from '../../infrastructure/network/in-memory-http-client';
import { ApiExpenseReportGateway } from './api-expense-report.gateway';

const authorized = { headers: { Authorization: 'Bearer token' } };
const everything: ExpenseReportListCriteria = {
  search: '', searchCategories: [], categories: [], statuses: [], projects: [], proofs: [],
  from: null, to: null, minAmount: null, maxAmount: null, sort: ExpenseReportSort.DATE, direction: 'DESC',
};
const details = {
  date: '2026-09-28', category: 'TRAVEL', paymentMethod: 'PERSONAL_CARD', amount: '68,00',
  vatRate: 10, description: 'Montpellier – Lyon', project: 'Client Valette',
};
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

describe('ApiExpenseReportGateway', () => {
  it('asks for the list with the default ordering only when nothing is chosen', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/expense-reports?sort=DATE&direction=DESC', { status: 200, data: { items: [] } });

    await expect(new ApiExpenseReportGateway(http).list('c1', everything, 'token')).resolves.toEqual({ items: [] });
    expect(http.calls[0].config).toEqual(authorized);
  });

  it('flattens every criterion into the query string, one parameter per project', async () => {
    const http = new InMemoryHttpClient();
    const url =
      'companies/c1/expense-reports?search=lyon&searchCategories=TRAVEL&categories=TRAVEL%2CMEAL&statuses=SUBMITTED' +
      '&projects=Salon%2C+Bordeaux&projects=Valette&proofs=WITH&from=2026-09-01&to=2026-09-30' +
      '&minAmount=10.00&maxAmount=150.00&sort=AMOUNT&direction=ASC';
    http.reply('get', url, { status: 200, data: { items: [] } });

    await new ApiExpenseReportGateway(http).list('c1', {
      search: ' lyon ', searchCategories: ['TRAVEL'], categories: ['TRAVEL', 'MEAL'], statuses: ['SUBMITTED'],
      projects: ['Salon, Bordeaux', 'Valette'], proofs: ['WITH'], from: '2026-09-01', to: '2026-09-30',
      minAmount: '10.00', maxAmount: '150.00', sort: ExpenseReportSort.AMOUNT, direction: 'ASC',
    }, 'token');

    expect(http.calls[0].url).toBe(url);
  });

  it('submits the fields and the receipt as a form', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/expense-reports', { status: 201, data: { id: 'e1' } });

    await new ApiExpenseReportGateway(http).submit(
      'c1', prepareExpenseReportSubmission({ details, proof: { fileName: 'ticket.png', content: png } }), 'token',
    );

    expect(http.calls[0].data).toMatchObject({
      fields: [
        { name: 'date', value: '2026-09-28' }, { name: 'category', value: 'TRAVEL' },
        { name: 'paymentMethod', value: 'PERSONAL_CARD' }, { name: 'amount', value: '68.00' },
        { name: 'vatRate', value: '10' }, { name: 'description', value: 'Montpellier – Lyon' },
        { name: 'project', value: 'Client Valette' },
      ],
      files: [{ field: 'proof', fileName: 'ticket.png', contentType: 'image/png' }],
    });
  });

  it('puts a change with the choice about the attached receipt', async () => {
    const http = new InMemoryHttpClient();
    http.reply('put', 'companies/c1/expense-reports/e1', { status: 200, data: { id: 'e1' } });

    await new ApiExpenseReportGateway(http).revise(
      'c1', 'e1', prepareExpenseReportRevision({ details: { ...details, vatRate: null, project: null }, proof: null, keepProof: true }), 'token',
    );

    expect(http.calls[0].data).toEqual({
      fields: [
        { name: 'date', value: '2026-09-28' }, { name: 'category', value: 'TRAVEL' },
        { name: 'paymentMethod', value: 'PERSONAL_CARD' }, { name: 'amount', value: '68.00' },
        { name: 'description', value: 'Montpellier – Lyon' }, { name: 'keepProof', value: 'true' },
      ],
      files: [],
    });
  });

  it('asks for the link of a receipt', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/expense-reports/e1/proof', {
      status: 200, data: { url: 'https://storage/e1', fileName: 'ticket.png', contentType: 'image/png' },
    });

    await expect(new ApiExpenseReportGateway(http).viewProof('c1', 'e1', 'token')).resolves.toMatchObject({ fileName: 'ticket.png' });
  });
});
