// Wire Discover — find Wire actions for a task from a natural-language
// intent (Wire is Anakin's catalog of pre-built automation actions across
// hundreds of sites). Returns ranked candidate actions, each with its
// action_id, type ("read" or "write"), required/optional params, credit
// cost, and whether auth is needed. Run a returned action with
// wire_read_action.ts (type "read") or wire_write_action.ts (type "write").

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin, q: string, limit = 5) {
  const params = new URLSearchParams({ q, limit: String(limit) });

  const res = await fetch(`https://api.anakin.io/v1/wire/resolve?${params}`, {
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin wire-discover failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
