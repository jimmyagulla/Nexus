import { describe, expect, it } from 'vitest';
import { RandomUuidGenerator } from '../id/random-uuid-generator';
import { InMemoryExpenseReportProofStorage } from './in-memory-expense-report-proof.storage';

describe('InMemoryExpenseReportProofStorage', () => {
  it('keeps a receipt in the folder of its owner and links to its content', async () => {
    const storage = new InMemoryExpenseReportProofStorage(new RandomUuidGenerator());

    const key = await storage.store({ folder: 'c1/u1', contentType: 'image/png', content: Uint8Array.from([1, 2]) });

    expect(key.startsWith('c1/u1/')).toBe(true);
    await expect(storage.linkTo(key)).resolves.toBe('data:image/png;base64,AQI=');
  });

  it('forgets a removed receipt', async () => {
    const storage = new InMemoryExpenseReportProofStorage(new RandomUuidGenerator());
    const key = await storage.store({ folder: 'c1/u1', contentType: 'image/png', content: Uint8Array.from([1]) });

    await storage.remove(key);

    await expect(storage.linkTo(key)).rejects.toThrow(key);
  });
});
