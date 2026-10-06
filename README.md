# The Pan-African Fabric

This repository contains the Wix-managed Headless implementation of The Pan-African Fabric website.

The production frontend is an Astro application in [`headless/`](headless/). It uses Wix CMS and the Wix Headless site with ID `6dabfd00-04c6-4f6f-8282-fb56b240c160`.

The legacy Wix Editor/Velo source has been removed from the active repository. Its Wix site remains separate and is not modified, unpublished, transferred or deleted by this repository.

## Local development

```powershell
cd headless
npm.cmd ci
npm.cmd run dev
```

The local development server runs at <http://127.0.0.1:4321>.

## Validation

Run the following commands from `headless/`:

```powershell
npm.cmd run check
npm.cmd test
npm.cmd run build
```

## Wix preview

```powershell
cd headless
npx.cmd wix preview
```

A Wix preview is a non-production deployment. Publishing, connecting a domain and changing site ownership remain separate operations.

## Project documentation

- Client CMS editing guide: [`docs/cms-client-editing-guide.md`](docs/cms-client-editing-guide.md)
- CMS data dictionary: [`docs/cms-data-dictionary.md`](docs/cms-data-dictionary.md)
- Headless implementation notes: [`docs/phase-1/headless-implementation.md`](docs/phase-1/headless-implementation.md)
- Frontend progress record: [`docs/frontend-production-progress.md`](docs/frontend-production-progress.md)
