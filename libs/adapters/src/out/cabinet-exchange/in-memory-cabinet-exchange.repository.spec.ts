import { describe, expect, it } from 'vitest';
import { CabinetExchange } from '@hexagonal-monorepo-template/domain';
import { InMemoryCabinetExchangeRepository } from './in-memory-cabinet-exchange.repository';

const at = new Date('2026-10-06T09:00:00.000Z');

describe('InMemoryCabinetExchangeRepository', () => {
  it('hands out a distinct identity every time', () => {
    const repository = new InMemoryCabinetExchangeRepository();

    expect(repository.nextId()).not.toBe(repository.nextId());
  });

  it('finds a saved exchange by its identity', async () => {
    const repository = new InMemoryCabinetExchangeRepository();
    const exchange = CabinetExchange.draft('ex-1', 'c1', 'user-1', at);
    await repository.save(exchange);

    await expect(repository.findById('ex-1')).resolves.toEqual(exchange);
  });

  it('finds nothing for an unknown identity', async () => {
    const repository = new InMemoryCabinetExchangeRepository();

    await expect(repository.findById('ghost')).resolves.toBeNull();
  });

  it('replaces an exchange saved twice', async () => {
    const repository = new InMemoryCabinetExchangeRepository();
    const draft = CabinetExchange.draft('ex-1', 'c1', 'user-1', at);
    await repository.save(draft);
    const sent = draft.transmit('user-1', at);
    await repository.save(sent);

    await expect(repository.findById('ex-1')).resolves.toEqual(sent);
  });

  it('lists only the exchanges of one company', async () => {
    const repository = new InMemoryCabinetExchangeRepository();
    await repository.save(CabinetExchange.draft('ex-1', 'c1', 'user-1', at));
    await repository.save(CabinetExchange.draft('ex-2', 'c2', 'user-2', at));

    const listed = await repository.listByCompany('c1');

    expect(listed.map((exchange) => exchange.id)).toEqual(['ex-1']);
  });
});
