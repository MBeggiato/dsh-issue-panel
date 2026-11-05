# GitHub issues panel design

This plugin extends the existing Harness visual system rather than defining a new identity.

- Surface: session conversation view, approved master-detail issue list and discussion pane; narrow screens use list/detail navigation.
- Typography: inherited system UI font, 14px body, 18px panel heading, 20px issue title; tabular issue numbers.
- Colors: Harness alias tokens only in UI. Base/layer backgrounds, primary/secondary labels, border-l1/l2, brand-primary, state-error-primary. Theme selection remains host-owned.
- Controls: compact bordered inputs/buttons, 8px radius, explicit labels, visible focus outlines; inline authentication setup.
- Content: plain-text Markdown source to avoid executing external HTML. Issue labels remain neutral text chips.
- States: loading, empty, authentication/network failure, unavailable repository, detail selection, staged reference feedback.
- Artwork: original geometric SVG icon; no raster assets.

## Verification
Eleven backend tests pass; JavaScript syntax checks pass; mechanical design detector returned no findings. Independent source review found lifecycle issues that were fixed; fix-only review passed with non-blocking caveats. User confirmed the installed panel and non-Git explanation appear after page refresh. Live Client inspection still returned the prior view roster, so that inspection is inconclusive rather than proof of absence. No automated browser control was available: computed contrast, keyboard flow, light/dark rendering, real authenticated issue browsing and composer insertion remain unverified interactively.

## Known behavior
Refresh reloads the first issues page and the selected issue's first comments page while retaining selection. Load more remains available. This can reset browsing depth every 60 seconds. UI locale keys are routed through Harness with English fallback; inventory metadata also includes German.
