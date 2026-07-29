// Get Monitor Changes — the detected changes for a monitor: each entry
// records when the watched content differed from the previous check, with
// a diff/summary (and the AI change summary when ai_mode was on). Use
// monitor_list.ts first to find the monitor id.

type Anakin = {
  api_key: string;
};

/** See monitor_create.ts — the API returns each monitor's alertWebhookSecret
 * and it must never reach a Windmill run's output/log unredacted. */
function redactSecrets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = k === 'alertWebhookSecret' && v ? '[redacted — view in the Anakin dashboard]' : redactSecrets(v);
    }
    return out;
  }
  return value;
}

export async function main(anakin: Anakin, id: string) {
  const res = await fetch(`https://api.anakin.io/v1/monitors/${encodeURIComponent(id)}/changes`, {
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin monitor-changes failed (${res.status}): ${await res.text()}`);
  }

  return redactSecrets(await res.json());
}
