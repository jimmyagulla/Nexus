import { describe, expect, it } from 'vitest';
import { readExchangeFile } from './read-exchange-file';

describe('readExchangeFile', () => {
  it('turns a browser file into the file an exchange carries', async () => {
    const file = new File([new Uint8Array([72, 105])], 'releve.pdf', {
      type: 'application/pdf',
    });

    const exchangeFile = await readExchangeFile(file);

    expect(exchangeFile.fileName).toBe('releve.pdf');
    expect(exchangeFile.mimeType).toBe('application/pdf');
    expect([...exchangeFile.content]).toEqual([72, 105]);
  });

  it('keeps an empty file empty, for the domain to refuse', async () => {
    const exchangeFile = await readExchangeFile(
      new File([], 'vide.pdf', { type: 'application/pdf' }),
    );

    expect(exchangeFile.content).toHaveLength(0);
  });
});
