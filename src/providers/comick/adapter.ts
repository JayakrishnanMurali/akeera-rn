import type { Chapter, Manga, Paged } from "@/src/domain/types";
import type { MangaProvider, SearchParams } from "@/src/providers/types";
import { apiGet, ComickMangaSchema, type ComickManga } from "./client";
import {
  buildCoverUrl,
  ChaptersResponseSchema,
  ComicResponseSchema,
  ComicsDataSchema,
  SearchResultsSchema,
  ChapterImagesResponseSchema,
  type SearchComic,
  type TrendingComic,
} from "./types";

function mapStatus(s?: string): Manga["status"] {
  const v = (s || "").toLowerCase();
  if (v.includes("ongo")) return "ongoing";
  if (v.includes("complet")) return "completed";
  if (v.includes("hiat")) return "hiatus";
  if (v.includes("cancel")) return "cancelled";
  return "unknown";
}

function toManga(m: ComickManga & { hid?: string; slug?: string }): Manga {
  return {
    // Prefer slug for stable URLs; fall back to hid if needed
    id: String(m.slug ?? m.hid ?? ""),
    title: m.title,
    altTitles: (m.md_titles || []).map((t) => t.title).filter(Boolean),
    coverUrl: m.cover_url,
    description: m.desc,
    authors: m.authors,
    artists: m.artists,
    tags: [],
    status: mapStatus(m.status),
  };
}

// Comick API has multiple versions; we’ll start with commonly used endpoints.
// These can be adjusted without touching the rest of the app due to the adapter.
export function createComickProvider(): MangaProvider {
  return {
    id: "comick",
    name: "Comick",

    async trending(params) {
      const limit = params?.limit ?? 20;
      const resp = await apiGet<any>(`/top?type=trending`);
      // Try strict schema first, then fall back to tolerant extraction
      let list: TrendingComic[] = [];
      let coverLookup: Record<string, string | undefined> = {};
      try {
        const parsed = ComicsDataSchema.parse(resp);
        // Build a quick slug -> cover map from rank and recentRank (if present)
        for (const c of [...parsed.rank, ...parsed.recentRank]) {
          const key = c.md_covers?.[0]?.b2key;
          if (c.slug && key && !coverLookup[c.slug]) coverLookup[c.slug] = key;
        }
        const keys = Object.keys(parsed.trending).sort(
          (a, b) => Number(a) - Number(b)
        );
        const preferredKey = (parsed.trending as any)["7"] ? "7" : keys[0];
        list = (parsed.trending as any)[preferredKey] ?? [];
      } catch {
        const tr = (resp?.trending ?? resp?.data?.trending ?? {}) as Record<
          string,
          any[]
        >;
        const rank = (resp?.rank ?? resp?.data?.rank ?? []) as any[];
        const recent = (resp?.recentRank ??
          resp?.data?.recentRank ??
          []) as any[];
        for (const c of [...rank, ...recent]) {
          const key = c?.md_covers?.[0]?.b2key;
          if (c?.slug && key && !coverLookup[c.slug]) coverLookup[c.slug] = key;
        }
        const keys = Object.keys(tr).sort((a, b) => Number(a) - Number(b));
        const preferredKey = tr["7"] ? "7" : keys[0];
        list = (tr?.[preferredKey] ?? []) as any[];
      }
      const picked = list.slice(0, limit);
      const mapped: Manga[] = picked.map((c: TrendingComic) => {
        const key =
          c.md_covers?.[0]?.b2key ?? (c.slug ? coverLookup[c.slug] : undefined);
        return {
          id: c.slug || String(c.id),
          title: c.title,
          altTitles: (c.md_titles || []).map((t) => t.title).filter(Boolean),
          coverUrl: buildCoverUrl(key),
          description: undefined,
          authors: undefined,
          artists: undefined,
          tags: [],
          status: undefined,
        } as Manga;
      });
      return { items: mapped, nextCursor: null } as Paged<Manga>;
    },

    async latest(params) {
      // Latest chapters endpoint returns chapters, not titles; we can approximate
      // "latest" titles by taking unique comics from the latest chapters feed.
      const limit = params?.limit ?? 20;
      const data = await apiGet<any>(`/chapter/?order=new&page=1`);
      const arr: any[] = Array.isArray(data)
        ? data
        : data?.result ?? data?.chapters ?? [];
      const comics = new Map<string, Manga>();
      for (const c of arr) {
        const obj = c?.comic ?? c?.md_comics ?? c?.manga ?? {};
        const parsed = ComickMangaSchema.partial().catch({}).parse(obj) as any;
        parsed.hid = obj?.hid ?? obj?.id ?? parsed.hid;
        parsed.slug = obj?.slug ?? parsed.slug;
        parsed.cover_url = obj?.cover_url ?? obj?.coverUrl ?? parsed.cover_url;
        parsed.title = obj?.title ?? parsed.title;
        const m = toManga(parsed);
        if (m.id && !comics.has(m.id)) comics.set(m.id, m);
        if (comics.size >= limit) break;
      }
      return { items: Array.from(comics.values()), nextCursor: null };
    },

    async search({ q, limit = 20 }: SearchParams) {
      const data = await apiGet<any>(
        `/v1.0/search/?q=${encodeURIComponent(q)}&limit=${limit}`
      );
      let arr: SearchComic[] = [];
      try {
        arr = SearchResultsSchema.parse(data);
      } catch {
        // Fall back if server wraps in { result: [] } or similar
        const maybe = Array.isArray((data as any)?.result)
          ? (data as any).result
          : Array.isArray((data as any)?.comics)
          ? (data as any).comics
          : Array.isArray(data)
          ? data
          : [];
        arr = SearchResultsSchema.catch([]).parse(maybe);
      }
      const picked = arr.slice(0, limit);
      const mapped: Manga[] = picked.map((c) => ({
        id: c.slug || c.hid || String(c.id),
        title: c.title,
        altTitles: (c.md_titles || []).map((t) => t.title).filter(Boolean),
        coverUrl: buildCoverUrl(c.md_covers?.[0]?.b2key),
        description: c.desc ?? undefined,
        authors: undefined,
        artists: undefined,
        tags: [],
        status:
          c.status === 1 ? "ongoing" : c.status === 2 ? "completed" : "unknown",
      }));
      return { items: mapped, nextCursor: null };
    },

    async getManga(id) {
      const data = await apiGet<any>(`/v1.0/comic/${encodeURIComponent(id)}/`);
      const parsed = ComicResponseSchema.parse(data);
      const c = parsed.comic;
      const statusVal =
        typeof c.status === "string" ? Number(c.status) : c.status;
      const status =
        statusVal === 1 ? "ongoing" : statusVal === 2 ? "completed" : "unknown";
      const coverKey = c.md_covers?.[0]?.b2key;
      return {
        id: c.slug || c.hid || String(c.id),
        title: c.title,
        altTitles: (c.md_titles || []).map((t) => t.title).filter(Boolean),
        coverUrl: buildCoverUrl(coverKey),
        description: c.desc || undefined,
        authors: parsed.authors?.map((a) => a.name) || [],
        artists: parsed.artists?.map((a) => a.name) || [],
        tags: (c.md_comic_md_genres || [])
          .map((g) => g.md_genres?.name)
          .filter(Boolean),
        status,
      } as Manga;
    },

    async getChapters(mangaId, params) {
      // For chapters, Comick expects HID; if we have a slug, resolve to get hid
      let hid = mangaId;
      if (!/^[A-Za-z0-9_-]{10,}$/.test(mangaId)) {
        // likely a slug -> resolve comic to get hid
        try {
          const detail = await apiGet<any>(
            `/v1.0/comic/${encodeURIComponent(mangaId)}/`
          );
          hid =
            detail?.comic?.hid ?? detail?.hid ?? detail?.manga?.hid ?? mangaId;
        } catch {}
      }
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.set("limit", String(params.limit));
      const qs = searchParams.toString();
      const data = await apiGet<any>(
        `/comic/${encodeURIComponent(hid)}/chapters${qs ? `?${qs}` : ""}`
      );
      let arr: any[] = [];
      try {
        const parsed = ChaptersResponseSchema.parse(data);
        arr = parsed.chapters;
      } catch {
        arr = Array.isArray(data) ? data : data?.chapters ?? data?.result ?? [];
      }
      const items: Chapter[] = arr.map((c: any) => ({
        id: String(c?.hid ?? c?.id ?? `${hid}-${c?.chap}`),
        mangaId: mangaId,
        title: c?.title ?? undefined,
        number: c?.chap != null ? Number(c.chap) : undefined,
        lang: c?.lang ?? undefined,
        publishedAt: c?.publish_at ?? c?.created_at ?? undefined,
      }));
      return { items, nextCursor: null };
    },

    async getChapterPages(chapterId) {
      const data = await apiGet<any>(
        `/chapter/${encodeURIComponent(chapterId)}/get_images`
      );
      let arr: any[] = [];
      try {
        arr = ChapterImagesResponseSchema.parse(data);
      } catch {
        arr = Array.isArray(data)
          ? data
          : data?.images ?? data?.result ?? [];
      }
      const pages = arr
        .map((x: any, i: number) => {
          if (typeof x === "string") {
            return { index: i, imageUrl: x };
          }
          const opt = x?.optimized as string | null | undefined;
          const key = x?.b2key as string | undefined;
          const url = opt && /^https?:\/\//i.test(opt) ? opt : buildCoverUrl(opt || key);
          if (!url) return undefined;
          return { index: i, imageUrl: url };
        })
        .filter(Boolean) as { index: number; imageUrl: string }[];
      return pages;
    },
  };
}
