import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const kv = sqliteTable('kv', {
  key: text('key').primaryKey(),
  value: text('value'),
  updatedAt: integer('updated_at').$type<number | null>().default(null),
});

