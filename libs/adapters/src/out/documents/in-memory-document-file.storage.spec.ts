import { describe, expect, it } from 'vitest';
import { InMemoryDocumentFileStorage } from './in-memory-document-file.storage';

const file = { folder: 'c1/u1', contentType: 'application/pdf', content: Uint8Array.from([0x25, 0x50, 0x44, 0x46]) };

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

  it('links to a file with a data URL carrying its content', async () => {
    const storage = new InMemoryDocumentFileStorage();
    const key = await storage.store(file);

    await expect(storage.linkTo(key)).resolves.toBe('data:application/pdf;base64,JVBERg==');
  });

  it('refuses to link to a file it does not keep', async () => {
    await expect(new InMemoryDocumentFileStorage().linkTo('c1/u1/missing')).rejects.toThrow();
  });
});
