import { describe, expect, it } from 'vitest';
import {
  ErrorCode,
  ExpenseReportListCriteria,
  ExpenseReportSort,
  prepareExpenseReportRevision,
  prepareExpenseReportSubmission,
} from '@hexagonal-monorepo-template/domain';
import { FixedClock } from '../clock/fixed-clock';
import { RandomUuidGenerator } from '../id/random-uuid-generator';
import { InMemoryExpenseReportGateway } from './in-memory-expense-report.gateway';

const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
const details = {
  date: '2026-09-12', category: 'MEAL', paymentMethod: 'COMPANY_CARD', amount: '45',
  vatRate: 10, description: 'Déjeuner client Valette', project: 'Client Valette',
};
const everything: ExpenseReportListCriteria = {
  search: '', searchCategories: [], categories: [], statuses: [], projects: [], proofs: [],
  from: null, to: null, minAmount: null, maxAmount: null, sort: ExpenseReportSort.DATE, direction: 'DESC',
};

function setUp() {
  return new InMemoryExpenseReportGateway(new RandomUuidGenerator(), new FixedClock(new Date('2026-10-19T10:00:00Z')));
}

describe('InMemoryExpenseReportGateway', () => {
  it('lists the reports the token submitted, in its company only', async () => {
    const gateway = setUp();
    const submitted = await gateway.submit('c1', prepareExpenseReportSubmission({ details, proof: null }), 'u1');
    await gateway.submit('c1', prepareExpenseReportSubmission({ details, proof: null }), 'u2');

    const list = await gateway.list('c1', everything, 'u1');

    expect([list.items.map((item) => item.id), submitted.status, submitted.vatAmount]).toEqual([
      [submitted.id], 'SUBMITTED', '4.09',
    ]);
  });

  it('opens the receipt of a report', async () => {
    const gateway = setUp();
    const submitted = await gateway.submit(
      'c1', prepareExpenseReportSubmission({ details, proof: { fileName: 'ticket.png', content: png } }), 'u1',
    );

    await expect(gateway.viewProof('c1', submitted.id, 'u1')).resolves.toMatchObject({
      fileName: 'ticket.png', contentType: 'image/png',
    });
    await expect(gateway.viewProof('c1', submitted.id, 'u2')).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('revises a report, keeping or dropping its receipt', async () => {
    const gateway = setUp();
    const submitted = await gateway.submit(
      'c1', prepareExpenseReportSubmission({ details, proof: { fileName: 'ticket.png', content: png } }), 'u1',
    );

    const kept = await gateway.revise('c1', submitted.id, prepareExpenseReportRevision({
      details: { ...details, amount: '50' }, proof: null, keepProof: true,
    }), 'u1');
    const dropped = await gateway.revise('c1', submitted.id, prepareExpenseReportRevision({
      details, proof: null, keepProof: false,
    }), 'u1');

    expect([kept.amount, kept.proof?.fileName, dropped.proof]).toEqual(['50.00', 'ticket.png', null]);
  });
});
