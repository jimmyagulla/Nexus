import {
  FixedClock,
  InMemoryCabinetConnectionRepository,
  InMemoryCabinetExchangeRepository,
  InMemoryExchangeFileStorage,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  CabinetConnection,
  CabinetConnectionStatus,
  CabinetExchange,
  ErrorCode,
  ExchangeCategory,
  ExchangeEventKind,
  ExchangeFile,
  ExchangeStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { TransmitCabinetExchangesUseCase } from './transmit-cabinet-exchanges.use-case';

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const created = new Date('2026-10-06T09:00:00.000Z');
const now = new Date('2026-10-06T10:00:00.000Z');

const file = ExchangeFile.of(
  'a.pdf',
  'application/pdf',
  new Uint8Array([1, 2]),
);

function toTransmit(id: string): CabinetExchange {
  return CabinetExchange.draft(id, 'c1', 'user-1', created)
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(file)
    .markToTransmit();
}

async function build(
  status: CabinetConnectionStatus | null = CabinetConnectionStatus.CONNECTED,
  ids: readonly string[] = ['ex-1'],
) {
  const exchanges = new InMemoryCabinetExchangeRepository();
  const files = new InMemoryExchangeFileStorage();
  const connections = new InMemoryCabinetConnectionRepository();
  if (status !== null) {
    await connections.save(new CabinetConnection('c1', status));
  }
  for (const id of ids) {
    await exchanges.save(toTransmit(id));
    await files.save(id, file);
  }
  const useCase = new TransmitCabinetExchangesUseCase(
    exchanges,
    files,
    connections,
    new FixedClock(now),
  );
  return { exchanges, files, connections, useCase };
}

describe('TransmitCabinetExchangesUseCase', () => {
  it('transmits the exchange, which the connected cabinet receives at once', async () => {
    const { exchanges, useCase } = await build();

    const [snapshot] = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      exchangeIds: ['ex-1'],
    });

    expect(snapshot?.status).toBe(ExchangeStatus.RECEIVED);
    expect((await exchanges.findById('ex-1'))?.history).toEqual([
      {
        kind: ExchangeEventKind.TRANSMITTED,
        actorId: 'user-1',
        occurredAt: now,
        documentCount: 1,
      },
      {
        kind: ExchangeEventKind.RECEIVED,
        actorId: null,
        occurredAt: now,
        documentCount: 1,
      },
    ]);
  });

  it('transmits several documents together and remembers the group size', async () => {
    const { exchanges, useCase } = await build(
      CabinetConnectionStatus.CONNECTED,
      ['ex-1', 'ex-2', 'ex-3'],
    );

    const snapshots = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      exchangeIds: ['ex-1', 'ex-2', 'ex-3'],
    });

    expect(snapshots.map((snapshot) => snapshot.status)).toEqual([
      ExchangeStatus.RECEIVED,
      ExchangeStatus.RECEIVED,
      ExchangeStatus.RECEIVED,
    ]);
    expect(
      (await exchanges.findById('ex-2'))?.history.map(
        (event) => event.documentCount,
      ),
    ).toEqual([3, 1]);
  });

  it.each([
    ['no cabinet at all', null],
    ['an invitation not yet accepted', CabinetConnectionStatus.INVITATION_SENT],
    ['a revoked cabinet', CabinetConnectionStatus.REVOKED],
  ])('fails when the company has %s and leaves the exchange To transmit', async (_label, status) => {
    const { exchanges, useCase } = await build(status);

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        exchangeIds: ['ex-1'],
      }),
    ).rejects.toThrow(ErrorCode.TRANSMISSION_FAILED);
    expect((await exchanges.findById('ex-1'))?.status).toBe(
      ExchangeStatus.TO_TRANSMIT,
    );
  });

  it('fails when the file of the exchange cannot be found, leaving it To transmit', async () => {
    const { exchanges, useCase } = await build();
    await exchanges.save(toTransmit('ex-9'));

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        exchangeIds: ['ex-9'],
      }),
    ).rejects.toThrow(ErrorCode.TRANSMISSION_FAILED);
    expect((await exchanges.findById('ex-9'))?.status).toBe(
      ExchangeStatus.TO_TRANSMIT,
    );
  });

  it('transmits nothing from a group when one exchange cannot be transmitted', async () => {
    const { exchanges, useCase } = await build(
      CabinetConnectionStatus.CONNECTED,
      ['ex-1'],
    );
    await exchanges.save(toTransmit('ex-9'));

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        exchangeIds: ['ex-1', 'ex-9'],
      }),
    ).rejects.toThrow(ErrorCode.TRANSMISSION_FAILED);
    expect((await exchanges.findById('ex-1'))?.status).toBe(
      ExchangeStatus.TO_TRANSMIT,
    );
  });

  it('can be retried once the cabinet is connected', async () => {
    const { connections, exchanges, useCase } = await build(
      CabinetConnectionStatus.INVITATION_SENT,
    );
    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        exchangeIds: ['ex-1'],
      }),
    ).rejects.toThrow(ErrorCode.TRANSMISSION_FAILED);
    await connections.save(
      new CabinetConnection('c1', CabinetConnectionStatus.CONNECTED),
    );

    await useCase.execute({
      actor: employer,
      companyId: 'c1',
      exchangeIds: ['ex-1'],
    });

    expect((await exchanges.findById('ex-1'))?.status).toBe(
      ExchangeStatus.RECEIVED,
    );
  });

  it('answers the same way for an unknown exchange and one of another company', async () => {
    const { exchanges, useCase } = await build();
    await exchanges.save(CabinetExchange.draft('ex-2', 'c2', 'user-9', created));

    for (const exchangeId of ['ghost', 'ex-2']) {
      await expect(
        useCase.execute({
          actor: employer,
          companyId: 'c1',
          exchangeIds: [exchangeId],
        }),
      ).rejects.toThrow(ErrorCode.INACCESSIBLE_DOCUMENT);
    }
  });

  it('refuses an actor who is not the employer of the company', async () => {
    const { useCase } = await build();

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.EMPLOYEE },
        companyId: 'c1',
        exchangeIds: ['ex-1'],
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('asks for at least one exchange', async () => {
    const { useCase } = await build();

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1', exchangeIds: [] }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });
});
