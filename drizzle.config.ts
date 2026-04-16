import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite', // Cloudflare D1 uses SQLite under the hood
  driver: 'd1-http', // For local development later we can use better-sqlite3, but this prepares for D1
});
