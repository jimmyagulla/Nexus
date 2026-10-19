import { Global, Module } from '@nestjs/common';
import { RandomUuidGenerator } from '@hexagonal-monorepo-template/adapters';
import { IIdGenerator } from '@hexagonal-monorepo-template/ports';

@Global()
@Module({
  providers: [
    {
      provide: IIdGenerator,
      useFactory: () => new RandomUuidGenerator(),
    },
  ],
  exports: [IIdGenerator],
})
export class IdGeneratorModule {}
