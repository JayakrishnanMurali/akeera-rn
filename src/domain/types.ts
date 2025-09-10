export type MangaId = string;
export type ChapterId = string;

export type Manga = {
  id: MangaId;
  title: string;
  altTitles?: string[];
  coverUrl?: string;
  description?: string;
  authors?: string[];
  artists?: string[];
  tags?: string[];
  status?: 'ongoing' | 'completed' | 'hiatus' | 'cancelled' | 'unknown';
};

export type Chapter = {
  id: ChapterId;
  mangaId: MangaId;
  title?: string;
  number?: number;
  lang?: string;
  publishedAt?: string; // ISO string
};

export type Page = {
  index: number;
  imageUrl: string;
  width?: number;
  height?: number;
};

export type Paged<T> = {
  items: T[];
  nextCursor?: string | null;
};

