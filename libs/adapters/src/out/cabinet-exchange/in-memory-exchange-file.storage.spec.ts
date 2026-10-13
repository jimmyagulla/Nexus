import { describe, expect, it } from 'vitest';
import { ExchangeFile } from '@hexagonal-monorepo-template/domain';
import { InMemoryExchangeFileStorage } from './in-memory-exchange-file.storage';

function file(content: number[]): ExchangeFile {
  return ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array(content));
}

describe('InMemoryExchangeFileStorage', () => {
  it('gives back the file stored for an exchange', async () => {
    const storage = new InMemoryExchangeFileStorage();
    await storage.save('ex-1', file([1, 2]));

    const found = await storage.find('ex-1');

    expect([...(found?.content ?? [])]).toEqual([1, 2]);
    expect(found?.fileName).toBe('a.pdf');
  });

  it('has nothing for an exchange without file', async () => {
    await expect(
      new InMemoryExchangeFileStorage().find('ex-1'),
    ).resolves.toBeNull();
  });

  it('replaces the file of an exchange', async () => {
    const storage = new InMemoryExchangeFileStorage();
    await storage.save('ex-1', file([1]));
    await storage.save('ex-1', file([2, 3]));

    expect([...((await storage.find('ex-1'))?.content ?? [])]).toEqual([2, 3]);
  });
});
