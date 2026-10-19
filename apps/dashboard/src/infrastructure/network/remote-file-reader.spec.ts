import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { InMemoryHttpClient } from './in-memory-http-client';
import { RemoteFileReader } from './remote-file-reader';

describe('RemoteFileReader', () => {
  it('reads the file behind a link, typed with its media type', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'https://files/arret', Uint8Array.from([0x25, 0x50]));

    const file = await new RemoteFileReader(http).read('https://files/arret', 'application/pdf');

    expect(file.type).toBe('application/pdf');
    expect(new Uint8Array(await file.arrayBuffer())).toEqual(Uint8Array.from([0x25, 0x50]));
    expect(http.calls).toEqual([{ method: 'get', url: 'https://files/arret', data: undefined, config: undefined }]);
  });

  it('refuses a link the storage no longer serves', async () => {
    const http = new InMemoryHttpClient();
    http.reject('get', 'https://files/expired', new Error(ErrorCode.ACCESS_DENIED));

    await expect(new RemoteFileReader(http).read('https://files/expired', 'application/pdf')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
