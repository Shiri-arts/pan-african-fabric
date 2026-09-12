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
| `npm.cmd test` | **9/9 pass** (CMS boundary and additive-migration tests) |
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

## Batch 5 — the event banner moves continuously (2026-09-08)

### Decision reversed, and why that is recorded

Batch 4 chose a one-time text entry over a ticker, specifically to avoid continuous
motion. The client reversed that: the inaugural showcase is the most important thing
on the site and should command attention. The banner now scrolls its detail line and
sweeps its shine continuously, and venue and location were added to it.

This is a deliberate departure from the brief's "do not use continuously moving text".
It was raised before implementing, and reaffirmed. WCAG 2.2.2 requires a way to stop
motion that runs longer than five seconds, so the banner ships that control rather
than the requirement being dropped.

### How the motion is made stoppable

- A visible **pause control** in the banner, `aria-pressed`, label switching between
  Pause and Play. The choice is remembered per viewer in `localStorage`, wrapped so a
  browser blocking site data cannot break the banner.
- **Hover and keyboard focus** both pause the scroll and the shine.
- **prefers-reduced-motion** removes all of it: the detail line wraps as ordinary
  text, the shine is hidden, the duplicate copy is hidden, and every fact stays.
- **No JavaScript**: the line renders static and complete, and the pause control stays
  hidden rather than appearing as a dead button.

The timer never moves position; it sits outside the scrolling lane. The scrolling copy
is duplicated for a seamless loop, with the duplicate `aria-hidden` so it is never
announced twice, and the number of copies is measured at runtime so the loop never
shows a gap.

The banner is no longer a single large link, which would have made the pause button
invalid markup nested inside it. The link is now the Event details cue, stretched
across the banner so the whole surface stays clickable while the button sits above it.

### Defects found by verification

- The script rewrote the accessible sentence on every tick and **dropped venue and
  location from it**, so a screen reader lost the two facts just added. The details are
  now carried through every rewrite.
- The sentence read `Washington, D.C..` A close helper stops a second full stop being
  added to a string that already ends in one.

### Verification

New marquee suite, all passing: motion runs and the shine loops infinitely; the timer
does not move; venue, location and zoned time are present in the line and in the
accessible sentence; exactly one of two copies is exposed; the pause control toggles,
stops motion, persists across reload and resumes; hover and focus pause; reduced motion
is fully static with every detail present; no-JavaScript renders complete with no
orphan control.

`astro check` 67 files 0/0/0; tests 8/8; both builds complete; production verifier
11 routes 200, 6 routes 404, now with 17 approved-content assertions plus checks that
the pause control ships and the duplicate copy is hidden. Responsive 72/72. Interaction,
behaviour, countdown, navigation and tile-contrast suites all passing.

## Batch 6 — banner control fixes (2026-09-08)

Two faults reported against the banner shipped in batch 5, plus one found alongside.

### Play did not restart the motion

The real fault, and the reason it looked broken. Pausing and playing were driven by
`.countdown:hover` and `.countdown:focus-within` alongside the explicit control. The
control lives inside the banner, so pressing play left the pointer over the button and
focus on it, both of which still matched those selectors: the banner removed
`is-paused` and stayed frozen anyway.

Holding is now computed in script from whether the pointer or focus is inside the
banner **but not on the control**, and applied as `is-holding`. The CSS rules are plain
class selectors, so the explicit control can never be defeated by a hover state.

The regression test was verified to catch the original fault: with the old rule
restored, three assertions fail with exactly the reported symptom, and they pass again
with the fix.

### The control text is gone

"Pause event banner" no longer renders. The control is a 48px icon-only square.

### The control had no accessible name below 640px

Found while removing the text. The label was `display: none` under 640px, which
removes it from the accessibility tree entirely, so the button was unnamed on every
phone. The label is now visually hidden at all widths instead: never seen, always
available. A test asserts the name is present at 1440px and at 390px.

### Verification

Marquee suite extended: play must resume with the pointer still on the control, the
line must actually travel again afterwards, and a second pause and play round trip
must work. Control checks cover the invisible label, the retained accessible name at
two widths, and the 44px target.

All seven browser suites pass: responsive, interaction, behaviour, countdown,
navigation, tiles, marquee. `astro check` 67 files 0/0/0; tests 8/8; both builds
complete; production verifier 11 routes 200, 6 routes 404, 17 approved-content
assertions.

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

## Batch 7 — CMS model aligned to the redesigned frontend (2026-09-09)

The original eight-collection foundation did not represent the new static-page copy,
the twelve colour assignments, designer participation roles, press resources,
partnership choices, verified contact channels or the editorial side of Shop.

The model now has 18 private collections. Ten supporting collections were added:
`SiteSettings`, `Pages`, `PageSections`, `Regions`, `EditionColours`,
`Participations`, `PressItems`, `PartnershipOptions`, `ContactChannels` and
`ShopItems`. The eight existing collection IDs were preserved and extended
additively. No field or collection was deleted.

`Participations` is the authoritative country–designer join, so a principal designer,
competition entrant and collaborator can have different roles without copying a
biography. `EditionColours` stores all twelve ordered colour-to-country mappings, so
Cameroon, Ghana and South Africa can each carry two colours. `ShopItems` is an
editorial bridge only; Wix Stores will remain authoritative for prices, inventory,
variants, cart and checkout.

All 18 collections have the Wix `PUBLISH` plugin with new content defaulting to
`DRAFT`. All four collection permissions remain `ADMIN`, public CMS access remains
disabled, and every base collection is empty. The live read-only access report records
HTTP 403 for anonymous queries to every base collection. Wix has not materialized the
empty `__drafts` shadow collections yet, so those return 404 and contain no records.

The schema, route query contract, relationship diagram, content-entry order and
publication rules are recorded in `docs/phase-1/cms-specification.md`.

## Batch 8 — the twelve-colour grid as a reference board (2026-09-09)

The client supplied the source colour board and asked the grid on `/edition-one` to
follow it.

### What changed

- **Three columns by four rows**, replacing four by three. The data order already
  matched the board exactly, 1-12, so only the column count moved.
- **Fully coloured swatches.** The half-card treatment is gone: colour name and
  country now sit centred on the colour itself, with no neutral label band, no index
  number, no region line and no cue. This is the same half-card the client had already
  asked to drop on the homepage; it had not been carried through to this grid.
- **Flush, with no internal rules.** Only the outer edge is drawn, because the White
  swatch would otherwise dissolve into the ivory page around it.
- **Not links.** The client chose a pure reference board. The twelve routes into the
  country pages that this grid used to provide are gone, but the country pages remain
  reachable from the same page through the regions section and the countries section.
  The section copy that read "Select any colour to open its country" was corrected,
  since it had become false.

### Where the board and the build deliberately differ

The supplied board uses white text on Blue, Orange and Hot pink. Measured, white gives
3.01, 3.54 and 4.19 against those three, all below 4.5:1 for normal-size text. The
build keeps the measured accessible colours instead: charcoal on Blue, black on Orange
and Hot pink. Nine of the twelve match the board as supplied. A rendered-contrast test
confirms all twelve carry both lines at AA, lowest 4.64:1.

### Verification

Two new suites. One asserts the grid renders three columns by four rows, twelve
swatches, zero links, and all twelve colour-and-country pairings in the board's exact
order. The other measures both text lines on every swatch against its own colour.
Nine browser suites pass in total.

## Boundaries held

- Wix CMS schema changes were limited to the explicitly requested redesign on Headless
  site `6dabfd00-04c6-4f6f-8282-fb56b240c160`. All 18 collections are public-read,
  administrator-write and draft-first. Thirty approved-source records were migrated as
  drafts; the five earlier published foundation records were preserved.
- Existing Editor/Velo site `cf6dc8aa-2320-4c66-b52e-44252adf69f3`: **untouched**. Root
  `src/`, `package.json`, `wix.config.json` and `wix.lock` not modified.
- A Wix-hosted frontend preview was created for review. There was **no release**, domain
  change, ownership transfer, CMS content publication, payment activation or form
  submission. No redirect was activated.
- No analytics, pixels, trackers, cookies or third-party embeds added. The same-origin
  CSP is preserved unchanged. No external image or font host introduced.
- `parse5` was added to `headless/package.json` for server-side rich-text sanitizing.
  Browser-test tooling and profiles remain ignored scratch artifacts.

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

Batch 5:

36. The event banner scrolling continuously, with venue and location and a pause control.
37. This record.

Batch 6:

38. Banner control fixes: play resuming, icon-only control, accessible name restored.
39. This record.

Batch 7:

40. CMS specification and additive private schema aligned to the redesigned frontend.
41. Draft-first lifecycle, live schema inspection and expanded anonymous-access report.
42. This record.

Batch 8:

43. The twelve-colour grid rebuilt as a three-by-four reference board.
44. This record.

Batch 9 — CMS backend and runtime wiring (2026-09-12):

45. Additive 18-collection schema completion, including global, navigation, section,
    SEO, media-rights and founder-quotation controls.
46. Typed, allowlisted public CMS access layer and safe rich-text renderer.
47. All public routes, header, footer, metadata, navigation, featured content and
    dynamic slugs wired to published Wix CMS responses.
48. Draft-only migration of 30 approved-source records, with zero publication calls.
49. Read-only content validator, access report, data dictionary and client editing guide.
50. Production response verification and real-browser Wix preview checks.

Final verification on September 12, 2026: `astro check` reported zero diagnostics;
all 37 automated CMS, access, migration and rich-text tests passed; the Astro build,
production-response verifier and Wix build passed. The final Wix preview returned 200
for all eight public index pages and a real 404 for an unpublished/unknown event slug.
At 1440px, 768px and 390px it had no horizontal overflow or broken images; the mobile
menu opened with Space and closed with Escape, and reduced-motion behavior remained
enabled. The read-only live validator reported the seven known issues on the five older
published records and performed zero mutations.

All implementation belongs only on `wix-headless-migration`. It is not merged to
`main`, and the branch must never be force-pushed.

## Exact next action at the CMS review gate

1. In the Wix dashboard, review the 30 draft records and publish only the records whose
   copy, relationships and provenance have been approved.
2. Complete the seven validator errors on the five earlier published records: add the
   missing approval timestamps and the two page hero titles. This project does not
   expose safe API-created revisions for those already-published items, so use the Wix
   dashboard and publish the corrections deliberately.
3. Add verified regions, biographies, symbols, garments, stories, press resources,
   partnership descriptions and contact channels as drafts when source material exists.
4. Approve solid web values for the 12 edition colours, enter an accessible label colour,
   and have a developer verify at least 4.5:1 contrast before publishing those records.
5. Run `npm.cmd run cms:validate` before publication, then verify the Wix preview after
   the intended records are published.
6. Keep the frontend unreleased until the client approves the CMS review gate. Forms,
   commerce, domain changes and ownership changes remain outside this phase.
