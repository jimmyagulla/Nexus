import { IKeyValueStorage } from '@hexagonal-monorepo-template/ports';

/**
 * Keeps the texts in the local storage of the browser, so that they outlive
 * the visit. The only file of the app that reaches `localStorage`. A browser
 * that refuses it (private mode, blocked site data) keeps nothing, silently.
 */
export class BrowserKeyValueStorage implements IKeyValueStorage {
  read(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  write(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Nothing is kept: the next visit starts afresh.
    }
  }
}
