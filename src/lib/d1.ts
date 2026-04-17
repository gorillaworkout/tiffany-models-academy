// Direct Cloudflare D1 HTTP API client
const CF_ACCOUNT_ID = "6f0ac708a5e84619183c932fc262c8b4";
const CF_API_TOKEN = "REDACTED_CF_TOKEN";
const CF_DB_ID = "8f97c93d-9203-4b78-833b-67d5ac171d37";

const D1_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_DB_ID}/query`;

export async function d1Query(sql: string, params?: any[]) {
  const body: any = { sql };
  if (params && params.length > 0) {
    body.params = params;
  }

  const res = await fetch(D1_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(`D1 error: ${JSON.stringify(data.errors)}`);
  }

  return data.result[0].results;
}
