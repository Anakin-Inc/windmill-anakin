// Wire Build — request a brand-new Wire action for a website that isn't in
// the catalog yet. Describe the site (website_url) and what the action
// should do or extract (goal); Wire generates and auto-tests a scraper, then
// publishes it. Asynchronous (returns status "pending") and charges
// credits, refunded automatically if the build fails. Only use this after
// wire_discover.ts / wire_catalog.ts confirm no existing action covers the
// site.

type Anakin = {
  api_key: string;
};

export async function main(
  anakin: Anakin,
  website_url: string,
  goal: string,
  catalog_id?: string,
  visibility: 'private' | 'public' = 'private',
  force = false,
) {
  const body: Record<string, unknown> = { website_url, goal, visibility, force };
  if (catalog_id) body.catalog_id = catalog_id;

  const res = await fetch('https://api.anakin.io/v1/wire/build-request', {
    method: 'POST',
    headers: {
      'X-API-Key': anakin.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Anakin wire-build failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
