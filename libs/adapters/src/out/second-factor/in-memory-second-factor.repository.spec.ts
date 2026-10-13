import { SecondFactor } from '@hexagonal-monorepo-template/domain';
import { InMemorySecondFactorRepository } from './in-memory-second-factor.repository';

describe('InMemorySecondFactorRepository', () => {
  it('finds nothing for a user who never started', async () => {
    const repository = new InMemorySecondFactorRepository();

    expect(await repository.findByUserId('u1')).toBeNull();
  });

  it('gives back the second factor it saved', async () => {
    const repository = new InMemorySecondFactorRepository();
    const factor = SecondFactor.begin('u1', 'c1', 'SECRET');

    await repository.save(factor);

    expect(await repository.findByUserId('u1')).toBe(factor);
  });

  it('replaces the second factor of the same user', async () => {
    const repository = new InMemorySecondFactorRepository();
    const factor = SecondFactor.begin('u1', 'c1', 'SECRET');
    await repository.save(factor);

    await repository.save(factor.confirm());

    expect((await repository.findByUserId('u1'))?.isEnrolled()).toBe(true);
  });

  it('keeps the second factors of two users apart', async () => {
    const repository = new InMemorySecondFactorRepository();
    await repository.save(SecondFactor.begin('u1', 'c1', 'ONE'));
    await repository.save(SecondFactor.begin('u2', 'c1', 'TWO'));

    expect((await repository.findByUserId('u2'))?.secret).toBe('TWO');
  });
});
