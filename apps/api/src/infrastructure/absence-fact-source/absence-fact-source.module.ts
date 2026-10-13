import { Module } from '@nestjs/common';
import { InMemoryAbsenceFactSource } from '@hexagonal-monorepo-template/adapters';
import { IAbsenceFactSource } from '@hexagonal-monorepo-template/ports';

@Module({
  providers: [
    {
      provide: IAbsenceFactSource,
      useFactory: () => new InMemoryAbsenceFactSource(),
    },
  ],
  exports: [IAbsenceFactSource],
})
export class AbsenceFactSourceModule {}
