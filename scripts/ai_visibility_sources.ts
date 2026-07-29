// List AI Visibility Sources — the AI answer engines available to
// ai_visibility_search.ts, each with its slug (what you pass as `sources`)
// and display label.

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin) {
  const res = await fetch('https://api.anakin.io/v1/ai-visibility/sources', {
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin ai-visibility-sources failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
