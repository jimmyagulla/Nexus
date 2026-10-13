import { InMemoryCabinetExchangeRepository } from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  CabinetExchange,
  ErrorCode,
  ExchangeCategory,
  ExchangeFile,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { GetCabinetIndicatorsUseCase } from './get-cabinet-indicators.use-case';

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const at = new Date('2026-10-06T10:00:00.000Z');
const file = ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1]));
const category = ExchangeCategory.parse('Facture');

async function build() {
  const exchanges = new InMemoryCabinetExchangeRepository();
  await exchanges.save(
    CabinetExchange.draft('ready', 'c1', 'user-1', at)
      .withCategory(category)
      .withDocument(file)
      .markToTransmit(),
  );
  await exchanges.save(
    CabinetExchange.deposit('unread', 'c1', 'cab-1', category, file, at).receive(at),
  );
  await exchanges.save(
    CabinetExchange.deposit('read', 'c1', 'cab-1', category, file, at)
      .receive(at)
      .consult('user-1', at),
  );
  await exchanges.save(
    CabinetExchange.deposit('foreign', 'c2', 'cab-9', category, file, at).receive(at),
  );
  await exchanges.save(
    CabinetExchange.draft('colleague-draft', 'c1', 'user-2', at),
  );
  return new GetCabinetIndicatorsUseCase(exchanges);
}

describe('GetCabinetIndicatorsUseCase', () => {
  it('publishes what is To transmit, what was received and what was not consulted', async () => {
    const useCase = await build();

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1' }),
    ).resolves.toEqual({ toTransmit: 1, received: 2, notConsulted: 1 });
  });

  it('counts nothing for a company that exchanged nothing', async () => {
    const useCase = new GetCabinetIndicatorsUseCase(
      new InMemoryCabinetExchangeRepository(),
    );

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1' }),
    ).resolves.toEqual({ toTransmit: 0, received: 0, notConsulted: 0 });
  });

  it('is for the employer only', async () => {
    const useCase = await build();

    for (const role of [UserRole.ACCOUNTANT, UserRole.EMPLOYEE]) {
      await expect(
        useCase.execute({ actor: { ...employer, role }, companyId: 'c1' }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    }
  });

  it('is for the employer of the company only', async () => {
    const useCase = await build();

    await expect(
      useCase.execute({ actor: employer, companyId: 'c2' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
