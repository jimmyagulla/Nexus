import { Global, Module } from '@nestjs/common';
import { MockDb } from '@hexagonal-monorepo-template/infrastructure';

/**
 * Shared, business-agnostic technical client. Provided once at the app level
 * and made global so feature wiring modules can inject it and seed their own
 * tables.
 */
@Global()
@Module({
  providers: [
    {
      provide: MockDb,
      useFactory: () => new MockDb(),
    },
  ],
  exports: [MockDb],
})
export class MockDbModule {}
