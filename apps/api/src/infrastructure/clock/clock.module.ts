import { Global, Module } from '@nestjs/common';
import { SystemClock } from '@hexagonal-monorepo-template/adapters';
import { IClock } from '@hexagonal-monorepo-template/ports';

@Global()
@Module({
  providers: [
    {
      provide: IClock,
      useFactory: () => new SystemClock(),
    },
  ],
  exports: [IClock],
})
export class ClockModule {}
