# Shared component contract

Reference implementation lives in review.html and tokens.css. These are portable review files, not Wix native components or arbitrary CSS to inject into Wix Editor.

| Component | Structure | Behavior / acceptance |
|---|---|---|
| SectionContainer | full-width background; centered standard/editorial/gallery content | Fluid width; 24/32/48px reference gutters; no negative positioning |
| GlobalHeader | linked wordmark/tagline; five nav links; Press Kit action | Wordmark home; compact layout below 1100px reference width; actual Wix layout mapped separately |
| MobileMenu | labelled disclosure; ordinary navigation links | Keyboard toggle; Escape closes and returns focus; no modal focus trap needed for in-flow menu |
| GlobalFooter | brand/creator; explore; connect; legal line | Verified contact, Instagram, Shiri Achu Art, privacy/image use/accessibility; no placeholder accounts |
| Button/link | primary accent; secondary outline; tertiary underlined link | 48px minimum control height, hover/focus, descriptive text; anchors navigate, buttons change state |
| PageHero | small label, one H1, short lead, max two actions, separate media | No oversized text obscuring faces; H1 wraps without clipping |
| CountryCard | image; country; region; approved designer; one link | Country name supplies accessible link text; controlled ratio; no flag decoration |
| ImageCredit | image + figcaption | Required alt, caption, creator/rights and focal point; internal missing metadata never rendered publicly |
| EventFeature | type, title, date/venue, summary, official action | No invented time or endorsement; reuse Event record |
| FormField | label, control, helper/error, status | Persistent labels, strong borders, errors associated programmatically; actual Wix forms remain untouched |

## Wix implementation constraints

Wix Editor is not Wix Studio. The 1200px/12-column web reference is a target to assess, not a claim that native Editor supports identical CSS grids or breakpoints. Determine safe strip/column widths and the separate mobile layout in Editor. Prefer native menus, global header/footer and Wix theme styles. Do not rebuild the entire site inside an iframe or custom element merely to force CSS support.

Preserve native forms and existing element bindings. No unsupported document/CSS injection or generated Wix internal IDs. Shared header/footer approval is incomplete until actual native rendering is checked at 1440, 1280, 1024, 768 and 390/320px where the available preview supports it. Record unsupported viewport tests explicitly.

## Design rules

Editorial serif for large titles, Archivo for utility/body text. Title case page titles, sentence case section headings, uppercase short labels only. Body max 65ch; standard content 1200px target. Section padding uses 48-96px according to viewport. Spacing scale: 4/8/12/16/24/32/48/64/96/128.

Use warm ivory and charcoal with restrained rust actions. Gold is rare decorative emphasis. Images provide visual richness. Borders before shadows; image corners square, control corners 4px. No decorative stock patterns or invented symbol imagery. Prefer static media to competing carousels. Respect reduced motion.
