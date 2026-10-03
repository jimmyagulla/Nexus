import { Greeting } from '@hexagonal-monorepo-template/domain';
import { IGreetingRepository } from '@hexagonal-monorepo-template/ports';
import { MockDb } from '@hexagonal-monorepo-template/infrastructure';

export class GreetingMockRepository implements IGreetingRepository {
  constructor(private readonly db: MockDb) {}

  findDefault(): Greeting | null {
    const record = this.db.get('greetings', 'default');

    if (!record) {
      return null;
    }

    return new Greeting(record['message'] as string);
  }
}
