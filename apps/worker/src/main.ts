import { Logger } from '@nestjs/common';
import { handler } from './handler';

export { handler };

const helloEvent = {
  source: 'mock.worker',
  'detail-type': 'hello.requested',
  detail: {},
};

async function runLocal(): Promise<void> {
  const result = await handler(helloEvent);
  Logger.log(`Result: ${JSON.stringify(result)}`, 'Worker');
}

if (require.main === module) {
  void runLocal();
}
