# Approved-content CMS migration inventory

This inventory records which hardcoded frontend content may enter Wix CMS through
the approved-content seed. It is a migration control document, not public website
copy. The seed is intentionally smaller than the current frontend because existing
review copy and layout scaffolding are not evidence of client approval.

## Classification rules

| Classification | Meaning | Migration action |
|---|---|---|
| Approved client-supplied | Explicitly supplied or approved by the client in the project conversation or supplied source artwork. | Include in the allowlisted seed as a draft. |
| Structural UI | Interface wording needed to operate or understand the template. | Keep in code unless the client has explicitly chosen it as editable content. |
| Review placeholder / unverified | Draft prose, specimen content, sampled values, unconfirmed links or working editorial assumptions. | Exclude from the CMS seed. |
| Missing | Required content that has not been supplied. | Leave empty; create no invented substitute. |

## Approved client-supplied content included in the seed

| Source | Content | CMS destination |
|---|---|---|
| `headless/src/data/site.ts` and client approval | Site name `The Pan-African Fabric` and tagline `One Fabric. Many African Stories.` | `SiteSettings`; home `Pages` record |
| Client-supplied revised navigation guide and `headless/src/data/navigation.ts` | About; Edition One; Events; Stories; Shop; Press & Contact; Partner With Us, their routes, order and highlighted primary action | Navigation fields on `Pages` |
| Client-supplied `COLOURS AND COUNTRY.png` and `headless/src/data/colours.ts` | Twelve colour names, source order and country assignments | `EditionColours`; minimal `Countries`; minimal `Editions` |
| Client event message and `headless/src/data/events.ts` | Exact event title, date, time, venue and location; subsequently confirmed Eastern time instants | `Events` |
| Existing verified Wix CMS records | Home hero reference `media-home-hero-pan-african-fan`; founder portrait reference `media-founder-shiri-achu` | Home `Pages.heroAsset`; founder `PageSections.mediaAsset` |

The seed does not recreate or upload the two media items. Apply mode first verifies
that both published dependency records exist on the Headless site.

## Structural UI retained in code

| Source areas | Examples | Reason |
|---|---|---|
| `headless/src/components/` | Skip link, menu toggle labels, breadcrumbs, empty-state mechanics, media fallbacks | Accessibility and component behaviour must remain stable. |
| Route templates in `headless/src/pages/` | Section landmarks, card labels, previous/next controls, countdown units, `404` presentation | These describe the interface and template structure. |
| `headless/src/data/navigation.ts` | Anchor-level wayfinding such as `Origin`, `Next event` and `All stories` | These can remain structural until the client explicitly requests section-menu editing. |
| Client-supplied navigation guide | Contextual menu roles such as `The why` and `Professional access` | The current CMS navigation contract is page-based and has no dedicated role field; these remain structural UI copy. |
| `headless/src/data/site.ts` | Fast-fact labels and review-only `noindex` setting | These serve the current review build and are not part of the approved factual seed. |

## Review placeholders and unverified material excluded

| Source | Excluded content | Reason |
|---|---|---|
| `headless/src/data/review-copy.server.ts` | Homepage, About, Edition One, Events, Press and other draft introductions | The file explicitly marks this copy as review-only. |
| `headless/src/data/review-fixtures.server.ts` | Specimen stories, products and media positions | These are layout fixtures rather than approved content. |
| `headless/src/data/stories.ts` and `headless/src/data/shop.ts` | Story/product specimens and availability language | No approved story body, product, price, inventory or fulfilment record exists. |
| `headless/src/data/colours.ts` | Sampled hexadecimal values, measured contrast metadata and CSS variables | The source image uses gradients; samples are screen-review values, not approved colour specifications. |
| `headless/src/data/countries.ts` | Region relationships, especially the working Cameroon placement | The regional grouping is still flagged for founder confirmation. |
| `headless/src/data/site.ts` | Instagram URL, founder-site URL and contact-channel descriptions/addresses | Public destinations and public-use permission remain unverified. |
| `docs/phase-1/copy-deck.md` | Definition, introductions, section prose, future-edition claims and Smithsonian contextual framing | The document labels these as drafts or approval-dependent. |
| Route files under `headless/src/pages/` | Hardcoded promotional paragraphs, partnership descriptions, event-format prose, press language and shop positioning | Implemented presentation copy is not by itself evidence of editorial approval. |

## Missing content deliberately left empty

- Founder biography and quotation
- Country introductions, interpretations and participation summaries
- Symbol names, meanings, origins, acknowledgements and artwork
- Designer names, biographies, statements, portraits and verified links
- Garment descriptions, techniques, imagery and credits
- Event overview, programme, admission, accessibility, participants, tickets and official URL
- Stories, author credits and story imagery
- Press releases, press kit, approved coverage and downloadable assets
- Public contact addresses and response commitments
- Partnership descriptions and enquiry destinations
- Products, prices, inventory, variants, fulfilment and commerce identifiers
- Copyright holders, photographers and any additional media-rights claims
- Canonical production origin and production robots policy

## Draft-only execution contract

The migration runner is offline and read-only by default. Its dry-run output lists
every proposed record and reports zero writes. Apply mode requires all of:

```powershell
node scripts/cms/migrate-approved-content.mjs --apply --confirm-draft-write --site 6dabfd00-04c6-4f6f-8282-fb56b240c160
```

Apply mode checks `headless/wix.config.json`, rejects the Editor site ID, verifies
the collection schemas and admin-only write permissions, verifies the two published
media dependencies, and completes a conflict preflight before its first write.
Every write uses `_publishStatus: DRAFT`. The runner contains no publication call.
The seed deliberately omits `approvedAt`; the later publication validator must not
treat seed preparation as final editorial approval.

Existing non-empty editorial values are never overwritten. A difference between a
seeded fact and an existing draft or published record stops the run for human review.
Repeated runs reuse the same collection/item IDs and preserve additional CMS fields.

Apply mode ran against the allowlisted Headless site on September 12, 2026. It created
30 draft records and performed zero publication operations. The existing published
home page, About page and founder section were preserved instead of overwritten; the
two existing Media assets were reused. The migration did not upload media, release
the frontend or publish any seeded content.
