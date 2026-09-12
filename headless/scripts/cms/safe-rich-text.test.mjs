import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizeCmsRichText } from '../../src/lib/safe-rich-text.ts';

test('safe rich text keeps the editorial allowlist and hardens external links', () => {
  const html = sanitizeCmsRichText('<h1 style="color:red">Heading</h1><p>Hello <strong>world</strong>. <a href="https://example.com" onclick="steal()">Source</a></p>');
  assert.equal(html, '<h2>Heading</h2><p>Hello <strong>world</strong>. <a href="https://example.com/" target="_blank" rel="noopener noreferrer">Source</a></p>');
});

test('safe rich text removes executable content, unsafe URLs and arbitrary styling', () => {
  const html = sanitizeCmsRichText('<p class="custom">Safe<script>alert(1)</script><a href="javascript:alert(1)"> link</a><img src=x onerror=alert(1)></p>');
  assert.equal(html, '<p>Safe link</p>');
  assert.doesNotMatch(html, /script|javascript|onerror|class=/i);
});

test('safe rich text accepts internal and mail links without forcing a new tab', () => {
  const html = sanitizeCmsRichText('<p><a href="/events">Events</a> <a href="mailto:hello@example.com">Email</a></p>');
  assert.equal(html, '<p><a href="/events">Events</a> <a href="mailto:hello@example.com">Email</a></p>');
});
