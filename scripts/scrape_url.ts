// Extract Website Data — submit a scrape job. Pair with get_scrape_result.ts
// (add a Sleep step between them in a Flow if the page takes a while).

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
) {
  const res = await fetch('https://api.anakin.io/v1/url-scraper', {
    method: 'POST',
    headers: {
      'X-API-Key': anakin.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      generateJson: generate_json,
      country,
      useBrowser: use_browser,
      forceFresh: force_fresh,
    }),
  });

  if (!res.ok) {
    throw new Error(`Anakin scrape submit failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
