// Wire Read Action — run a Wire READ action: one whose type is "read" (it
// extracts data and does not change state on the target site — search
// listings, fetch a product's price/specs, read a profile). Get action_id
// and its param shape from wire_discover.ts or wire_catalog.ts first.
// Returns the result inline when the action is synchronous, or `{ job_id }`
// to poll with get_wire_job_result.ts when it runs async. Most read actions
// need no auth; when the action's auth_mode is "required", pass a
// credential_id from wire_identities.ts or wire_login.ts.

type Anakin = {
  api_key: string;
};

export async function main(
  anakin: Anakin,
  action_id: string,
  params: Record<string, unknown> = {},
  credential_id?: string,
  identity_id?: string,
) {
  const body: Record<string, unknown> = { action_id };
  if (params && Object.keys(params).length > 0) body.params = params;
  if (credential_id) body.credential_id = credential_id;
  if (identity_id) body.identity_id = identity_id;

  const res = await fetch('https://api.anakin.io/v1/wire/task', {
    method: 'POST',
    headers: {
      'X-API-Key': anakin.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Anakin wire-read-action failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
