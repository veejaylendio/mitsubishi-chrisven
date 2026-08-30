"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Map<string, Set<() => void>>();

function getListeners(key: string) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  return set;
}

/**
 * A boolean persisted to localStorage under `key`, read via useSyncExternalStore
 * so there's no setState-in-effect and no SSR/client hydration mismatch.
 * `serverSnapshot` is what renders before hydration; `defaultWhenUnset` only runs
 * on the client, for a responsive default (e.g. based on window width) the first
 * time this key has never been set.
 */
export function usePersistedBoolean(
  key: string,
  serverSnapshot: boolean,
  defaultWhenUnset: () => boolean,
): [boolean, (next: boolean) => void] {
  const subscribe = useCallback(
    (callback: () => void) => {
      const set = getListeners(key);
      set.add(callback);
      return () => set.delete(callback);
    },
    [key],
  );

  const getSnapshot = useCallback(() => {
    const stored = window.localStorage.getItem(key);
    return stored !== null ? stored === "true" : defaultWhenUnset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: boolean) => {
      window.localStorage.setItem(key, String(next));
      getListeners(key).forEach((callback) => callback());
    },
    [key],
  );

  return [value, setValue];
}
