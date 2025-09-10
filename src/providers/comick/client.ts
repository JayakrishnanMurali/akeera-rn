import { z } from 'zod';
import logger from '@/src/utils/logger';

const BASE_URL = 'https://api.comick.fun';

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const started = Date.now();
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' },
      ...init,
    });
  } catch (err: any) {
    const ms = Date.now() - started;
    logger.http({ method: 'GET', url: path, status: 0, ms });
    logger.httpBody({ error: String(err) });
    throw err;
  }
  const ms = Date.now() - started;
  let json: any = null;
  try {
    json = await res.json();
  } catch (e) {
    // not JSON; leave as null
  }
  logger.http({ method: 'GET', url: path, status: res.status, ms });
  if (json != null) logger.httpBody(json);
  if (!res.ok) {
    throw new Error(`Comick GET ${path} failed: ${res.status}`);
  }
  return json as T;
}

// Minimal zod schemas (can expand per endpoint as we wire)
export const ComickMangaSchema = z.object({
  slug: z.string().or(z.number()).transform(String),
  title: z.string().catch(''),
  cover_url: z.string().url().optional().catch(undefined),
  md_titles: z.array(z.object({ title: z.string().catch('') })).optional().catch([]),
  authors: z.array(z.string()).optional().catch([]),
  artists: z.array(z.string()).optional().catch([]),
  desc: z.string().optional().catch(undefined),
  status: z.string().optional().catch(undefined),
});

export type ComickManga = z.infer<typeof ComickMangaSchema>;
