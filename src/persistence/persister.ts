import type { Persister } from '@tanstack/react-query-persist-client';
import type { PersistedClient } from '@tanstack/react-query-persist-client';
import { sqlite } from '@/src/persistence/db';
import { kv } from '@/src/persistence/schema';
import { eq } from 'drizzle-orm';

const KEY = 'react_query_cache_v1';

async function readKV(): Promise<string | null> {
  // Using raw execute for simplicity (drizzle execute is sync on expo driver)
  const rows = sqlite.getAllSync?.(`SELECT value FROM kv WHERE key = ?`, [KEY]) as { value: string }[] | undefined;
  if (rows && rows.length > 0) return rows[0].value;
  return null;
}

async function writeKV(value: string): Promise<void> {
  sqlite.runSync?.(`INSERT OR REPLACE INTO kv (key, value, updated_at) VALUES (?, ?, ?)`, [KEY, value, Date.now()]);
}

async function deleteKV(): Promise<void> {
  sqlite.runSync?.(`DELETE FROM kv WHERE key = ?`, [KEY]);
}

export function createSQLitePersister(): Persister {
  // Ensure table exists
  sqlite.execSync?.(`CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT, updated_at INTEGER)`);

  return {
    persistClient: async (client: PersistedClient) => {
      try {
        const data = JSON.stringify(client);
        await writeKV(data);
      } catch (e) {
        // noop
      }
    },
    restoreClient: async () => {
      try {
        const raw = await readKV();
        if (!raw) return undefined;
        return JSON.parse(raw) as PersistedClient;
      } catch {
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        await deleteKV();
      } catch {}
    },
  };
}
