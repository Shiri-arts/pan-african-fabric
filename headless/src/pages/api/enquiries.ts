import type { APIRoute } from 'astro';
import { items } from '@wix/data';
import { ENQUIRY_COLLECTION_ID, validateEnquiry } from '../../lib/enquiry';

const attempts = new Map<string, number[]>();
const json = (body: object, status: number) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) return json({ message: 'Unsupported request.' }, 415);
  const key = clientAddress || request.headers.get('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter(time => now - time < 15 * 60_000);
  if (recent.length >= 5) return json({ message: 'Too many attempts. Please wait before trying again.' }, 429);
  attempts.set(key, [...recent, now]);
  let input: unknown;
  try { input = await request.json(); } catch { return json({ message: 'The enquiry could not be read.' }, 400); }
  const result = validateEnquiry(input, now);
  if (!result.ok) return json({ message: result.message }, 400);
  try {
    await items.insert(ENQUIRY_COLLECTION_ID, {
      title: `${result.data.name} — ${result.data.enquiryType}`,
      name: result.data.name, organisation: result.data.organisation, email: result.data.email,
      location: result.data.location, enquiryType: result.data.enquiryType, message: result.data.message,
      timeline: result.data.timeline, consent: true, status: 'New', submittedAt: new Date(now).toISOString(),
      sourcePath: '/partner-with-us',
    });
    return json({ message: 'Thank you. Your enquiry has been received.' }, 201);
  } catch {
    return json({ message: 'Your enquiry could not be submitted right now. Please email info@shiriachuart.com.' }, 503);
  }
};
