import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { RandomUuidGenerator } from '@hexagonal-monorepo-template/adapters';
import { IIdGenerator } from '@hexagonal-monorepo-template/ports';
import { IdGeneratorModule } from './id-generator.module';

describe('IdGeneratorModule', () => {
  it('binds the identifier port to random UUIDs', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [IdGeneratorModule],
    }).compile();

    expect(moduleRef.get(IIdGenerator)).toBeInstanceOf(RandomUuidGenerator);
  });
});
