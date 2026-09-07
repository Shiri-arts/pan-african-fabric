# Revised Phase 1 implementation record

The approved Headless migration supersedes the older Editor-only implementation gates in this directory. The earlier tokens, component contract, routes, copy deck, inventory, and two wireframes remain the design/content sources. The supplied 14-page July 2026 PDF was read in full, with launch scope taken from page 13. Its future recommendations are not additional implementation authorization.

## Isolation and creation

- Branch: `wix-headless-migration`, created from clean `launch-critical-redesign` at `b19f82ab64f063eb584fe51cb449964e4de9f14e`.
- Frontend: `headless/`, with its own package manifest, lockfile, Astro configuration and Wix configuration.
- New Wix site: `6dabfd00-04c6-4f6f-8282-fb56b240c160` (HEADLESS / Editorless / free).
- New companion app: `7c983a5c-6496-4542-8036-6ffd5a3c71eb`, verified READY through the companion-app API.
- Original Editor/Velo `src/`, root package.json, wix.config.json and wix.lock are preserved. No existing CMS, forms, settings or domain mutations.

CLI authentication succeeded with browser authorization. Installed scaffolder `@wix/create-new@0.0.109` exposes creation as `headless init`. Its help was checked before execution:

```text
npx.cmd --yes @wix/create-new@0.0.109 headless init --business-name "The Pan-African Fabric Headless" --folder-name headless --site-template blank --no-publish --skip-install --skip-git
```

Business/project creation succeeded, but the CLI's unquoted Windows temporary path caused the template `git clone` to fail (`fatal: Too many arguments`, exit 129). Creation was not repeated. The new site and its companion app were recovered using read-only account/site APIs; official `wix/headless-templates` blank configuration was restored locally and managed environment values pulled into ignored `.env.local`.

**Observed hosting state:** Wix reports the provisioned backend as `published: true`; the new hosting URL returned HTTP 404. No frontend build/release occurred during creation, and no release/publish command was run. This record does not call the Wix backend itself unpublished. The migration frontend has not been deployed. The production domain remains on the original site.

## Foundation implemented

- Ivory/charcoal/rust tokens, decorative gold, fluid 720/1200/1440px containers and 24/32/48px gutters.
- Locally bundled Libre Caslon Text and Archivo, both SIL OFL 1.1, with notices served alongside fonts. No proprietary Adobe Caslon files.
- Shared header/footer, five navigation routes, a real Media/Press Kit section link, accessible button/link variants, React mobile disclosure, skip link, focus states and reduced motion.
- A labelled local homepage review and five route stubs. Full country, event, media and initiative pages remain Phase 2 work.
- Eight private CMS schemas, all declared reference targets and reciprocal relationships, and a server/admin access layer outside frontend source. Public access is disabled in Phase 1; it never queries private records.
- No content population, fabricated biography, symbolic interpretation, image, media right, contact address or downloadable asset.

## Live CMS verification

All eight collection schemas were read back with ADMIN insert/update/remove/read. Every collection contained zero items. The access verifier then inserted one synthetic canary at a time, verified administrative reads, obtained real anonymous visitor credentials and received HTTP 403 for both visitor list queries and direct-item reads. Each canary was removed in a finally block and the empty state rechecked. Results are in `headless/cms-access-verification.json`.

## Implementation validation — 7 September 2026

- Existing Phase 1 foundation validator: passed (16 routes, 7 redirects, 9 content packages, token contrast/parity and accessibility structure). Those redirects are documentation only and were not activated.
- Astro diagnostics: 19 files, zero errors, warnings or hints. Eight CMS boundary/provisioning tests passed.
- Astro production build and `wix build` completed. No release/publish command was run. Upstream Wix/Vite emits Node built-in externalization notices and a missing optional `@wix/stores` optimization warning; this project does not use Stores.
- Edge/Playwright: widths 1440, 1280, 1024, 768, 390 and 320px passed horizontal-overflow and keyboard checks. Mobile Enter/Space toggle, Tab into navigation, Escape/returned focus, skip-to-main, five navigation destinations, Press Kit anchor, unknown-route 404, no-JavaScript navigation and reduced motion passed. Desktop/mobile screenshots were visually inspected; local artifacts are under ignored `output/playwright/`.
- Production worker responses: home and five section routes returned HTTP 200 with the content-unavailable gate; unknown route returned 404. Draft strings and administrative CMS code were absent from generated bundles and those responses.
- Browser analytics initially attempted a URL containing a visitor session token and automatic approval review blocked a rerun. Unused Wix HTML embeds were disabled and a verified same-origin CSP was added before continuing. The corrected shell passed browser checks without uncaught page errors. SDK requests denied by the policy may appear as expected CSP console messages.
- No screen-reader, cross-browser, deployed-host, custom-domain or public-content publication testing is claimed. The production adapter cannot run `astro preview`; its built worker entry was invoked locally with managed environment values.

## Phase 1 review gate

Review the local shell and these foundations before Phase 2. Final editorial copy, designer/region decisions, symbol sources, approved media and credits, official Smithsonian program details, press kit, public contact and legal/privacy wording remain content dependencies. Do not publish the local draft copy. Do not enable public collection reads, populate pages, activate redirects, merge main, release or connect a domain at this gate.

## Sources

- [Wix creation flags](https://dev.wix.com/docs/wix-cli/command-reference/project-creation/create-headless)
- [Official blank Astro starter](https://github.com/wix/headless-templates/tree/main/astro/blank)
- [Wix build command](https://dev.wix.com/docs/wix-cli/command-reference/project-commands/build)
- [Query sites and Headless namespace](https://dev.wix.com/docs/api-reference/account-level/sites/skills/query-sites)
- [Companion app lookup](https://dev.wix.com/docs/api-reference/app-management/companion-apps/get-companion-app)
- CMS endpoint/schema references and verification instructions: `headless/scripts/cms/README.md`.
