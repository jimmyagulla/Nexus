import { createNodeVitestConfig } from '@hexagonal-monorepo-template/workspace/vitest/node';

export default createNodeVitestConfig({
  importMetaUrl: import.meta.url,
  name: 'worker',
  coverageDirectory: '../../coverage/apps/worker',
  test: {
    setupFiles: ['./src/test-setup.ts'],
  },
});
