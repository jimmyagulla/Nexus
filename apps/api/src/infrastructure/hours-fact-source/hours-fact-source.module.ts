import { Module } from '@nestjs/common';
import { InMemoryHoursFactSource } from '@hexagonal-monorepo-template/adapters';
import { IHoursFactSource } from '@hexagonal-monorepo-template/ports';

@Module({
  providers: [
    {
      provide: IHoursFactSource,
      useFactory: () => new InMemoryHoursFactSource(),
    },
  ],
  exports: [IHoursFactSource],
})
export class HoursFactSourceModule {}
