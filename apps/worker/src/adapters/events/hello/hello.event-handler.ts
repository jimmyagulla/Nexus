import { Inject, Injectable } from '@nestjs/common';
import { IHelloInboundPort } from '@hexagonal-monorepo-template/ports';
import {
  HELLO_REQUESTED_DETAIL_TYPE,
  parseEventEnvelope,
} from './dto/hello-event';

@Injectable()
export class HelloEventHandler {
  constructor(
    @Inject(IHelloInboundPort)
    private readonly helloPort: IHelloInboundPort
  ) {}

  handle(event: unknown): { message: string } {
    const envelope = parseEventEnvelope(event);

    if (envelope['detail-type'] !== HELLO_REQUESTED_DETAIL_TYPE) {
      throw new Error('Unknown event type');
    }

    const greeting = this.helloPort.execute();

    return { message: greeting.message };
  }
}
