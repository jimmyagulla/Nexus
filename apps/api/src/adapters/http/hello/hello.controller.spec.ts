import { Greeting } from '@hexagonal-monorepo-template/domain';
import { IHelloInboundPort } from '@hexagonal-monorepo-template/ports';
import { HelloController } from './hello.controller';

describe('HelloController', () => {
  it('maps the greeting from the inbound port to a response DTO', () => {
    const inboundPort: IHelloInboundPort = {
      execute: () => new Greeting('Hello API'),
    };
    const controller = new HelloController(inboundPort);

    expect(controller.getHello()).toEqual({ message: 'Hello API' });
  });
});
