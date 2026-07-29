// Map a Site — submit a job to discover all reachable URLs under a starting
// URL. Pair with get_map_result.ts (add a Sleep step between them in a Flow
// if the site is large).

type Anakin = {
  api_key: string;
};

export async function main(
  anakin: Anakin,
  url: string,
  limit = 100,
  depth = 2,
  limit_per_level = 100,
  include_subdomains = false,
  include_external_links = false,
  use_browser = false,
  search?: string,
) {
  const body: Record<string, unknown> = {
    url,
    limit,
    depth,
    limitPerLevel: limit_per_level,
    includeSubdomains: include_subdomains,
    includeExternalLinks: include_external_links,
    useBrowser: use_browser,
  };
  if (search) {
    body.search = search;
  }

  const res = await fetch('https://api.anakin.io/v1/map', {
    method: 'POST',
    headers: {
      'X-API-Key': anakin.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Anakin map submit failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
