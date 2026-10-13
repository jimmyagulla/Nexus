import { InMemoryCabinetExchangeRepository } from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  CabinetExchange,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListCabinetExchangesUseCase } from './list-cabinet-exchanges.use-case';

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const day = (date: string) => new Date(`${date}T09:00:00.000Z`);

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
  return new ListCabinetExchangesUseCase(exchanges);
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
});
