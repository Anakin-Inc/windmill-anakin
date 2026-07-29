// Create a Website Monitor — schedule a check of a URL every
// interval_minutes (min 15) and record a change when the content differs,
// optionally alerting a webhook or email. scope "page" (default) watches
// one URL; "site" crawls the site each run; "wire" runs a Wire action each
// check and diffs its JSON. watch_mode "full_page" compares the whole page;
// "specific_data" extracts only the fields in output_schema with AI — ideal
// for price/stock/status tracking. This creates a recurring, billed job.

type Anakin = {
  api_key: string;
};

/** Deep-copy `value` with any secret-bearing keys replaced — the API returns
 * each monitor's alertWebhookSecret (an HMAC signing secret); a secret that
 * lands in a Windmill run's output/log is compromised, so it never passes
 * through unredacted. Retrieve the real value from the Anakin dashboard. */
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

export async function main(
  anakin: Anakin,
  url: string,
  interval_minutes: number,
  scope: 'page' | 'site' | 'wire' = 'page',
  watch_mode: 'full_page' | 'specific_data' = 'full_page',
  watch_format: 'markdown' | 'html' | 'cleaned_html' = 'markdown',
  output_schema?: Record<string, unknown>,
  ai_mode = false,
  ai_goal?: string,
  use_browser = false,
  country = 'us',
  session_id?: string,
  is_active = true,
  expires_at?: string,
  alert_webhook_url?: string,
  alert_emails?: string,
  max_pages?: number,
  max_depth?: number,
  include_patterns?: string[],
  exclude_patterns?: string[],
  wire_action_id?: string,
  wire_catalog_slug?: string,
  wire_credential_id?: string,
  wire_params?: Record<string, unknown>,
  wire_watch_paths?: string[],
) {
  const body: Record<string, unknown> = {
    url,
    intervalMinutes: interval_minutes,
    scope,
    watchMode: watch_mode,
    watchFormat: watch_format,
    aiMode: ai_mode,
    useBrowser: use_browser,
    country,
    isActive: is_active,
  };
  if (output_schema) body.outputSchema = output_schema;
  if (ai_goal) body.aiGoal = ai_goal;
  if (session_id) body.sessionId = session_id;
  if (expires_at) body.expiresAt = expires_at;
  if (alert_webhook_url) body.alertWebhookUrl = alert_webhook_url;
  if (alert_emails) body.alertEmails = alert_emails;
  if (max_pages !== undefined) body.maxPages = max_pages;
  if (max_depth !== undefined) body.maxDepth = max_depth;
  if (include_patterns) body.includePatterns = include_patterns;
  if (exclude_patterns) body.excludePatterns = exclude_patterns;
  if (wire_action_id) body.wireActionId = wire_action_id;
  if (wire_catalog_slug) body.wireCatalogSlug = wire_catalog_slug;
  if (wire_credential_id) body.wireCredentialId = wire_credential_id;
  if (wire_params) body.wireParams = wire_params;
  if (wire_watch_paths) body.wireWatchPaths = wire_watch_paths;

  const res = await fetch('https://api.anakin.io/v1/monitors', {
    method: 'POST',
    headers: {
      'X-API-Key': anakin.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Anakin monitor-create failed (${res.status}): ${await res.text()}`);
  }

  return redactSecrets(await res.json());
}
