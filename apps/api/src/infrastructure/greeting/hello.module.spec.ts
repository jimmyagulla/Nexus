import { Test } from '@nestjs/testing';
import { IHelloInboundPort } from '@hexagonal-monorepo-template/ports';
import { GetHelloUseCase } from '@hexagonal-monorepo-template/application';
import { HelloModule } from './hello.module';
import { MockDbModule } from '../mock-db/mock-db.module';

describe('HelloModule', () => {
  it('wires the full hello chain (MockDb -> repository -> use case)', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MockDbModule, HelloModule],
    }).compile();

    const inboundPort = moduleRef.get<IHelloInboundPort>(IHelloInboundPort);

    expect(inboundPort).toBeInstanceOf(GetHelloUseCase);
    expect(inboundPort.execute().message).toBe('Hello API');
  });
});
