# Phase 1 Headless foundation

This isolated Astro/React frontend continues the approved design in `../docs/phase-1/`. The repository root remains the existing Editor/Velo project: run frontend commands **from this directory only**.

New site: `6dabfd00-04c6-4f6f-8282-fb56b240c160`. Companion app: `7c983a5c-6496-4542-8036-6ffd5a3c71eb`. Existing Editor site `cf6dc8aa-2320-4c66-b52e-44252adf69f3` is explicitly forbidden by CMS tooling.

## Local review

```powershell
cd headless
npm.cmd ci
npm.cmd run dev
```

Open http://127.0.0.1:4321. The server binds only to loopback. Development mode displays labelled draft copy from the existing copy deck; primary route stubs exercise the shared shell. Production builds omit those drafts and show a neutral content-unavailable state. There are no public biographies, cultural descriptions, event claims, downloads, forms, or unverified contact details. The Press Kit action navigates to the Media section; it does not pretend to download a file.

The responsive shell includes containers, button/link variants, navigation, a React disclosure menu, skip link, visible focus, and footer. Without JavaScript, navigation remains expanded and usable. The menu is in normal document flow; Escape closes it and restores focus. Reduced-motion preferences remove transitions.

## Validation

```powershell
npm.cmd run check
npm.cmd test
npm.cmd run build
npm.cmd run build:wix
node scripts/verify-production.mjs
```

Build commands do not release the frontend. No release script or deployment workflow is included. Do not run release/publish, activate redirects, connect domains, or merge to main at the Phase 1 gate.

Stop the development server before building, then restart it: the Wix integration shares generated caches between modes. Running a build beside the dev server can leave mismatched React modules in the preview. The hosting adapter does not support `astro preview`; production responses were verified by invoking the built worker's `fetch` entry with the ignored local environment.

Phase 1 disables unused Wix HTML embeds and managed page integrations. A response Content Security Policy restricts browser requests, scripts, images and fonts to the same origin (plus loopback development WebSocket). This blocks SDK analytics requests; analytics and external media require a deliberate policy decision in a later approved phase.

## Content access

`src/lib/public-content.mjs` is the public content contract. CMS wiring is disabled and returns no private records. Administrative REST transport and provisioning live under `scripts/cms/`, outside frontend source. The 18 redesigned schemas are private, empty and draft-first; see `cms-access-verification.json` for the live anonymous access checks. No administrative token is bundled or stored in the repo. Managed local environment stays in ignored `.env.local`.

Wix's collection publish plugin supplies the draft/live lifecycle. Visitor access and frontend CMS queries remain disabled until the integration gate is implemented and tested. Never use a status filter as access control. Approval evidence and media permissions remain private; private CMS metadata cannot protect a file uploaded to a public CDN.

## Fonts and source

Libre Caslon Text provides the Caslon-style headings; Archivo provides body and interface type. Both use SIL OFL 1.1 and are bundled through Fontsource with notices under `public/licenses/`. Adobe Caslon Pro is not bundled. See `FONT-LICENSES.md`. Wix starter configuration is derived from the official blank Astro template; its MIT notice is retained in `LICENSE.wix-template`.

The supplied strategy PDF is source material, not permission to invent or publish content. Country profiles, galleries, CMS population, forms, redirects and public CMS wiring remain pending.

