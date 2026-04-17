import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// We are migrating to HTTP API approach using D1 HTTP for environments without binding (like PM2 or Vercel)
// We will build a custom HTTP driver wrapper for Drizzle ORM

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";
const D1_DATABASE_ID = process.env.D1_DATABASE_ID || "";

class D1HttpDriver {
  async prepare(query: string) {
    return {
      bind: (...params: any[]) => ({
        all: async () => this.execute(query, params),
        run: async () => this.execute(query, params),
        get: async () => {
          const res = await this.execute(query, params);
          return res.results ? res.results[0] : null;
        },
        values: async () => {
           const res = await this.execute(query, params);
           return res.results ? res.results.map((r: any) => Object.values(r)) : [];
        }
      }),
      all: async () => this.execute(query, []),
      run: async () => this.execute(query, []),
      get: async () => {
        const res = await this.execute(query, []);
        return res.results ? res.results[0] : null;
      },
      values: async () => {
         const res = await this.execute(query, []);
         return res.results ? res.results.map((r: any) => Object.values(r)) : [];
      }
    };
  }

  private async execute(query: string, params: any[]) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/query`;
    
    // Cloudflare strict param formatting
    let payload: any = { sql: query };
    if (params && params.length > 0) {
      if (Array.isArray(params[0])) {
         payload.params = params[0];
      } else {
         payload.params = params;
      }
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: 'no-store' // <---- Disable Next.js fetch caching
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error("D1 Error:", data.errors);
        throw new Error(`D1 query failed: ${JSON.stringify(data.errors)}`);
      }

      return data.result[0];
    } catch (e) {
      console.error("Fetch D1 Error:", e);
      throw e;
    }
  }

  async exec(query: string) { return this.execute(query, []); }
  async batch(queries: any[]) { return Promise.all(queries.map(q => q.all())); }
}

// Proxy the generic drizzle D1 interface to our HTTP driver
const httpDriver = new D1HttpDriver();

// For components outside Cloudflare Workers
export function getDb() {
  return drizzle(httpDriver as any, { schema });
}
