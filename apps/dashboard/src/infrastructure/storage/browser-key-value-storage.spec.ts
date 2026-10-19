import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrowserKeyValueStorage } from './browser-key-value-storage';

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('BrowserKeyValueStorage', () => {
  it('keeps a text in the local storage of the browser', () => {
    new BrowserKeyValueStorage().write('k', 'v');

    expect(new BrowserKeyValueStorage().read('k')).toBe('v');
  });

  it('reads nothing under a key never written', () => {
    expect(new BrowserKeyValueStorage().read('missing')).toBeNull();
  });

  it('keeps nothing, without failing, when the browser refuses its storage', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('SecurityError');
    });
    const storage = new BrowserKeyValueStorage();

    expect(() => storage.write('k', 'v')).not.toThrow();
    expect(storage.read('k')).toBeNull();
  });
});
