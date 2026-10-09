# Supplied Design Reference and Assets

This inventory documents reusable project inputs now supplied in the repository. It is not an implementation-completion report. See [third-party notices](../THIRD_PARTY_NOTICES.md) for attribution and reuse terms, and [asset-manifest.json](../frontend/assets/asset-manifest.json) for actual sizes/SHA-256 hashes.

## Historical visual baseline

[autotrace-v2.html](reference/autotrace-v2.html) is a **byte-identical copy** of the authoritative standalone v2. Its former filename contained Fieldnote; the internal product name is already AutoTrace. The original filename is not a new product name.

The file embeds styling, 14 unique fonts, satellite imagery, a favicon, a factory illustration and prior context overlays. Source links are user-activated references, not required runtime fetches. Open the HTML in a browser for design inspection. It is preserved as a historical reference, not `frontend/index.html` and not the new working application.

**Do not treat its canned extraction animation or initial assessment as acceptance evidence.** Replace those behaviors only in a separately implemented frontend after approval. Historical text/numbers/claims are not automatic requirements or validated results. Preserve visual style, typography, narrative structure, viewer, equations, dashboard/fullscreen and responsiveness without inheriting unsupported interpretations.

The archive has no new review/confirmation backend, no actual PDF extraction, and no approved ScenarioBurnProvider. Do not use its old outputs to populate runtime assessments.

Its title and content still refer to three historical cases, and its procurement illustration is not one of the new readable text-PDF inputs. These preserved details do not expand the approved two-case scope or replace actual document generation/extraction.

## Reusable frontend inputs

| Input | Repository path | Use |
|---|---|---|
| Original real imagery | [before.webp](../frontend/assets/before.webp), [after.webp](../frontend/assets/after.webp) | Unchanged Thailand Sentinel-2 RGB context; 26 January/12 March 2021 |
| Original imagery provenance | [imagery-provenance.json](../frontend/assets/imagery-provenance.json) | Original item IDs, times, source URLs, requested geographic bbox and image hashes |
| Source projection/render metadata | [image-frame-source.json](../frontend/assets/image-frame-source.json) | Source EPSG:32647 affine/shape and recorded original preparation method; not a validated cultivation geometry |
| Integrity inventory | [asset-manifest.json](../frontend/assets/asset-manifest.json) | Verify byte identity of the baseline, assets, projection metadata and license notices |
| Typography | [fonts.css](../frontend/assets/fonts.css) plus the 14 referenced WOFF2 files | Exact font binaries embedded in the v2 baseline; no CDN needed |
| Favicon | [favicon.svg](../frontend/assets/favicon.svg) | Matches the embedded v2 icon |
| Factory illustration | [factory.webp](../frontend/assets/factory.webp), [factory-provenance.json](../frontend/assets/factory-provenance.json) | Public-domain foreign illustration only; preserve author/location and non-evidence label |
| License notices | `frontend/assets/licenses/` | Keep font OFL and Tailwind MIT notices with redistributed assets/reference |

The original imagery manifest is intentionally preserved unchanged. Its `burn-overlay.png` and `maize-overlay.png` entries describe the legacy context layers embedded in the archive; those standalone files are **not supplied** as new runtime evidence. Do not iterate every manifest entry as a required runtime asset. Use the two RGB entries and explicit supplied inventory instead.

## Geometry handoff

The requested WGS84 bbox is not the exact displayed projected crop. The original source uses EPSG:32647 and a rounded raster crop, then bilinear resize to 1400×1400 pixels and WebP encoding. The source metadata and preparation method are recorded in `image-frame-source.json`.

W3 must reconstruct/test the exact rounded crop window, display affine and viewer object-fit mapping before placing synthetic AOI/burn layers. Geographic bbox percentages alone are insufficient. No new transform/alignment validation is claimed from asset copying.

## Excluded or unfinished inputs

- No v3 frontend/Journey files, transport routes, old preassigned scenario verdicts, private proposal, research archive, raw satellite products or machine paths are copied.
- No procurement text PDFs, supported AOI fixtures, synthetic burn/production records, runtime extraction/server code, test oracle or dependency/build manifest have been generated. Those belong to approved implementation work, not this reference bundle.
- No real detector, WorldCereal reference-parcel validation or new environmental measurement is introduced.

Use repository-relative paths in the implemented frontend/helper/tests. Required inputs must be available from a fresh clone; required external setup/acquisition must be documented and completed before offline operation. Preserve these originals and record deliberately derived replacements separately with new hashes.

`.gitattributes` disables line-ending conversion for the imported reference/assets so recorded hashes survive cross-platform checkouts. Existing whitespace in the historical HTML and upstream license notices is preserved intentionally; do not reformat them as part of application edits.
