import { describe, expect, it } from 'vitest';
import { unzipSync } from 'fflate';
import { ZipFileArchiver } from './zip-file-archiver';

describe('ZipFileArchiver', () => {
  it('packs every file under its name into a ZIP archive', async () => {
    const archive = await new ZipFileArchiver().archive([
      { name: 'Bulletin_2026-01.pdf', content: Uint8Array.from([1, 2, 3]) },
      { name: 'Bulletin_2026-02.pdf', content: Uint8Array.from([4, 5]) },
    ]);

    expect(unzipSync(archive)).toEqual({
      'Bulletin_2026-01.pdf': Uint8Array.from([1, 2, 3]),
      'Bulletin_2026-02.pdf': Uint8Array.from([4, 5]),
    });
  });

  it('announces the media type of a ZIP archive', () => {
    expect(new ZipFileArchiver().contentType).toBe('application/zip');
  });
});
