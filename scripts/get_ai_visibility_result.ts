// Get AI Visibility Result — poll a search started by ai_visibility_search.ts
// using its search_id. A "failed" status still carries the per-source
// results and errors — return it either way rather than treating it as a
// script failure.

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin, search_id: string) {
  const res = await fetch(
    `https://api.anakin.io/v1/ai-visibility/search/${encodeURIComponent(search_id)}`,
    { headers: { 'X-API-Key': anakin.api_key } },
  );

  if (!res.ok) {
    throw new Error(`Anakin get-ai-visibility-result failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
