export const PORTFOLIO_VIEW_COOKIE = 'portfolio_view';

const SIG_HEX_LEN = 32; // first 128 bits of HMAC-SHA256 as hex

function getSecret(): string {
  const s = process.env.PORTFOLIO_COOKIE_SECRET;
  if (s) {
    return s;
  }
  if (process.env.NODE_ENV === 'development') {
    return 'dev-insecure-portfolio-cookie-secret';
  }
  throw new Error('PORTFOLIO_COOKIE_SECRET is required in production');
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length !== SIG_HEX_LEN || !/^[0-9a-f]+$/i.test(hex)) {
    return null;
  }
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16);
    if (Number.isNaN(byte)) {
      return null;
    }
    out[i / 2] = byte;
  }
  return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

/** First 16 bytes of HMAC-SHA256(secret, message) — matches former Node digest('hex').slice(0, 32) semantics. */
async function hmacPrefix(secret: string, message: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const full = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, enc.encode(message))
  );
  return full.slice(0, 16);
}

export async function issuePortfolioViewCookie(): Promise<string> {
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  const nonce = bytesToHex(nonceBytes);
  const prefix = await hmacPrefix(getSecret(), nonce);
  return `${nonce}.${bytesToHex(prefix)}`;
}

export async function verifyPortfolioViewCookie(
  raw: string | undefined
): Promise<boolean> {
  if (!raw) {
    return false;
  }
  const dot = raw.indexOf('.');
  if (dot < 1 || dot === raw.length - 1) {
    return false;
  }
  const nonce = raw.slice(0, dot);
  const sigHex = raw.slice(dot + 1);
  const sigBytes = hexToBytes(sigHex);
  if (!sigBytes) {
    return false;
  }
  try {
    const expected = await hmacPrefix(getSecret(), nonce);
    return timingSafeEqual(sigBytes, expected);
  } catch {
    return false;
  }
}
