import { Test } from '@nestjs/testing';
import { MockDb } from '@hexagonal-monorepo-template/infrastructure';
import { MockDbModule } from './mock-db.module';

describe('MockDbModule', () => {
  it('provides a generic, business-agnostic MockDb (no seeded data)', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MockDbModule],
    }).compile();

    const db = moduleRef.get(MockDb);

    expect(db).toBeInstanceOf(MockDb);
    expect(db.get('greetings', 'default')).toBeUndefined();
  });
});
