# Redesigned frontend CMS foundation

This directory implements the redesigned schemas from `docs/phase-1/cms-specification.md` as private, empty collections. The provisioning runner never writes or publishes data items and never modifies the existing Editor site. It adds Wix's `PUBLISH` collection plugin with `defaultStatus: DRAFT`; this creates the editorial draft lifecycle but does not expose content while collection reads remain `ADMIN`. The access verifier is read-only. Wix supplies immutable system item IDs; application fields do not duplicate `_id`.

`manifest.mjs` describes native Wix CMS fields. The plan creates all collection shells before reference fields, resolving circular country/event references. All four collection permissions are explicitly `ADMIN`. Dates with unknown times use `DATE`; approval timestamps use `DATETIME`. Relationship data population is deferred and must use the dedicated Wix reference API for multi-reference items.

Run locally without credentials:

```powershell
node scripts/cms/apply-foundation.mjs --dry-run
node --test scripts/cms/foundation.test.mjs
```

The administrative runner supports `--apply --site NEW_SITE_ID` and reads a short-lived, site-scoped CLI token only from `WIX_CMS_ADMIN_TOKEN`. Never persist this token in a file or frontend environment variable. The runner accepts only the verified Headless site ID and denies the old Editor site and every other site. Existing mismatched schemas/permissions halt the runner rather than overwrite settings. An interrupted run can resume; matching schemas, fields and plugins are skipped. The runner re-reads permissions/fields/plugins and verifies every base collection contains zero items before reporting success.

`content.server.mjs` is server/admin tooling only. Its `getPublicContent()` contract always returns an empty list with `disabled-phase-1`; it cannot query private CMS content. The separate private client rejects the Editor site, uses a fixed Wix API origin with redirects disabled, and hides upstream error bodies. Do not expose its `request` or `queryPrivate` methods in an API route or import them into a client island. No runtime administrative credentials are required by the frontend in this phase.

The Wix draft lifecycle is the publication mechanism. It remains operationally disabled because no content is entered and base collections are not visitor-readable. A status field or server-side filtering of administrative query results is not an access-control boundary. Do not store confidential media in public CDN assets even if their CMS metadata is private.

The 18-collection redesign and readback succeeded on site `6dabfd00-04c6-4f6f-8282-fb56b240c160` on 2026-09-09. `../../cms-access-verification.json` records HTTP 403 for authenticated anonymous queries against every base collection and confirms every base collection is empty. Empty draft shadow collections are not materialized by Wix yet and return 404; the verifier records that state without creating content.

Wix requires reciprocal keys on multi-reference fields. Countries.relatedEvents and Events.countries form one shared relationship. Other multi-references use explicit descriptive reciprocal keys. Wix creates reciprocal fields automatically. The runner re-reads the current schema before adding each field, so it can resume and avoids recreating an automatic reciprocal.

Official schemas checked 2026-09-07:

- [Create Data Collection](https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-collections/create-data-collection): `POST /wix-data/v2/collections`, body `{ collection: { id, fields, permissions } }`.
- [Create Data Collection Field](https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-collections/create-data-collection-field): `POST /wix-data/v2/collections/create-field`, body `{ dataCollectionId, field }`.
- [Get Data Collection](https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-collections/get-data-collection): `GET /wix-data/v2/collections/{dataCollectionId}?consistentRead=true`. Visitor responses omit permissions, so permission readback must use the administrative identity.
- [Add Data Collection Plugin](https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-collections/add-data-collection-plugin): `POST /wix-data/v2/collections/add-plugin` with `PUBLISH` and `defaultStatus: DRAFT`.
- Reference schemas use `typeMetadata.reference.referencedCollectionId` and `typeMetadata.multiReference.referencedCollectionId`. Collections are not a strict validation boundary; validate future content before publication.

