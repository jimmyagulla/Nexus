import {
  ApiPresenceGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  PresenceListSnapshot,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListPresencesFromSessionUseCase } from './list-presences-from-session.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const list: PresenceListSnapshot = {
  presences: [
    {
      id: 'p1',
      employeeId: 'e1',
      employeeName: 'Camille Martin',
      month: '2026-10',
      workedDays: 22,
      leaves: [],
      absences: [],
      sickLeaves: [],
      overtime: [],
    },
  ],
  employees: [{ id: 'e1', companyId: 'c1', fullName: 'Camille Martin' }],
  canManage: true,
};

function useCaseFor(
  session: InMemorySessionGateway,
): ListPresencesFromSessionUseCase {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/presences', {
    status: 200,
    data: {
      presences: list.presences,
      employees: [{ id: 'e1', fullName: 'Camille Martin' }],
      canManage: true,
    },
  });
  return new ListPresencesFromSessionUseCase(
    session,
    new ApiPresenceGateway(http),
  );
}

describe('ListPresencesFromSessionUseCase', () => {
  it('lists the presences of the company of the signed-in actor', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute()).resolves.toEqual(list);
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
