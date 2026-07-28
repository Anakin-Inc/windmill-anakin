// Start Agentic Search — submit a multi-stage research job. Pair with
// get_agentic_search_result.ts (add a Sleep step in a Flow — this can take
// several minutes).

type Anakin = {
  api_key: string;
};

export async function main(
  anakin: Anakin,
  prompt: string,
  use_browser = true,
  schema: Record<string, unknown> | undefined = undefined,
) {
  const body: Record<string, unknown> = { prompt, useBrowser: use_browser };
  if (schema) {
    body.schema = schema;
  }

  const res = await fetch('https://api.anakin.io/v1/agentic-search', {
    method: 'POST',
    headers: {
      'X-API-Key': anakin.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Anakin agentic search submit failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
