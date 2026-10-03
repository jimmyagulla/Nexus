import { Greeting } from '@hexagonal-monorepo-template/domain';
import {
  IGreetingRepository,
  IHelloInboundPort,
} from '@hexagonal-monorepo-template/ports';

export class GetHelloUseCase implements IHelloInboundPort {
  constructor(private readonly greetings: IGreetingRepository) {}

  execute(): Greeting {
    const greeting = this.greetings.findDefault();

    if (!greeting) {
      throw new Error('Default greeting not found');
    }

    return greeting;
  }
}
