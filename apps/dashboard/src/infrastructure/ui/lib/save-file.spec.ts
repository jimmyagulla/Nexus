import { afterEach, describe, expect, it, vi } from 'vitest';
import { saveFile } from './save-file';

describe('saveFile', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('hands the file to the browser under its own name', () => {
    const createObjectURL = vi.fn(() => 'blob:file');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    const clicked: { download: string; href: string }[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clicked.push({ download: this.download, href: this.href });
    });

    saveFile({
      fileName: 'releve.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([72, 105]),
    });

    expect(clicked).toEqual([{ download: 'releve.pdf', href: 'blob:file' }]);
  });

  it('gives the browser a blob of the right type, then releases it', () => {
    const createObjectURL = vi.fn(() => 'blob:file');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    saveFile({
      fileName: 'scan.png',
      mimeType: 'image/png',
      content: new Uint8Array([1, 2, 3]),
    });

    const blob = (createObjectURL.mock.calls[0] as unknown as [Blob])[0];
    expect(blob.type).toBe('image/png');
    expect(blob.size).toBe(3);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:file');
  });

  it('leaves no link behind in the page', () => {
    vi.stubGlobal('URL', {
      createObjectURL: () => 'blob:file',
      revokeObjectURL: () => undefined,
    });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    saveFile({
      fileName: 'a.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([1]),
    });

    expect(document.querySelector('a')).toBeNull();
  });
});
