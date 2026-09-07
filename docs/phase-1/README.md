# Phase 1: launch foundation

Status: repository foundation implemented; native Wix shell NOT implemented.

This package follows The Pan-African Fabric Website Structure and Content Plan (14 pages, July 2026), particularly the launch-critical priorities on page 13 and pre-build handoff on page 14. It is an internal review package, not public site content or a Wix preview.

## Review order

1. [Design tokens](design-tokens.json) and [component contract](components.md)
2. [Route map](routes.json)
3. [Launch copy deck](copy-deck.md)
4. [Content readiness inventory](content-inventory.json)
5. [CMS specification](cms-specification.md)
6. [Interactive wireframes and style tile](review.html): download this file alongside `tokens.css`, then open it locally. The HTML has no external dependencies, analytics, forms, or network requests.
7. [Safety baseline and remaining gates](baseline-and-gates.md)

The review HTML demonstrates the proposed header, footer, navigation, button styles and content hierarchy at fluid widths. Homepage and country layouts are wireframes: grey media slots are intentional, clearly labelled review placeholders. It neither replaces Wix elements nor binds to CMS records. The proposed fonts require the existing Wix font setup; this offline review uses system serif/sans fallbacks unless those fonts are installed locally.

## Scope

Launch: Home, Initiative, Edition One overview, nine country profiles with separate principal-designer records, Smithsonian event, essential Exhibitions/Media pages, current Press Kit, minimal Future Editions, verified contact/footer. Expanded archives, standalone designer pages, interactive map, video library and participation workflows remain later work.

No `src/` files, runtime dependencies, Wix config, Wix lock, collections, forms, redirects or site settings were changed by this package. No new public routes exist yet. No branch protection rule has been installed: branch isolation is a workflow boundary, not a server-enforced protection.

## Validate

From the repository root:

```sh
node docs/phase-1/validate.mjs
```

This checks token contrast, token/CSS parity, unique routes, country coverage and publication readiness. It does not certify native Wix responsiveness or accessibility. See validation notes for the checks actually performed.

## Approvals still needed

Approve the visual direction, route mapping and editorial groupings; provide verified country/designer copy, approved imagery/credits, official event details and the current downloadable press kit. Missing content stays internal. Repository work is ready for review; Phase 1 as originally scoped remains incomplete until the Wix shell is applied and tested in an authenticated Editor session.
