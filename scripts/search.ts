// Perform AI Search — synchronous, no polling needed.

type Anakin = {
  api_key: string;
};

export async function main(anakin: Anakin, prompt: string, limit = 5) {
  const res = await fetch('https://api.anakin.io/v1/search', {
    method: 'POST',
    headers: {
      'X-API-Key': anakin.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, limit }),
  });

  if (!res.ok) {
    throw new Error(`Anakin search failed (${res.status}): ${await res.text()}`);
  }

  return await res.json();
}
