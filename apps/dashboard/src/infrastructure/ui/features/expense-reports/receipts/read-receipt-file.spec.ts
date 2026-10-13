import { describe, expect, it } from 'vitest';
import { readReceiptFile } from './read-receipt-file';

describe('readReceiptFile', () => {
  it('turns the chosen file into the receipt of the report', async () => {
    const file = new File([new Uint8Array([1, 2, 3])], 'ticket.pdf', {
      type: 'application/pdf',
    });

    await expect(readReceiptFile(file)).resolves.toEqual({
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([1, 2, 3]),
      expenseId: null,
    });
  });
});
