import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEnquiryEmail, ENQUIRY_RECIPIENT } from '../../src/lib/enquiry-email.ts';

test('enquiry email targets the approved address and safely escapes visitor content', () => {
  const email = buildEnquiryEmail({
    name: '<Ada>', organisation: 'Museum & Gallery', email: 'ada@example.com',
    enquiryType: 'Partnership', message: '<script>alert(1)</script>', consent: true,
  });
  assert.equal(email.toRecipients[0]?.emailAddress, ENQUIRY_RECIPIENT);
  assert.equal(email.replyTo.emailAddress, 'ada@example.com');
  assert.match(email.emailHtmlContent, /&lt;script&gt;/);
  assert.doesNotMatch(email.emailHtmlContent, /<script>/);
});
