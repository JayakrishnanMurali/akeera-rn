import { createSQLitePersister } from "@/src/persistence/persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import React, { useEffect, useMemo, useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 minute
            gcTime: 1000 * 60 * 60 * 24, // 24h
            retry: 2,
          },
        },
      }),
    []
  );

  useEffect(() => {
    const persister = createSQLitePersister();
    const [unsubscribe, restorePromise] = persistQueryClient({
      queryClient,
      persister,
      maxAge: 1000 * 60 * 60 * 24, // 24h
      hydrateOptions: {},
      dehydrateOptions: {
        shouldDehydrateQuery: () => true,
      },
      buster: "v1",
    });
    restorePromise.finally(() => setReady(true));
    return unsubscribe;
  }, [queryClient]);

  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
