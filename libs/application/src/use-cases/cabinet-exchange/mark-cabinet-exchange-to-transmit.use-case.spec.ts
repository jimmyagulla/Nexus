import {
  InMemoryCabinetExchangeRepository,
  InMemoryExchangeFileStorage,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  CabinetExchange,
  ErrorCode,
  ExchangeCategory,
  ExchangeFile,
  ExchangeStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { MarkCabinetExchangeToTransmitUseCase } from './mark-cabinet-exchange-to-transmit.use-case';

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const at = new Date('2026-10-06T10:00:00.000Z');

const pdf = {
  fileName: 'releve.pdf',
  mimeType: 'application/pdf',
  content: new Uint8Array([1, 2, 3]),
};

async function build(
  prepare: (draft: CabinetExchange) => CabinetExchange = (draft) => draft,
) {
  const exchanges = new InMemoryCabinetExchangeRepository();
  const files = new InMemoryExchangeFileStorage();
  await exchanges.save(
    prepare(CabinetExchange.draft('ex-1', 'c1', 'user-1', at)),
  );
  const useCase = new MarkCabinetExchangeToTransmitUseCase(exchanges, files);
  return { exchanges, files, useCase };
}

const complete = (draft: CabinetExchange): CabinetExchange =>
  draft
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(
      ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1])),
    );

describe('MarkCabinetExchangeToTransmitUseCase', () => {
  it('marks a complete draft as To transmit', async () => {
    const { exchanges, useCase } = await build(complete);

    const snapshot = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      exchangeId: 'ex-1',
    });

    expect(snapshot.status).toBe(ExchangeStatus.TO_TRANSMIT);
    expect((await exchanges.findById('ex-1'))?.status).toBe(
      ExchangeStatus.TO_TRANSMIT,
    );
  });

  it('lets the employer attach the file and choose the category while marking', async () => {
    const { files, useCase } = await build();

    const snapshot = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      exchangeId: 'ex-1',
      category: 'Facture',
      file: pdf,
    });

    expect(snapshot).toMatchObject({
      status: ExchangeStatus.TO_TRANSMIT,
      category: 'Facture',
      document: { fileName: 'releve.pdf' },
    });
    expect([...((await files.find('ex-1'))?.content ?? [])]).toEqual([1, 2, 3]);
  });

  it('refuses a draft without document', async () => {
    const { useCase } = await build((draft) =>
      draft.withCategory(ExchangeCategory.parse('Facture')),
    );

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1', exchangeId: 'ex-1' }),
    ).rejects.toThrow(ErrorCode.MISSING_DOCUMENT);
  });

  it('refuses a draft without category', async () => {
    const { useCase } = await build();

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        exchangeId: 'ex-1',
        file: pdf,
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses an invalid file and leaves the draft untouched', async () => {
    const { exchanges, useCase } = await build();

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        exchangeId: 'ex-1',
        category: 'Facture',
        file: { ...pdf, mimeType: 'application/zip' },
      }),
    ).rejects.toThrow(ErrorCode.INVALID_FILE);
    expect((await exchanges.findById('ex-1'))?.category).toBeNull();
  });

  it('answers the same way for an unknown exchange and for an unreachable one', async () => {
    const { exchanges, useCase } = await build(complete);
    await exchanges.save(
      CabinetExchange.draft('ex-2', 'c2', 'user-9', at),
    );

    for (const exchangeId of ['ghost', 'ex-2']) {
      await expect(
        useCase.execute({ actor: employer, companyId: 'c1', exchangeId }),
      ).rejects.toThrow(ErrorCode.INACCESSIBLE_DOCUMENT);
    }
  });

  it('keeps a draft private to the colleague who started it', async () => {
    const { useCase } = await build(complete);

    await expect(
      useCase.execute({
        actor: { ...employer, userId: 'user-2' },
        companyId: 'c1',
        exchangeId: 'ex-1',
      }),
    ).rejects.toThrow(ErrorCode.INACCESSIBLE_DOCUMENT);
  });

  it('refuses an actor who is not the employer of the company', async () => {
    const { useCase } = await build(complete);

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.ACCOUNTANT },
        companyId: 'c1',
        exchangeId: 'ex-1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('does not mark an exchange that is already past the draft', async () => {
    const { exchanges, useCase } = await build(complete);
    await useCase.execute({
      actor: employer,
      companyId: 'c1',
      exchangeId: 'ex-1',
    });

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1', exchangeId: 'ex-1' }),
    ).rejects.toThrow(ErrorCode.REQUEST_ALREADY_PROCESSED);
    expect((await exchanges.findById('ex-1'))?.status).toBe(
      ExchangeStatus.TO_TRANSMIT,
    );
  });

  it('does not let the document change once the exchange is ready', async () => {
    const { files, useCase } = await build(complete);
    await useCase.execute({
      actor: employer,
      companyId: 'c1',
      exchangeId: 'ex-1',
    });

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        exchangeId: 'ex-1',
        file: pdf,
      }),
    ).rejects.toThrow(ErrorCode.REQUEST_ALREADY_PROCESSED);
    expect(await files.find('ex-1')).toBeNull();
  });
});
