// List Saved Browser Sessions — encrypted login states captured via the
// Anakin dashboard or Browser API. Each session's id is what you pass as
// session_id / sessionId to scrape/crawl, monitor_create.ts, or
// browser_task.ts to work with login-protected pages. Optionally filter by
// website domain. If no session exists for a site, it must be created
// interactively in the dashboard (login, 2FA/captchas included) — that flow
// cannot run from a script.

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin, domain?: string) {
  const params = new URLSearchParams();
  if (domain) params.set('domain', domain);
  const qs = params.toString();

  const res = await fetch(`https://api.anakin.io/v1/sessions${qs ? `?${qs}` : ''}`, {
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin session-list failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
