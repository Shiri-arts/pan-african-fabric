# Page-by-page content and media proposal

**Project:** The Pan-African Fabric
**Purpose:** Editorial and CMS review before implementation
**Prepared:** 13 September 2026
**Implementation status:** Reviewed and approved for implementation on 13 September 2026. Subsequent corrections remain part of the review process.

## 1. Review method

This proposal maps content to every section currently present in the Astro frontend. It uses the supplied press kit, official press and media guide, cultural reception invitation, image collection, approved navigation guide, existing Phase 1 documents, and the CMS records already created.

Each proposed item has one of these statuses:

- **Source-backed:** wording or facts already occur in supplied project material. Normal punctuation and web formatting may still need review.
- **Editorial proposal:** new connective copy proposed for the website. It must be approved or revised before publication.
- **Relationship proposal:** an existing CMS record or media asset is proposed for a particular page placement.
- **Confirmation required:** the source set does not establish the fact, attribution, image subject, usage right, or final wording sufficiently.

The source files remain read-only. File names below identify the originals; implementation should use their corresponding Wix `MediaAssets` records.

## 2. Site-wide content

| Placement             | Proposed content or asset                                                                                                      | CMS destination                                 | Status                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------- |
| Header identity       | **THE PAN-AFRICAN FABRIC**                                                                                               | `SiteSettings.siteName`                       | Source-backed                                                             |
| Primary navigation    | About; Edition One; Events; Stories; Shop; Press & Contact; Partner With Us                                                    | `Pages.navigationLabel`, order and visibility | Source-backed from approved navigation guide                              |
| Primary CTA           | **Partner With Us**                                                                                                      | Partner page navigation highlight               | Source-backed                                                             |
| Site tagline          | **One Fabric. Many African Stories.**                                                                                    | `SiteSettings.tagline`                        | Source-backed                                                             |
| Footer statement      | **A contemporary cultural initiative connecting African stories through textile, art, fashion, education and exchange.** | `SiteSettings.footerStatement`                | Editorial proposal                                                        |
| Footer creator credit | **Created by Shiri Achu.**                                                                                               | Footer section/settings field                   | Source-backed                                                             |
| Instagram             | `@thepanafricanfabric`                                                                                                       | `SiteSettings.instagramUrl`                   | Source-backed handle; destination URL should be verified                  |
| Founder website       | `www.shiriachuart.com`                                                                                                       | `SiteSettings.founderSiteUrl`                 | Source-backed                                                             |
| Default social image  | The Pan-African Fan image                                                                                                      | `SiteSettings.socialShareAsset`               | Relationship proposal; use`The Pan-African Fan.jpg`/existing hero asset |

## 3. Home page `/`

### Hero

| Field         | Proposal                                                                                                                                                                                                                 | Status                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Eyebrow       | **An international cultural initiative**                                                                                                                                                                           | Editorial proposal aligned with supplied description |
| H1            | **The Pan-African Fabric**                                                                                                                                                                                         | Source-backed                                        |
| Tagline       | **One Fabric. Many African Stories.**                                                                                                                                                                              | Source-backed                                        |
| Introduction  | **Created by artist and architect Shiri Achu, The Pan-African Fabric is a contemporary cultural initiative that brings African symbols, textile, fashion, education and cultural exchange into one shared story.** | Editorial condensation of source-backed material     |
| Primary CTA   | **Explore Edition One** → `/edition-one`                                                                                                                                                                        | Source-backed intent                                 |
| Secondary CTA | **The inaugural showcase** → confirmed event page                                                                                                                                                                 | Source-backed intent                                 |
| Hero image    | `The Pan-African Fan.jpg`                                                                                                                                                                                              | Already approved and connected; retain               |
| Meta labels   | **12 colours · 9 countries · 5 regions**                                                                                                                                                                         | Source-backed                                        |

### Section 01 — Edition One

- **Heading:** **One fabric. Nine countries.**
- **Introduction:** **Edition One brings together designers representing Cameroon, the Central African Republic, Egypt, Ethiopia, Ghana, Kenya, Morocco, Nigeria and South Africa. Each designer interprets the same Pan-African textile through a distinct cultural and creative perspective.**
- **Content:** Render the nine published country cards with their assigned country colours and principal designers.
- **Image treatment:** Use colour-led country tiles until a verified image has been assigned to each country. Do not reuse unrelated event photography as country imagery.
- **CMS:** `PageSections(home, edition-one)` for heading/body; `Countries`, `EditionColours`, `Designers` for cards.
- **Status:** Heading and roster are source-backed; introduction is an editorial synthesis.

### Section 02 — Designers

- **Heading:** **One fabric, interpreted nine ways.**
- **Body:** **Meet the designers shaping Edition One and discover how a shared textile becomes nine individual fashion interpretations.**
- **CTA:** **Meet the designers** → `/edition-one#designers`.
- **Supporting image:** `67329f2b-6d3a-4a7b-a34c-8f68e30d4183.jpg`, the documented inaugural dress by Muks’ Couture.
- **CMS:** `PageSections(home, designers)`; connect `mediaAsset` to the dress image.
- **Status:** Designer premise and dress relationship are source-backed; body is editorial proposal.

### Section 03 — Stories

- **Heading:** **The living voice of the initiative.**
- **Body:** **Read reflections, poems and records from the people and moments shaping The Pan-African Fabric.**
- **Content:** Show the three most recent published stories with their actual artwork.
- **CTA:** **Go to Stories** → `/stories`.
- **CMS:** `PageSections(home, stories)` plus `Stories` query.
- **Status:** Editorial proposal; story titles, authors and artwork are source-backed.

### Section 04 — Partner With Us

- **Heading:** **Bring the fabric to your city.**
- **Body:** **Museums, embassies, universities, sponsors, cultural organisations, designers and future hosts can help shape where this initiative goes next.**
- **Primary CTA:** **Partner With Us** → `/partner-with-us`.
- **Secondary CTA:** **Press and contact** → `/press-contact`.
- **Image:** `OBP05905.jpg` as the preferred public-programme image; alternatives `OBP05927.jpg` or `OBP06356.jpg` after visual and credit review.
- **Credit:** Olga Barkar, based on embedded EXIF; public credit format and reuse permission require confirmation.
- **CMS:** `PageSections(home, partner)` with `mediaAsset`.
- **Status:** Collaborator list is source-backed; sentence is editorial proposal; image relationship requires approval.

### Edition One at a glance

- Keep the factual summary **12 colours · 9 countries · 5 regions**.
- CTA: **Explore Edition One**.
- CMS: values should be calculated from published records rather than entered as separate copy.

## 4. About page `/about`

### Hero

| Field            | Proposal                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Status                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Eyebrow          | **About**                                                                                                                                                                                                                                                                                                                                                                                                                                          | Approved navigation language                                                        |
| H1               | **The why behind the fabric.**                                                                                                                                                                                                                                                                                                                                                                                                                     | Editorial proposal consistent with approved menu role                               |
| Introduction     | Use the first paragraph of the approved initiative introduction:**The Pan-African Fabric is the first contemporary Pan-African textile intentionally designed to unite authentic cultural symbols from across North, East, West, Central and Southern Africa into a single shared fabric. Founded by artist and architect Shiri Achu, the initiative celebrates African unity through culture, creativity, collaboration and cultural diplomacy.** | Source-backed, lightly formatted for web review                                     |
| Hero image       | `SHIRI ACHU WITH COLOUR BLOCK 2.JPG`                                                                                                                                                                                                                                                                                                                                                                                                                   | Relationship proposal; visually links founder, colour system and initiative         |
| Alternative hero | `Colour board.jpg`                                                                                                                                                                                                                                                                                                                                                                                                                                     | Relationship proposal if the founder image remains exclusive to the founder section |
| Meta             | **12 colours · 9 countries · 5 regions**                                                                                                                                                                                                                                                                                                                                                                                                         | Source-backed                                                                       |

### Section 01 — Origin

- **Heading:** **Why this initiative exists.**
- **Body proposal:** **The Pan-African Fabric began with a desire to create a shared contemporary textile that could hold distinct African cultural stories together. Its colour palette grew from Long Live the Art of Service (LLTAOS), Shiri Achu’s 2023 creative initiative exploring twelve colours as symbols of service, purpose and human values. Those colours became the foundation of a fabric where symbolism and storytelling meet.**
- **Image:** `Colour board.jpg` or `COLOUR CHAT2.png` as a supporting visual.
- **CMS:** `PageSections(about, origin)`.
- **Status:** Source-backed synthesis; verify the preferred spelling and display of LLTAOS.

### Section 02 — Mission and vision

- **Heading:** **What it sets out to do.**
- **Body proposal:** **The initiative uses art and fashion to celebrate the richness and diversity of African cultures, strengthen connections across the continent and its global diaspora, and create opportunities for cultural dialogue, education and international collaboration.**
- **CMS:** `PageSections(about, mission)`.
- **Status:** Source-backed condensation.

### Section 03 — How it works

- **Heading:** **How the initiative is made.**
- **Body proposal:** **The platform brings together artists, fashion designers, museums, embassies, educational institutions, cultural organisations and communities through exhibitions, workshops, designer competitions, educational programmes, public engagement and creative collaboration. For Edition One, designers representing nine countries interpret one shared textile through their own cultural perspectives, creative visions and craftsmanship.**
- **Image:** `Bukum workshop.JPG` for community participation, subject to confirmation of its event and subjects.
- **CMS:** `PageSections(about, model)`.
- **Status:** Source-backed synthesis; image relationship requires confirmation.

### Section 04 — Founder

- **Eyebrow:** **04 — The founder**
- **Heading:** **The creator.**
- **Portrait:** Existing approved `SHIRI ACHU.png` founder portrait.
- **Quote:** Use the exact attributed founder quote already extracted from the official media guide. Do not paraphrase it inside quotation marks.
- **Biography:** Use the approved founder biography already stored in the founder section, with paragraph breaks preserved.
- **CMS:** Existing `PageSections(about, founder)`; verify `quoteText`, `quoteAttribution`, `body` and `mediaAsset` all render.
- **Status:** Source-backed and already present; frontend rendering relationship requires validation.

### Section 05 — Milestones

Replace the three placeholder timeline rows with these source-backed milestones:

1. **2023 — Long Live the Art of Service (LLTAOS):** twelve colours explored as symbols of service, purpose and human values.
2. **April 2025 — Official launch:** The Pan-African Fabric Initiative officially launched at the Embassy of the Republic of Cameroon in Washington, D.C.
3. **2025–2026 — Creative programmes:** workshops, designer competitions, exhibitions and public programmes expanded the initiative across Africa and the United States.
4. **26 September 2026 — Inaugural showcase:** nine designers representing nine African countries present Edition One at the Smithsonian National Museum of African Art.

- **Images:** Use a restrained gallery drawn from `OBP*.jpg` for the official launch and `Bukum workshop.JPG`/`Photo Feb 13 2026, 9 52 41 AM.jpg` for workshops, only after event-to-image confirmation.
- **CMS recommendation:** A reusable milestone collection would offer maximum client control. For Phase 1, structured milestone rows may be stored in a dedicated `Milestones` collection rather than a single rich-text field.
- **Status:** Dates and general claims are source-backed; the 2025–2026 grouping needs editorial approval.

## 5. Edition One page `/edition-one`

### Hero

- **Eyebrow:** **Edition One**
- **H1:** **One fabric. Nine countries.**
- **Lead:** **Nine countries. Five regions. One shared visual language.**
- **Introduction:** **Edition One brings together creative voices from Cameroon, the Central African Republic, Egypt, Ethiopia, Ghana, Kenya, Morocco, Nigeria and South Africa. Explore the designers, cultural symbols and fashion interpretations behind each contribution.**
- **Hero image:** `Symbols and meanings.jpg` as the preferred wide editorial crop.
- **Alternative:** `Screenshot 2024-09-25 142025.jpg` if it provides a cleaner fabric view at wide aspect ratio.
- **CMS:** `Pages(page-edition-one)` hero and introduction.
- **Status:** Roster and premise are source-backed; presentation wording is editorial proposal.

### Section 01 — The fabric

- **Heading:** **A single cloth, carrying twelve colours.**
- **Body:** Use `Editions.fabricDescription` followed by `Editions.colourNarrative`.
- **Image:** `FAN.png` or `The Pan-African Fan.jpg` as a product-scale fabric detail; avoid duplicating the home hero if possible.
- **CMS:** `PageSections(edition-one, the-fabric)` plus Edition record.

### Section 02 — The twelve colours

- Keep the twelve source colour labels and country relationships.
- Add section body: **The palette connects twelve colours to the nine countries represented in Edition One. These screen values support the website presentation; they are not production or print colour specifications.**
- Show `COLOUR CHAT2.png` below or beside the accessible HTML colour grid as the supplied source graphic.
- CMS: `EditionColours` plus `PageSections(edition-one, colours)`.

### Section 03 — Five regions

- Heading: **Nine countries, grouped across five regions.**
- Body: **Edition One brings North, East, West, Central and Southern Africa into one shared creative conversation.**
- Content: Render five region groups and their related countries.
- CMS: `Regions`, `Countries.region`, `PageSections(edition-one, regions)`.

### Section 04 — Countries

- Heading: **Nine countries. Nine interpretations.**
- Body: **Open each country profile to explore its colours, symbols, designer and contribution to Edition One.**
- Content: nine country cards.
- CMS: `Countries`, `EditionColours`, `PageSections(edition-one, countries)`.

### Section 05 — Designers

- Heading: **One fabric, interpreted nine ways.**
- Body: **Fashion designers representing each participating country interpret The Pan-African Fabric through their own cultural perspective, creative vision and craftsmanship.**
- Content: the nine `Participations` joined to their `Designers` and `Countries`.
- CMS: `Participations`, not an unqualified designer list, so country representation remains accurate.

### Section 06 — Creative process

- Heading: **From cloth to finished garment.**
- Body: use `Editions.creativeProcess`.
- Supporting media sequence: `Styling the Tie.jpg`, `2.jpg`, `3.jpg`, `7.jpg`, `8Florence.jpg`, and `IMG_6999.jpg` as candidate process/editorial images.
- Do not assign captions, subjects or sequence labels until the client identifies what each photograph shows.
- CMS: `PageSections(edition-one, process)` and a media gallery relationship.

### Section 07 — Garments and accessories

- Heading: **The finished work.**
- Lead garment: **This inaugural Pan-African Fabric dress**, designed by Muks’ Couture.
- Hero: `67329f2b-6d3a-4a7b-a34c-8f68e30d4183.jpg`.
- Supporting candidates: `DSC_0737.JPG`, `IMG_8963.jpeg`, `IMG_9007.jpeg` after subject/design attribution is confirmed.
- Shop crossover: The Pan-African Fan can appear as an accessory, but should remain clearly labelled as a shop/editorial item rather than a designer garment.
- CMS: `Garments`, `ShopItems`, `PageSections(edition-one, garments)`.

## 6. Country pages `/edition-one/[country]`

Use one consistent template for all nine countries. Each page needs the following populated sections:

| Section                 | Proposed source                                                                                                | CMS fields/relationships                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Hero                    | Country name, region and its first assigned Edition One colour; verified country/designer image when available | `Countries.heroAsset`, `region`, `EditionColours`      |
| Introduction            | A concise country participation summary derived from the supplied designer statement                           | `Countries.introduction`, `participationSummary`         |
| Colours                 | Published country-linked colour records                                                                        | `EditionColours.country`                                   |
| Featured symbol         | Published source name and exact meaning                                                                        | `Countries.featuredSymbol` → `Symbols`                  |
| Designer                | Principal designer identity and supplied statement                                                             | `Countries.principalDesigner`; `Participations.designer` |
| Creative interpretation | Exact supplied participation statement                                                                         | `Participations.statement`                                 |
| Garments                | Only garments actually related to this participation                                                           | `Garments.participation`                                   |
| Related experience      | Events explicitly connected to the country/designer                                                            | Event multi-reference relationships                          |
| Credits                 | Named photographers, models, makers and partners only when supplied                                            | `Countries.credits`, media credits                         |

### Country-specific proposed content spine

| Country                  | Region          | Principal designer                 | Colours          | Featured symbol(s)                  | Image recommendation                                                                        |
| ------------------------ | --------------- | ---------------------------------- | ---------------- | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| Cameroon                 | Central Africa  | Muks’ Couture                     | Dark green; Blue | Double Bell; Toghu                  | Inaugural dress image for garment section; do not use it as generic country history imagery |
| Central African Republic | Central Africa  | Diana-Melissa Ngoumape             | White            | Kuba pattern                        | Await identified designer/garment photography                                               |
| Egypt                    | North Africa    | MOJA Design Studio                 | Orange           | Eye of Horus                        | Await identified designer/garment photography                                               |
| Ethiopia                 | East Africa     | YYASMINA STAR                      | Mint green       | Traditional Ethiopian pattern       | Await identified designer/garment photography                                               |
| Ghana                    | West Africa     | Afua Sam / Studio D’Maxsi         | Pink; Purple     | Nkonsonkonson; Boa Me Na Me Mmoa Wo | Await identified designer/garment photography                                               |
| Kenya                    | East Africa     | Amos Onyango / LAWY Afrik          | Red              | Maasai Shuka pattern                | Await identified designer/garment photography                                               |
| Morocco                  | North Africa    | Naima El Messaoudi / Caftan Joujou | Black            | Amazigh diamond                     | Await identified designer/garment photography                                               |
| Nigeria                  | West Africa     | Goody’s Stitches                  | Hot pink         | Northern knot                       | Await identified designer/garment photography                                               |
| South Africa             | Southern Africa | Fatima Barnes                      | Yellow; Green    | Shwe-shwe pattern; Zulu shield      | Await identified designer/garment photography                                               |

The supplied source set does not reliably identify the people, garments or countries in most standalone photographs. Those images should stay in the media library until the client supplies an identification sheet. Colour-and-symbol heroes are preferable to incorrect photographic attribution.

## 7. Events landing page `/events`

### Hero

- **H1:** **Where it happens.**
- **Introduction:** **Follow The Pan-African Fabric through exhibitions, workshops, designer competitions, cultural receptions and public programmes. Discover the inaugural showcase and the moments that have shaped the initiative.**
- **Hero image:** `OBP05905.jpg` or `OBP05927.jpg`, subject to confirmation that it depicts the official launch/public programme.
- **CMS:** `Pages(page-events)`.

### Featured event

- Feature **The Inaugural Pan-African Fabric & Fashion Showcase**.
- Date/time: **Saturday, September 26, 2026 · 1:00 PM–5:00 PM ET**.
- Venue: **Smithsonian National Museum of African Art, Washington, D.C.**
- Hero image proposal: the supplied showcase/reception invitation artwork until an official event photograph exists.
- CMS: `Events.featured`, `heroAsset`, event detail fields.

### Upcoming events

- Display only events with a confirmed future date and `isConfirmed = true`.
- Provisional or date-less records should not appear under “Upcoming.” They may appear in an “Initiative journey” archive if their historical date is verified.

### Formats

Populate the six existing cards:

1. Exhibitions — presentations of the fabric and finished garments.
2. Workshops — practical sessions with designers, students and communities.
3. Competitions — calls and design competitions supporting country participation.
4. Receptions — openings and cultural gatherings.
5. Talks — conversations about textile, design and cultural exchange.
6. Travelling presentations — bringing the initiative to new cities and venues.

Use `PageSections(events, formats)` for the heading/body. If the client needs to edit each card independently, create an `EventFormats` collection or use `PartnershipOptions` only after renaming it to a genuinely reusable taxonomy.

### Archive

- Populate verified historical records: official launch, Africa With Love, International Women’s Day workshop, and Fashioning Power, Fashioning Peace.
- Assign `OBP*.jpg` to the official launch gallery and the workshop candidates to their correct events only after identity confirmation.

## 8. Event detail pages `/events/[slug]`

Every event page should populate:

- Hero image and image credit.
- Event title, date, time, timezone, venue and location.
- Overview.
- Programme.
- Admission and accessibility information.
- Official URL or attendance URL.
- Partner credits.
- Country, designer and participation relationships.
- Gallery and downloadable resources.
- Post-event account and verified coverage after the event.

### Inaugural showcase page

- Use the exact supplied event details and programme already stored.
- Proposed hero: invitation artwork or `The Pan-African Fan.jpg` as a temporary campaign visual.
- Resource: cultural reception invitation PDF, once download permission is approved.
- Attendance/accessibility: leave absent until supplied by the venue or client.

### Cultural reception page

- Use the invitation’s exact title, date, venue, admission and partner wording.
- Hero/resource: reception invitation PDF artwork.
- Avoid merging the reception and Smithsonian showcase into one event; connect them as related events.

## 9. Stories landing page `/stories`

### Hero

- **H1:** **The living voice.**
- **Introduction:** **Stories, poems, reflections and milestones from the people and programmes shaping The Pan-African Fabric.**
- **Hero image:** `IMG_6999.jpg` as a candidate editorial image, pending subject and credit confirmation; safer alternative is a composite-free crop of one supplied poem artwork.

### Story index

- Heading: **Everything published so far.**
- Body: **Browse initiative milestones and creative writing connected to the fabric’s evolving story.**
- Render all eight published story records.

### Categories

- **Milestones** — documented developments and public presentations.
- **Poetry** — the seven supplied works by Wirndzerem G. Barfee/name variants exactly as credited on each artwork.
- Future categories: Behind the scenes, Country stories, Designer stories, Announcements, Partnerships, Founder reflections, Interviews and Preparation.

## 10. Story detail pages `/stories/[slug]`

### Africa to the World

- Hero: `67329f2b-6d3a-4a7b-a34c-8f68e30d4183.jpg`.
- Body: use the supplied “Africa to the World” milestone paragraph already stored.
- Related country: Cameroon.
- Related designer: Muks’ Couture.
- Related event: Fashioning Power, Fashioning Peace.

### Seven poems

- Use each `POEM*.jpg` as its story hero.
- Preserve each exact title, author spelling and date as shown on its source artwork.
- Add a text transcription to `Stories.body` for accessibility and search only after line breaks, punctuation and author spelling have been verified against the artwork.
- Do not silently standardise the different displayed author forms (`Wirndzerem G.B.`, `Wirndzerem GB`, `Wirndzerem.GB`, `Wirndzerem G. Barfee`).
- Related records should be added only where the poem itself or supplied documentation establishes the relationship.

## 11. Shop landing page `/shop`

### Hero

- **H1:** **Own a piece of the story.**
- **Introduction:** **Explore approved objects and special editions that carry The Pan-African Fabric beyond the exhibition space. Each piece remains connected to the initiative and its story.**
- **Hero image:** `FAN.png` or `The Pan-African Fan.jpg`.

### Collection

- Heading: **Published pieces.**
- Show **The Pan-African Fan** as the current editorial item.
- Do not show price, stock, purchase or checkout controls until commerce details are supplied and approved.

### What the shop will carry

Proposed categories:

- The Pan-African Fan.
- Approved garments and accessories.
- Future digital or special editions.

Mark all future categories as “coming later” rather than implying availability.

## 12. Shop item `/shop/the-pan-african-fan`

- **Title:** The Pan-African Fan.
- **Hero/gallery:** `The Pan-African Fan.jpg` plus `FAN.png` if both show distinct useful views.
- **Story proposal:** **The Pan-African Fan brings the fabric’s colour, pattern and shared visual language into a functional object connected to Edition One.**
- **Edition relationship:** Edition One.
- **Availability:** Details forthcoming.
- **Commerce:** disabled until price, currency, stock, fulfilment, returns and legal details are supplied.
- **Status:** Title, imagery and edition relationship are source-backed; product story is editorial proposal.

## 13. Press & Contact `/press-contact`

### Hero

- **H1:** **Professional access.**
- **Introduction:** **Find approved information, releases, media resources and contact routes for The Pan-African Fabric. Please retain the supplied captions, credits and usage terms when using any asset.**
- **Hero image:** `OBP05746.jpg` as a portrait-format press image or `OBP06404.jpg` as an alternative, pending subject confirmation and Olga Barkar credit approval.

### Fast facts

Populate from source-backed records:

- Founder: Shiri Achu.
- Initiative: The Pan-African Fabric.
- Edition One: 12 colours, 9 countries, 5 regions.
- Official launch: April 2025, Embassy of the Republic of Cameroon, Washington, D.C.
- Inaugural showcase: 26 September 2026, Smithsonian National Museum of African Art.
- Website and Instagram destination after URL verification.

### Releases and statements

Display the four existing `PressItems` records with type, date and summary. Add full body text where the PDFs contain a release intended for public reproduction.

### Approved images and files

Proposed downloads after explicit redistribution approval:

1. Official Press Kit PDF — July 2026.
2. Official Press & Media Guide PDF — August 2026.
3. Showcase and Cultural Reception invitation PDF — September 2026.

Each downloadable record needs exact file size, version, usage notes, download permission and a Wix document relationship.

### Selected coverage

Keep hidden until actual external publication names, headlines, dates and URLs are supplied. Internal press materials are not external coverage.

### Contact

Use the three existing verified channels and make their types explicit:

- General/media email.
- Media telephone.
- Reception/event telephone.

The page should display phone links as `tel:` links and email links as `mailto:` links. Partnership enquiries should link to Partner With Us. A submission form remains disabled until recipient, consent, privacy and spam-protection decisions are approved.

## 14. Partner With Us `/partner-with-us`

### Hero

- **H1:** **Bring the fabric to your city.**
- **Introduction:** **The Pan-African Fabric grows through institutions and people who create space for cultural exchange. Museums, embassies, universities, sponsors, cultural organisations, designers and future hosts are invited to begin a conversation.**
- **Primary CTA:** Start an enquiry.
- **Secondary CTA:** Explore Edition One.
- **Hero image:** `OBP06356.jpg` as a preferred public-engagement image; alternative `Bukum workshop.JPG` for an education-led emphasis. Both require subject/event confirmation.

### Why partner

- **Heading:** **What a partnership makes possible.**
- **Body proposal:** **A partnership can bring the fabric, its designers and its cultural stories into new public settings. Collaborations may support exhibitions, education, creative exchange, designer participation, cultural diplomacy and meaningful engagement with local communities.**
- **Status:** Editorial synthesis of source-backed initiative activities.

### Who we work with

Split the current combined record so the frontend receives seven collaborator records with `optionType = collaborator`:

1. Museums — host exhibitions, collection conversations and public programmes.
2. Embassies — support cultural diplomacy, receptions and international exchange.
3. Universities — develop educational programmes, workshops and research conversations.
4. Sponsors — support production, travel, access and programme delivery.
5. Cultural organisations — co-create programmes and connect local communities.
6. Designers — contribute creative interpretations and future collaborations.
7. Future hosts — bring exhibitions, presentations and events to new cities.

All descriptions are editorial proposals and require approval.

### Ways to collaborate

Create separate `PartnershipOptions` records with `optionType = format`:

- Host an exhibition.
- Develop a workshop or education programme.
- Sponsor an event, journey or production need.
- Build a cultural or institutional partnership.
- Collaborate as a designer.
- Host a talk, reception or travelling presentation.

### Enquiry

Create `PartnershipOptions` records with `optionType = enquiry` matching the form choices. Keep submission disabled until backend routing, consent wording, privacy notice and spam protection are approved. Until then, provide a direct link to the verified public email.

## 15. Media assignment plan

| Asset group                                                                                   | Primary proposed use                                                   | Secondary use                      | Required confirmation                                                     |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------- |
| `The Pan-African Fan.jpg`, `FAN.png`                                                      | Home/shop hero and fan product                                         | Edition fabric detail              | Product credit and whether both images are distinct enough to retain      |
| `SHIRI ACHU.png`                                                                            | Founder portrait                                                       | Press creator resource             | Photographer/credit line                                                  |
| `SHIRI ACHU WITH COLOUR BLOCK 2.JPG`                                                        | About hero                                                             | Colour/origin story                | Photographer, context and preferred crop                                  |
| `Colour board.jpg`, `COLOUR CHAT2.png`                                                    | Origin and colour-system sections                                      | Edition One colour section         | Whether artwork is approved as public explanatory media                   |
| `Symbols and meanings.jpg`, source screenshots                                              | Edition One hero/symbol reference                                      | Press educational resource         | Artwork acknowledgements and public-use permission                        |
| `67329f2b-...jpg`                                                                           | Muks’ Couture garment/story                                           | Cameroon garment section           | Complete garment/photo credit                                             |
| `OBP*.jpg`                                                                                  | Official launch gallery, About milestones, Events/Partner/Press heroes | Home partner block                 | Identify subjects; confirm Olga Barkar public credit and usage permission |
| `Bukum workshop.JPG`, `Photo Feb 13...jpg`, HEIC files                                    | Workshop event galleries and education partnership sections            | About “How it works”             | Exact event, location, subjects, consent and credits                      |
| `Styling the Tie.jpg`, `2.jpg`, `3.jpg`, `7.jpg`, `8Florence.jpg`, `IMG_6999.jpg` | Edition creative-process or story galleries                            | Editorial page heroes              | Identify subject, stage, location and photographer                        |
| `DSC_0737.JPG`, `IMG_8963.jpeg`, `IMG_9007.jpeg`                                        | Garment/event galleries                                                | Country pages after identification | Designer, country, garment, model and photographer                        |
| `POEM*.jpg`                                                                                 | Seven poem heroes                                                      | Stories landing visual             | Exact poem-to-file mapping and publication rights                         |
| Three PDFs                                                                                    | Press downloads and event resources                                    | None                               | Redistribution approval and document upload                               |

## 16. CMS additions and relationship corrections proposed

1. Add the missing `PageSections` records for every section key listed above.
2. Connect every page hero through `Pages.heroAsset`.
3. Connect section images through `PageSections.mediaAsset`; introduce a multi-image section relationship if galleries are required.
4. Add editable milestone records instead of leaving fixed placeholder rows.
5. Split partnership records into `collaborator`, `format` and `enquiry` option types expected by the frontend.
6. Add event-to-media, event-to-country, event-to-designer and related-event relationships.
7. Add story dates, accessible text bodies and supported categories.
8. Add story-to-country, story-to-designer and story-to-event relationships.
9. Add garment supporting media and full credit relationships after identification.
10. Upload the three PDFs as Wix documents only after download permission is approved.
11. Keep commerce disabled until a complete product and fulfilment package exists.
12. Ensure the client can edit page title, eyebrow, hero title, introduction, CTA labels/links, section heading/body, section visibility and section image from Wix CMS.

## 17. Decisions required before implementation

| Decision            | Options for review                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------- |
| About hero          | `SHIRI ACHU WITH COLOUR BLOCK 2.JPG`                                                    |
| Edition One hero    | `Symbols and meanings.jpg`                                                             |
| Events hero         | Select one identified`OBP*.jpg` public-programme photograph                             |
| Stories hero        | `IMG_6999.jpg`                                                                         |
| Press hero          | Select an identified`OBP*.jpg` with approved Olga Barkar credit                         |
| Partner hero        | Identified public-programme`OBP*.jpg`                                                   |
| Country photography | Supply an image-identification sheet before assigning unnamed photographs                 |
| Poem text           | Approve exact transcription, line breaks and displayed author form per poem               |
| PDFs                | Approved public download and usage terms                                                 |
| Contact form        | Approve recipient, privacy notice, consent text and spam protection                       |
| Product commerce    | Supply price, currency, availability, fulfilment, returns and legal terms before enabling |

## 18. Recommended review order

1. Approve or revise the page-level hero image selections.
2. Approve the proposed headings and connective copy.
3. Identify the subjects, events, countries, designers and credits in the unnamed photographs.
4. Approve the country-by-country introductions and participation statements.
5. Approve partnership descriptions and enquiry choices.
6. Approve PDF redistribution and media credits.
7. Convert the accepted rows into a CMS change manifest for final review before implementation.
