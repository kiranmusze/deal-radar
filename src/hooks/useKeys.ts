import { useState, useEffect } from 'react';
import { AppKeys, AppMode } from '../lib/types';

const STORAGE_KEY = 'deal-radar-keys';

function loadKeys(): AppKeys {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { openregisterKey: '', claudeKey: '' };
}

export function useKeys() {
  const [keys, setKeys] = useState<AppKeys>(loadKeys);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    } catch {
      // ignore
    }
  }, [keys]);

  const mode: AppMode = keys.openregisterKey && keys.claudeKey ? 'live' : 'demo';

  return { keys, setKeys, mode };
}
