import { describe, expect, it } from 'vitest';
import {
  CabinetConnection,
  CabinetConnectionStatus,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryCabinetConnectionRepository } from './in-memory-cabinet-connection.repository';

describe('InMemoryCabinetConnectionRepository', () => {
  it('finds the connection of a company', async () => {
    const repository = new InMemoryCabinetConnectionRepository();
    const connection = new CabinetConnection(
      'c1',
      CabinetConnectionStatus.CONNECTED,
    );
    await repository.save(connection);

    await expect(repository.findByCompanyId('c1')).resolves.toEqual(connection);
  });

  it('finds nothing for a company without cabinet', async () => {
    await expect(
      new InMemoryCabinetConnectionRepository().findByCompanyId('c1'),
    ).resolves.toBeNull();
  });

  it('keeps the latest status of a connection', async () => {
    const repository = new InMemoryCabinetConnectionRepository();
    await repository.save(
      new CabinetConnection('c1', CabinetConnectionStatus.CONNECTED),
    );
    await repository.save(
      new CabinetConnection('c1', CabinetConnectionStatus.REVOKED),
    );

    expect((await repository.findByCompanyId('c1'))?.status).toBe(
      CabinetConnectionStatus.REVOKED,
    );
  });
});
