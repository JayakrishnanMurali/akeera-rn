export const keys = {
  explore: {
    trending: () => ['explore', 'trending'] as const,
    latest: () => ['explore', 'latest'] as const,
  },
  search: (q: string) => ['search', q] as const,
  manga: (id: string) => ['manga', id] as const,
  chapters: (mangaId: string) => ['chapters', mangaId] as const,
  chapterPages: (chapterId: string) => ['chapterPages', chapterId] as const,
} as const;

