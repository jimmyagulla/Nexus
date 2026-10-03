const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const workspaceRoot = join(__dirname, '../../..');
const eventPath =
  process.argv[2] ?? join(__dirname, '../events/get-docs.json');
const { handler } = require(join(workspaceRoot, 'dist/apps/api/lambda.js'));

const event = JSON.parse(readFileSync(eventPath, 'utf8'));
const context = {
  callbackWaitsForEmptyEventLoop: true,
  functionName: 'api',
  functionVersion: '$LATEST',
  invokedFunctionArn: 'arn:aws:lambda:local:function:api',
  memoryLimitInMB: '128',
  awsRequestId: 'local',
  logGroupName: 'local',
  logStreamName: 'local',
  getRemainingTimeInMillis: () => 30_000,
  done: () => undefined,
  fail: () => undefined,
  succeed: () => undefined,
};

handler(event, context)
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
