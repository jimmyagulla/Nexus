import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { ISickLeaveDocumentSource } from '@hexagonal-monorepo-template/ports';
import { SickLeaveDocumentSourceModule } from './sick-leave-document-source.module';

describe('SickLeaveDocumentSourceModule', () => {
  it('provides the sick leave document source', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SickLeaveDocumentSourceModule],
    }).compile();

    expect(moduleRef.get(ISickLeaveDocumentSource)).toBeDefined();
  });

  it('knows no document until the vault module files its documents', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SickLeaveDocumentSourceModule],
    }).compile();

    expect(
      await moduleRef
        .get<ISickLeaveDocumentSource>(ISickLeaveDocumentSource)
        .listForEmployee('c1', 'e1'),
    ).toEqual([]);
  });
});
