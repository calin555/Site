export interface UrlVerifyResult {
  ok: boolean;
  status?: number;
  error?: string;
}

const VERIFY_TIMEOUT_MS = 8000;

export async function verifySourceUrl(
  url: string | null | undefined
): Promise<UrlVerifyResult> {
  if (!url) {
    return { ok: false, error: "missing_url" };
  }

  let target = url;
  if (url.startsWith("/")) {
    const base = (
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    ).replace(/\/$/, "");
    target = `${base}${url}`;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

    const res = await fetch(target, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "ChargePro-LinkCheck/1.0" },
    });

    clearTimeout(timer);

    if (res.status >= 200 && res.status < 400) {
      return { ok: true, status: res.status };
    }

    if (res.status === 405 || res.status === 403) {
      return verifyWithGet(target);
    }

    return { ok: false, status: res.status, error: `http_${res.status}` };
  } catch (err) {
    const message = err instanceof Error ? err.message : "fetch_failed";
    return { ok: false, error: message };
  }
}

async function verifyWithGet(url: string): Promise<UrlVerifyResult> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "ChargePro-LinkCheck/1.0" },
    });

    clearTimeout(timer);
    const ok = res.status >= 200 && res.status < 400;
    return ok
      ? { ok: true, status: res.status }
      : { ok: false, status: res.status, error: `http_${res.status}` };
  } catch (err) {
    const message = err instanceof Error ? err.message : "fetch_failed";
    return { ok: false, error: message };
  }
}
