import type { APIRoute } from 'astro';
import { emailTransmissions } from '@wix/email-transmissions';
import { auth } from '@wix/essentials';
import { validateEnquiry } from '../../lib/enquiry';
import { buildEnquiryEmail } from '../../lib/enquiry-email';

export const prerender = false;

const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, number[]>();
const sendEmail = auth.elevate(emailTransmissions.sendEmailTransmission);

const json = (body: Record<string, unknown>, status: number) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

function clientKey(request: Request): string {
  return request.headers.get('cf-connecting-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown';
}

function isRateLimited(key: string, now: number): boolean {
  const active = (attempts.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (active.length >= MAX_ATTEMPTS) return true;
  attempts.set(key, [...active, now]);
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 20_000) return json({ ok: false, message: 'The enquiry is too large.' }, 413);
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return json({ ok: false, message: 'The enquiry format is not supported.' }, 415);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: 'The enquiry could not be read.' }, 400);
  }

  const result = validateEnquiry(payload);
  if (!result.ok) return json({ ok: false, message: result.message }, 400);
  if (isRateLimited(clientKey(request), Date.now())) {
    return json({ ok: false, message: 'Too many attempts. Please email us directly.' }, 429);
  }

  try {
    const transmission = await sendEmail(buildEnquiryEmail(result.data), { idempotencyKey: crypto.randomUUID() });
    if (!transmission.emailTransmission || transmission.emailTransmission.status === 'REJECTED') {
      throw new Error('Email transmission was not accepted.');
    }
    return json({ ok: true }, 202);
  } catch (error) {
    console.error('Partner enquiry email failed.', error instanceof Error ? error.message : 'Unknown error');
    return json({ ok: false, message: 'Email delivery is temporarily unavailable.' }, 502);
  }
};

export const ALL: APIRoute = () => json({ ok: false, message: 'Method not allowed.' }, 405);
