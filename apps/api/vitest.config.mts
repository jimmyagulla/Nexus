import { createNodeVitestConfig } from '@hexagonal-monorepo-template/workspace/vitest/node';

export default createNodeVitestConfig({
  importMetaUrl: import.meta.url,
  name: 'api',
  coverageDirectory: '../../coverage/apps/api',
  test: {
    setupFiles: ['./src/test-setup.ts'],
  },
});
