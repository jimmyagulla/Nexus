import {
  FixedClock,
  InMemoryCabinetExchangeRepository,
  InMemoryExchangeFileStorage,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExchangeDirection,
  ExchangeStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { CreateCabinetExchangeDraftUseCase } from './create-cabinet-exchange-draft.use-case';

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const now = new Date('2026-10-06T10:00:00.000Z');

const pdf = {
  fileName: 'releve.pdf',
  mimeType: 'application/pdf',
  content: new Uint8Array([1, 2, 3]),
};

function build() {
  const exchanges = new InMemoryCabinetExchangeRepository();
  const files = new InMemoryExchangeFileStorage();
  const useCase = new CreateCabinetExchangeDraftUseCase(
    exchanges,
    files,
    new FixedClock(now),
  );
  return { exchanges, files, useCase };
}

describe('CreateCabinetExchangeDraftUseCase', () => {
  it('creates a draft going to the cabinet with its category and file', async () => {
    const { useCase } = build();

    const snapshot = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      category: 'Facture',
      file: pdf,
    });

    expect(snapshot).toMatchObject({
      direction: ExchangeDirection.COMPANY_TO_CABINET,
      status: ExchangeStatus.DRAFT,
      category: 'Facture',
      senderId: 'user-1',
      date: '2026-10-06T10:00:00.000Z',
      document: { fileName: 'releve.pdf', mimeType: 'application/pdf', size: 3 },
    });
  });

  it('keeps the draft and its file for later', async () => {
    const { exchanges, files, useCase } = build();

    const snapshot = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      category: 'Facture',
      file: pdf,
    });

    expect((await exchanges.findById(snapshot.id))?.companyId).toBe('c1');
    expect([...((await files.find(snapshot.id))?.content ?? [])]).toEqual([
      1, 2, 3,
    ]);
  });

  it('accepts a draft that has neither category nor file yet', async () => {
    const { files, useCase } = build();

    const snapshot = await useCase.execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(snapshot).toMatchObject({ category: null, document: null });
    await expect(files.find(snapshot.id)).resolves.toBeNull();
  });

  it('refuses an invalid file and creates nothing', async () => {
    const { exchanges, useCase } = build();

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        file: { ...pdf, mimeType: 'text/plain' },
      }),
    ).rejects.toThrow(ErrorCode.INVALID_FILE);
    await expect(exchanges.listByCompany('c1')).resolves.toEqual([]);
  });

  it('refuses an empty file', async () => {
    const { useCase } = build();

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        file: { ...pdf, content: new Uint8Array() },
      }),
    ).rejects.toThrow(ErrorCode.INVALID_FILE);
  });

  it('refuses a blank category', async () => {
    const { useCase } = build();

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1', category: '  ' }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses an actor who is not the employer of the company', async () => {
    const { useCase } = build();

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.EMPLOYEE },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    await expect(
      useCase.execute({ actor: employer, companyId: 'c2' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
