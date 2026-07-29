// Wire Identities — list your saved Wire identities and their credentials.
// An identity is a named account on a site; each credential's `id` is the
// credential_id you pass to wire_read_action.ts / wire_write_action.ts for
// actions whose auth_mode is "required". Optionally filter by catalog_id.

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin, catalog_id?: string) {
  const params = new URLSearchParams();
  if (catalog_id) params.set('catalog_id', catalog_id);
  const qs = params.toString();

  const res = await fetch(`https://api.anakin.io/v1/wire/identities${qs ? `?${qs}` : ''}`, {
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin wire-identities failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
