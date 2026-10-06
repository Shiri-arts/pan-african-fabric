# Wix CMS technical data dictionary

This document is generated from `headless/scripts/cms/manifest.mjs`. It describes the additive schema expected on the separate Wix Headless site. Wix system fields such as immutable item ID, created date, updated date and publish state are supplied by Wix and are not duplicated here.

Every published record requires `title`, `slug`, `sourceVersion` and `approvedAt`, plus the collection-specific required fields shown below. Fields marked **Internal** support provenance or validation and must not be rendered as public copy. A reference from a published record must point to a published dependency.

## Site settings (`SiteSettings`)

Frontend use: Global header, footer, defaults and announcement.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `siteName` | Site Name | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `tagline` | Tagline | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `headerIdentity` | Header Identity | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `footerStatement` | Footer Statement | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `copyrightText` | Copyright Text | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `defaultSeoTitlePattern` | Default SEO Title Pattern | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `defaultSeoDescription` | Default SEO Description | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `announcementText` | Announcement Text | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `announcementLinkLabel` | Announcement Link Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `canonicalOrigin` | Canonical Origin | `URL` | Yes | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `instagramUrl` | Instagram URL | `URL` | Conditional/No | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `founderSiteUrl` | Founder Site URL | `URL` | Conditional/No | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `announcementLinkUrl` | Announcement Link URL | `URL` | Conditional/No | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `announcementEnabled` | Announcement Enabled | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `primaryEdition` | Primary Edition | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Editions |
| `defaultSeoAsset` | Default SEO Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `socialShareAsset` | Social Share Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |

## Pages (`Pages`)

Frontend use: Route hero, metadata and page-level CTAs.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `pageKey` | Page Key | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `path` | Path | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `navigationLabel` | Navigation Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `footerNavigationLabel` | Footer Navigation Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `eyebrow` | Eyebrow | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `heroTitle` | Hero Title | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `heroTagline` | Hero Tagline | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `seoTitle` | SEO Title | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 60 characters | None |
| `seoDescription` | SEO Description | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 160 characters | None |
| `robots` | Robots | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `primaryCtaLabel` | Primary CTA Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `primaryCtaHref` | Primary CTA Link | `TEXT` | Conditional/No | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `secondaryCtaLabel` | Secondary CTA Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `secondaryCtaHref` | Secondary CTA Link | `TEXT` | Conditional/No | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `introduction` | Introduction | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `navigationVisible` | Navigation Visible | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `footerNavigationVisible` | Footer Navigation Visible | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `navigationHighlighted` | Navigation Highlighted | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `navigationOrder` | Navigation Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `footerNavigationOrder` | Footer Navigation Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `heroMetaLabels` | Hero Meta Labels | `ARRAY_STRING` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `heroAsset` | Hero Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `socialShareAsset` | Social Share Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |

## Page sections (`PageSections`)

Frontend use: Ordered reusable page section.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `sectionKey` | Section Key | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `sectionType` | Section Type | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `eyebrow` | Eyebrow | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `heading` | Heading | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `subheading` | Subheading | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `quoteText` | Quote Text | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `quoteAttribution` | Quote Attribution | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `ctaLabel` | CTA Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `ctaHref` | CTA Link | `TEXT` | Conditional/No | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `tone` | Tone | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `layoutVariant` | Layout Variant | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `mediaCaption` | Media Caption | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `body` | Body | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `isEnabled` | Is Enabled | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `page` | Page | `REFERENCE` | Yes | Public or editorial control | Referenced record must exist; published records require published dependencies | Pages |
| `mediaAsset` | Media Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |

## Editions (`Editions`)

Frontend use: Edition overview.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `year` | Year | `NUMBER` | Yes | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `editionStatus` | Edition Status | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `leadLine` | Lead Line | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `statement` | Statement | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `fabricDescription` | Fabric Description | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `colourNarrative` | Colour Narrative | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `creativeProcess` | Creative Process | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `heroAsset` | Hero Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `fabricAsset` | Fabric Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `relatedEvents` | Related Events | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Events |

## Regions (`Regions`)

Frontend use: Region grouping.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `regionKey` | Region Key | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `name` | Name | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `description` | Description | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |

## Edition countries (`Countries`)

Frontend use: Country profile.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `countryName` | Country Name | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `regionLabel` | Region Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `profileStatus` | Profile Status | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `regionNote` | Region Note | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `introduction` | Introduction | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `interpretation` | Interpretation | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `participationSummary` | Participation Summary | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `credits` | Credits | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `edition` | Edition | `REFERENCE` | Yes | Public or editorial control | Referenced record must exist; published records require published dependencies | Editions |
| `region` | Region | `REFERENCE` | Yes | Public or editorial control | Referenced record must exist; published records require published dependencies | Regions |
| `principalDesigner` | Principal Designer | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Designers |
| `featuredSymbol` | Featured Symbol | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Symbols |
| `heroAsset` | Hero Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `supportingAssets` | Supporting Assets | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `relatedEvents` | Related Events | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Events |

## Edition colours (`EditionColours`)

Frontend use: Country colour presentation.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `colourName` | Colour Name | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `hexValue` | Hex Value | `TEXT` | Yes | Public or editorial control | Six-digit hexadecimal colour; the measured pair must reach 4.5:1 contrast | None |
| `textHex` | Text Hex | `TEXT` | Yes | Public or editorial control | Six-digit hexadecimal colour; the measured pair must reach 4.5:1 contrast | None |
| `screenValueNote` | Screen Value Note | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `sourcePosition` | Source Position | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `contrastRatio` | Contrast Ratio | `NUMBER` | Conditional/No | Public or editorial control | Measured from Hex value and Text hex; stored value must match within 0.05 | None |
| `largeTextOnly` | Large Text Only | `BOOLEAN` | Conditional/No | Public or editorial control | Must be false for a published colour tile | None |
| `edition` | Edition | `REFERENCE` | Yes | Public or editorial control | Referenced record must exist; published records require published dependencies | Editions |
| `country` | Country | `REFERENCE` | Yes | Public or editorial control | Referenced record must exist; published records require published dependencies | Countries |
| `symbol` | Symbol | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Symbols |
| `mediaAsset` | Media Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |

## Symbols (`Symbols`)

Frontend use: Verified symbol explanation.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `approvedName` | Approved Name | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `origin` | Origin | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `acknowledgement` | Acknowledgement | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `meaning` | Meaning | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `publicSourceUrl` | Public Source URL | `URL` | Conditional/No | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `artworkAsset` | Artwork Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |

## Designers (`Designers`)

Frontend use: Designer profile.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `displayName` | Display Name | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `studioName` | Studio Name | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `professionalTitle` | Professional Title | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `location` | Location | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `biography` | Biography | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `statement` | Statement | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `professionalUrl` | Professional URL | `URL` | Conditional/No | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `socialUrl` | Social URL | `URL` | Conditional/No | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `portraitAsset` | Portrait Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |

## Designer participations (`Participations`)

Frontend use: Edition/country/designer attribution.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `participationRole` | Participation Role | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `participationStatus` | Participation Status | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `publicCredit` | Public Credit | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `selectionContext` | Selection Context | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `isPrincipal` | Is Principal | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `statement` | Statement | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `edition` | Edition | `REFERENCE` | Yes | Public or editorial control | Referenced record must exist; published records require published dependencies | Editions |
| `country` | Country | `REFERENCE` | Yes | Public or editorial control | Referenced record must exist; published records require published dependencies | Countries |
| `designer` | Designer | `REFERENCE` | Yes | Public or editorial control | Referenced record must exist; published records require published dependencies | Designers |
| `heroAsset` | Hero Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |

## Garments and accessories (`Garments`)

Frontend use: Garment or accessory detail.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `lookNumber` | Look Number | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `itemType` | Item Type | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `technique` | Technique | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `collectionLabel` | Collection Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `description` | Description | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `publicCredits` | Public Credits | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `participation` | Participation | `REFERENCE` | Yes | Public or editorial control | Referenced record must exist; published records require published dependencies | Participations |
| `designer` | Designer | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Designers |
| `country` | Country | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Countries |
| `edition` | Edition | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Editions |
| `heroAsset` | Hero Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `galleryAssets` | Gallery Assets | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `appearances` | Appearances | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Events |

## Events (`Events`)

Frontend use: Event listing, detail and countdown.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `eventType` | Event Type | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `dateLabel` | Date Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `timeLabel` | Time Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `timezoneLabel` | Timezone Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `venue` | Venue | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `location` | Location | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `eventStatus` | Event Status | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `startsAt` | Starts At | `DATETIME` | Conditional/No | Public or editorial control | Valid Wix date value | None |
| `endsAt` | Ends At | `DATETIME` | Conditional/No | Public or editorial control | Valid Wix date value | None |
| `overview` | Overview | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `programme` | Programme | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `admission` | Admission | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `accessibility` | Accessibility | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `publicPartnerCredits` | Public Partner Credits | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `officialUrl` | Official URL | `URL` | Conditional/No | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `ticketUrl` | Ticket URL | `URL` | Conditional/No | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `isConfirmed` | Is Confirmed | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `featured` | Featured | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `edition` | Edition | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Editions |
| `heroAsset` | Hero Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `galleryAssets` | Gallery Assets | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `resources` | Resources | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `countries` | Countries | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Countries |
| `designers` | Designers | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Designers |
| `participations` | Participations | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Participations |

## Media assets (`MediaAssets`)

Frontend use: Rights-aware media rendering.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `filename` | Filename | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `assetType` | Asset Type | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `alt` | Alt | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `caption` | Caption | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `ratio` | Ratio | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `focalPosition` | Focal Position | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `location` | Location | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `creator` | Creator | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `copyrightHolder` | Copyright Holder | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `creditLine` | Credit Line | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `usagePermission` | Usage Permission | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `usageTerms` | Usage Terms | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `downloadLabel` | Download Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `fileSizeLabel` | File Size Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `version` | Version | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `image` | Image | `IMAGE` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `mobileImage` | Mobile Image | `IMAGE` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `document` | Document | `DOCUMENT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `video` | Video | `VIDEO` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `date` | Date | `DATE` | Conditional/No | Public or editorial control | Valid Wix date value | None |
| `width` | Width | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `height` | Height | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `mobileWidth` | Mobile Width | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `mobileHeight` | Mobile Height | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `focalX` | Focal X | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `focalY` | Focal Y | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `decorative` | Decorative | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `downloadAllowed` | Download Allowed | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |

## Stories (`Stories`)

Frontend use: Story listing and article.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `headline` | Headline | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `category` | Category | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `excerpt` | Excerpt | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `standfirst` | Standfirst | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `authorCredit` | Author Credit | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `dateLabel` | Date Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `body` | Body | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `storyDate` | Story Date | `DATE` | Conditional/No | Public or editorial control | Valid Wix date value | None |
| `publishedDate` | Published Date | `DATETIME` | Conditional/No | Public or editorial control | Valid Wix date value | None |
| `heroAsset` | Hero Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `countries` | Countries | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Countries |
| `designers` | Designers | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Designers |
| `events` | Events | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Events |

## Press items (`PressItems`)

Frontend use: Press, release, coverage or download.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `itemType` | Item Type | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `headline` | Headline | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `publicationName` | Publication Name | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `dateLabel` | Date Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `version` | Version | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `fileSizeLabel` | File Size Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `excerpt` | Excerpt | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `body` | Body | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `usageNotes` | Usage Notes | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `itemDate` | Item Date | `DATE` | Conditional/No | Public or editorial control | Valid Wix date value | None |
| `externalUrl` | External URL | `URL` | Conditional/No | Public or editorial control | Internal path where supported, or HTTPS/mailto/tel; scripts rejected | None |
| `downloadAllowed` | Download Allowed | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `asset` | Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `relatedEvent` | Related Event | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Events |
| `relatedStory` | Related Story | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Stories |

## Partnership options (`PartnershipOptions`)

Frontend use: Partnership cards and choices.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `optionType` | Option Type | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `label` | Label | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `enquiryValue` | Enquiry Value | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `description` | Description | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `isEnabled` | Is Enabled | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `mediaAsset` | Media Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |

## Contact channels (`ContactChannels`)

Frontend use: Verified public contact route.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `channelKey` | Channel Key | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `label` | Label | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `description` | Description | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `emailAddress` | Email Address | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `responseNote` | Response Note | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `publicUseVerified` | Public Use Verified | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `isEnabled` | Is Enabled | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |

## Shop editorial items (`ShopItems`)

Frontend use: Editorial bridge to Wix Stores.

| Field key | Dashboard label | Type | Required to publish | Visibility | Validation | Publication dependency |
|---|---|---|---|---|---|---|
| `title` | Title | `TEXT` | Yes | Public or editorial control | Recommended maximum 90 characters | None |
| `slug` | Slug | `TEXT` | Yes | Public or editorial control | Lowercase letters, numbers and single hyphens; unique within collection | None |
| `summary` | Summary | `TEXT` | Conditional/No | Public or editorial control | Recommended maximum 300 characters | None |
| `sourceVersion` | Source Version | `TEXT` | Yes | Internal | Trimmed value; field-specific rules apply | None |
| `displayOrder` | Display Order | `NUMBER` | Conditional/No | Public or editorial control | Finite numeric value; field-specific constraints apply | None |
| `approvedAt` | Approved At | `DATETIME` | Yes | Internal | Valid Wix date value | Required before publication |
| `wixProductId` | Wix Product ID | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `itemType` | Item Type | `TEXT` | Yes | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `availabilityLabel` | Availability Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `variantLabel` | Variant Label | `TEXT` | Conditional/No | Public or editorial control | Trimmed value; field-specific rules apply | None |
| `editorialStory` | Editorial Story | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `fulfilment` | Fulfilment | `RICH_TEXT` | Conditional/No | Public or editorial control | Wix rich content only; script-like content and unsafe URLs rejected | None |
| `commerceEnabled` | Commerce Enabled | `BOOLEAN` | Conditional/No | Public or editorial control | True or false | None |
| `edition` | Edition | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Editions |
| `country` | Country | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Countries |
| `garment` | Garment | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Garments |
| `heroAsset` | Hero Asset | `REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `galleryAssets` | Gallery Assets | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | MediaAssets |
| `relatedStories` | Related Stories | `MULTI_REFERENCE` | Conditional/No | Public or editorial control | Referenced record must exist; published records require published dependencies | Stories |

## Controlled values and cross-record rules

- `PageSections.tone`: `ivory`, `paper`, `surface` or `ink`.
- A visible page navigation entry requires its corresponding header or footer label; its destination is the validated page path.
- CTA labels and destinations are supplied together.
- A confirmed event requires exact start/end instants, time zone, venue and location; end must follow start.
- Non-decorative images require alt text. Display requires `web-display-approved` or `download-approved`; downloads require `download-approved`.
- Published edition colours require approved six-digit background and text values with measured contrast of at least 4.5:1. The frontend independently recomputes this ratio and omits unsafe pairs.
- An enabled contact channel requires `publicUseVerified`.
- A commerce-enabled shop item requires an existing Wix Stores product ID. Price, inventory and variants remain authoritative in Wix Stores.
- Multi-reference links must be written through Wix's reference APIs rather than ordinary array writes.
