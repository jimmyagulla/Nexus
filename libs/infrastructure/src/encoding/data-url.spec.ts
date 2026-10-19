import { describe, expect, it } from 'vitest';
import { toDataUrl } from './data-url';

describe('toDataUrl', () => {
  it('carries the media type and the base64 content', () => {
    expect(toDataUrl('text/csv', new TextEncoder().encode('a;b'))).toBe('data:text/csv;base64,YTti');
  });

  it('encodes every byte value', () => {
    expect(toDataUrl('application/octet-stream', Uint8Array.from([0, 255]))).toBe(
      'data:application/octet-stream;base64,AP8=',
    );
  });
});
