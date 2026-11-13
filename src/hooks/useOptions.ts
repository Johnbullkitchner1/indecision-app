import { useEffect, useReducer } from 'react';
import { optionsReducer, parseStoredOptions } from '../lib/options';

const STORAGE_KEY = 'indecision:options';

function load() {
  try {
    return parseStoredOptions(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

/** Options state, persisted to localStorage and synced across tabs. */
export function useOptions() {
  const [options, dispatch] = useReducer(optionsReducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
    } catch {
      // Storage may be unavailable (private mode, quota); the app still works in-memory.
    }
  }, [options]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      dispatch({ type: 'replace', options: parseStoredOptions(e.newValue) });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return [options, dispatch] as const;
}
