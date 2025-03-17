// https://techblog.kayac.com/cost-intensive-lambda

const calcHash = async (body: string) => {
  const encoder = new TextEncoder().encode(body);
  const hash = await crypto.subtle.digest("SHA-256", encoder);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((bytes) => bytes.toString(16).padStart(2, "0")).join("");
};

const oacFetcher = async (
  input: string,
  init: {
    method: string;
    headers: Record<string, string>;
    body: string | undefined;
  },
) => {
  const headers = init.headers;
  if (["POST", "PUT"].includes(init.method) && init.body !== undefined) {
    const hash = await calcHash(init.body);
    headers["x-amz-content-sha256"] = hash;
  }

  return await fetch(input, { ...init, headers });
};
