import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEnquiry } from '../../src/lib/enquiry.ts';

const now = Date.now();
const valid = { name: 'Ada', organisation: 'Museum', email: 'ada@example.com', enquiryType: 'Hosting an exhibition', message: 'We would like to discuss hosting the exhibition.', consent: true, website: '', startedAt: now - 5_000 };

test('enquiry validation accepts complete consented submissions', () => {
  const result = validateEnquiry(valid, now);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.data.email, 'ada@example.com');
});

test('enquiry validation rejects bots, invalid email, missing consent and instant posts', () => {
  assert.equal(validateEnquiry({ ...valid, website: 'spam.example' }, now).ok, false);
  assert.equal(validateEnquiry({ ...valid, email: 'invalid' }, now).ok, false);
  assert.equal(validateEnquiry({ ...valid, consent: false }, now).ok, false);
  assert.equal(validateEnquiry({ ...valid, startedAt: now }, now).ok, false);
});
