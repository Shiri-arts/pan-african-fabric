# Wix CMS client editing and publishing guide

This guide explains how editors maintain **The Pan-African Fabric** website through Wix CMS without editing application code. It covers routine editing, relationships, media rights, approvals, publishing, enquiry handling, quality checks, troubleshooting, and the point at which technical help is required.

## 1. Confirm the correct Wix site

All work in this guide belongs to the separate Wix-managed Headless project:

- **Headless project site ID:** `6dabfd00-04c6-4f6f-8282-fb56b240c160`
- **Quick identity check:** the site ID ends in `c160`
- **Original Editor site ID:** `cf6dc8aa-2320-4c66-b52e-44252adf69f3`

The two Wix sites are independent. Editing one site's CMS does not update the other. A Git branch also does not isolate Wix data: a CMS change affects the Wix project selected in the dashboard.

Before changing content:

1. Open the Wix dashboard.
2. Confirm that the URL or site information shows the site ID ending in `c160`.
3. Open **CMS**, then **Your Collections**.
4. Select the collection named in this guide.
5. Identify the item by its title and stable key or slug.

Stop if the site ID is different and ask the site administrator to verify the project.

## 2. What the client controls

The CMS controls the content supported by the current frontend:

- Page titles, hero text, introductions, metadata and buttons
- Header and footer navigation labels, visibility, order and highlighted action
- Section headings, body copy, quotations, captions and visibility
- Approved hero images, portraits, supporting media and downloads
- Editions, regions, countries, colours, symbols and designers
- Events, stories, press materials, partnerships and public contacts
- Shop editorial descriptions and approved product imagery
- Site identity, tagline, footer copy, copyright and announcements

The frontend code controls fonts, spacing, responsive breakpoints, component structure, animation, menu mechanics, fixed layouts and security rules. CMS values fill supported content positions; they do not create arbitrary new page designs.

## 3. Editorial responsibilities

| Role | Responsibility |
|---|---|
| Editor | Enters approved copy, creates drafts, selects media and checks previews. |
| Content approver | Confirms facts, names, spelling, dates, cultural descriptions and wording. |
| Media-rights approver | Confirms display/download permission, creator, rights holder, credit and terms. |
| Site administrator | Manages Wix access, validation, dependencies, publishing and enquiries. |
| Developer | Changes layouts, fields, relationships, validation, integrations and releases. |

Do not mark assumptions as approved. Record the actual source and approval date.

## 4. Standard content lifecycle

Use this workflow for each material change:

1. **Prepare:** locate the approved source or decision.
2. **Draft:** enter only supported, approved content.
3. **Relate:** connect the correct page, edition, country, designer, event or media.
4. **Record provenance:** complete **Source Version** with the document, revision or dated decision.
5. **Record approval:** complete **Approved At** only after approval is received.
6. **Validate:** have the administrator run the content validator.
7. **Publish dependencies:** publish referenced media and related records first.
8. **Publish the item:** explicitly publish the edited record.
9. **Review:** inspect the Wix-hosted frontend on desktop and mobile.
10. **Correct:** edit and republish the same record rather than creating a duplicate.

The public frontend reads published base collections only. Saving a draft does not make it public. The current project has no protected frontend preview of unpublished revisions.

## 5. Common CMS fields

| Field | Correct use |
|---|---|
| **Title** | Editorial identity; it may also render publicly, depending on the collection. |
| **Slug** | Stable, unique identifier using lowercase letters, numbers and single hyphens. |
| **Summary** | Short version used where the frontend requests compact copy. |
| **Source Version** | Internal provenance; never substitute it for public copy. |
| **Approved At** | Actual approval date/time, not the draft creation date. |
| **Display Order** | Whole number for repeated items; lower values normally appear first. |

Leave spacing between order values, such as 10, 20 and 30, when practical. Do not edit Wix system item IDs, creation dates or update dates.

## 6. Rich-text rules

- Use the Wix rich-text editor for paragraphs, headings, lists and links.
- Paste copied material as plain text, then apply minimal formatting.
- Use separate paragraphs for separate ideas.
- Add links through the editor and test their destinations.
- Review punctuation and accented characters after pasting.
- Never paste scripts, `<p>` tags, HTML, embeds, iframes, custom CSS or page-builder markup.

The frontend sanitizes rich text and unsafe URLs. If literal tags appear publicly, remove them from the CMS field and format the text with Wix controls.

## 7. Page-by-page collection map

Every route has one record in **Pages**. Supporting blocks are **Page Sections** connected to that page.

| Website area | Collections that supply it |
|---|---|
| Home | **Site Settings**, **Pages**, **Page Sections**, **Editions**, **Edition Colours**, **Countries**, **Events**, **Stories**, **Media Assets** |
| About | **Pages**, **Page Sections**, founder **Media Assets** |
| Edition One | **Pages**, **Page Sections**, **Editions**, **Regions**, **Countries**, **Edition Colours**, **Symbols**, **Designers**, **Participations**, **Garments** |
| Events | **Pages**, **Page Sections**, **Events**, related records and **Media Assets** |
| Stories | **Pages**, **Page Sections**, **Stories**, related records and **Media Assets** |
| Shop | **Pages**, **Page Sections**, **Shop Items**, optional Wix Stores products, **Media Assets** |
| Press & Contact | **Pages**, **Page Sections**, **Press Items**, **Contact Channels**, downloadable **Media Assets** |
| Partner With Us | **Pages**, **Page Sections**, **Partnership Options**, private **Enquiries** |

Changing a Page hero title does not automatically change its navigation label, section headings or SEO title. Edit every intended field explicitly.

## 8. Edit a page hero

Open **Pages** and identify the item using **Title** and **Page Key**.

- **Eyebrow:** small contextual label above the heading.
- **Hero Title:** required main page heading.
- **Hero Tagline:** supporting line.
- **Introduction:** longer introductory copy where supported.
- **Hero Meta Labels:** compact facts in supported hero layouts.
- **Hero Asset:** approved Media Asset used in the hero.

Enter calls to action as complete pairs:

- **Primary CTA Label** and **Primary CTA Link**
- **Secondary CTA Label** and **Secondary CTA Link**

Use an internal path such as `/events`, approved `https://`, `mailto:` or `tel:` destination. If no button is needed, clear both fields.

For search metadata:

- Keep **SEO Title** near 60 characters or fewer.
- Keep **SEO Description** near 160 characters or fewer.
- Use an approved **Social Share Asset**.
- Change **Robots** only with SEO/developer guidance.

Do not change **Page Key**, **Path** or **Slug** during routine copy editing. They are stable technical identities and route changes can break frontend lookups and incoming links.

## 9. Edit a page section

Open **Page Sections** and identify the item by **Title**, **Section Key** and parent **Page**.

- Edit **Eyebrow**, **Heading**, **Subheading** and **Body**.
- Maintain founder **Quote Text** and **Quote Attribution** together.
- Use **Caption** only when the connected media requires one.
- Enter **CTA Label** and **CTA Link** together.
- Select an approved **Media Asset** where supported.
- Use **Is Enabled** to hide a section without deleting it.
- Set **Display Order** to a whole number.
- Use only supported **Tone** values: `ivory`, `paper`, `surface` or `ink`.
- Retain the current **Layout Variant** unless a developer confirms another supported value.

Major section sequence is defined by page code. Display Order controls repeated content and records editorial intent, but may not move structurally different sections. Do not casually change **Section Key**, **Section Type** or parent **Page**.

## 10. Edit navigation

Navigation is managed on each destination's **Pages** record:

1. Enter **Navigation Label**.
2. Enable **Navigation Visible**.
3. Set **Navigation Order**; lower numbers appear first.
4. Enter **Footer Navigation Label**.
5. Enable **Footer Navigation Visible** where required.
6. Set **Footer Navigation Order**.
7. Use **Navigation Highlighted** only for the single approved primary action.
8. Publish and check both desktop and mobile menus.

A visible navigation item requires a label, valid path and published Page. New routes, dropdowns and nested menus require a developer.

## 11. Manage site-wide settings

Open **Site Settings**. Normally there is one active record. It controls:

- Site Name, Tagline and Header Identity
- Footer Statement and Copyright Text
- Default SEO title pattern and description
- Instagram and founder-site links
- Announcement text, label, link and enabled state
- Primary Edition and default/social media

Treat **Canonical Origin** as technical configuration. Do not change it during routine editing because it affects canonical URLs and indexing. Enable an announcement only after checking its copy and destination.

## 12. Add or replace media

Wix Media Manager stores the file. **Media Assets** stores public metadata, accessibility text, rights and relationships.

### Upload and register an image

1. Confirm approval for the intended website use.
2. Upload the original approved file to Wix Media Manager.
3. Open **Media Assets** and create a draft or edit the existing record.
4. Select it in **Image**; add **Mobile Image** only when an approved alternative exists.
5. Enter original width, height and aspect ratio.
6. Set focal position and review desktop/mobile results.
7. Add meaningful **Alt Text**, unless **Decorative** is intentionally enabled.
8. Enter caption, creator, copyright holder, credit and usage terms exactly as approved.
9. Use `web-display-approved` only for authorized web display.
10. Use `download-approved` and **Download Allowed** only when public downloading is authorized.
11. Record source and approval.
12. Publish media before records that reference it.

Alt text should state useful visual information in context. A portrait should identify the person; an artwork or garment may need its approved title and concise description. Decorative media should not have competing alt text.

### Replace shared media carefully

Replacing an existing asset affects every record referencing it. Identify all placements, check aspect ratio/focal point, confirm existing alt text and rights still apply, then review every affected page. Create a separate Media Asset when the new file has different rights, credit, crop, purpose or alt text.

### Documents and downloads

1. Upload the approved final document.
2. Register it as a document in **Media Assets**.
3. Record filename, version, size label, usage notes and rights.
4. Set `download-approved` and **Download Allowed** only with explicit permission.
5. Publish the Media Asset.
6. Connect it to **Press Items** and enable that Press Item's download control.

Display permission does not automatically grant permission to distribute the original file.

## 13. Maintain Edition One

### Editions

Use **Editions** for edition-level title, narrative, creative process, dates, status and hero/fabric media. Do not duplicate Edition One merely to revise its copy.

### Regions and Countries

Use **Regions** for the five regional groupings and order. Use **Countries** for a country within an Edition and connect the correct Edition and Region.

### Edition Colours

Each **Edition Colours** record connects an Edition, Country and approved digital colour. Preserve source order.

Before publishing:

1. Confirm the approved solid web colour.
2. Enter **Hex Value** and **Text Hex** as six-digit values such as `#123456`.
3. Have a developer measure and record contrast.
4. Require at least 4.5:1 for normal text.
5. Keep **Large Text Only** off for current labels.
6. Confirm relationships, order and approval date.
7. Run validation.

The supplied gradient artwork is not an exact digital colour specification. The frontend omits incomplete or unsafe colour pairs.

### Symbols

Use **Symbols** only for verified names, meanings, origins, acknowledgements and public sources. Never infer cultural meaning from appearance. Connect approved artwork through Media Assets.

### Designers, Participations and Garments

**Designers** stores a reusable person/studio profile. **Participations** is the authoritative relationship connecting a Designer to an Edition and Country for a particular role. Do not duplicate a Designer for another edition.

**Garments** connects a work to its correct Participation. Its direct Edition, Country and Designer selections must agree with that Participation. Use approved media only.

## 14. Create or edit an event

Before setting **Is Confirmed**, verify:

- Exact event title, start/end time and time zone
- End time follows start time
- Venue, city/location and approved wording
- Official and ticket links
- Admission, accessibility, programme and partner statements
- Edition, country, designer, participation, garment and media relationships

Do not infer unknown details. Leave them empty and keep the Event in draft. After publishing, inspect its listing, detail and countdown because one record may feed all three.

## 15. Create or edit a story

Complete the approved headline, slug, category, excerpt, standfirst, body, author credit, dates, hero/gallery media and verified relationships. Publish dependencies first. Check both listing and detail views after publication.

## 16. Maintain press items

Use **Press Items** only for approved releases, verified coverage, press materials or authorized downloads.

1. Select the correct item type.
2. Enter headline, publication, date and version.
3. Add excerpt, body and usage notes where applicable.
4. Use a verified HTTPS destination for external coverage.
5. Connect a published document Media Asset for downloads.
6. Add an accurate size label.
7. Enable download only when the Media Asset is also download-approved.
8. Connect a verified Event or Story where applicable.
9. Publish and test in a private browser window.

Never relabel planning documents or internal drafts as public press kits.

## 17. Maintain public contacts

Use **Contact Channels** for public addresses and numbers:

- **Channel Key:** stable identity; do not casually change it.
- **Label:** public heading.
- **Description:** purpose.
- **Email Address** or **Phone Number:** approved public contact.
- **Response Note:** approved expectations or instructions.
- **Display Order:** presentation order.

A channel renders only when **Is Enabled** and **Public Use Verified** are both on. Verify the value and permission for public display, test the link, record provenance and publish. To hide it temporarily, disable it and republish rather than deleting it.

## 18. Maintain partnership options

**Partnership Options** controls cards and enquiry choices:

- **Label** and **Description** are public.
- **Option Type** and **Enquiry Value** connect the option to the form.
- **Is Enabled** controls availability.
- **Media Asset** supplies approved media where supported.
- **Display Order** controls order.

Test the form selector after changes. Ask a developer before renaming technical Enquiry Values because existing submissions may use them.

## 19. Review enquiries

The partnership form stores submissions in private **Enquiries**. Visitors may insert a submission but cannot read, update or delete records. Enquiries are operational data and are never published content.

1. Open Enquiries with an administrator account.
2. Sort by creation date.
3. Review enquiry type, contact, organisation, location and message.
4. Treat visitor free text as untrusted input.
5. Follow the approved response and retention process.
6. Limit access to staff who need the data.
7. Never copy personal data into public collections.

Never make Enquiries publicly readable and never publish enquiry records. Email notifications, CRM routing, automated replies, retention automation and third-party spam protection require separate configuration and testing.

## 20. Maintain shop editorial content

Use **Shop Items** for titles, stories, approved imagery, availability wording and relationships. Product images should show the full item.

- Use approved **Hero Asset** and **Gallery Assets**.
- Use **Editorial Story** for the initiative connection.
- Use **Availability Label** for approved status wording.
- Keep **Commerce Enabled** off unless a valid Wix Stores product exists.
- Ensure **Wix Product ID** matches that product.

Wix Stores remains authoritative for price, currency, stock, variants, cart, checkout and transactional fulfilment. Never invent commercial details in Shop Items.

## 21. Relationships and publication order

A public reference should point to a published dependency. Otherwise the frontend may omit it or display an honest empty state.

Important relationships include:

- Page Section → Page and optional Media Asset
- Page → Hero/Social Media Asset
- Country → Edition and Region
- Edition Colour → Edition and Country
- Participation → Edition, Country and Designer
- Garment → Participation and related records
- Event/Story/Press/Shop → media and related content
- Site Settings → Primary Edition and default media

Publish in this general order:

1. Media Assets
2. Editions, Regions, Countries and Designers
3. Edition Colours, Participations and other relationship records
4. Events, Stories, Press Items, Partnership Options and Shop Items
5. Page Sections
6. Pages, especially navigation destinations
7. Site Settings when its global fields or references changed

Use Wix relationship controls for multi-reference fields. Do not paste IDs into ordinary text or array fields.

## 22. Validate before publishing

The administrator runs the read-only validator from the repository:

```powershell
cd headless
npm run cms:validate
```

It checks required fields, provenance, approval, slugs, page keys, routes, URLs, rich text, dependencies, navigation, CTA pairs, event dates, alt text, media rights, download permission, colour contrast, contact verification and commerce links.

Correct every error before publishing. Review every warning. Routine editors should not run schema, migration, seed or bulk-publication scripts.

## 23. Frontend review checklist

### Desktop

- Correct hero, title, tagline and image
- Correct header/footer navigation and order
- Buttons open the intended destinations
- No literal HTML tags
- Readable paragraphs, quotations and lists
- Appropriate media crops or full-product presentation
- Correct captions, credits and downloads

### Mobile

- Menu opens, closes and reaches every visible destination
- Hero copy stays readable
- Names and titles wrap acceptably
- Images retain required subjects and product detail
- Cards retain intended order
- Controls are easy to tap

### Keyboard and accessibility

- Navigate with Tab and Shift+Tab.
- Confirm visible focus.
- Open/close the menu by keyboard.
- Activate buttons/downloads by keyboard.
- Confirm useful alt text for meaningful images.
- Confirm link wording makes sense out of context.

Also review in a private/signed-out window to confirm visitor access rather than administrator-session access.

## 24. Correct, hide, unpublish or delete

- **Correct:** edit and republish the existing record.
- **Hide:** use Is Enabled or the supported visibility control and publish.
- **Unpublish:** check dependent records first, correct their references, then unpublish and review affected pages.
- **Delete:** avoid routine deletion. Ask an administrator to check dependencies because deletion can permanently break relationships.

## 25. Troubleshooting

### A saved change is not visible

- Confirm it was published, not only saved.
- Confirm the site ID ends in `c160`.
- Confirm visibility/Is Enabled is on.
- Confirm the intended relationships.
- Publish media and other dependencies.
- Refresh or use a private window.

### An image does not render

- Publish its Media Asset.
- Confirm Usage Permission allows web display.
- Add alt text or mark it decorative.
- Confirm the page references the Media Asset record, not merely a file URL.

### An image is badly cropped

- Review focal position and source aspect ratio.
- Use an approved mobile alternative if available.
- Full-product display may require a contain-style frontend placement; ask a developer if the current placement is a cover-style hero.
- Do not alter the source file without approval.

### Literal `<p>` tags appear

- Remove literal HTML.
- Paste as plain text into Wix rich text.
- Format using Wix controls, republish and recheck.

### Navigation is missing

- Publish the Page.
- Enable Navigation Visible and add its label.
- Verify its path.
- Ensure only the approved primary action is highlighted.

### A contact is missing

- Enable both Is Enabled and Public Use Verified.
- Populate the correct email/phone field.
- Publish the record.

### A download is missing

- Publish the document Media Asset.
- Confirm `download-approved` and Download Allowed.
- Connect it to the Press Item, enable that item's download and publish it.

### The form renders but no submission appears

- Check Enquiries directly; email notification is not proof of storage unless automation exists.
- Confirm visitor insert remains allowed while read/update/delete remain administrator-only.
- Test valid required fields, consent and normal completion time.
- Ask a developer to inspect Wix requests. Never weaken collection privacy for troubleshooting.

## 26. Changes requiring technical support

Ask a developer or administrator for:

- New page types, routes, nested menus or section layouts
- Major structural reordering, animation or interactions
- New CMS collections, fields, relationships or controlled values
- Protected draft preview
- Colour contrast measurement
- New form fields, notifications, CRM routing, automated replies or spam integrations
- Ticketing, authentication, memberships, payments, checkout or inventory
- Imports, migrations, schema scripts or bulk publication
- CMS permission changes
- Frontend deployment, release, domain, billing, plan, ownership or transfer work

CMS publication changes Headless-site content. It does not release frontend code, switch a domain, transfer ownership or overwrite the original Editor site.

## 27. Final publishing checklist

- [ ] I am on the Headless site whose ID ends in `c160`.
- [ ] Facts, names, dates, spelling and cultural descriptions match an approved source.
- [ ] Source Version and Approved At are accurate.
- [ ] Stable keys, paths and slugs were not changed accidentally.
- [ ] CTA labels and links are complete and tested.
- [ ] Every relationship points to the intended record.
- [ ] Dependencies are published first.
- [ ] Images have alt text or are decorative.
- [ ] Credits, rights and usage permission are complete.
- [ ] Downloads have explicit download permission.
- [ ] Public contacts are verified before enablement.
- [ ] Validation has no unresolved errors.
- [ ] Desktop, mobile, private-window and keyboard reviews passed.

For every field and its technical validation rule, see the [Wix CMS technical data dictionary](./cms-data-dictionary.md).
