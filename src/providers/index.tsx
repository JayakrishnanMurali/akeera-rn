import React, { createContext, useContext, useMemo } from 'react';
import type { MangaProvider } from '@/src/providers/types';
import { createComickProvider } from '@/src/providers/comick/adapter';

type ProviderContextValue = {
  provider: MangaProvider;
};

const ProviderContext = createContext<ProviderContextValue | undefined>(undefined);

export function ProviderRegistry({ children }: { children: React.ReactNode }) {
  // In future, make this switchable from settings/local storage.
  const provider = useMemo(() => createComickProvider(), []);
  const value = useMemo(() => ({ provider }), [provider]);
  return <ProviderContext.Provider value={value}>{children}</ProviderContext.Provider>;
}

export function useMangaProvider() {
  const ctx = useContext(ProviderContext);
  if (!ctx) throw new Error('useMangaProvider must be used within ProviderRegistry');
  return ctx.provider;
}

