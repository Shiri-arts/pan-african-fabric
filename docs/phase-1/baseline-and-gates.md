# Baseline and safety gates

## Recorded baseline

- Repository: `Shiri-arts/pan-african-fabric` (private).
- Baseline commit: `65f7ce2fbfd03a6174a8c50941d8947170655c15`.
- Base tree: `b044c2b5e7260ce3b5d580942c26fa788fa18c70`.
- Implementation branch: `launch-critical-redesign`.
- Site ID: `cf6dc8aa-2320-4c66-b52e-44252adf69f3`.
- Recorded UI version: `104`, from repository config. Not independently checked against current Editor draft.
- Editor type: Wix Editor, not Studio.
- Original public routes: `/`, `/about-us`, `/mission`, `/designers`, `/featured`, `/showcase`, `/journal`, `/press`.
- Both branches were at the baseline when this work started. Neither had a GitHub branch-protection rule.

Git preserves the code baseline, not a complete independent site backup. Wix history/duplicate-site recovery and a current screenshot baseline remain to be verified in Editor. Do not call UI version 104 a tested restore point.

## Preserved code

The Landing page references `#statsSection`, `#countCountries`, `#countRegions`, `#countDesigners`. Preserve these IDs and text-element compatibility during layout work. The counter currently sets its own color; later align that deliberately with the approved accent. No code change has been made here. Other page files and masterPage are starter code; no custom backend functions were found at this baseline.

## Editor boundary

Cloud Google sign-in returned 502/connection refused. No authenticated visual editing session was verified. Therefore native header, footer, theme, CMS connections, mobile layout, screenshot capture, Local Editor preview and restore verification remain pending.

Official Wix Local Editor documentation states that Local Editor and Regular Editor design changes are shared; a Git branch alone does not isolate them. Collection field changes can affect live data before publishing. This package creates no collections or schema mutations.

References verified during the project:
- https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/about-the-local-editor
- https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/test-your-code-in-the-local-editor

## Gates before native shell work

1. Verify authenticated Editor access, current active collaborators, draft UI version and recoverable history.
2. Agree whether work uses a duplicate site or the shared unpublished draft; do not silently create a new site or assume a duplicate copies every integration.
3. Confirm the intended site ID at each CLI/API boundary. Never retarget this repo's Wix config by hand.
4. Map the reference tokens to native Wix theme styles and editor-supported responsive behavior.
5. Apply shared header/footer without deleting form data or renaming counter IDs.
6. Test desktop, narrow desktop and Wix mobile preview; save a new UI version through the supported Editor workflow.
7. Record that UI version with the corresponding code revision; review before main merge.

## Content decisions

- Cameroon region: source brief groups it in West Africa. Keep `regionAsBrief` separate from approved public regional label; founder/content lead to confirm whether this is intentional editorial grouping. No silent correction.
- Work email: user supplied `Info@thepanafricanfabric.com` previously for media work. Confirm it is the public/media contact and accessibility contact before using it on the site.
- Designer spelling/affiliation: roster is a working source, not signed-off biography copy.
- Smithsonian: date comes from the brief; official time, title, link, partner credit and permission need approval.
- Press Kit: no approved downloadable file was supplied in this handoff.
- All missing rights, symbol meanings and credits remain internal. Never publish placeholder values.

## Rollback and publication

All package changes are additive under `docs/phase-1`; runtime files and main remain unchanged. A normal revert of the package commit can remove these additions later; do not reset main or force-push. Native design rollback must use a verified Wix history/restore workflow and code/UI pairing. Domain, live CMS, forms/submissions, analytics and managed app collections are outside this repository package. Merge/publish requires explicit authorization; no auto-publishing workflow is introduced.
