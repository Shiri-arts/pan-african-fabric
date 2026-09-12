# Wix CMS editing guide

This guide explains how to maintain The Pan-African Fabric website from the Wix dashboard. Work only in the separate Headless project whose site ID ends in `c160`. The original Editor website is a different site and remains unchanged.

## Before editing

1. Open the separate Headless project in the Wix dashboard.
2. Open **CMS** and select the required collection.
3. Confirm that you are editing the intended record. Use its title and slug to identify it.
4. Keep new or incomplete work as a draft until its facts, links, relationships and media rights are approved.

The website controls fonts, spacing, layouts and animation. The CMS controls approved words, images, ordering, visibility and a limited set of presentation choices.

## Edit a page

Open **Pages**, then select the page by its title or stable page key.

- Edit **Hero title**, **Hero tagline**, **Eyebrow** and **Introduction** for the top of the page.
- Edit the primary or secondary button label and destination together.
- Edit **SEO title** and **SEO description** for search and social previews.
- Use **Hero asset** or **Social share asset** to select an approved record from **Media assets**.
- Use the header and footer navigation fields to control each page's menu label, visibility and order.
- Use **Navigation highlighted** only for the approved primary action.

Keep a title under about 90 characters, an SEO title under about 60 characters and an SEO description under about 160 characters. A page path starts with `/`, for example `/about`.

## Edit or reorder a page section

Open **Page sections** and select the section by its title and parent page.

- Edit the eyebrow, heading, subheading and body.
- For the founder section, edit **Quote text** and **Quote attribution** together.
- Set **Display order** to a whole number. It controls repeated/list content and records the intended order; the major page-section sequence is fixed by the page layout.
- Turn **Is enabled** off to hide the section without deleting it.
- Choose an approved tone: `ivory`, `paper`, `surface` or `ink`.
- Select only a layout variant already offered by the website.
- Enter a CTA label and destination together, or leave both empty.
- Select an approved **Media asset** and enter a caption when needed.

Do not paste scripts, embeds, custom CSS or copied page-builder markup into rich-text fields.

## Edit navigation

Navigation uses the matching page record in **Pages**. This keeps each one-level menu destination tied to a real website route.

1. Enter the header label in **Navigation label** and set **Navigation visible**.
2. Enter a whole number in **Navigation order**. Lower numbers appear first.
3. Enter the footer label in **Footer navigation label** and set **Footer navigation visible** when the page belongs in the footer.
4. Enter **Footer navigation order**.
5. Use **Navigation highlighted** only for the approved primary navigation action.

The page must be published before it can appear in public navigation. A new destination or nested menu requires a developer.

## Replace or add an image

1. Upload the approved file to Wix Media Manager.
2. Open **Media assets** and create or edit its metadata record.
3. Select the uploaded file in **Image**. Add a mobile image only when an approved alternative exists.
4. Enter its width, height, aspect ratio and focal position.
5. Write useful alt text unless the image is purely decorative.
6. Enter the creator, copyright holder, credit and usage terms from the approved source material.
7. Select `web-display-approved` only when web display is authorized. Select `download-approved` only when visitors may download it.
8. Leave **Download allowed** off unless permission explicitly covers downloads.
9. Publish the media record before publishing a page that uses it.

Replacing the file in a Media asset updates every section that references that record. Check each affected page before publishing.

## Create an event

Open **Events**, create a draft and complete the approved details. Confirm the exact start and end times, time zone, venue and location before turning on **Is confirmed**. Connect only verified editions, countries, designers, participations, garments and media.

Do not infer admission, accessibility, ticketing, programme or partner information. Leave unknown fields empty and keep the event in draft.

## Create a story

Open **Stories** and create a draft. Add the headline, slug, category, excerpt, standfirst, author credit, approved dates, body and hero media. Add related records only when the relationship is verified. Publish its media and other required dependencies first.

## Edit countries, designers and garments

- **Countries** describes one country within an edition.
- **Designers** stores a reusable person or studio profile.
- **Designer participations** connects a designer to an edition and country and records that specific role.
- **Garments and accessories** connects work to the appropriate participation.

The participation record is the authoritative connection. Country, edition and designer selections on a garment must agree with its participation. Do not create duplicate designer records to represent different editions.

## Approve edition colours for the website

The twelve colour names, source order and country assignments are already saved as drafts in **Edition colours**. Their exact web colours are deliberately blank because the supplied artwork uses gradients and does not define approved digital colour specifications.

Before publishing a colour record:

1. Confirm the approved solid web colour with the client or designer.
2. Enter **Hex value** and **Text hex** as six-digit values such as `#123456`.
3. Ask a developer to measure the pair and enter the verified **Contrast ratio**.
4. Keep **Large text only** off. The colour and label must achieve at least 4.5:1 contrast for normal text.
5. Confirm the edition and country relationships, source order and **Approved at** date.
6. Run validation before publishing.

Incomplete or low-contrast colour records are omitted from the public frontend even if they are accidentally published.

## Press, partnerships, contacts and shop editorial content

- Use **Press items** only for approved releases, verified coverage or approved downloads.
- Use **Partnership options** for the published collaboration choices shown on the website.
- Enable a **Contact channel** only after **Public use verified** is also checked.
- Use **Shop editorial items** for presentation and storytelling. Wix Stores remains responsible for prices, stock, variants, cart and checkout.

## Save, validate and publish

1. Save the record as a draft.
2. Complete **Source version** with the approved source or revision name.
3. Complete **Approved at** only after approval has actually been received.
4. Ask the site administrator to run the read-only CMS content validation report.
5. Correct every reported error. Review warnings for unusually long text.
6. Publish dependencies first: media and referenced records, then page sections or content records, then pages used in navigation.
7. Publish the record explicitly in Wix.
8. Check the Wix-hosted frontend preview on desktop and mobile after the content is published. The current project does not provide a protected frontend preview of unpublished CMS revisions.

The public frontend reads published records only. A protected draft preview is not currently available, so do not weaken permissions to preview drafts.

## Correct or remove public content

Edit and republish a corrected record when the correction should replace the existing version. Unpublish a record when it must disappear from public pages. Before unpublishing a shared media, page or entity, check whether other published records reference it.

Avoid deleting records during normal editorial work. Deletion can break relationships and should be handled by the site administrator after a dependency check.

## Changes that require a developer

Ask a developer for:

- A new page type, route or section layout
- Reordering major page sections whose layouts differ from one another
- New animation or interaction
- New CMS fields or relationships
- A change to available tones or layout variants
- A secure draft-preview feature
- Measuring and approving an edition colour and its accessible label colour
- Forms, submissions or email automation
- Ticketing, payments, products, checkout or inventory
- A frontend release, domain change or ownership change

CMS publication changes content. It does not release new frontend code or change the domain.
