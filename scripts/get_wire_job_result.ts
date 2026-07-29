// Get Wire Job Result — poll a job started by wire_read_action.ts or
// wire_write_action.ts. Only needed when that submit call returned a
// job_id — synchronous actions return their result directly and there is
// nothing to poll.

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin, job_id: string) {
  const res = await fetch(`https://api.anakin.io/v1/wire/jobs/${encodeURIComponent(job_id)}`, {
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin get-wire-job-result failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
