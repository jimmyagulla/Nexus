import { InMemorySecondFactorIdentityBinder } from './in-memory-second-factor-identity-binder';

describe('InMemorySecondFactorIdentityBinder', () => {
  it('remembers a user whose second factor is verified', async () => {
    const binder = new InMemorySecondFactorIdentityBinder();

    await binder.markVerified('u1');

    expect(binder.verified.has('u1')).toBe(true);
    expect(binder.verified.has('u2')).toBe(false);
  });

  it('forgets the verification of a user', async () => {
    const binder = new InMemorySecondFactorIdentityBinder();
    await binder.markVerified('u1');

    await binder.clearVerified('u1');

    expect(binder.verified.has('u1')).toBe(false);
  });

  it('accepts to clear a user who was never verified', async () => {
    await expect(
      new InMemorySecondFactorIdentityBinder().clearVerified('u1'),
    ).resolves.toBeUndefined();
  });
});
