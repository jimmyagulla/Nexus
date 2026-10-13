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
import { DownloadCabinetExchangeFileUseCase } from './download-cabinet-exchange-file.use-case';

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
const downloaded = new Date('2026-10-07T08:00:00.000Z');

const file = ExchangeFile.of(
  'releve.pdf',
  'application/pdf',
  new Uint8Array([1, 2, 3]),
);

function exchange(id: string): CabinetExchange {
  return CabinetExchange.draft(id, 'c1', 'user-1', sent)
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(file)
    .markToTransmit();
}

async function build(
  status: CabinetConnectionStatus | null = CabinetConnectionStatus.CONNECTED,
) {
  const exchanges = new InMemoryCabinetExchangeRepository();
  const files = new InMemoryExchangeFileStorage();
  const connections = new InMemoryCabinetConnectionRepository();
  if (status !== null) {
    await connections.save(new CabinetConnection('c1', status));
  }
  await exchanges.save(exchange('received').transmit('user-1', sent).receive(sent));
  await files.save('received', file);
  await exchanges.save(exchange('lost').transmit('user-1', sent).receive(sent));
  await exchanges.save(exchange('ready'));
  await files.save('ready', file);
  return {
    exchanges,
    useCase: new DownloadCabinetExchangeFileUseCase(
      exchanges,
      files,
      connections,
      new FixedClock(downloaded),
    ),
  };
}

describe('DownloadCabinetExchangeFileUseCase', () => {
  it('gives the cabinet the file it received', async () => {
    const { useCase } = await build();

    const content = await useCase.execute({
      actor: accountant,
      companyId: 'c1',
      exchangeId: 'received',
    });

    expect(content).toEqual({
      fileName: 'releve.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([1, 2, 3]),
    });
  });

  it('remembers the download and consults the exchange', async () => {
    const { exchanges, useCase } = await build();

    await useCase.execute({
      actor: accountant,
      companyId: 'c1',
      exchangeId: 'received',
    });

    const stored = await exchanges.findById('received');
    expect(stored?.status).toBe(ExchangeStatus.CONSULTED);
    expect(stored?.history.at(-1)).toEqual({
      kind: ExchangeEventKind.DOWNLOADED,
      actorId: 'cab-1',
      occurredAt: downloaded,
      documentCount: 1,
    });
  });

  it('does not touch the exchange when its sender downloads the copy', async () => {
    const { exchanges, useCase } = await build();

    await useCase.execute({
      actor: employer,
      companyId: 'c1',
      exchangeId: 'received',
    });

    expect((await exchanges.findById('received'))?.status).toBe(
      ExchangeStatus.RECEIVED,
    );
  });

  it('answers DOCUMENT_INACCESSIBLE for what the cabinet may not see', async () => {
    const { useCase } = await build();

    for (const exchangeId of ['ready', 'ghost']) {
      await expect(
        useCase.execute({ actor: accountant, companyId: 'c1', exchangeId }),
      ).rejects.toThrow(ErrorCode.INACCESSIBLE_DOCUMENT);
    }
  });

  it('answers DOCUMENT_INACCESSIBLE when the file of the exchange is gone', async () => {
    const { useCase } = await build();

    await expect(
      useCase.execute({
        actor: accountant,
        companyId: 'c1',
        exchangeId: 'lost',
      }),
    ).rejects.toThrow(ErrorCode.INACCESSIBLE_DOCUMENT);
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
});
