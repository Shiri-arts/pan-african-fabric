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

## Batch 2 — wordmark and event countdown (2026-09-08)

### Client decisions recorded

- **Event timezone confirmed: US Eastern.** 26 September 2026 falls inside US daylight
  time, so the offset is EDT, UTC-04:00. The event now carries exact instants
  (`2026-09-26T13:00:00-04:00` to `17:00:00-04:00`) instead of floating wall-clock
  times. This is what unblocks the countdown the brief previously prohibited, and it
  lets the structured data emit a real `startDate` and `endDate`.
- The homepage countdown bar **replaces** the event poster there. Venue, location and
  time now appear on `/events` and the event detail route, not on the homepage.
- The bar is built from the twelve Edition One colour values.
- When no event is upcoming the section **collapses silently**.
- Days, hours and minutes; seconds only inside the final hour.
- Not dismissible: it is a page section, not an overlay.

### Wordmark

`THE PAN-AFRICAN FABRIC` now sits on one line everywhere, in the header and the footer.
Measured: at 320px only 135px was free beside the old 105px "MENU" button, which would
have forced the wordmark down to 9.6px. The toggle is now icon-only below 520px — a
48x48 target whose label stays in the accessibility tree — and the row gap tightens,
giving 208px. The wordmark renders at 13.6px there against a 14.7px ceiling, 15.1px at
360px and 16.4px at 390px, and reaches its full size from about 500px up. The footer
wordmark scales the same way and was given a 44px minimum target, which single-lining it
had removed.

### Countdown bar

`EventCountdownBar.astro` follows `nextEvent()`, so it tracks whichever event is soonest
and needs no per-event wiring. It renders nothing when nothing is upcoming.

- Server-renders a real day count and the full date, so it is correct with no JavaScript
  and cannot hydrate-mismatch.
- Counts down only for an event with a confirmed timezone; `canCountDown()` gates it.
- Removes itself the moment the event ends, which also corrects a response cached
  before the end.
- The ticking digits are `aria-hidden`; a static sentence carries the same information
  and is rewritten only when the day count changes, because the brief prohibits
  continuously moving text.
- Under `prefers-reduced-motion` it stops updating and stays at day precision. The
  movement goes; the day count, the full date and the link all remain.
- The colour entry animation is finite and runs once, so nothing moves continuously
  beside the rest of the page.
- Timers align to the next real second or minute boundary rather than drifting.

`eventPhase` now returns `upcoming` / `live` / `archive` from the exact instants when
they exist, falling back to calendar-date comparison when a timezone is unconfirmed.

### Verification for this batch

Behaviour was tested against a controlled clock rather than by waiting for the date.
All checks pass:

| Simulated time | Result |
|---|---|
| 6 days before | `6 DAYS 0 HOURS 59 MINUTES`, accessible sentence correct, digits `aria-hidden` |
| 90 minutes before | `1 HOUR 29 MINUTES` — no `0 DAYS` |
| 30 minutes before | `29 MINUTES 58 SECONDS` — seconds appear, days gone |
| During the event | kicker flips to `HAPPENING NOW`, timer reads `Live`, bar stays |
| 1 second after the end | bar absent |
| Loaded 30s before the end, clock run forward | bar removes itself |
| Reduced motion | static `18 DAYS`, no updates over 3 simulated minutes, link intact |
| No JavaScript | full title, date, time with `ET`, and `18 DAYS` all present |

Two defects were found by these tests and fixed: the kicker stayed on "Next event" while
the timer already read "Live", and the timer displayed a redundant `0 DAYS` in the last
day. A third was found by the responsive suite: single-lining the footer wordmark
dropped its touch target to 31px.

Full suites re-run after the changes: responsive 72/72 across 12 routes x 6 widths with
no overflow, one h1 each, no control under 44px, zero page and console errors;
interaction and behaviour suites unchanged and passing; `astro check` 65 files 0/0/0;
tests 8/8; both builds complete; production verifier 11 routes 200, 6 routes 404, with
10 approved-content assertions and four countdown-integrity assertions.

## Batch 3 — homepage structure (2026-09-08)

### The problem, measured

The homepage carried three consecutive Edition One sections. Measured before the
change: they were **52% of the homepage on desktop and 62% on mobile**, and sections
02 and 03 alone were 4,586px on a phone — about five and a half screens.

| Section | 1440px | 390px |
|---|---|---|
| 01 Edition One | 1826px | 2274px |
| 02 The countries | 1069px | 2223px |
| 03 Designers and garments | 952px | 2363px |

The overlap was total, not partial: the colour panels, the country cards and the
designer slots all pointed at the same nine country pages. All 12 colour-panel links
reappeared as country cards, and all 9 designer links did too.

In a production build, section 03 was nine cards all reading "Designer to be
announced", because the roster is an unapproved working source.

### Client decisions

- **02 folds into 01** as a compact index beneath the twelve-colour grid.
- **03 becomes a slim teaser** on the homepage; the full framework moves to
  `/edition-one`, which had no designer section before.

### Result

| | before | after |
|---|---|---|
| Homepage height, 1440px | 7,373px | **6,096px** (-17%) |
| Homepage height, 390px | 11,000px | **7,555px** (-31%) |
| Duplicate country links | 21 | **0** |

`CountryIndex.astro` carries each country's name, region and approved-content
availability as text, with a colour rail repeating its Edition One colours. The rail
is decoration only, and a hairline was added so the near-white Central African
Republic rail stays visible against ivory.

The homepage now reads: hero, countdown, 01 Edition One (colours and countries),
02 Designers teaser, 03 Stories, 04 Partner With Us, fast facts. `/edition-one` gains
`05 The designers` and its sections renumber to seven.

### Deviation from the brief, recorded

The implementation brief lists the colour grid, the nine-country index and the
designer framework as three separate homepage sections (items 3, 4 and 5). This batch
merges the first two and relocates the third, on the client's explicit instruction,
which the brief's own source-priority list ranks above its page requirements. The
substance of item 4 is preserved: region and availability state are still previewed on
the homepage, in the compact index. Item 5 is preserved on the canonical page rather
than removed.

### Verification

Re-ran after the change: `astro check` 66 files 0/0/0; tests 8/8; both builds complete;
production verifier 11 routes 200, 6 routes 404; responsive 72/72 across 12 routes and
6 widths with no overflow, one h1 each, no control under 44px, zero page and console
errors; interaction, behaviour and countdown suites all passing.

## Batch 4 — colour correction, country tiles, nav previews (2026-09-08)

### A measurement that corrects an earlier decision

Batch 1 recorded that Hot pink could not carry normal-size text and that this is why
the colour cards were half-coloured with a neutral label band. That was true against
the house charcoal and against white, but not against pure black. Re-measured:

| | white | charcoal | pure black |
|---|---|---|---|
| Hot pink `#E3327C` | 4.19 | 3.82 | **5.01** |
| Orange `#D76921` | 3.54 | 4.52 | **5.93** |

**All twelve colours clear 4.5:1 for normal-size text.** Orange and Hot pink now use
pure black; the rest keep white or the house charcoal. Fully-coloured cards are
therefore accessible with no scrim, no large-text restriction and no change to any
supplied colour value. `largeTextOnly` stays in the model but no colour sets it.

### Client decisions

- The event bar must not merge into the hero.
- It should have a shine effect.
- Text animates once and rests; the timer does not move. Chosen over a ticker after
  the WCAG 2.2.2 implication was raised.
- "Twelve colours. One fabric." replaced with **"One fabric. Nine countries."** The
  initiative is not showcasing colour.
- Colour names come off the cards.
- Cards are fully coloured, not half.
- The separate "9 countries across 5 African regions" block goes.
- Menu items reveal their page sections on hover.

### What changed

**Nine country tiles** replace the twelve-panel colour grid on the homepage. Each
country appears exactly once, so the grid *is* the country index and the compact list
added in batch 3 is gone. A two-colour country shows its second colour as an edge
band, so both colours are present and no text ever crosses a contrast boundary. The
twelve-colour grid itself remains on `/edition-one`, where colour is the subject.

**The event bar** sits on the ivory ground with clear space above and its own
contained dark box, so it reads as a separate object. The colour track carries a
finite gloss sweep, and title and date animate in once and then rest. Nothing moves
continuously, so WCAG 2.2.2 requires no pause control. Reduced motion drops the
sweep, the entry pass and the segment rise.

**Menu section previews.** Each item reveals its page's real sections. Open and close
are pure CSS on `:hover` and `:focus-within`, so it works with JavaScript off and is
never pointer-only; Escape dismisses, which covers the dismissible requirement for
content shown on hover or focus. Below 1100px the sections are part of the existing
accordion, because touch has no hover. All 25 previewed anchors were verified to
resolve to a real element on their page.

### Defects found by verification

- **Kenya's labels failed AA.** A 0.85 opacity on the region and status labels dropped
  red from 4.64:1 to 3.56:1. The opacity was removed; hierarchy now comes from size,
  letterspacing and case. A rendered-contrast test now measures every label on every
  tile against its own ground: 9 tiles x 5 labels, all passing.
- The Edition One section head left a large void, because a short title bottom-aligned
  against a much taller supporting column. Added a top-aligned variant.
- The colour track was inset by the container padding; the width constraint and the
  dark box are now separate elements.

### Verification

`astro check` 67 files 0/0/0; tests 8/8; both builds complete; production verifier
11 routes 200, 6 routes 404 with 14 approved-content assertions. Responsive 72/72
across 12 routes and 6 widths. Interaction, behaviour and countdown suites passing.
New: a navigation suite (hover, keyboard focus, hoverable, Escape and focus return,
top-level navigation still working, no-JavaScript, mobile accordion, 25 anchors) and
a tile-contrast suite.

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
approved social share image.

The event timezone is **no longer outstanding**: the client confirmed US Eastern on
8 September 2026.

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

Batch 2 continues the same sequence:

24. Confirmed Eastern time on the event model.
25. The single-line wordmark and the icon-only narrow-width menu button.
26. The homepage event countdown bar.
27. Countdown coverage in the production verifier, and this record.

Batch 3:

28. The compact country index and the homepage restructure.
29. The designer framework relocated to `/edition-one`.
30. This record.

Batch 4:

31. Accessible text colours re-measured across all twelve colours.
32. Nine fully-coloured country tiles replacing the homepage colour grid.
33. The event bar separated, with a shine pass and a one-time text entry.
34. Menu items previewing their page sections on hover and focus.
35. This record.

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
