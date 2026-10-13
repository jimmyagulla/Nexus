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
  ExchangeFile,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListCabinetExchangesUseCase } from './list-cabinet-exchanges.use-case';

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const day = (date: string) => new Date(`${date}T09:00:00.000Z`);

const accountant: ActorContext = {
  userId: 'cab-1',
  companyId: 'c1',
  role: UserRole.ACCOUNTANT,
};

function readyExchange(id: string, companyId = 'c1'): CabinetExchange {
  return CabinetExchange.draft(id, companyId, 'user-1', day('2026-10-01'))
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1])))
    .markToTransmit();
}

async function buildForCabinet(
  status: CabinetConnectionStatus | null = CabinetConnectionStatus.CONNECTED,
) {
  const exchanges = new InMemoryCabinetExchangeRepository();
  const connections = new InMemoryCabinetConnectionRepository();
  if (status !== null) {
    await connections.save(new CabinetConnection('c1', status));
  }
  const at = day('2026-10-02');
  await exchanges.save(CabinetExchange.draft('draft', 'c1', 'user-1', at));
  await exchanges.save(readyExchange('ready'));
  await exchanges.save(readyExchange('received').transmit('user-1', at).receive(at));
  await exchanges.save(
    readyExchange('other-company', 'c2').transmit('user-9', at).receive(at),
  );
  return new ListCabinetExchangesUseCase(exchanges, connections);
}

async function build() {
  const exchanges = new InMemoryCabinetExchangeRepository();
  await exchanges.save(
    CabinetExchange.draft('old', 'c1', 'user-1', day('2026-10-01')),
  );
  await exchanges.save(
    CabinetExchange.draft('new', 'c1', 'user-1', day('2026-10-05')),
  );
  await exchanges.save(
    CabinetExchange.draft('colleague-draft', 'c1', 'user-2', day('2026-10-04')),
  );
  await exchanges.save(
    CabinetExchange.draft('stranger', 'c2', 'user-9', day('2026-10-03')),
  );
  return new ListCabinetExchangesUseCase(
    exchanges,
    new InMemoryCabinetConnectionRepository(),
  );
}

describe('ListCabinetExchangesUseCase', () => {
  it('lists the exchanges of the company, the most recent first', async () => {
    const useCase = await build();

    const listed = await useCase.execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(listed.map((snapshot) => snapshot.id)).toEqual(['new', 'old']);
  });

  it('keeps the drafts of a colleague out of the list', async () => {
    const useCase = await build();

    const listed = await useCase.execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(listed.map((snapshot) => snapshot.id)).not.toContain(
      'colleague-draft',
    );
  });

  it('never lists the exchanges of another company', async () => {
    const useCase = await build();

    await expect(
      useCase.execute({ actor: employer, companyId: 'c2' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('lists nothing for a company that exchanged nothing', async () => {
    const useCase = new ListCabinetExchangesUseCase(
      new InMemoryCabinetExchangeRepository(),
      new InMemoryCabinetConnectionRepository(),
    );

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1' }),
    ).resolves.toEqual([]);
  });

  it('refuses an employee', async () => {
    const useCase = await build();

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.EMPLOYEE },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  describe('for the cabinet', () => {
    it('lists what it received, nothing that is still on the company side', async () => {
      const useCase = await buildForCabinet();

      const listed = await useCase.execute({
        actor: accountant,
        companyId: 'c1',
      });

      expect(listed.map((snapshot) => snapshot.id)).toEqual(['received']);
    });

    it('lists nothing when the cabinet is revoked', async () => {
      const useCase = await buildForCabinet(CabinetConnectionStatus.REVOKED);

      await expect(
        useCase.execute({ actor: accountant, companyId: 'c1' }),
      ).resolves.toEqual([]);
    });

    it('lists nothing when the cabinet was never connected', async () => {
      const useCase = await buildForCabinet(null);

      await expect(
        useCase.execute({ actor: accountant, companyId: 'c1' }),
      ).resolves.toEqual([]);
    });

    it('refuses the cabinet of another company', async () => {
      const useCase = await buildForCabinet();

      await expect(
        useCase.execute({
          actor: { ...accountant, companyId: 'c2' },
          companyId: 'c1',
        }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    });
  });

  it('shows the employer what the cabinet deposited, in the cabinet to company direction', async () => {
    const exchanges = new InMemoryCabinetExchangeRepository();
    await exchanges.save(
      CabinetExchange.deposit(
        'deposit',
        'c1',
        'cab-1',
        ExchangeCategory.parse('Bilan'),
        ExchangeFile.of('bilan.pdf', 'application/pdf', new Uint8Array([1])),
        day('2026-10-08'),
      ).receive(day('2026-10-08')),
    );
    const useCase = new ListCabinetExchangesUseCase(
      exchanges,
      new InMemoryCabinetConnectionRepository(),
    );

    const [listed] = await useCase.execute({ actor: employer, companyId: 'c1' });

    expect(listed).toMatchObject({
      id: 'deposit',
      direction: 'CABINET_TO_COMPANY',
      status: 'RECEIVED',
    });
  });
});
