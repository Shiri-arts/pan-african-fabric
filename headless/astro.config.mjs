// @ts-check
import { defineConfig } from 'astro/config';
import wix from "@wix/astro";
import react from '@astrojs/react';
import wixHosting from '@wix/astro-wix-hosting-adapter';

const localBrowserTest = process.env.LOCAL_BROWSER_TEST === 'true';

// https://astro.build/config
export default defineConfig({
  // Phase 1 has no Wix-managed page embeds or browser business services.
  integrations: [wix({ htmlEmbeds: false, wixSitePages: false }), react()],
  output: 'server',
  // Wix preview proxies requests through an internal host, so Astro's default
  // host comparison rejects valid same-origin POSTs. API routes enforce the
  // browser Origin against Wix's forwarded public host instead.
  security: { checkOrigin: false },
  // Wix's Cloudflare-based dev runtime can fail to start on restricted Windows
  // hosts. This opt-in bypass is for local browser checks only; normal builds and
  // Wix preview always use the managed-hosting adapter.
  ...(localBrowserTest ? {} : { adapter: wixHosting() }),
  server: { host: '127.0.0.1', port: 4321 },
  devToolbar: { enabled: false },
});
