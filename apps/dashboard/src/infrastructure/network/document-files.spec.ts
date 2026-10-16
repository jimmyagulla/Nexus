import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { fetchFile, saveFile } from './document-files';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('fetchFile', () => {
  it('reads the file behind a link, typed with its media type', async () => {
    vi.stubGlobal('fetch', async () => ({ ok: true, arrayBuffer: async () => Uint8Array.from([0x25, 0x50]).buffer }));

    const file = await fetchFile('https://files/arret', 'application/pdf');

    expect(file.type).toBe('application/pdf');
    expect(new Uint8Array(await file.arrayBuffer())).toEqual(Uint8Array.from([0x25, 0x50]));
  });

  it('refuses a link the storage no longer serves', async () => {
    vi.stubGlobal('fetch', async () => ({ ok: false, arrayBuffer: async () => new ArrayBuffer(0) }));

    await expect(fetchFile('https://files/expired', 'application/pdf')).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});

describe('saveFile', () => {
  it('hands the file to the download manager under its name', () => {
    const clicked: { href: string; download: string }[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      clicked.push({ href: this.href, download: this.download });
    });

    saveFile('blob:http://app/1', 'Arrêt.pdf');

    expect(clicked).toEqual([{ href: 'blob:http://app/1', download: 'Arrêt.pdf' }]);
    expect(document.querySelector('a')).toBeNull();
  });
});
