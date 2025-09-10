import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

// Single DB instance for the app
export const sqlite = SQLite.openDatabaseSync('app.db');
export const db = drizzle(sqlite);

