import type { Chapter, Manga, MangaId, Page, Paged, ChapterId } from '@/src/domain/types';

export type SearchParams = {
  q: string;
  limit?: number;
  cursor?: string | null;
};

export interface MangaProvider {
  id: string; // e.g., 'comick'
  name: string; // Human label

  // Discovery
  trending(params?: { limit?: number; cursor?: string | null }): Promise<Paged<Manga>>;
  latest(params?: { limit?: number; cursor?: string | null }): Promise<Paged<Manga>>;

  // Search
  search(params: SearchParams): Promise<Paged<Manga>>;

  // Details
  getManga(id: MangaId): Promise<Manga>;
  getChapters(mangaId: MangaId, params?: { limit?: number; cursor?: string | null }): Promise<Paged<Chapter>>;
  getChapterPages(chapterId: ChapterId): Promise<Page[]>;
}

