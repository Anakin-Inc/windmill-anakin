// List Website Monitors — list all your monitors, or pass `id` to fetch one
// monitor's full configuration and status (next/last check time, active
// state, per-check credit cost, alert settings).

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

export async function main(anakin: Anakin, id?: string) {
  const path = id ? `/monitors/${encodeURIComponent(id)}` : '/monitors';

  const res = await fetch(`https://api.anakin.io/v1${path}`, {
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin monitor-list failed (${res.status}): ${await res.text()}`);
  }

  return redactSecrets(await res.json());
}
