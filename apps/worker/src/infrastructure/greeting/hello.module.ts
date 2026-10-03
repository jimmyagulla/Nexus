import { Module } from '@nestjs/common';
import { GetHelloUseCase } from '@hexagonal-monorepo-template/application';
import {
  IHelloInboundPort,
  IGreetingRepository,
} from '@hexagonal-monorepo-template/ports';
import { GreetingMockRepository } from '@hexagonal-monorepo-template/adapters';
import { MockDb } from '@hexagonal-monorepo-template/infrastructure';
import { HelloEventHandler } from '../../adapters/events/hello/hello.event-handler';

@Module({
  providers: [
    {
      provide: IGreetingRepository,
      useFactory: (db: MockDb) => {
        db.seed('greetings', 'default', { message: 'Hello Worker' });

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
    HelloEventHandler,
  ],
  exports: [IHelloInboundPort, HelloEventHandler],
})
export class HelloModule {}
