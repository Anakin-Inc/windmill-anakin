// Scrape URL and Wait — submit a scrape job and poll it until it finishes, in
// one step. Use this for a single page; use scrape_url.ts + get_scrape_result.ts
// in a Flow when you'd rather not keep a worker busy while the page loads.

type Anakin = {
  api_key: string;
};

export async function main(
  anakin: Anakin,
  url: string,
  generate_json = false,
  country = 'us',
  use_browser = false,
  force_fresh = false,
  timeout_seconds = 180,
) {
  const headers = {
    'X-API-Key': anakin.api_key,
    'Content-Type': 'application/json',
  };

  const submit = await fetch('https://api.anakin.io/v1/url-scraper', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      url,
      generateJson: generate_json,
      country,
      useBrowser: use_browser,
      forceFresh: force_fresh,
    }),
  });

  if (!submit.ok) {
    throw new Error(`Anakin scrape submit failed (${submit.status}): ${await submit.text()}`);
  }

  const { jobId } = await submit.json();
  const deadline = Date.now() + timeout_seconds * 1000;

  while (Date.now() < deadline) {
    const res = await fetch(`https://api.anakin.io/v1/url-scraper/${encodeURIComponent(jobId)}`, { headers });

    if (!res.ok) {
      throw new Error(`Anakin get-scrape-result failed (${res.status}): ${await res.text()}`);
    }

    const job = await res.json();
    if (job.status === 'completed') return job;
    if (job.status === 'failed') {
      throw new Error(`Anakin scrape job ${jobId} failed: ${job.error ?? 'unknown error'}`);
    }

    await new Promise((r) => setTimeout(r, 3000));
  }

  throw new Error(
    `Anakin scrape job ${jobId} still running after ${timeout_seconds}s; fetch it later with get_scrape_result.ts`,
  );
}
