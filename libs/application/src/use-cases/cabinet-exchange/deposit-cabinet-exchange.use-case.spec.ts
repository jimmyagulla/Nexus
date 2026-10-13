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
  ErrorCode,
  ExchangeDirection,
  ExchangeEventKind,
  ExchangeStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { DepositCabinetExchangeUseCase } from './deposit-cabinet-exchange.use-case';

const accountant: ActorContext = {
  userId: 'cab-1',
  companyId: 'c1',
  role: UserRole.ACCOUNTANT,
};

const now = new Date('2026-10-08T10:00:00.000Z');

const pdf = {
  fileName: 'bilan.pdf',
  mimeType: 'application/pdf',
  content: new Uint8Array([1, 2, 3]),
};

async function build(
  status: CabinetConnectionStatus | null = CabinetConnectionStatus.CONNECTED,
) {
  const exchanges = new InMemoryCabinetExchangeRepository();
  const files = new InMemoryExchangeFileStorage();
  const connections = new InMemoryCabinetConnectionRepository();
  if (status !== null) {
    await connections.save(new CabinetConnection('c1', status));
  }
  return {
    exchanges,
    files,
    useCase: new DepositCabinetExchangeUseCase(
      exchanges,
      files,
      connections,
      new FixedClock(now),
    ),
  };
}

describe('DepositCabinetExchangeUseCase', () => {
  it('creates an exchange from the cabinet to the company, Received by the company', async () => {
    const { useCase } = await build();

    const snapshot = await useCase.execute({
      actor: accountant,
      companyId: 'c1',
      category: 'Bilan',
      file: pdf,
    });

    expect(snapshot).toMatchObject({
      direction: ExchangeDirection.CABINET_TO_COMPANY,
      status: ExchangeStatus.RECEIVED,
      category: 'Bilan',
      senderId: 'cab-1',
      date: '2026-10-08T10:00:00.000Z',
      document: { fileName: 'bilan.pdf', size: 3 },
    });
  });

  it('is born Transmitted before it is Received, as the history tells', async () => {
    const { exchanges, useCase } = await build();

    const snapshot = await useCase.execute({
      actor: accountant,
      companyId: 'c1',
      category: 'Bilan',
      file: pdf,
    });

    expect(
      (await exchanges.findById(snapshot.id))?.history.map(
        (event) => event.kind,
      ),
    ).toEqual([ExchangeEventKind.TRANSMITTED, ExchangeEventKind.RECEIVED]);
  });

  it('keeps the file of the deposit', async () => {
    const { files, useCase } = await build();

    const snapshot = await useCase.execute({
      actor: accountant,
      companyId: 'c1',
      category: 'Bilan',
      file: pdf,
    });

    expect([...((await files.find(snapshot.id))?.content ?? [])]).toEqual([
      1, 2, 3,
    ]);
  });

  it('refuses an invalid file and deposits nothing', async () => {
    const { exchanges, useCase } = await build();

    await expect(
      useCase.execute({
        actor: accountant,
        companyId: 'c1',
        category: 'Bilan',
        file: { ...pdf, mimeType: 'text/plain' },
      }),
    ).rejects.toThrow(ErrorCode.INVALID_FILE);
    await expect(exchanges.listByCompany('c1')).resolves.toEqual([]);
  });

  it('asks for the document', async () => {
    const { useCase } = await build();

    await expect(
      useCase.execute({
        actor: accountant,
        companyId: 'c1',
        category: 'Bilan',
        file: null,
      }),
    ).rejects.toThrow(ErrorCode.MISSING_DOCUMENT);
  });

  it('asks for the category', async () => {
    const { useCase } = await build();

    await expect(
      useCase.execute({
        actor: accountant,
        companyId: 'c1',
        category: '  ',
        file: pdf,
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it.each([
    ['revoked', CabinetConnectionStatus.REVOKED],
    ['invited only', CabinetConnectionStatus.INVITATION_SENT],
    ['never connected', null],
  ])('no longer lets a cabinet deposit when it is %s', async (_label, status) => {
    const { exchanges, useCase } = await build(status);

    await expect(
      useCase.execute({
        actor: accountant,
        companyId: 'c1',
        category: 'Bilan',
        file: pdf,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    await expect(exchanges.listByCompany('c1')).resolves.toEqual([]);
  });

  it('refuses the employer, who sends through its own exchanges', async () => {
    const { useCase } = await build();

    await expect(
      useCase.execute({
        actor: { ...accountant, role: UserRole.EMPLOYER },
        companyId: 'c1',
        category: 'Bilan',
        file: pdf,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
