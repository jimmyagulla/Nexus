import { useSyncExternalStore } from 'react';

const supported = () => typeof window.matchMedia === 'function';

/** Whether the media query matches, following its changes (true where unsupported). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (!supported()) {
        return () => undefined;
      }
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    () => !supported() || window.matchMedia(query).matches,
    () => true,
  );
}
