import type { EnquiryInput } from './enquiry';

export const ENQUIRY_RECIPIENT = 'info@shiriachuart.com';

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const row = (label: string, value?: string): string => value
  ? `<tr><th align="left" style="padding:8px 16px 8px 0;vertical-align:top">${escapeHtml(label)}</th><td style="padding:8px 0">${escapeHtml(value).replaceAll('\n', '<br>')}</td></tr>`
  : '';

export function buildEnquiryEmail(data: EnquiryInput) {
  return {
    emailSubject: `Partner enquiry: ${data.enquiryType} - ${data.name}`.slice(0, 200),
    emailHtmlContent: `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#181512"><h1 style="font-size:22px">New Partner With Us enquiry</h1><table>${row('Name', data.name)}${row('Organisation', data.organisation)}${row('Email', data.email)}${row('Country or city', data.location)}${row('Type', data.enquiryType)}${row('Timeline', data.timeline)}${row('Enquiry', data.message)}</table><p style="color:#666;font-size:12px">Submitted through the Partner With Us form on The Pan-African Fabric website.</p></body></html>`,
    senderName: 'The Pan-African Fabric',
    replyTo: { emailAddress: data.email, name: data.name.slice(0, 50) },
    toRecipients: [{ emailAddress: ENQUIRY_RECIPIENT, name: 'The Pan-African Fabric' }],
    type: 'TRANSACTIONAL' as const,
    metadata: { source: 'partnerform' },
  };
}
