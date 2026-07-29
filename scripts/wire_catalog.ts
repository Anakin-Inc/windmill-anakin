// Wire Catalog — browse the Wire action catalog. Omit `slug` to list every
// supported site and its action count; pass a slug (e.g. "walmart",
// "amazon") to get that site's full action list with exact parameter
// schemas, each action's type (read/write), auth mode, and credit cost.

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin, slug?: string) {
  const path = slug ? `/wire/catalog/${encodeURIComponent(slug)}` : '/wire/catalog';

  const res = await fetch(`https://api.anakin.io/v1${path}`, {
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin wire-catalog failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
