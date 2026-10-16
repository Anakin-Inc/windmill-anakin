// Get Agentic Search Result — poll a job started by agentic_search.ts.

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin, job_id: string) {
  const res = await fetch(`https://api.anakin.io/v1/agentic-search/${encodeURIComponent(job_id)}`, {
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin get-agentic-search-result failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
