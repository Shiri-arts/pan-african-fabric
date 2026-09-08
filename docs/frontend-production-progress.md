# Frontend production progress

Continuity record for the production frontend described in
`docs/production-frontend-implementation-prompt.md`. Update after every meaningful batch.

A successor must read, in order: that prompt, this file,
`docs/phase-1/headless-implementation.md`, `headless/README.md` — then inspect the real
Git and runtime state before editing anything.

## Position

- Branch: `wix-headless-migration`. Never `main`, never merged to `main`.
- Parent commit: `23b35765468999d5ae944ea9b7154eab9bc8524c` (Phase 1 foundation).
- All frontend commands run from `headless/`.
- Local review URL: `http://127.0.0.1:4321` (`npm.cmd run dev`, loopback only).

## Batch 1 — complete frontend implementation (2026-09-08)

### Routes implemented

| Route | File | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Eight-section narrative, cinematic hero |
| `/about` | `src/pages/about.astro` | Origin, mission, model, founder, milestones |
| `/edition-one` | `src/pages/edition-one/index.astro` | Fabric, twelve colours, five regions, nine countries, process, garments |
| `/edition-one/[country]` | `src/pages/edition-one/[country].astro` | Nine countries; unknown slug returns HTTP 404 |
| `/events` | `src/pages/events/index.astro` | Featured, upcoming, formats, archive |
| `/events/[slug]` | `src/pages/events/[slug].astro` | Resolves the confirmed showcase; unknown slug 404 |
| `/stories` | `src/pages/stories/index.astro` | Index plus honest empty state |
| `/stories/[slug]` | `src/pages/stories/[slug].astro` | Article template; 404 in production |
| `/shop` | `src/pages/shop/index.astro` | `Shop collection coming soon` |
| `/shop/[slug]` | `src/pages/shop/[slug].astro` | Product template; 404 in production |
| `/press-contact` | `src/pages/press-contact.astro` | Fast facts, releases, assets, coverage, enquiries |
| `/partner-with-us` | `src/pages/partner-with-us.astro` | Campaign page and non-submitting form preview |
| 404 | `src/pages/404.astro` + `NotFound.astro` | Designed page, real 404 status |

The Phase 1 catch-all `src/pages/[section].astro` was **deleted**: it turned arbitrary
top-level paths into HTTP 200. `/initiative`, `/exhibitions`, `/media` and
`/future-editions` now return 404, as verified below.

### Components

`Header` (quiet-over-hero, solid on scroll), `Footer`, `MenuToggle` (React island),
`PageHero`, `Media`, `ColourGrid`, `ColourPanel`, `ColourChips`, `CountryCard`,
`EventPoster`, `EventCard`, `StoryCard`, `ProductCard`, `Field`, `EmptyState`, `Copy`,
`Section`, `SectionHead`, `Container`, `Button`, `Eyebrow`, `Breadcrumbs`, `Meta`,
`Reveal`, `ScrollProgress`, `NotFound`.

Typed view models under `src/data/`: `colours`, `countries`, `events`, `navigation`,
`site`, `stories`, `shop`, `redirect-map`. Contracts under `src/lib/`: `content`
(provenance), `media`, `seo`, `review`.

### Content provenance system

Every editorial string carries a status (`src/lib/content.ts`):

- **approved** — client-supplied. Renders in every build.
- **draft** — verbatim from `docs/phase-1/copy-deck.md`. Renders **only** in the review
  build, always visibly marked. Lives in `src/data/review-copy.server.ts`, reached only
  through an `import.meta.env.DEV` guard, so it is removed from production bundles.
- **awaiting** — no source material supplied. Renders a designed empty state.

Nothing was invented. No cultural fact, symbol meaning, biography, quotation,
endorsement, event outcome, contact, price or credit was written for this build.

### Twelve-colour system

`src/data/colours.ts` holds all twelve colours mapped to nine countries (Cameroon,
Ghana and South Africa carry two each). Contrast was **measured**, not assumed:

- Ten colours pass 4.5:1 with a neutral text colour on the field.
- Hot pink `#E3327C` reaches only 4.19:1 (white) and 3.82:1 (charcoal). **Neither
  neutral passes for normal-size text.** Resolution: the field carries only large
  display type (at least 24px, so the 3:1 large-text threshold applies and 4.19:1
  passes), and the authoritative colour, country and region labels sit on a neutral
  band beneath every panel at 14.44:1. Colour is therefore never the sole carrier of
  country information.
- Blue and Orange resolved to charcoal (5.31:1 and 4.52:1), not white.

### Confirmed event

Title, date, time, venue and location render exactly as supplied, on the homepage,
`/events` and its own detail route. No countdown (no confirmed timezone). Structured
data omits timezone, offers, organizer, image, URL and attendance mode. No Community
Day framing, partner status, ticketing or endorsement anywhere. `?preview=archive`
renders the post-event state in the review build only.

## Commands actually run, with real results

From `headless/`:

| Command | Result |
|---|---|
| `npm.cmd run check` | **64 files, 0 errors, 0 warnings, 0 hints** |
| `npm.cmd test` | **8/8 pass** (CMS boundary tests, unchanged) |
| `npm.cmd run build` | **Complete.** Upstream Wix/Vite Node-builtin externalization notices only |
| `npm.cmd run build:wix` | **Complete.** No release or publish command run |
| `node scripts/verify-production.mjs` | **Pass:** 11 routes HTTP 200, 6 HTTP 404 |

`scripts/verify-production.mjs` was rewritten for the new route map. It now also asserts
that approved content *does* render in production, that no commerce control or commerce
form field appears, and that review-only specimens 404.

**One deliberate change to the draft blocklist:** `One Fabric. Many African Stories.`
was removed from it. The implementation brief calls it "the approved tagline" and
requires it in the hero. Nineteen other draft strings were added, including all nine
working designer names.

## Browser verification actually performed

Playwright driving **system Microsoft Edge 152**, installed in the session scratchpad
rather than added to the project manifest, so no dependency was introduced. The dev
server was stopped before each production build and restarted afterwards.

**Widths checked: 320, 390, 768, 1024, 1280, 1440.** 12 routes x 6 widths = 72 checks.

- No horizontal overflow at any width on any route.
- Exactly one `h1` per route at every width.
- No interactive control below the 44x44 touch target.
- Zero uncaught page errors, zero console errors.
- Skip link: first Tab reaches it, it becomes visible, Enter moves focus to `#main`.
- Focus indicator: 3px outline plus a 3px contrasting halo, verified computed.
- `aria-current`: present on all 7 primary routes and on a country detail route.
- Mobile menu: Enter opens, Tab enters navigation, Escape closes and restores focus,
  Space opens.
- Colour grid: 12 labelled links at every one of the six widths.
- `Central African Republic` wraps to 2 lines at 320px without clipping.
- **No JavaScript:** navigation visible and usable, toggle hidden, link navigation works,
  12 colour panels render, 0 reveal elements hidden.
- **Reduced motion:** transitions neutralised, hero animation off, reveal content fully
  visible and unoffset, scroll-progress hidden, all information still present.
- **HTTP status:** 11 known routes 200; `/initiative`, `/exhibitions`, `/media`,
  `/future-editions`, `/not-a-route`, `/a/b/c` and four unknown detail slugs all 404.
- **Form preview:** 7 controls, all labelled, all disabled, every `aria-describedby`
  resolves, error programmatically associated, submit disabled, no form action.

Screenshots are under ignored `output/playwright/` (full page) and
`output/playwright/review/` (viewport crops). These were visually inspected.

### Defects found by that inspection and fixed

1. **Overlay header rendered invisible.** A sticky header still occupies flow, so it sat
   above the hero rather than over it, putting ivory text on the ivory body. An
   adjacent-sibling fix failed because Astro emits the header's `<script>` between the
   header and `main`; the hook was moved onto `main` itself.
2. **Hero copy column crushed.** `max-width: 22ch` was computed from the body font and
   forced 80px display type into roughly 176px. Changed to a rem measure.
3. **Mobile hero eyebrow hidden behind the header** once the hero was pulled up. Header
   height is now reserved as padding.
4. **Reveal animation could strand content.** Elements scrolled past (anchor jump, then
   scrolling up) never intersected and stayed at opacity 0. The observer's top
   `rootMargin` now treats anything above the viewport as intersecting. Verified.
5. **Logo link under the touch target** (36-37px). Given `min-height: 48px`.
6. **Missing favicon** produced a console 404. Added `public/favicon.svg`, built from the
   twelve supplied colour values. No logo was invented.

## Known issues and limitations

- **No screen-reader testing** was performed. No conformance claim is made. The target
  is WCAG 2.2 AA; the automated and manual checks above are development evidence, not a
  conformance statement.
- **Only Chromium (Edge) was tested.** No Firefox or Safari testing.
- **No Lighthouse run.** With no real hero image and no deployed host, an LCP figure
  would not be meaningful. Bundle sizes from the build: largest client chunk 136.51 kB
  (44.01 kB gzip, React for the single menu island); individual page scripts are
  0.31-0.45 kB each.
- The hero placeholder is an art-directed gradient, so the current largest contentful
  element is text. The image path (`<picture>`, srcset, focal point, fetch priority,
  ratio reservation) is implemented and simply unused until real assets arrive.
- Region grouping follows the brief's working grouping. Cameroon's placement is surfaced
  on its own page as awaiting founder confirmation rather than silently corrected.

## Content and media dependencies still outstanding

None of this can be written by an implementer; all of it is client-supplied.

**Copy:** initiative introduction; About origin, mission/vision and model; founder
biography, portrait and one attributable quotation; milestone list; fabric description;
twelve-colour development narrative; per-country introduction, symbol, interpretation,
participation and credits; event description; partnership rationale; collaboration
formats and collaborator descriptions; shop product copy.

**Media:** homepage hero (desktop and mobile crops, focal point, alt text, credit, reuse
permission); About and per-page heroes; founder portrait; per-country hero plus two
supporting garment images; event imagery; story heroes; product photography.

**Approvals:** designer roster names and studio naming (currently review-only, marked
"working roster, not approved"); press kit PDF with version, date, file size and
permitted URL; press releases; verified coverage links; public contact address
(`Info@thepanafricanfabric.com` was supplied as a work address, public use still
pending); Instagram and founder-site destinations (held back behind a `verified` flag in
`src/data/site.ts`, flip it once confirmed); production origin for canonical URLs;
approved social share image; event timezone (blocks any countdown).

## Boundaries held

- Wix CMS collections, schemas, permissions and data: **untouched**.
  `headless/scripts/cms/` not modified. The eight collections remain private and empty.
- Existing Editor/Velo site `cf6dc8aa-2320-4c66-b52e-44252adf69f3`: **untouched**. Root
  `src/`, `package.json`, `wix.config.json` and `wix.lock` not modified.
- **No** deploy, release, publish, domain change, ownership transfer, payment activation
  or form submission. No redirect activated: proposals are recorded in
  `src/data/redirect-map.ts` as documentation only.
- No analytics, pixels, trackers, cookies or third-party embeds added. The same-origin
  CSP is preserved unchanged. No external image or font host introduced.
- No dependency added to `headless/package.json`. Playwright lives in the scratchpad.

## Commit history

Recorded as 23 atomic commits rather than one large one, so each layer can be reviewed
and reverted independently. Every commit was typechecked in isolation: all 23 report
0 errors, 0 warnings and 0 hints from `astro check`.

1. Design tokens and the stylesheet system.
2. Content provenance and media contracts.
3. The twelve-colour system and the nine-country model.
4. The event model and the confirmed showcase.
5. The revised information architecture and the proposed redirect record.
6. Site facts, the empty story and product models, and the metadata contract.
7. Isolated draft copy and the template specimens.
8. Layout and control primitives.
9. Copy, empty-state and media components.
10. The twelve-colour grid.
11. Country, event, story and product cards.
12. Hero, form field, breadcrumb, metadata and 404 components.
13. Scroll reveal and reading progress.
14. The shell cutover: layout contract, header, menu, footer, homepage, 404 and removal
    of the catch-all. This one is deliberately larger. The new layout requires every
    route to declare its own description and canonical path, so the layout and all of
    its callers had to move together; splitting it would have left the tree with pages
    that could not satisfy the layout contract, and it was verified that they could not.
15. About.
16. Edition One and the country template.
17. Events and the event detail template.
18. Stories and the article template.
19. Shop and the product template.
20. Press and Contact.
21. Partner With Us and the form preview.
22. The rewritten production-boundary verifier.
23. This record.

Pushed to `wix-headless-migration`. Not merged to `main`, and never force-pushed: the
history was arranged before the branch was published.

## Exact next action for another agent

The frontend is at the review gate. Do **not** start CMS wiring, deployment, redirects,
ownership transfer or form activation.

1. Walk the local review build with the client and collect decisions on the outstanding
   copy and media above.
2. When approved hero photography arrives: place the files in `headless/public/`, fill in
   the `Media` record on the relevant page (`desktop`, `mobile`, `srcset`, `focal`,
   `alt`, `credit`, `permission`) and re-run the responsive suite. No component change
   is needed.
3. When an external destination is confirmed, set `verified: true` in `src/data/site.ts`.
4. When copy is approved, move the string out of `review-copy.server.ts` into an
   `approved()` call at its page, and delete it from the blocklist in
   `scripts/verify-production.mjs`.
