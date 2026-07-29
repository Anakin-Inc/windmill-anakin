// Run an AI Browser Task — submit a natural-language task to Anakin's
// browser AI agent, which drives a real stealth browser (navigate, click,
// type, extract) on your behalf. Pair with get_browser_task_result.ts (add a
// Sleep step in a Flow — tasks can run up to ~5 minutes). This can change
// state on the target site (form submissions, cart actions, etc.) — review
// the prompt before running in production. Never put passwords or secrets
// in the prompt; use a saved session_id for authenticated sites (see
// session_list.ts). Pass output_schema to get structured JSON back.

type Anakin = {
  api_key: string;
};

export async function main(
  anakin: Anakin,
  prompt: string,
  url?: string,
  session_id?: string,
  max_steps?: number,
  timeout_ms?: number,
  output_schema?: Record<string, unknown>,
) {
  const body: Record<string, unknown> = { prompt, async: true };
  if (url) body.url = url;
  if (session_id) body.session_id = session_id;
  if (max_steps !== undefined) body.max_steps = max_steps;
  if (timeout_ms !== undefined) body.timeout_ms = timeout_ms;
  if (output_schema) body.output_schema = output_schema;

  const res = await fetch('https://api.anakin.io/v1/ai/evaluate', {
    method: 'POST',
    headers: {
      'X-API-Key': anakin.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Anakin browser-task submit failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
