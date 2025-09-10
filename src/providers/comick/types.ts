import { z } from "zod";

export const MdCoverSchema = z.object({
  w: z.number(),
  h: z.number(),
  b2key: z.string(),
});

export const MdTitleSchema = z.object({
  title: z.string(),
  lang: z.string().optional(),
});

export const ComicBaseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  demographic: z.number().nullable().optional(),
  content_rating: z.string().optional(),
  genres: z.array(z.number()).optional().default([]),
  is_english_title: z.boolean().nullable().optional(),
  md_titles: z.array(MdTitleSchema).optional(),
  last_chapter: z.union([z.number(), z.string()]).optional(),
  md_covers: z.array(MdCoverSchema).optional(),
});

export const TrendingComicSchema = ComicBaseSchema.extend({
  id: z.number().optional(),
});

export const ComicsDataSchema = z.object({
  rank: z.array(ComicBaseSchema).optional().default([]),
  recentRank: z.array(ComicBaseSchema).optional().default([]),
  trending: z.record(z.string(), z.array(TrendingComicSchema)),
});

export type MdCover = z.infer<typeof MdCoverSchema>;
export type MdTitle = z.infer<typeof MdTitleSchema>;
export type ComicBase = z.infer<typeof ComicBaseSchema>;
export type TrendingComic = z.infer<typeof TrendingComicSchema>;
export type ComicsData = z.infer<typeof ComicsDataSchema>;

export function buildCoverUrl(b2key?: string | null): string | undefined {
  if (!b2key) return undefined;
  const key = b2key.replace(/^\/+/, '');
  const hasExt = /\.(jpg|jpeg|png|webp|gif)$/i.test(key);
  const finalKey = hasExt ? key : `${key}.jpg`;
  return `https://meo.comick.pictures/${finalKey}`;
}

// Search API types (root returns an array of comics)
export const MuComicsSchema = z
  .object({
    year: z.union([z.number(), z.null()]).optional().nullable(),
  })
  .optional()
  .nullable();

export const SearchComicSchema = z.object({
  id: z.number(),
  hid: z.string(),
  slug: z.string(),
  title: z.string(),
  country: z.string().optional().catch(''),

  rating: z.union([z.number(), z.string(), z.null()]).optional().nullable(),
  bayesian_rating: z.union([z.number(), z.string(), z.null()]).optional().nullable(),
  rating_count: z.number().optional().catch(0),
  follow_count: z.number().optional().catch(0),

  desc: z.string().optional().catch(''),
  status: z.number().optional().catch(0), // 1 ongoing, 2 completed
  last_chapter: z.union([z.number(), z.null()]).optional().nullable(),
  translation_completed: z.union([z.boolean(), z.null()]).optional().nullable(),
  view_count: z.number().optional().catch(0),

  content_rating: z.string().optional().catch(''),
  demographic: z.number().nullable().optional(),

  uploaded_at: z.string().nullable().optional(),
  created_at: z.string().optional().catch(''),

  user_follow_count: z.number().optional().catch(0),
  year: z.union([z.number(), z.null()]).optional().nullable(),

  mu_comics: MuComicsSchema,
  is_english_title: z.boolean().nullable().optional(),

  md_titles: z.array(MdTitleSchema).optional(),
  md_covers: z.array(MdCoverSchema).optional(),

  highlight: z.string().optional(),
});

export const SearchResultsSchema = z.array(SearchComicSchema);

export type SearchComic = z.infer<typeof SearchComicSchema>;
export type SearchResults = z.infer<typeof SearchResultsSchema>;

// =====================
// Comic Details schema
// =====================

export const ArtistAuthorSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

export const FirstChapterSchema = z.object({
  vol: z.string().nullable(),
  title: z.string().nullable(),
  chap: z.string().nullable(),
  hid: z.string(),
  lang: z.string().nullable(),
  created_at: z.string(),
  up_count: z.number(),
  group_name: z.array(z.string()),
  md_chapters_groups: z.array(
    z.object({
      md_groups: z.object({ title: z.string(), slug: z.string() }),
    })
  ),
});

export const MdGenreSchema = z.object({
  name: z.string(),
  type: z.string().nullable().optional(),
  slug: z.string(),
  group: z.string(),
});

export const MdComicGenreSchema = z.object({
  md_genres: MdGenreSchema,
});

export const AnimeInfoSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const ComicDetailsSchema = z.object({
  id: z.number(),
  hid: z.string(),
  title: z.string(),
  country: z.string(),
  status: z.union([z.number(), z.string()]),
  links: z.record(z.string(), z.string()).optional().default({}),
  last_chapter: z.union([z.number(), z.null()]).nullable(),
  chapter_count: z.number(),
  demographic: z.union([z.number(), z.string(), z.null()]).nullable(),
  user_follow_count: z.number(),
  follow_rank: z.union([z.number(), z.null()]).nullable().optional(),
  follow_count: z.number(),
  desc: z.string().optional().catch(""),
  parsed: z.string().optional().catch(""),
  slug: z.string(),
  mismatch: z.string().nullable().optional(),
  year: z.union([z.number(), z.null()]).nullable(),
  bayesian_rating: z.union([z.string(), z.number(), z.null()]).nullable(),
  rating_count: z.number().optional().catch(0),
  content_rating: z.string(),
  translation_completed: z.boolean().optional().catch(false),
  chapter_numbers_reset_on_new_volume_manual: z.boolean().optional().catch(false),
  final_chapter: z.string().nullable().optional(),
  final_volume: z.string().nullable().optional(),
  noindex: z.boolean().optional().catch(false),
  adsense: z.boolean().optional().catch(false),
  login_required: z.boolean().optional().catch(false),
  anime: AnimeInfoSchema.optional(),
  has_anime: z.boolean().optional().catch(false),
  recommendations: z
    .array(
      z.object({
        up: z.number(),
        down: z.number(),
        total: z.number(),
        relates: z.object({
          title: z.string(),
          slug: z.string(),
          hid: z.string(),
          md_covers: z.array(MdCoverSchema).optional().default([]),
        }),
      })
    )
    .optional()
    .default([]),
  relate_from: z
    .array(
      z.object({
        relate_to: z.object({ slug: z.string(), title: z.string() }),
        md_relates: z.object({ name: z.string() }),
      })
    )
    .optional()
    .default([]),
  is_english_title: z.boolean().nullable().optional(),
  md_titles: z.array(MdTitleSchema).optional().default([]),
  md_comic_md_genres: z.array(MdComicGenreSchema).optional().default([]),
  md_covers: z.array(MdCoverSchema).optional().default([]),
  mu_comics: MuComicsSchema.nullable().optional(),
  iso639_1: z.string().optional().catch(""),
  lang_name: z.string().optional().catch(""),
  lang_native: z.string().optional().catch(""),
});

export const ComicResponseSchema = z.object({
  firstChapters: z.array(FirstChapterSchema).optional().default([]),
  comic: ComicDetailsSchema,
  artists: z.array(ArtistAuthorSchema).optional().default([]),
  authors: z.array(ArtistAuthorSchema).optional().default([]),
  langList: z.array(z.string()).optional().default([]),
  recommendable: z.boolean().optional().catch(false),
  demographic: z.union([z.string(), z.null()]).nullable().optional(),
  englishLink: z.union([z.string(), z.null()]).nullable().optional(),
  matureContent: z.boolean().optional().catch(false),
});

export type ComicResponse = z.infer<typeof ComicResponseSchema>;
export type ComicDetails = z.infer<typeof ComicDetailsSchema>;

// =====================
// Chapters schema
// =====================

export const MdChaptersGroupSchema = z.object({
  md_groups: z.object({ title: z.string(), slug: z.string() }),
});

export const ChapterSchema = z.object({
  id: z.number(),
  chap: z.string(),
  title: z.string().nullable(),
  vol: z.string().nullable(),
  lang: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  up_count: z.number(),
  down_count: z.number(),
  is_the_last_chapter: z.boolean(),
  publish_at: z.string().nullable(),
  group_name: z.array(z.string()).nullable(),
  hid: z.string(),
  identities: z.array(z.string()).nullable(),
  md_chapters_groups: z.array(MdChaptersGroupSchema),
});

export const ChaptersResponseSchema = z.object({
  chapters: z.array(ChapterSchema),
  total: z.number(),
  checkVol2Chap1: z.boolean(),
  limit: z.number(),
});

export type ChapterItem = z.infer<typeof ChapterSchema>;
export type ChaptersResponse = z.infer<typeof ChaptersResponseSchema>;

// =====================
// Chapter images schema
// =====================

export const ChapterImageSchema = z.object({
  h: z.number(),
  w: z.number(),
  name: z.string(),
  s: z.number(),
  b2key: z.string(),
  optimized: z.string().nullable(),
});

export const ChapterImagesResponseSchema = z.array(ChapterImageSchema);

export type ChapterImage = z.infer<typeof ChapterImageSchema>;
export type ChapterImagesResponse = z.infer<typeof ChapterImagesResponseSchema>;
