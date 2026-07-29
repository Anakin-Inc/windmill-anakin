// Wire Write Action — run a Wire WRITE action: one whose type is "write" (it
// performs a state-changing interaction on the target site — submit a form,
// add an item to a cart, post content, update account settings). This
// changes state on an external site; review params before running in
// production. Get action_id and its param shape from wire_discover.ts or
// wire_catalog.ts first. Returns the result inline when the action is
// synchronous, or `{ job_id }` to poll with get_wire_job_result.ts when it
// runs async. Most write actions need auth — pass a credential_id from
// wire_identities.ts or wire_login.ts.

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
    throw new Error(`Anakin wire-write-action failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
