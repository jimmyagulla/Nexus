import { Module } from '@nestjs/common';
import { InMemorySickLeaveDocumentSource } from '@hexagonal-monorepo-template/adapters';
import { ISickLeaveDocumentSource } from '@hexagonal-monorepo-template/ports';

@Module({
  providers: [
    {
      provide: ISickLeaveDocumentSource,
      useFactory: () => new InMemorySickLeaveDocumentSource(),
    },
  ],
  exports: [ISickLeaveDocumentSource],
})
export class SickLeaveDocumentSourceModule {}
