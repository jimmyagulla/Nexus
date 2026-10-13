import {
  ApiPresenceGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  PresenceSnapshot,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { OpenPresenceFromSessionUseCase } from './open-presence-from-session.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const opened: PresenceSnapshot = {
  id: 'p1',
  employeeId: 'e1',
  employeeName: 'Camille Martin',
  month: '2026-10',
  workedDays: 22,
  proposedWorkedDays: 22,
  adjustments: [],
  leaves: [],
  absences: [],
  sickLeaves: [],
  overtime: [],
};

function useCaseFor(
  session: InMemorySessionGateway,
): { useCase: OpenPresenceFromSessionUseCase; http: InMemoryHttpClient } {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/presences', { status: 201, data: opened });
  return {
    http,
    useCase: new OpenPresenceFromSessionUseCase(
      session,
      new ApiPresenceGateway(http),
    ),
  };
}

describe('OpenPresenceFromSessionUseCase', () => {
  it('opens the month on the company of the signed-in actor', async () => {
    const { useCase, http } = useCaseFor(
      new InMemorySessionGateway('token', actor),
    );

    await expect(
      useCase.execute({ employeeId: 'e1', month: '2026-10' }),
    ).resolves.toEqual(opened);
    expect(http.calls).toMatchObject([
      {
        method: 'post',
        url: 'companies/c1/presences',
        data: { employeeId: 'e1', month: '2026-10' },
      },
    ]);
  });

  it('refuses when the session carries no company', async () => {
    const { useCase, http } = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(
      useCase.execute({ employeeId: 'e1', month: '2026-10' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(http.calls).toEqual([]);
  });

  it('refuses when the session carries no token', async () => {
    const { useCase, http } = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(
      useCase.execute({ employeeId: 'e1', month: '2026-10' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(http.calls).toEqual([]);
  });
});
