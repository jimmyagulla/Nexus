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
import { AdjustPresenceWorkedDaysFromSessionUseCase } from './adjust-presence-worked-days-from-session.use-case';

const actor: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const corrected: PresenceSnapshot = {
  id: 'p1',
  employeeId: 'e1',
  employeeName: 'Camille Martin',
  month: '2026-10',
  workedDays: 20,
  proposedWorkedDays: 22,
  adjustments: [
    {
      actorId: 'user-1',
      occurredAt: '2026-10-13T09:00:00.000Z',
      before: 22,
      after: 20,
    },
  ],
  leaves: [],
  absences: [],
  sickLeaves: [],
  overtime: [],
};

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('patch', 'companies/c1/presences/p1/worked-days', {
    status: 200,
    data: corrected,
  });
  return {
    http,
    useCase: new AdjustPresenceWorkedDaysFromSessionUseCase(
      session,
      new ApiPresenceGateway(http),
    ),
  };
}

describe('AdjustPresenceWorkedDaysFromSessionUseCase', () => {
  it('corrects the worked days on the company of the signed-in actor', async () => {
    const { useCase, http } = useCaseFor(
      new InMemorySessionGateway('token', actor),
    );

    await expect(
      useCase.execute({ presenceId: 'p1', workedDays: 20 }),
    ).resolves.toEqual(corrected);
    expect(http.calls).toMatchObject([
      {
        method: 'patch',
        url: 'companies/c1/presences/p1/worked-days',
        data: { workedDays: 20 },
      },
    ]);
  });

  it('refuses when the session carries no company', async () => {
    const { useCase, http } = useCaseFor(
      new InMemorySessionGateway('token', { ...actor, companyId: null }),
    );

    await expect(
      useCase.execute({ presenceId: 'p1', workedDays: 20 }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(http.calls).toEqual([]);
  });

  it('refuses when the session carries no token', async () => {
    const { useCase, http } = useCaseFor(new InMemorySessionGateway(null, actor));

    await expect(
      useCase.execute({ presenceId: 'p1', workedDays: 20 }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(http.calls).toEqual([]);
  });
});
