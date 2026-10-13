import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { IHoursFactSource } from '@hexagonal-monorepo-template/ports';
import { HoursFactSourceModule } from './hours-fact-source.module';

describe('HoursFactSourceModule', () => {
  it('provides the hours fact source', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HoursFactSourceModule],
    }).compile();

    expect(moduleRef.get(IHoursFactSource)).toBeDefined();
  });

  it('knows no hours until the overtime module publishes its facts', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HoursFactSourceModule],
    }).compile();

    expect(
      await moduleRef
        .get<IHoursFactSource>(IHoursFactSource)
        .listForEmployee('c1', 'e1'),
    ).toEqual([]);
  });
});
