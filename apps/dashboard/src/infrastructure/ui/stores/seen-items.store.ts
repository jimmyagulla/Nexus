import { createStore, type StoreApi } from 'zustand/vanilla';
import type { IKeyValueStorage } from '@hexagonal-monorepo-template/ports';

/** Key the payslips opened or downloaded are kept under on the device. */
export const SEEN_PAYSLIPS_KEY = 'nexus.payslips.seen';

/** Key the documents opened or downloaded are kept under on the device. */
export const SEEN_DOCUMENTS_KEY = 'nexus.documents.seen';

export interface SeenItemsState {
  /** Items opened or downloaded on this device. */
  seenIds: ReadonlySet<string>;
  markSeen: (ids: readonly string[]) => void;
}

export type SeenItemsStore = StoreApi<SeenItemsState>;

/**
 * The items of one kind (payslips, documents) already opened or downloaded,
 * kept on the device under `key`: there is no server-side notification.
 * Shared by the screen of that kind and the badge of the shell.
 */
export function createSeenItemsStore(storage: IKeyValueStorage, key: string): SeenItemsStore {
  return createStore<SeenItemsState>((set, get) => ({
    seenIds: readSeenIds(storage, key),
    markSeen: (ids) => {
      const current = get().seenIds;
      if (ids.every((id) => current.has(id))) {
        return;
      }
      const seenIds = new Set([...current, ...ids]);
      storage.write(key, JSON.stringify([...seenIds]));
      set({ seenIds });
    },
  }));
}

/** What the device kept; nothing when it kept something unreadable. */
function readSeenIds(storage: IKeyValueStorage, key: string): Set<string> {
  try {
    const kept: unknown = JSON.parse(storage.read(key) ?? '[]');
    return new Set(
      Array.isArray(kept) ? kept.filter((id): id is string => typeof id === 'string') : [],
    );
  } catch {
    return new Set();
  }
}
