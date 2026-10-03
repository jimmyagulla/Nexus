import { Test } from '@nestjs/testing';
import { IHelloInboundPort } from '@hexagonal-monorepo-template/ports';
import { GetHelloUseCase } from '@hexagonal-monorepo-template/application';
import { AppModule } from './app.module';
import { HelloEventHandler } from '../adapters/events/hello/hello.event-handler';

describe('AppModule', () => {
  it('wires the full hello chain (MockDb -> repository -> use case)', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const inboundPort = moduleRef.get<IHelloInboundPort>(IHelloInboundPort);

    expect(inboundPort).toBeInstanceOf(GetHelloUseCase);
    expect(inboundPort.execute().message).toBe('Hello Worker');
  });

  it('provides HelloEventHandler', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef.get(HelloEventHandler)).toBeInstanceOf(HelloEventHandler);
  });
});
