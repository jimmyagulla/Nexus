import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { UuidGenerator } from '@hexagonal-monorepo-template/adapters';
import { IIdGenerator } from '@hexagonal-monorepo-template/ports';
import { IdGeneratorModule } from './id-generator.module';

const INJECTED_IDS = Symbol('INJECTED_IDS');

@Module({
  providers: [
    {
      provide: INJECTED_IDS,
      useFactory: (ids: IIdGenerator) => ids,
      inject: [IIdGenerator],
    },
  ],
})
class IdConsumerModule {}

describe('IdGeneratorModule', () => {
  it('binds the id generator port to the uuid generator', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [IdGeneratorModule],
    }).compile();

    expect(moduleRef.get(IIdGenerator)).toBeInstanceOf(UuidGenerator);
  });

  it('offers the id generator to a module that does not import it', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [IdGeneratorModule, IdConsumerModule],
    }).compile();

    expect(moduleRef.get(INJECTED_IDS)).toBe(moduleRef.get(IIdGenerator));
  });
});
