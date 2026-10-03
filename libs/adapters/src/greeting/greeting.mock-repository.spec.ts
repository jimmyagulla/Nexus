import { Greeting } from '@hexagonal-monorepo-template/domain';
import { MockDb } from '@hexagonal-monorepo-template/infrastructure';
import { GreetingMockRepository } from './greeting.mock-repository';

describe('GreetingMockRepository', () => {
  it('maps the default greeting record to a Greeting', () => {
    const db = new MockDb({
      greetings: { default: { message: 'Hello API' } },
    });
    const repository = new GreetingMockRepository(db);

    expect(repository.findDefault()).toEqual(new Greeting('Hello API'));
  });

  it('returns null when the default record is absent', () => {
    const repository = new GreetingMockRepository(new MockDb());

    expect(repository.findDefault()).toBeNull();
  });
});
