import { createStore, type StoreApi } from 'zustand/vanilla';
import type { IKeyValueStorage } from '@hexagonal-monorepo-template/ports';

/** Key the seen payslips are kept under on the device. */
export const SEEN_PAYSLIPS_KEY = 'nexus.payslips.seen';

export interface SeenPayslipsState {
  /** Payslips opened or downloaded on this device. */
  seenIds: ReadonlySet<string>;
  markSeen: (payslipIds: readonly string[]) => void;
}

export type SeenPayslipsStore = StoreApi<SeenPayslipsState>;

/**
 * The payslips already opened or downloaded, kept on the device: there is no
 * server-side notification. Shared by the payslips screen and the shell badge.
 */
export function createSeenPayslipsStore(storage: IKeyValueStorage): SeenPayslipsStore {
  return createStore<SeenPayslipsState>((set, get) => ({
    seenIds: readSeenIds(storage),
    markSeen: (payslipIds) => {
      const current = get().seenIds;
      if (payslipIds.every((payslipId) => current.has(payslipId))) {
        return;
      }
      const seenIds = new Set([...current, ...payslipIds]);
      storage.write(SEEN_PAYSLIPS_KEY, JSON.stringify([...seenIds]));
      set({ seenIds });
    },
  }));
}

/** What the device kept; nothing when it kept something unreadable. */
function readSeenIds(storage: IKeyValueStorage): Set<string> {
  try {
    const kept: unknown = JSON.parse(storage.read(SEEN_PAYSLIPS_KEY) ?? '[]');
    return new Set(
      Array.isArray(kept) ? kept.filter((id): id is string => typeof id === 'string') : [],
    );
  } catch {
    return new Set();
  }
}
