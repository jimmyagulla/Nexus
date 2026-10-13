import { afterEach, describe, expect, it, vi } from 'vitest';
import { openReceiptFile } from './open-receipt-file';

describe('openReceiptFile', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('opens the content of the receipt in a new tab', () => {
    const blobs: Blob[] = [];
    vi.stubGlobal('URL', {
      createObjectURL: (blob: Blob) => {
        blobs.push(blob);
        return 'blob:receipt';
      },
    });
    const opened: unknown[][] = [];
    vi.spyOn(window, 'open').mockImplementation((...args) => {
      opened.push(args);
      return null;
    });

    openReceiptFile({
      id: 'f1',
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([1, 2, 3]),
    });

    expect(blobs).toHaveLength(1);
    expect(blobs[0]?.type).toBe('application/pdf');
    expect(blobs[0]?.size).toBe(3);
    expect(opened).toEqual([['blob:receipt', '_blank']]);
  });
});
