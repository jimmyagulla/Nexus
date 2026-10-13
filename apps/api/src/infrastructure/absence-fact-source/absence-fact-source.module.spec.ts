import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { IAbsenceFactSource } from '@hexagonal-monorepo-template/ports';
import { AbsenceFactSourceModule } from './absence-fact-source.module';

describe('AbsenceFactSourceModule', () => {
  it('provides the absence fact source', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AbsenceFactSourceModule],
    }).compile();

    expect(moduleRef.get(IAbsenceFactSource)).toBeDefined();
  });

  it('knows no absence until the leave module publishes its facts', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AbsenceFactSourceModule],
    }).compile();

    expect(
      await moduleRef
        .get<IAbsenceFactSource>(IAbsenceFactSource)
        .listForEmployee('c1', 'e1'),
    ).toEqual([]);
  });
});
