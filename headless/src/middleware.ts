import { defineMiddleware } from 'astro:middleware';

// CMS images are served by Wix Media Manager. Keep every other browser request
// same-origin, including SDK-injected analytics requests.
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://static.wixstatic.com",
    "font-src 'self'",
    `connect-src 'self'${import.meta.env.DEV ? ' ws://127.0.0.1:4321' : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join('; '));
  return response;
});
