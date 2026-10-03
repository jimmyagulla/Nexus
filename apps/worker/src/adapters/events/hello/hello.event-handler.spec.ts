import { Greeting } from '@hexagonal-monorepo-template/domain';
import { IHelloInboundPort } from '@hexagonal-monorepo-template/ports';
import { HelloEventHandler } from './hello.event-handler';

function unusedInboundPort(): IHelloInboundPort {
  return {
    execute: () => {
      throw new Error('inbound port should not be called');
    },
  };
}

describe('HelloEventHandler', () => {
  it('maps a hello.requested event to the inbound port result', () => {
    const inboundPort: IHelloInboundPort = {
      execute: () => new Greeting('Hello Worker'),
    };
    const handler = new HelloEventHandler(inboundPort);

    expect(
      handler.handle({
        source: 'mock.worker',
        'detail-type': 'hello.requested',
        detail: {},
      }),
    ).toEqual({ message: 'Hello Worker' });
  });

  it('rejects a null event without calling the inbound port', () => {
    expect(() => new HelloEventHandler(unusedInboundPort()).handle(null)).toThrow(
      'Invalid event',
    );
  });

  it('rejects a non-object event without calling the inbound port', () => {
    expect(() =>
      new HelloEventHandler(unusedInboundPort()).handle('not-an-event'),
    ).toThrow('Invalid event');
  });

  it('rejects a missing detail-type without calling the inbound port', () => {
    expect(() =>
      new HelloEventHandler(unusedInboundPort()).handle({
        source: 'mock.worker',
        detail: {},
      }),
    ).toThrow('Unknown event type');
  });

  it('rejects an unknown detail-type without calling the inbound port', () => {
    expect(() =>
      new HelloEventHandler(unusedInboundPort()).handle({
        source: 'mock.worker',
        'detail-type': 'other.event',
        detail: {},
      }),
    ).toThrow('Unknown event type');
  });
});
