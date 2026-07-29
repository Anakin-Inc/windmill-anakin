// Control a Website Monitor — "pause" stops scheduled checks, "resume"
// restarts them (may hit the plan's active-monitor cap), "run_now" triggers
// an immediate out-of-schedule check (billed like a normal check), and
// "delete" permanently removes the monitor and its history. Use
// monitor_list.ts to find the id.

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

export async function main(anakin: Anakin, id: string, action: 'pause' | 'resume' | 'run_now' | 'delete') {
  const base = `https://api.anakin.io/v1/monitors/${encodeURIComponent(id)}`;
  const { url, method } =
    action === 'delete'
      ? { url: base, method: 'DELETE' }
      : action === 'run_now'
        ? { url: `${base}/run`, method: 'POST' }
        : { url: `${base}/${action}`, method: 'POST' };

  const res = await fetch(url, {
    method,
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin monitor-control failed (${res.status}): ${await res.text()}`);
  }

  return redactSecrets(await res.json());
}
