// Wire Login — sign in to a credentials-mode Wire site and get a
// credential_id usable immediately with wire_read_action.ts /
// wire_write_action.ts. Provide the catalog slug and the login fields that
// catalog's login schema defines (see wire_catalog.ts's login_input_schema),
// e.g. { email, password }. The password is never stored, only the
// encrypted session. Only needed for actions whose auth_mode is "required".

type Anakin = {
  api_key: string;
};

export async function main(
  anakin: Anakin,
  catalog_slug: string,
  params: Record<string, unknown> = {},
  identity_name?: string,
  source_id?: string,
  source_ref?: Record<string, unknown>,
) {
  const body: Record<string, unknown> = { catalog_slug };
  if (params && Object.keys(params).length > 0) body.params = params;
  if (identity_name) body.identity_name = identity_name;
  if (source_id) body.source_id = source_id;
  if (source_ref) body.source_ref = source_ref;

  const res = await fetch('https://api.anakin.io/v1/wire/login', {
    method: 'POST',
    headers: {
      'X-API-Key': anakin.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Anakin wire-login failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
