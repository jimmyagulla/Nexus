import {
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
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListCabinetExchangeHistoryUseCase } from './list-cabinet-exchange-history.use-case';

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

const day = (date: string) => new Date(`${date}T09:00:00.000Z`);
const file = ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1]));

function sentOn(id: string, date: string, companyId = 'c1'): CabinetExchange {
  const at = day(date);
  return CabinetExchange.draft(id, companyId, 'user-1', at)
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(file)
    .markToTransmit()
    .transmit('user-1', at)
    .receive(at);
}

async function build(
  status: CabinetConnectionStatus | null = CabinetConnectionStatus.CONNECTED,
) {
  const exchanges = new InMemoryCabinetExchangeRepository();
  const connections = new InMemoryCabinetConnectionRepository();
  if (status !== null) {
    await connections.save(new CabinetConnection('c1', status));
  }
  await exchanges.save(
    sentOn('old', '2026-10-01').consult('cab-1', day('2026-10-02')),
  );
  await exchanges.save(sentOn('new', '2026-10-05'));
  await exchanges.save(sentOn('foreign', '2026-10-03', 'c2'));
  await exchanges.save(
    CabinetExchange.draft('draft', 'c1', 'user-1', day('2026-10-04')),
  );
  await exchanges.save(
    CabinetExchange.deposit(
      'deposit',
      'c1',
      'cab-1',
      ExchangeCategory.parse('Bilan'),
      file,
      day('2026-10-06'),
    ).receive(day('2026-10-06')),
  );
  return new ListCabinetExchangeHistoryUseCase(exchanges, connections);
}

describe('ListCabinetExchangeHistoryUseCase', () => {
  it('tells every step of the exchanges of the company, the most recent first', async () => {
    const useCase = await build();

    const entries = await useCase.execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(
      entries.map((entry) => [entry.exchangeId, entry.kind, entry.occurredAt]),
    ).toEqual([
      ['deposit', ExchangeEventKind.TRANSMITTED, '2026-10-06T09:00:00.000Z'],
      ['deposit', ExchangeEventKind.RECEIVED, '2026-10-06T09:00:00.000Z'],
      ['new', ExchangeEventKind.TRANSMITTED, '2026-10-05T09:00:00.000Z'],
      ['new', ExchangeEventKind.RECEIVED, '2026-10-05T09:00:00.000Z'],
      ['old', ExchangeEventKind.CONSULTED, '2026-10-02T09:00:00.000Z'],
      ['old', ExchangeEventKind.TRANSMITTED, '2026-10-01T09:00:00.000Z'],
      ['old', ExchangeEventKind.RECEIVED, '2026-10-01T09:00:00.000Z'],
    ]);
  });

  it('only tells about one exchange when asked for it', async () => {
    const useCase = await build();

    const entries = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      exchangeId: 'old',
    });

    expect(new Set(entries.map((entry) => entry.exchangeId))).toEqual(
      new Set(['old']),
    );
    expect(entries).toHaveLength(3);
  });

  it('never tells about the exchanges of another company', async () => {
    const useCase = await build();

    const entries = await useCase.execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(entries.map((entry) => entry.exchangeId)).not.toContain('foreign');
  });

  it('leaves out the drafts, which were never exchanged', async () => {
    const useCase = await build();

    const entries = await useCase.execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(entries.map((entry) => entry.exchangeId)).not.toContain('draft');
  });

  it('tells the cabinet what it received and what it deposited', async () => {
    const useCase = await build();

    const entries = await useCase.execute({
      actor: accountant,
      companyId: 'c1',
    });

    expect(new Set(entries.map((entry) => entry.exchangeId))).toEqual(
      new Set(['old', 'new', 'deposit']),
    );
  });

  it('tells a revoked cabinet nothing', async () => {
    const useCase = await build(CabinetConnectionStatus.REVOKED);

    await expect(
      useCase.execute({ actor: accountant, companyId: 'c1' }),
    ).resolves.toEqual([]);
  });

  it('answers DOCUMENT_INACCESSIBLE when asked for an exchange the actor may not see', async () => {
    const useCase = await build();

    for (const exchangeId of ['foreign', 'draft', 'ghost']) {
      await expect(
        useCase.execute({ actor: accountant, companyId: 'c1', exchangeId }),
      ).rejects.toThrow(ErrorCode.INACCESSIBLE_DOCUMENT);
    }
  });

  it('refuses an employee and the cabinet of another company', async () => {
    const useCase = await build();

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.EMPLOYEE },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    await expect(
      useCase.execute({
        actor: { ...accountant, companyId: 'c2' },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
