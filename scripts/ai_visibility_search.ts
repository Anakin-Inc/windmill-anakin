// Compare AI Engine Answers — submit the same question to multiple AI
// answer engines (ChatGPT, Gemini, Google AI Overview, …) for brand/AI-SEO
// visibility checks. Pair with get_ai_visibility_result.ts (add a Sleep step
// in a Flow — typically completes within 1-2 minutes) using the returned
// search_id. Billed per source; failed sources are free.

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin, query: string, sources?: string[], country = 'us') {
  const body: Record<string, unknown> = { query, country };
  if (sources) body.sources = sources;

  const res = await fetch('https://api.anakin.io/v1/ai-visibility/search', {
    method: 'POST',
    headers: {
      'X-API-Key': anakin.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Anakin ai-visibility-search submit failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
