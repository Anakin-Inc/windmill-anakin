// Get Browser Task Result — poll a job started by browser_task.ts using its
// workflow_id (returned as `job_id` in the submit response).

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin, job_id: string) {
  const res = await fetch(`https://api.anakin.io/v1/ai/jobs/${encodeURIComponent(job_id)}`, {
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin get-browser-task-result failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
