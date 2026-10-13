import {
  ApiExpenseCategoryGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListExpenseCategoriesFromSessionUseCase } from './list-expense-categories-from-session.use-case';

const actor: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const categories = [{ id: 'restaurant', label: 'Restaurant' }];

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/expense-categories', {
    status: 200,
    data: categories,
  });
  return new ListExpenseCategoriesFromSessionUseCase(
    session,
    new ApiExpenseCategoryGateway(http),
  );
}

describe('ListExpenseCategoriesFromSessionUseCase', () => {
  it('lists the categories of the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute()).resolves.toEqual(categories);
  });

  it('refuses when the session carries no company', async () => {
    const useCase = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses when the session carries no token', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
