// Crawl a Site — submit a job to bulk-fetch markdown across many pages of a
// site. Pair with get_crawl_result.ts (add a Sleep step in a Flow — crawls
// can take a while). Scope which URLs are fetched with include/exclude
// patterns.

type Anakin = {
  api_key: string;
};

export async function main(
  anakin: Anakin,
  url: string,
  max_pages = 10,
  depth = 1,
  country = 'us',
  use_browser = false,
  include_patterns?: string[],
  exclude_patterns?: string[],
  session_id?: string,
  session_name?: string,
) {
  const body: Record<string, unknown> = {
    url,
    maxPages: max_pages,
    depth,
    country,
    useBrowser: use_browser,
  };
  if (include_patterns) body.includePatterns = include_patterns;
  if (exclude_patterns) body.excludePatterns = exclude_patterns;
  if (session_id) body.sessionId = session_id;
  if (session_name) body.sessionName = session_name;

  const res = await fetch('https://api.anakin.io/v1/crawl', {
    method: 'POST',
    headers: {
      'X-API-Key': anakin.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Anakin crawl submit failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
