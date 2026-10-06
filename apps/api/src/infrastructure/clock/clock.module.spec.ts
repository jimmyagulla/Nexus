import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { SystemClock } from '@hexagonal-monorepo-template/adapters';
import { IClock } from '@hexagonal-monorepo-template/ports';
import { ClockModule } from './clock.module';

const INJECTED_CLOCK = Symbol('INJECTED_CLOCK');

@Module({
  providers: [
    {
      provide: INJECTED_CLOCK,
      useFactory: (clock: IClock) => clock,
      inject: [IClock],
    },
  ],
})
class ClockConsumerModule {}

describe('ClockModule', () => {
  it('binds the clock port to the system clock', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ClockModule],
    }).compile();

    expect(moduleRef.get(IClock)).toBeInstanceOf(SystemClock);
  });

  it('offers the clock to a module that does not import it', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ClockModule, ClockConsumerModule],
    }).compile();

    expect(moduleRef.get(INJECTED_CLOCK)).toBe(moduleRef.get(IClock));
  });
});
