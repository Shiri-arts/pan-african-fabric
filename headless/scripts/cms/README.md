# Redesigned frontend CMS foundation

This directory implements the redesigned schemas from `docs/phase-1/cms-specification.md` on the separate Headless site. The provisioning runner creates schemas and never modifies the existing Editor site. Every collection uses Wix's `PUBLISH` plugin with `defaultStatus: DRAFT`. Published base collections are readable by visitors; inserts, updates and removals remain `ADMIN`. Draft shadow collections are not accepted by the frontend and anonymous draft queries are denied. Wix supplies immutable system item IDs; application fields do not duplicate `_id`.

`manifest.mjs` describes native Wix CMS fields. The plan creates all collection shells before reference fields, resolving circular country/event references. Read permission is `ANYONE`; all three write permissions are `ADMIN`. Dates with unknown times use `DATE`; approval timestamps use `DATETIME`. Future multi-reference population must use the dedicated Wix reference API.

Run locally without credentials:

```powershell
node scripts/cms/apply-foundation.mjs --dry-run
node --test scripts/cms/foundation.test.mjs
```

The administrative runner supports `--apply --site NEW_SITE_ID` and reads a short-lived, site-scoped CLI token only from `WIX_CMS_ADMIN_TOKEN`. Never persist this token in a file or frontend environment variable. The runner accepts only the verified Headless site ID and denies the old Editor site and every other site. Existing mismatched schemas/permissions halt the runner rather than overwrite settings. An interrupted run can resume; matching schemas, fields and plugins are skipped. The runner re-reads permissions/fields/plugins and verifies every base collection contains zero items before reporting success.

`content.server.mjs` remains server/admin tooling. The runtime frontend reads published base collections through `src/lib/wix-cms.ts` with Wix's visitor context. That layer has a fixed collection allowlist, rejects draft collection IDs, validates media display permission and alt text, and falls back to honest placeholders when a query or record is unusable. No runtime administrative credential is shipped to the frontend.

The Wix draft lifecycle is the publication mechanism. A status field is provenance, not an access-control boundary. Files uploaded to the public Wix Media Manager CDN must already be approved for web display; confidential or unverified media must not be uploaded there.

The 18-collection redesign and access readback succeeded on site `6dabfd00-04c6-4f6f-8282-fb56b240c160` on 2026-09-09. Five approved foundation records are published: two Pages, one PageSection and two MediaAssets. The hero and founder relationships and both Wix Media Manager files are verified anonymously. `../../cms-access-verification.json` records HTTP 200 for base collections and HTTP 404 for non-materialized draft shadows.

Wix requires reciprocal keys on multi-reference fields. Countries.relatedEvents and Events.countries form one shared relationship. Other multi-references use explicit descriptive reciprocal keys. Wix creates reciprocal fields automatically. The runner re-reads the current schema before adding each field, so it can resume and avoids recreating an automatic reciprocal.

Official schemas checked 2026-09-07:

- [Create Data Collection](https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-collections/create-data-collection): `POST /wix-data/v2/collections`, body `{ collection: { id, fields, permissions } }`.
- [Create Data Collection Field](https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-collections/create-data-collection-field): `POST /wix-data/v2/collections/create-field`, body `{ dataCollectionId, field }`.
- [Get Data Collection](https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-collections/get-data-collection): `GET /wix-data/v2/collections/{dataCollectionId}?consistentRead=true`. Visitor responses omit permissions, so permission readback must use the administrative identity.
- [Add Data Collection Plugin](https://dev.wix.com/docs/api-reference/business-solutions/cms/collection-management/data-collections/add-data-collection-plugin): `POST /wix-data/v2/collections/add-plugin` with `PUBLISH` and `defaultStatus: DRAFT`.
- Reference schemas use `typeMetadata.reference.referencedCollectionId` and `typeMetadata.multiReference.referencedCollectionId`. Collections are not a strict validation boundary; validate future content before publication.
