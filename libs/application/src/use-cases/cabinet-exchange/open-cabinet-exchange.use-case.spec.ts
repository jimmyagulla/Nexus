import {
  FixedClock,
  InMemoryCabinetConnectionRepository,
  InMemoryCabinetExchangeRepository,
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
import { OpenCabinetExchangeUseCase } from './open-cabinet-exchange.use-case';

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};
const accountant: ActorContext = {
  userId: 'cab-1',
  companyId: 'c1',
  role: UserRole.ACCOUNTANT,
};

const sent = new Date('2026-10-06T10:00:00.000Z');
const opened = new Date('2026-10-07T08:00:00.000Z');

function exchange(id: string, companyId = 'c1'): CabinetExchange {
  return CabinetExchange.draft(id, companyId, 'user-1', sent)
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1])))
    .markToTransmit();
}

async function build(
  status: CabinetConnectionStatus | null = CabinetConnectionStatus.CONNECTED,
) {
  const exchanges = new InMemoryCabinetExchangeRepository();
  const connections = new InMemoryCabinetConnectionRepository();
  if (status !== null) {
    await connections.save(new CabinetConnection('c1', status));
  }
  await exchanges.save(exchange('received').transmit('user-1', sent).receive(sent));
  await exchanges.save(exchange('ready'));
  await exchanges.save(
    exchange('foreign', 'c2').transmit('user-9', sent).receive(sent),
  );
  const useCaseAt = (at: Date) =>
    new OpenCabinetExchangeUseCase(exchanges, connections, new FixedClock(at));
  return { exchanges, useCaseAt, useCase: useCaseAt(opened) };
}

describe('OpenCabinetExchangeUseCase', () => {
  it('passes a received exchange to Consulted on its first opening by the cabinet', async () => {
    const { exchanges, useCase } = await build();

    const snapshot = await useCase.execute({
      actor: accountant,
      companyId: 'c1',
      exchangeId: 'received',
    });

    expect(snapshot.status).toBe(ExchangeStatus.CONSULTED);
    expect(snapshot.consultedAt).toBe('2026-10-07T08:00:00.000Z');
    expect((await exchanges.findById('received'))?.status).toBe(
      ExchangeStatus.CONSULTED,
    );
  });

  it('remembers who consulted the exchange, and when', async () => {
    const { exchanges, useCase } = await build();

    await useCase.execute({
      actor: accountant,
      companyId: 'c1',
      exchangeId: 'received',
    });

    expect((await exchanges.findById('received'))?.history.at(-1)).toEqual({
      kind: ExchangeEventKind.CONSULTED,
      actorId: 'cab-1',
      occurredAt: opened,
      documentCount: 1,
    });
  });

  it('keeps the date of the first opening when the cabinet opens it again', async () => {
    const { useCase, useCaseAt } = await build();
    await useCase.execute({
      actor: accountant,
      companyId: 'c1',
      exchangeId: 'received',
    });

    const again = await useCaseAt(new Date('2026-10-09T08:00:00.000Z')).execute({
      actor: accountant,
      companyId: 'c1',
      exchangeId: 'received',
    });

    expect(again.consultedAt).toBe('2026-10-07T08:00:00.000Z');
  });

  it('does not consult an exchange when its sender opens it', async () => {
    const { exchanges, useCase } = await build();

    const snapshot = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      exchangeId: 'received',
    });

    expect(snapshot.status).toBe(ExchangeStatus.RECEIVED);
    expect((await exchanges.findById('received'))?.history).toHaveLength(2);
  });

  it('answers DOCUMENT_INACCESSIBLE for an exchange not meant for the cabinet', async () => {
    const { useCase } = await build();

    for (const exchangeId of ['ready', 'foreign', 'ghost']) {
      await expect(
        useCase.execute({ actor: accountant, companyId: 'c1', exchangeId }),
      ).rejects.toThrow(ErrorCode.INACCESSIBLE_DOCUMENT);
    }
  });

  it('answers DOCUMENT_INACCESSIBLE once the cabinet is revoked', async () => {
    const { useCase } = await build(CabinetConnectionStatus.REVOKED);

    await expect(
      useCase.execute({
        actor: accountant,
        companyId: 'c1',
        exchangeId: 'received',
      }),
    ).rejects.toThrow(ErrorCode.INACCESSIBLE_DOCUMENT);
  });

  it('refuses an employee', async () => {
    const { useCase } = await build();

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.EMPLOYEE },
        companyId: 'c1',
        exchangeId: 'received',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses the cabinet of another company', async () => {
    const { useCase } = await build();

    await expect(
      useCase.execute({
        actor: { ...accountant, companyId: 'c2' },
        companyId: 'c1',
        exchangeId: 'received',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
