import { sendMultipart } from './send-multipart';

type RecordedRequest = {
  url: string;
  method: string | undefined;
  headers: unknown;
  body: unknown;
};

const requests: RecordedRequest[] = [];

function respondWith(status: number, payload: unknown): void {
  vi.stubGlobal('fetch', async (url: string, init: RequestInit) => {
    requests.push({ url, method: init.method, headers: init.headers, body: init.body });
    return { ok: status < 400, status, json: async () => payload };
  });
}

afterEach(() => {
  requests.length = 0;
  vi.unstubAllGlobals();
});

describe('sendMultipart', () => {
  it('posts the fields and the files as a form', async () => {
    respondWith(201, { data: [] });

    await sendMultipart({
      url: 'https://api.test/documents',
      fields: [
        { name: 'category', value: 'OTHER' },
        { name: 'names', value: 'Scan' },
      ],
      files: [
        { field: 'files', fileName: 'scan.pdf', contentType: 'application/pdf', content: Uint8Array.from([0x25, 0x50]) },
      ],
    });

    const form = requests[0].body as FormData;
    const file = form.get('files') as File;
    expect(requests[0].method).toBe('POST');
    expect(form.get('category')).toBe('OTHER');
    expect(form.getAll('names')).toEqual(['Scan']);
    expect(file.name).toBe('scan.pdf');
    expect(file.type).toBe('application/pdf');
    expect(new Uint8Array(await file.arrayBuffer())).toEqual(Uint8Array.from([0x25, 0x50]));
  });

  it('carries the token without forcing a content type', async () => {
    respondWith(201, {});

    await sendMultipart({ url: 'https://api.test/documents', fields: [], files: [], token: 't1' });

    expect(requests[0].headers).toEqual({ Authorization: 'Bearer t1' });
  });

  it('reports a refused request instead of throwing', async () => {
    respondWith(413, { message: 'FILE_TOO_LARGE' });

    await expect(
      sendMultipart({ url: 'https://api.test/documents', fields: [], files: [] }),
    ).resolves.toEqual({ ok: false, status: 413, body: { message: 'FILE_TOO_LARGE' } });
  });
});
