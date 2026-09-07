# Foundation validation

Run: `node docs/phase-1/validate.mjs` — passed on 2026-09-07.

- 16 unique proposed routes; primary navigation resolves within the proposal.
- Seven redirect proposals have existing proposed destinations and no page collisions.
- Nine country records correspond to nine routes; none falsely marked publishable.
- CSS color values match the token source.
- Contrast: charcoal/ivory 14.44:1; muted/ivory 5.67:1; white/accent 8.30:1; accent/ivory 7.49:1; input border/white 4.20:1; focus/ivory 4.07:1.
- HTML IDs are unique; internal anchors and ARIA references resolve; embedded JavaScript parses.

These checks validate the reference package, not the existing website. Browser rendering, actual keyboard/focus behavior, screen-reader output and responsive screenshots have not been verified. No claim of WCAG conformance is made. Native Wix Editor layout, datasets, forms, Velo bindings, preview, SEO and publishing remain untested and unchanged by this package.

Before native implementation, review draft copy and verify media rights, public contact, country credits/grouping and the event details identified in the inventory. Before launch, complete the Editor-specific gates in `baseline-and-gates.md`.
