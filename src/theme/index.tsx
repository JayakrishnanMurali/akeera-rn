import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTokens, lightTokens, ThemeMode, ThemeTokens } from './tokens';

export type Theme = ThemeTokens & { mode: Exclude<ThemeMode, 'system'> };

type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const activeMode: Exclude<ThemeMode, 'system'> = useMemo(() => {
    if (mode === 'system') return system === 'dark' ? 'dark' : 'light';
    return mode;
  }, [mode, system]);

  const theme = useMemo<Theme>(() => {
    const base = activeMode === 'dark' ? darkTokens : lightTokens;
    return { ...base, mode: activeMode };
  }, [activeMode]);

  const value = useMemo(
    () => ({ theme, mode, setMode }),
    [theme, mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

