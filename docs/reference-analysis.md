# Nordiska Museet reference analysis

This document records the reusable visual principles observed in the supplied desktop screenshots and the live site structure. It is a layout reference only; Kultur & Art will use its own identity, content and media.

## Layout and grid

- The design alternates full-bleed color or media fields with centered editorial content.
- At the approximately 1900px screenshot width, primary content begins around 120px from each edge. This implies an inner width near 1660–1680px and a desktop gutter of about 6.25vw.
- A 12-column desktop grid is the most flexible model for the observed two-column, three-column and thumbnail/list compositions.
- Cards align tightly to the grid and use square corners. Visual separation comes from color contrast, whitespace and thin rules instead of shadows.
- Full-width sections remain visually expansive while text is kept to deliberate, readable measures.

## Typography

- The system uses a neutral grotesk sans serif throughout, with weight, scale and casing creating hierarchy.
- Display text is exceptionally large: viewport headlines approach 180–220px on wide desktop screens.
- Major section titles sit roughly in the 96–150px range; card titles are commonly 30–64px depending on prominence.
- Labels, metadata and navigation are compact, uppercase and tracked. Body copy is comparatively modest at roughly 17–21px.
- Headlines use tight line-height and slightly negative tracking. Most display lines are intentionally short.

## Spacing and composition

- Major sections commonly use 90–170px of vertical breathing room on desktop and often occupy most of a viewport.
- Thin horizontal rules establish rhythm between list items and information groups.
- Composition is asymmetric even when the underlying grid is regular: large type may overlap media, titles sit off-center, and open space is treated as an active element.
- Mobile should retain generous rhythm, but use approximately 20px side gutters and stack grid content into one column.

## Header and navigation

- The landing header is layered over the hero: ticket/status actions on the left, identity centered, and language/search/menu controls on the right.
- The hamburger is the persistent primary navigation trigger and becomes a floating colored square on scrolled or internal views.
- The menu is expected to become a large overlay rather than a small conventional dropdown.
- Kultur & Art should adapt the structure with its own logo and information architecture, not reproduce the museum controls verbatim.

## Hero system

- Hero treatments are viewport-led, normally near 100svh.
- Two observed variants are useful: a full-bleed cinematic video/image with oversized text, and a central 4:3 or 16:10 media object surrounded by a strong color field.
- Oversized words can cross the media boundary, but readable contrast must be preserved.
- On small screens, media and copy should stack, with the media spanning most or all of the available width.

## Media and cards

- Hero media uses full-viewport cover or a prominent central landscape frame around 40–50vw wide.
- Feature cards lean toward 4:3 imagery; three-column informational cards use approximately 3:2 imagery; compact editorial lists use 4:3 thumbnails.
- Two-column feature cards are bold color blocks. Three-column cards mix one emphasized color card with quieter siblings.
- Editorial list rows combine a small thumbnail, metadata, a large title and an oversized directional arrow.
- Final Kultur & Art imagery should feel documentary, human and active, with confident crops and no ornamental framing.

## Links, buttons and interaction

- Inline links are text-forward: visible underline plus a right-pointing arrow.
- High-priority actions can become full-width, shallow bars around 80–105px tall; smaller utility actions use outlined rectangles.
- Corners remain square and shadows are avoided.
- Suitable interaction behavior is restrained: arrow translation, underline-weight changes, small image scale, and direct foreground/background color swaps.
- Hover effects must be gated to hover-capable pointers, with equivalent focus states and reduced-motion support.

## Color and surfaces

- The reference uses saturated, flat color fields paired with off-white and near-black. Individual sections often commit to one dominant background color.
- Kultur & Art replaces that palette with brand blue `#3B9AC4`, brand lime `#A2D34E`, warm paper and deep ink.
- Ink text is used on both brand colors for reliable legibility. Blue and lime should alternate as editorial surfaces rather than appear as small decorative accents everywhere.

## Footer direction

- The live content structure groups newsletter signup, visit links, organization information, destinations and legal links into distinct columns.
- Kultur & Art's footer should likewise begin with one large participation or newsletter area, followed by a spacious multi-column link directory and a restrained legal row.
- On mobile, those columns should stack or become accessible disclosure groups.

## Responsive intent

- 320–767px: four-column underlying grid, single-column content, 20px gutters, touch-first controls.
- 768–1023px: eight-column grid for paired or asymmetric layouts.
- 1024px and above: twelve-column grid and desktop navigation treatment.
- 1440px and above: type, gutters and section spacing reach their maximum values.
- Display type uses fluid `clamp()` sizing so the editorial character is retained without abrupt breakpoint jumps.
