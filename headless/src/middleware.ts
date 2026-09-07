import { defineMiddleware } from 'astro:middleware';

// Phase 1 has no external media, analytics, forms or browser CMS access.
// Keep the review shell local, including SDK-injected analytics requests.
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${import.meta.env.DEV ? ' ws://127.0.0.1:4321' : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join('; '));
  return response;
});
