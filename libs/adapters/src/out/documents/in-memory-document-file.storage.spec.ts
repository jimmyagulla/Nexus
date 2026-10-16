import { describe, expect, it } from 'vitest';
import { InMemoryDocumentFileStorage } from './in-memory-document-file.storage';

const file = { folder: 'c1/u1', contentType: 'application/pdf', content: Uint8Array.from([1]) };

describe('InMemoryDocumentFileStorage', () => {
  it('keeps a file under a fresh key inside its folder', async () => {
    const storage = new InMemoryDocumentFileStorage();

    const first = await storage.store(file);
    const second = await storage.store(file);

    expect(first.startsWith('c1/u1/')).toBe(true);
    expect(first).not.toBe(second);
    expect(storage.files.get(first)).toEqual(file);
  });

  it('forgets a removed file', async () => {
    const storage = new InMemoryDocumentFileStorage();
    const key = await storage.store(file);

    await storage.remove(key);

    expect(storage.files.size).toBe(0);
  });

  it('links to a file, saving it under a name when asked', async () => {
    const storage = new InMemoryDocumentFileStorage();

    await expect(storage.linkTo('c1/u1/k', { downloadAs: null })).resolves.toEqual({ url: 'memory://c1/u1/k' });
    await expect(storage.linkTo('c1/u1/k', { downloadAs: 'a b.pdf' })).resolves.toEqual({ url: 'memory://c1/u1/k?download=a%20b.pdf' });
  });
});
