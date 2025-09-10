import { useQuery } from '@tanstack/react-query';
import { keys } from '@/src/query/keys';
import { useMangaProvider } from '@/src/providers';

export function useTrending(limit = 20) {
  const provider = useMangaProvider();
  return useQuery({
    queryKey: keys.explore.trending(),
    queryFn: () => provider.trending({ limit }),
  });
}

