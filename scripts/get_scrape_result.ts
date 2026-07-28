// Get Scrape Result — poll a job started by scrape_url.ts.

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin, job_id: string) {
  const res = await fetch(`https://api.anakin.io/v1/url-scraper/${job_id}`, {
    headers: { 'X-API-Key': anakin.api_key },
  });

  if (!res.ok) {
    throw new Error(`Anakin get-scrape-result failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
