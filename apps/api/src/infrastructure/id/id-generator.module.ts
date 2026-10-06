import { Global, Module } from '@nestjs/common';
import { UuidGenerator } from '@hexagonal-monorepo-template/adapters';
import { IIdGenerator } from '@hexagonal-monorepo-template/ports';

@Global()
@Module({
  providers: [
    {
      provide: IIdGenerator,
      useFactory: () => new UuidGenerator(),
    },
  ],
  exports: [IIdGenerator],
})
export class IdGeneratorModule {}
