# Editorial CMS specification

Logical model only. No Wix collections have been created. Field types below describe the intended Wix CMS mapping; validate exact API payloads against Wix documentation when Phase 2 is authorized.

## Publication and permissions

Eight public editorial collections hold approved public content only. Owner/content-editor roles may write; visitors may read approved public records. Private approval notes, contacts, contracts, embargoed files and unverified copy remain in an owner-only editorial workspace, not public collections.

A `status` field or a dataset filter is NOT an access-control boundary. Do not put private/draft records in a visitor-readable collection and assume `status = published` hides them. In Phase 2 choose a tested publication mechanism: either Wix-supported item visibility with verified direct-read protection, or promote only approved snapshots from private storage to public collections. Until selected and tested, keep draft collections owner-only. Frontend filtering alone is insufficient.

All public records: immutable internal ID; title (text); stable slug (text); summary (text); displayOrder (number); approvedAt (date/time); sourceVersion (text). Keep approval evidence privately. Unique slugs must be checked on promotion. Validate related records and asset permissions before public writes. Route changes require a redirect decision.

## Collections

| Collection | Fields beyond shared fields | Relationships and rules |
|---|---|---|
| Editions | year:number; editionStatus:text; statement:rich text; heroAsset:reference | Countries are queried by edition; relatedEvents:multi-reference Events. Status describes upcoming/current/archive, not security. |
| Countries | countryName:text; regionLabel:text; introduction:rich text; interpretation:rich text; participationSummary:rich text | edition:Editions; principalDesigner:Designers; featuredSymbol:Symbols; heroAsset:MediaAssets; relatedEvents:multi-reference Events. One record represents a country in an edition; unique edition+country key. |
| Symbols | approvedName:text; meaning:rich text; origin:text; acknowledgement:text; publicSourceUrl:URL | artworkAsset:MediaAssets; Countries reference Symbols. Do not infer cultural meanings. |
| Designers | displayName:text; studioName:text; professionalTitle:text; biography:rich text; statement:rich text; location:text; professionalUrl:URL; socialUrl:URL | portraitAsset:MediaAssets. Country/edition participation belongs to Countries; the same person can appear in later editions without duplicated biographies. |
| Garments | lookNumber:text; description:rich text; technique:text; publicCredits:rich text | designer:Designers; country:Countries; edition:Editions; heroAsset:MediaAssets; galleryAssets:multi-reference MediaAssets; appearances:multi-reference Events. |
| Events | eventType:text; startDate:date; endDate:date; startTimeLocal:text; timezone:text; venue:text; city:text; countryName:text; eventStatus:text; overview:rich text; officialUrl:URL; publicPartnerCredits:rich text | heroAsset:MediaAssets; galleryAssets/resources:multi-reference MediaAssets; countries:multi-reference Countries; designers:multi-reference Designers. Unknown time stays null, never midnight. |
| MediaAssets | filename:text; assetType:text; image:image or document:document or video:video; alt:text; caption:text; date:date; location:text; creator:text; copyrightHolder:text; creditLine:text; usageTerms:text; downloadAllowed:boolean; downloadLabel:text; focalX:number; focalY:number | Separate permitted display asset from approved downloadable original. Exclude embargoed/private assets entirely. Focal coordinates normalized 0..1; unknown metadata blocks publication where required. |
| Stories | headline:text; excerpt:text; body:rich text; authorCredit:text; storyDate:date | heroAsset:MediaAssets; countries/designers/events:multi-reference corresponding collections. Reserve schema; archive population outside launch unless selected spotlight material is ready. |

## Creation and reference sequence

1. Create all approved collection schemas privately, then establish references.
2. Prepare media records, symbols, designers and the edition.
3. Prepare country participation records and garments.
4. Prepare events; connect both event participants and country related-event references as needed.
5. Validate references, permissions, required fields and public assets before promotion.

Wix multi-reference relationships require dedicated reference operations; do not assume arrays in an item write establish them. Do not modify WixForms, Members or Locations managed collections.

## Launch validation

- Exactly nine Edition One country participation records, each with one principal designer.
- Principal designer remains clearly distinguished from competition entrants.
- Every country meets the minimum package in `content-inventory.json`.
- Every garment/image has appropriate model/photographer/production credits.
- Every public image has meaningful alt text unless it is genuinely decorative; captions and alt text serve different purposes.
- Event program type accurately says showcase within Community Day. No invented time, attendance or institutional endorsement.
- Download controls appear only for current, approved, downloadable assets.
- Test direct visitor queries and item URLs, not only rendered lists, before declaring draft/private content protected.

## Rendering contract

Country page reads one country by edition+slug, then its designer, symbol, hero and ordered garments. Related modules query approved event/story references. Homepage uses the same country records, not copied country text. Media downloads use MediaAssets metadata. Missing approved country packages block complete launch; do not quietly publish empty profiles to satisfy the nine-card grid. Country and designer templates may be built with unpublished fixtures for review, never fake public biographies.

## Dynamic URLs

Launch country URL: `/edition-one/{country-slug}`. Store internal edition/country identity separately from that presentation URL. Future editions can use their own prefix. Event URL: `/exhibitions/{event-slug}`. Standalone `/designers/{designer-slug}` pages are deferred; records exist now for future reuse. Native dynamic-page creation and dataset wiring remain Editor work.
