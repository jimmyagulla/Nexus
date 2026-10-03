import { Module } from '@nestjs/common';
import { HelloController } from '../../adapters/http/hello/hello.controller';
import { GetHelloUseCase } from '@hexagonal-monorepo-template/application';
import {
  IHelloInboundPort,
  IGreetingRepository,
} from '@hexagonal-monorepo-template/ports';
import { GreetingMockRepository } from '@hexagonal-monorepo-template/adapters';
import { MockDb } from '@hexagonal-monorepo-template/infrastructure';

@Module({
  controllers: [HelloController],
  providers: [
    {
      provide: IGreetingRepository,
      useFactory: (db: MockDb) => {
        db.seed('greetings', 'default', { message: 'Hello API' });

        return new GreetingMockRepository(db);
      },
      inject: [MockDb],
    },
    {
      provide: IHelloInboundPort,
      useFactory: (greetings: IGreetingRepository) =>
        new GetHelloUseCase(greetings),
      inject: [IGreetingRepository],
    },
  ],
  exports: [IHelloInboundPort],
})
export class HelloModule {}
