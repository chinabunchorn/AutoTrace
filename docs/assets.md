# Supplied Design Reference and Assets

This inventory documents reusable project inputs now supplied in the repository. It is not an implementation-completion report. See [third-party notices](../THIRD_PARTY_NOTICES.md) for attribution and reuse terms, and [asset-manifest.json](../frontend/assets/asset-manifest.json) for actual sizes/SHA-256 hashes.

## Revised source and selected-location status

**The supplied GISTDA API exports replace WorldCereal/live fetching.** Exact AOIs, corrected **5 km²** cap, actual source schema and remaining window/composition gaps are in [data/origins/README.md](../data/origins/README.md). Both response files are supplied byte-for-byte; Sentinel-2 remains future preparation. No authenticated API request or new image acquisition occurred.

## Frozen crop-response inputs

| Input | Repository path | Scope |
|---|---|---|
| UC1 export | [message.txt](../data/origins/gistda/usecase1/message.txt) | JSON array; Maize update 2026-09-30, 4 MultiPolygon objects |
| UC2 export | [response.json](../data/origins/gistda/usecase2/response.json) | Full JSON array includes Cassava/Maize/Sugarcane; select Maize update 2026-09-30, 8 geometry objects |
| Separate source inventory | [manifest.json](../data/origins/gistda/manifest.json) | Sizes/hashes, observed schema, case association, user-confirmed publication permission, actual missing metadata |

Attribution: **GISTDA; API exports supplied by the project owner**. The user confirmed permission to publish these specific files; do not invent a provider-wide license. They contain no `area`/`yield_avg`, endpoint/resolution/request-period/coverage assertion; retain gaps. Source update is not a procurement/imagery/fire date. Some geometry crosses query edges, requiring later clipping/union and reviewed composition. No keys/account/live fetching/refresh prerequisite. The historical 26-file frontend inventory remains unchanged; crop inputs use their separate manifest.

The original v2 image pair and the local `frontend/assets/usecase2/` WorldCereal candidate packet cover **superseded locations**. Preserve historical binaries/JSON/provenance; do not use their crop labels, AOI, dates, hectares, frame or burn-screening note as selected-case evidence. No silent WorldCereal fallback. GISTDA response/crop polygons must retain resolution/source/coverage limits; official origin does not make them surveyed parcel or fire ground truth.

Factory scope includes feed, human food and other uses of selected maize/corn. The v2 feed-mill photo is a historical foreign illustration only, not a universal factory identity. Retain the design/fonts/icon independently from old domain-specific claims.

## Historical visual baseline

[autotrace-v2.html](reference/autotrace-v2.html) is a **byte-identical copy** of the authoritative standalone v2. Its former filename contained Fieldnote; the internal product name is already AutoTrace. The original filename is not a new product name.

The file embeds styling, 14 unique fonts, satellite imagery, a favicon, a factory illustration and prior context overlays. Source links are user-activated references, not required runtime fetches. Open the HTML in a browser for design inspection. It is preserved as a historical reference, not `frontend/index.html` and not the new working application.

**Do not treat its canned extraction animation or initial assessment as acceptance evidence.** Replace those behaviors only in a separately implemented frontend after approval. Historical text/numbers/claims are not automatic requirements or validated results. Preserve visual style, typography, narrative structure, viewer, equations, dashboard/fullscreen and responsiveness without inheriting unsupported interpretations.

The archive has no new review/confirmation backend, no actual PDF extraction, and no approved ScenarioBurnProvider. Do not use its old outputs to populate runtime assessments.

Its title and content still refer to three historical cases, and its procurement illustration is not one of the new readable text-PDF inputs. These preserved details do not expand the approved two-case scope or replace actual document generation/extraction.

## Reusable frontend inputs

| Input | Repository path | Use |
|---|---|---|
| Original real imagery | [before.webp](../frontend/assets/before.webp), [after.webp](../frontend/assets/after.webp) | Preserved historical Thailand RGB; 26 January/12 March 2021, not new-AOI context |
| Original imagery provenance | [imagery-provenance.json](../frontend/assets/imagery-provenance.json) | Original item IDs, times, source URLs, requested geographic bbox and image hashes |
| Source projection/render metadata | [image-frame-source.json](../frontend/assets/image-frame-source.json) | Source EPSG:32647 affine/shape and recorded original preparation method; not a validated cultivation geometry |
| Integrity inventory | [asset-manifest.json](../frontend/assets/asset-manifest.json) | Verify byte identity of the baseline, assets, projection metadata and license notices |
| Typography | [fonts.css](../frontend/assets/fonts.css) plus the 14 referenced WOFF2 files | Exact font binaries embedded in the v2 baseline; no CDN needed |
| Favicon | [favicon.svg](../frontend/assets/favicon.svg) | Matches the embedded v2 icon |
| Factory illustration | [factory.webp](../frontend/assets/factory.webp), [factory-provenance.json](../frontend/assets/factory-provenance.json) | Public-domain foreign illustration only; preserve author/location and non-evidence label |
| License notices | `frontend/assets/licenses/` | Keep font OFL and Tailwind MIT notices with redistributed assets/reference |

The original imagery manifest is intentionally preserved unchanged. Its `burn-overlay.png` and `maize-overlay.png` entries describe legacy archive layers; those standalone files are **not supplied** as new runtime evidence. Do not iterate every manifest entry as required runtime evidence. The two original RGB entries and inventory verify historical asset preservation only, not readiness for the selected AOIs.

The superseded candidate packet under `frontend/assets/usecase2/` contains old imagery, raster/STAC/AOI crops and WorldCereal classification/map/overlay. Its historical README is annotated; the other 18 local packet files are excluded from this GISTDA publication, untouched and outside both tracked asset inventories. They are not required runtime inputs or remotely supplied selected-case evidence. Any future publication needs separate hash/permission review.

## Geometry handoff

The requested WGS84 bbox is not the exact displayed projected crop. The original source uses EPSG:32647 and a rounded raster crop, then bilinear resize to 1400×1400 pixels and WebP encoding. The source metadata and preparation method are recorded in `image-frame-source.json`.

That original transform is historical only. W3 must obtain/validate new source-frame metadata for both selected query AOIs, then test crop/display affine/object-fit mapping. Keep user query bounds separate from returned/clipped GISTDA cultivation geometry and separate synthetic burn. Geographic bbox percentages alone are insufficient; no new alignment/acquisition is claimed by documentation.

## Excluded or unfinished inputs

- No v3/Journey, transport, private proposal/research archive or machine paths are added by this revision. The already-copied old candidate packet contains small reference raster crops, not a new selected-AOI acquisition.
- No procurement text PDFs, supported AOI fixtures, synthetic burn/production records, runtime extraction/server code, test oracle or dependency/build manifest have been generated. Those belong to approved implementation work, not this reference bundle.
- The two raw GISTDA responses and manifest are included, but no local loader, API adapter, new Sentinel-2 frame or real burn detector is implemented. Supported evidence-window/composition/unknown-source policy and matching imagery remain to be qualified. WorldCereal is retired, not an active accuracy study.

Use repository-relative paths in the implemented frontend/helper/tests. Required inputs must be available from a fresh clone; required external setup/acquisition must be documented and completed before offline operation. Preserve these originals and record deliberately derived replacements separately with new hashes.

`.gitattributes` disables line-ending conversion for imported reference/assets and the two raw GISTDA exports so hashes survive cross-platform checkouts. Preserve original whitespace/bytes; derived crop records remain separate. Do not reformat historical reference/licenses or supplied responses during implementation.
