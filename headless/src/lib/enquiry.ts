export const ENQUIRY_COLLECTION_ID = 'Enquiries';

export interface EnquiryInput {
  name: string; organisation: string; email: string; location?: string;
  enquiryType: string; message: string; timeline?: string; consent: boolean;
  website?: string; startedAt?: number;
}

const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';

export function validateEnquiry(value: unknown, now = Date.now()): { ok: true; data: EnquiryInput } | { ok: false; message: string } {
  if (!value || typeof value !== 'object') return { ok: false, message: 'Please complete the enquiry form.' };
  const input = value as Record<string, unknown>;
  if (clean(input.website, 200)) return { ok: false, message: 'The enquiry could not be submitted.' };
  const startedAt = Number(input.startedAt);
  if (!Number.isFinite(startedAt) || now - startedAt < 2_000 || now - startedAt > 7_200_000) return { ok: false, message: 'Please reload the form and try again.' };
  const data: EnquiryInput = {
    name: clean(input.name, 120), organisation: clean(input.organisation, 180), email: clean(input.email, 320).toLowerCase(),
    location: clean(input.location, 180), enquiryType: clean(input.enquiryType, 180), message: clean(input.message, 4_000),
    timeline: clean(input.timeline, 300), consent: input.consent === true, startedAt,
  };
  if (!data.name || !data.organisation || !data.enquiryType || data.message.length < 10) return { ok: false, message: 'Please complete every required field.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { ok: false, message: 'Enter a valid email address.' };
  if (!data.consent) return { ok: false, message: 'Consent is required so the initiative can respond.' };
  return { ok: true, data };
}
