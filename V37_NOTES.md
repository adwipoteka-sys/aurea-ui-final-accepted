# V37 — 4K sharpness pass on all exact tabs

What changed:
- Rebuilt the exact full-screen artboards for Send / Contacts / History / Receipt in a 4K-class raster size (4096 px height).
- Applied a gentle UI-focused sharpen pass after high-quality Lanczos upscale, so text, lines, glows and button edges read cleaner on dense screens.
- Home stays on the existing 4K exact source of truth; the other tabs are now brought to the same perceived sharpness class.
- Navigation logic and hit-zones were left untouched, so only clarity changed — not layout.

Result:
- Same geometry and same active-tab behavior as v36.
- Cleaner rendering on high-DPI devices and less soft scaling on large screens.
