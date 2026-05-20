import { useEffect, useState } from 'react';

const STORAGE_KEY = 'innovatech-theme';

export function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  return { dark, toggle: () => setDark((v) => !v) };
}
