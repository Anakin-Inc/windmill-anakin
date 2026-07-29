// Delete a Saved Browser Session — permanently deletes a saved browser
// session and its encrypted login data. Irreversible — the user must log in
// again through the dashboard to recreate it, and any monitors or requests
// referencing this session id lose authenticated access. Find ids with
// session_list.ts.

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin, id: string) {
  const res = await fetch(`https://api.anakin.io/v1/sessions/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin session-delete failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
