import { CabinetExchange } from '../entities/cabinet-exchange';
import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { requireVisibleExchange } from './require-visible-exchange';

const at = new Date('2026-10-06T10:00:00.000Z');

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const exchange = CabinetExchange.draft('ex-1', 'c1', 'user-1', at);

describe('requireVisibleExchange', () => {
  it('gives the exchange back when the actor may see it', async () => {
    await expect(
      requireVisibleExchange('ex-1', employer, null, async () => exchange),
    ).resolves.toBe(exchange);
  });

  it('refuses an exchange that does not exist', async () => {
    await expect(
      requireVisibleExchange('ex-1', employer, null, async () => null),
    ).rejects.toThrow(ErrorCode.INACCESSIBLE_DOCUMENT);
  });

  it('refuses an exchange the actor may not see, like one that does not exist', async () => {
    const stranger: ActorContext = { ...employer, companyId: 'c2' };

    await expect(
      requireVisibleExchange('ex-1', stranger, null, async () => exchange),
    ).rejects.toThrow(ErrorCode.INACCESSIBLE_DOCUMENT);
  });
});
