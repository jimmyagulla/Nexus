export type EventEnvelope = {
  source: string;
  'detail-type': string;
  detail: unknown;
};

export const HELLO_REQUESTED_DETAIL_TYPE = 'hello.requested';

export function parseEventEnvelope(event: unknown): EventEnvelope {
  if (event === null || typeof event !== 'object') {
    throw new Error('Invalid event');
  }

  return event as EventEnvelope;
}
