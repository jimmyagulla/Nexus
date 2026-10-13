import { InMemorySecretHasher } from './in-memory-secret-hasher';

describe('InMemorySecretHasher', () => {
  it('hashes a secret so the original is not stored', async () => {
    const hasher = new InMemorySecretHasher();

    const hash = await hasher.hash('s3cret');

    expect(hash).not.toBe('s3cret');
    expect(hash.includes('s3cret')).toBe(true);
  });

  it('recognises the secret that produced the hash', async () => {
    const hasher = new InMemorySecretHasher();
    const hash = await hasher.hash('s3cret');

    expect(await hasher.matches('s3cret', hash)).toBe(true);
  });

  it('rejects a different secret', async () => {
    const hasher = new InMemorySecretHasher();
    const hash = await hasher.hash('s3cret');

    expect(await hasher.matches('other', hash)).toBe(false);
  });
});
