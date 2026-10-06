// @ts-check
import { defineConfig } from 'astro/config';
import wix from "@wix/astro";
import react from '@astrojs/react';
import wixHosting from '@wix/astro-wix-hosting-adapter';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const localBrowserTest = process.env.LOCAL_BROWSER_TEST === 'true';
const wixWranglerConfigPath = '.wix/wrangler.json';
const wixWranglerConfig = new URL('./.wix/wrangler.json', import.meta.url);

if (!localBrowserTest) {
  const configPath = fileURLToPath(wixWranglerConfig);
  const serverEntry = fileURLToPath(new URL(
    './node_modules/@wix/astro-wix-hosting-adapter/build/backend-runtime/server.mjs',
    import.meta.url,
  ));
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, `${JSON.stringify({ main: serverEntry }, null, 2)}\n`);
}

// https://astro.build/config
export default defineConfig({
  // Phase 1 has no Wix-managed page embeds or browser business services.
  integrations: [wix({ htmlEmbeds: false, wixSitePages: false }), react()],
  output: 'server',
  // Wix's Cloudflare-based dev runtime can fail to start on restricted Windows
  // hosts. This opt-in bypass is for local browser checks only; normal builds and
  // Wix preview always use the managed-hosting adapter.
  ...(localBrowserTest ? {} : { adapter: wixHosting({ configPath: wixWranglerConfigPath }) }),
  server: { host: '127.0.0.1', port: 4321 },
  devToolbar: { enabled: false },
});
