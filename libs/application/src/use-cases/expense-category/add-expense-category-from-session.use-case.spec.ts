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
import { AddExpenseCategoryFromSessionUseCase } from './add-expense-category-from-session.use-case';

const actor: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const categories = [
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'cat-1', label: 'Hôtel' },
];

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/expense-categories', {
    status: 201,
    data: categories,
  });
  return {
    http,
    useCase: new AddExpenseCategoryFromSessionUseCase(
      session,
      new ApiExpenseCategoryGateway(http),
    ),
  };
}

describe('AddExpenseCategoryFromSessionUseCase', () => {
  it('adds the category to the company of the signed-in actor', async () => {
    const { useCase, http } = useCaseFor(
      new InMemorySessionGateway('token', actor),
    );

    await expect(useCase.execute('Hôtel')).resolves.toEqual(categories);
    expect(http.calls[0]?.data).toEqual({ label: 'Hôtel' });
  });

  it('refuses when the session carries no company', async () => {
    const { useCase } = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(useCase.execute('Hôtel')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses when the session carries no token', async () => {
    const { useCase } = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(useCase.execute('Hôtel')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
