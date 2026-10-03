import { Greeting } from '@hexagonal-monorepo-template/domain';
import { IGreetingRepository } from '@hexagonal-monorepo-template/ports';
import { GetHelloUseCase } from './get-hello.use-case';

class InMemoryGreetingRepository implements IGreetingRepository {
  constructor(private readonly greeting: Greeting | null) {}

  findDefault(): Greeting | null {
    return this.greeting;
  }
}

describe('GetHelloUseCase', () => {
  it('returns the default greeting from the repository', () => {
    const useCase = new GetHelloUseCase(
      new InMemoryGreetingRepository(new Greeting('Hello API')),
    );

    expect(useCase.execute()).toEqual(new Greeting('Hello API'));
  });

  it('throws when the repository has no default greeting', () => {
    const useCase = new GetHelloUseCase(new InMemoryGreetingRepository(null));

    expect(() => useCase.execute()).toThrow('Default greeting not found');
  });
});
