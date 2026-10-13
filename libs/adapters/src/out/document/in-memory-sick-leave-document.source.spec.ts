import { describe, expect, it } from 'vitest';
import {
  CalendarDate,
  SickLeaveDocument,
} from '@hexagonal-monorepo-template/domain';
import { InMemorySickLeaveDocumentSource } from './in-memory-sick-leave-document.source';

function document(
  id: string,
  companyId: string,
  employeeId: string,
): SickLeaveDocument {
  return {
    id,
    companyId,
    employeeId,
    date: CalendarDate.parse('2026-10-14'),
  };
}

describe('InMemorySickLeaveDocumentSource', () => {
  it('lists the sick leave documents of one employee of one company', async () => {
    const mine = document('s1', 'c1', 'e1');
    const source = new InMemorySickLeaveDocumentSource([
      mine,
      document('s2', 'c1', 'e2'),
      document('s3', 'c2', 'e1'),
    ]);

    expect(await source.listForEmployee('c1', 'e1')).toEqual([mine]);
  });

  it('lists nothing when no document was filed', async () => {
    expect(
      await new InMemorySickLeaveDocumentSource().listForEmployee('c1', 'e1'),
    ).toEqual([]);
  });
});
