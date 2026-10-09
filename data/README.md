# Runtime Demonstration Data

## Responsibility

Prepare mixed-source, explicitly labelled runtime inputs for the two selected AOIs: real GISTDA crop-polygon evidence, planned Sentinel-2 context, fictional factory documents and separate burn/mock production assumptions. GISTDA replaces WorldCereal; concept scope covers factories using selected maize/corn for feed, human food or other uses. Read [AGENTS.md](../AGENTS.md), [plan.md](../plan.md), [contracts](../contracts/README.md) and the canonical [origin/acquisition brief](origins/README.md).

**Owner:** unassigned, coordinated with W2/W3. **Status:** exact query rings and both user-supplied GISTDA exports/manifest supplied; no implemented loader, derived origin records, new imagery, PDFs or scenarios. Source import/publication is approved, not application implementation.

## Directory roles

| Folder | Contents to prepare | Expected consumer/output |
|---|---|---|
| `documents/` | Readable one-page text procurement/claim PDFs, conspicuously fictional | Actual ingestion bytes; never fields from filename/case button |
| `origins/` | Canonical query rings; supplied `gistda/usecase1/message.txt`, `gistda/usecase2/response.json`, manifest; future derived geometry/window/frame records | Local JSON/hash loader, exact maize selection; no key/account/fetching. Query/crop geometries stay distinct |
| `scenarios/` | Separate synthetic positive/complete-zero burn layers and mock yield/timing/stock assumptions referencing GISTDA crop evidence | Conditional scenario/production inputs, not final verdicts or substitute cultivation polygons |

Small folders are described here and in AGENTS.md; `origins/README.md` is the canonical note for exact coordinates, supplied export schema and remaining review gaps.

## Tasks

1. Prepare the ten essential controlled PDF fields for fictional selected-crop consuming factories, plus contextual factory type/crop use (feed, human food, other/unspecified). Crop stays maize/corn; do not infer end use from classification. Proposed English labels; Thai UI/report. Final dates/quantities await source qualification.
2. Preserve exact AOIs in [origins/README.md](origins/README.md) and raw exports byte-for-byte with [manifest](origins/gistda/manifest.json). After implementation approval validate/hash/parse the local JSON arrays, select exact Maize (not UC2's Cassava/Sugarcane), clip/union to the associated AOI and write derived records separately. No real API pulling. Query AOIs are not surveyed farms or cultivation. Review source-window/composition assumptions; synthetic shapes stay test-only.
3. Provide separate positive/complete-empty synthetic burn scenarios at their respective selected AOIs with newly matched Sentinel-2 imagery. Missing evidence stays unknown. User burnt/non-burnt case names are intended labels, not validated fire status.
4. Record uniform mock yield, harvest/burn/policy dates and explicit stock/replacement assumptions. Do not derive tonnes or burn from RGB.
5. Version/hash records and record provenance/authoring methods/units/CRS. Coordinate changes with contracts, backend, UI and tests.

## Boundaries

Use fictional companies only. Human confirmation does not make data real. No hidden test expected-result JSON in runtime ingestion/provider/assessment. Independent answers belong in `tests/fixtures/`, not here.

Existing imagery/WorldCereal/MODIS/candidate packet are superseded location references. See [assets guide](../docs/assets.md) and [notices](../THIRD_PARTY_NOTICES.md). The cap is corrected to **5 km²**; raw GISTDA files are supplied with user-confirmed publication permission, not pending acquisition. No key/account/network prerequisite. Only new Sentinel-2 frames remain future acquisition work. Source fields are just `result`, `update`, `geom`; missing metadata/area/yield remain unknown. Both maize updates are 2026-09-30, not confirmed procurement/fire chronology. Never fabricate fields or substitute WorldCereal.

Only deliberately publishable inputs belong here. The user confirmed permission for these specific exports; retain GISTDA attribution and honest source gaps, not a blanket license claim. Keep keys/private/unlicensed inputs/personal notes out of Git. No live GISTDA fetching/refresh in preparation/runtime. Snapshot revisions require updated hashes/review and invalidate stale results. Runtime traces stay ignored.

## Done when

Both PDFs map to exact origin/maize/reviewed evidence window and supplied crop geometry/new Sentinel-2 frame; mutations change values/support states. Local source hashes/schema and missing-metadata policy pass; query area is not cultivation, source/synthetic/mock roles persist, independent geometry/math references pass. Missing crop evidence blocks assessment, not zero. Source files are supplied, but no application gate has passed.
