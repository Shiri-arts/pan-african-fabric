// @ts-check
import { defineConfig } from 'astro/config';
import wix from "@wix/astro";
import react from '@astrojs/react';
import wixHosting from '@wix/astro-wix-hosting-adapter';

// https://astro.build/config
export default defineConfig({
  // Phase 1 has no Wix-managed page embeds or browser business services.
  integrations: [wix({ htmlEmbeds: false, wixSitePages: false }), react()],
  output: 'server',
  adapter: wixHosting(),
  server: { host: '127.0.0.1', port: 4321 },
  devToolbar: { enabled: false },
});
