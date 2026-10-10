# AutoTrace — Phased Implementation Plan

**Scope update, 2026-10-10:** the user approved the [four-GET FastAPI design](docs/design-backend-api.md) and explicitly requested implementation using prepared UC1 values and a blank UC2 template. The [backend app/setup](backend/README.md) and `data/demo/` records are implemented; 13 backend tests pass. The full-workflow phases/stack below are retained as the earlier plan; they are not passed or required for this reduced demo. This implementation does not claim frontend integration, completed UC2 values or the original larger gates.

**Status:** project structure, documentation and publication of reusable reference/assets approved; application implementation awaits explicit user approval.

**Purpose:** define assignable coding work, shared interfaces, expected outputs and verification. Owners are unassigned until people agree on them. Folder creation does not complete a feature. Read [AGENTS.md](AGENTS.md) and [contracts/README.md](contracts/README.md) first.

**Goal:** complete both controlled PDF-to-assessment workflows with actual extraction, human confirmation, supported scenario processing and reproducible calculations.

**Architecture:** a v2-derived static frontend and one Python helper bound to 127.0.0.1. A local GISTDA snapshot loader reads the two user-supplied response files, validates their manifest/schema and selects maize; no live GISTDA fetching adapter, key, refresh or account setup. Sentinel-2 imagery remains separate future preparation work for the same AOIs and a reviewed evidence window. Extraction, crop evidence, burn scenarios, geometry, mock production, calculation and reporting remain separate modules. The pitch is offline with frozen repository inputs.

**Tech stack:** HTML, compiled Tailwind CSS 3.4.17 and vanilla JavaScript; Python 3.11 with pypdf, Shapely, Rasterio/GDAL and standard-library local HTTP/JSON/Decimal/unittest; frozen GISTDA JSON exports and future Sentinel-2 preparation sources; Node.js with Playwright 1.58.2/Chromium for development-only PDF generation and browser QA. Section 4 defines required versions and phase usage.

**Execution boundary:** importing/publishing the two provided responses, their provenance and related documentation is approved. Application implementation, dependency installation, new imagery/PDF/scenario generation and deployment still need separate approval. Raw crop inputs are now supplied, but the local loader, derived origin records, proposed scripts and gate reports do not exist yet. All six implementation phases remain **NOT STARTED**; source publication does not pass an application gate.

## 1. Scope and success

Build a small local prototype that completes two controlled PDF-to-assessment workflows. Preserve the standalone v2 presentation and distinguish actual extraction/calculation automation from fictional procurement and synthetic environmental evidence. The narrower prototype requirements govern over any broader proposal.

Common workflow: PDF bytes → text/parser → editable source-backed review → document confirmation → supported cultivation-origin/period lookup → ScenarioBurnProvider and unchanged imagery → evidence/assumption confirmation → deterministic calculation → reviewed Thai template and trace export/replay.

The order/human gates remain unchanged. Origin lookup now resolves reviewed **GISTDA crop-polygon snapshots** for the selected AOI/crop/period rather than WorldCereal labels or a fictional production square. Factory scope includes any factory consuming the prototype-selected crop, including corn for animal feed and human food; the prototype crop remains maize/corn, not an implementation of every crop. Factory type/end use is contextual document metadata, not something inferred from satellite crop classification and not a different mass-balance denominator.

No production platform, arbitrary annual-report extraction, OCR mandate, live LLM/GISTDA fetching, trained detector, Journey/transport, nationwide coverage, cloud/database/login or third required cross-border use case. GISTDA keys/account/network access are not prototype setup prerequisites. Any future API integration is separately approved scope.

## 2. Cases and assumptions to approve before implementation

Use fictional procurement/claim documents and the **two user-selected query AOIs**, with the supplied GISTDA response exports as cultivation-polygon inputs. Exact normalized rings, corrected cap, source schema/limitations and file mappings are in [data/origins/README.md](data/origins/README.md) and [manifest](data/origins/gistda/manifest.json). UC1 was supplied as latitude/longitude; UC2 as longitude/latitude. Query boundaries remain distinct from crop geometry and surveyed farms.

| Case | Planned origin ID | User-designated scenario | Query AOI area, approximate | Crop / acquisition period |
|---|---|---|---:|---|
| UC1 | `TH-DEMO-AOI-01` | Burnt field | 4.519295 km² | Maize from [message.txt](data/origins/gistda/usecase1/message.txt); source update `2026-09-30` |
| UC2 | `TH-DEMO-AOI-02` | Non-burnt field | 4.000004 km² | Maize from [response.json](data/origins/gistda/usecase2/response.json); source update `2026-09-30` |

The user corrected the cap to **5 km²**; both projected query-polygon planning areas are below it. Provider area method is not embedded, but no API request is planned. Both raw files are JSON arrays with `result`, `update`, `geom`; UC2 also has Cassava and Sugarcane. Select `result == "Maize"` explicitly, never the first crop or all crops together. No `area`/`yield_avg`, original query/date range, endpoint/resolution or complete-coverage assertion is supplied. Preserve these gaps; `update` is not a supported procurement/harvest/burn period by itself. Review an evidence-window/composition policy before freezing final inputs. GISTDA accuracy is unmeasured; no surveyed-parcel, subtype or fire claim. WorldCereal is retired with no fallback.

**Procurement, yield/stock/replacement and burn scenarios remain mock unless explicitly qualified otherwise.** User case labels do not establish real burning/no burning. The cultivation denominator must be the union of matched GISTDA crop polygons clipped to the AOI, not the whole query boundary. Dates, cultivation hectares, Q, b, R and case-specific expected answers are to be frozen after source/period qualification; do not force new locations to inherit old toy values.

### Independent math-test references — not new-AOI production results

| Proposed input/result | Burn-linked case | Zero-burn case |
|---|---:|---:|
| Fictional cultivated area | 100 ha | 100 ha |
| Uniform mock yield | 5 t/ha | 5 t/ha |
| Q | 500 t | 500 t |
| Synthetic burn-associated intersection | 40 ha | 0 ha |
| b under uniform yield | 0.4 | 0 |
| R from document | 400 t | 400 t |
| C = Q × (1 − b) | 300 t | 500 t |
| B_min = max(0, R − C) | 100 t | 0 t |
| s_min = B_min / R | 25% | 0% |

These remain independent synthetic **unit-test** reference answers, not integrated answers for the newly selected AOIs or an API result. Keep a synthetic square/rectangle in `tests/fixtures/`, not the runtime GISTDA crop record. The provider must not store a preassigned verdict. Real GISTDA geometry plus mock yield/burn assumptions still produces a conditional prototype result, not measured production.

Explicit assumptions: all declared purchases concern the mapped origin/crop/period; uniform mock yield; all eligible non-burn supply can be selected first; explicit mock carry-in stock and external replacement are zero. Unknown or nonzero replacement is outside this closed-origin toy model and requires review.

Synthetic unit-test harvest/burn dates may use 2021-02-15/2021-02-20; these are not new-AOI acquisition or event dates. Integrated case chronology remains pending a matched crop/imagery window and explicit mock policy. Residue burning after harvest does not classify grain as physically destroyed.

What-if references: burn-positive with R=250 t gives no deficit; changed PDF R=350 t gives B_min=50 t and s_min=1/7 after confirmation; R=0 gives `no_purchases` and null/N/A share. R>Q is inconsistent with the declared closed-origin assumptions, not a confident sourcing conclusion.

## 3. Working versus simulated components

| Component | Nature | Boundary |
|---|---|---|
| PDF reading/parser, lookup, GIS processing, calculation and reporting | Actual software automation | Must execute with real inputs; controlled supported template only |
| Procurement/claim PDFs, yield/stock/policy records | Clearly fictional/mock | Human confirmation does not make them real |
| Query AOIs | User-supplied real-coordinate boundaries | Search/request extent, not cultivated parcels |
| Cultivation polygons | Supplied GISTDA export files, not synthetic API replies | Select exact maize, verify hash/schema, review date-composition policy, clip/union; retain missing source metadata as unknown |
| Burn layers | Separately labelled synthetic scenario evidence | Not inferred from GISTDA crops, user labels or RGB; real burn source not qualified |
| Sentinel-2 true-colour base | Planned acquisitions for the two new AOIs | Old imagery is historical only; new dates/frames pending; RGB is not burn proof |
| Field correction and document/evidence/report confirmation | Human interventions | Logged separately from automated processing |
| Real parcels/detector validation, OCR/LLM/cross-border | Deferred | No capability or accuracy claim without qualified execution |

## 4. Architecture and outputs

- `frontend/`: v2-derived static HTML/compiled styling/local fonts and vanilla JS, no framework migration.
- Supplied design inputs: [historical standalone v2](docs/reference/autotrace-v2.html), original imagery/provenance, matching typography/icon, illustrative photo and licenses. Read [docs/assets.md](docs/assets.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md); verify [asset-manifest.json](frontend/assets/asset-manifest.json). The archive is not the new application and its old extraction/assessment behavior must be replaced.
- `backend/`: one loopback-only Python helper; `ingestion/`, `geospatial/`, `assessment/` are separate modules in that process, not microservices.
- `contracts/`: one shared definition for document/review/origin/provider/calculation/evaluation records.
- `data/documents/`: fictional text PDFs for selected-crop consuming factories; `data/origins/`: canonical query AOIs, approved GISTDA snapshots and matching crop/period/frame records; `data/scenarios/`: separately labelled synthetic burn and mock production records.
- `tests/fixtures/`: independent test oracle/mutation inputs, never extraction or assessment runtime answers.
- `scripts/`: launch/preflight, controlled-PDF creation, UI/offline test and recording tools.
- `outputs/`: actual run snapshots, reports and per-case evaluation evidence, ignored by Git.

### Required technology stack

These are the planned technologies, not a menu of interchangeable frameworks. Inspect/pin the actual working environment in Phase 1; do not silently substitute a framework or add dependencies. The package versions below were available during read-only discovery, not yet acceptance-tested in the new application.

| Layer | Required technology/version baseline | Purpose and phases |
|---|---|---|
| Frontend | HTML5, vanilla JavaScript, compiled Tailwind CSS **3.4.17** | Preserve supplied v2; local DOM/SVG overlay layers and state handling; Phase 5 |
| Presentation | Supplied WebP/WOFF2/icon assets and provenance | Repository-relative loading; no image repainting/CDN fonts; Phases 1, 3, 5, 6 |
| Helper/runtime | Python **3.11**; inspected patch **3.11.15** | One process; stdlib `http.server`, `json`, `hashlib`, `decimal`, `datetime`, `pathlib`; Phases 1–6 |
| PDF extraction | **pypdf 6.19.0** | Read actual supported PDF page text; Phase 2 |
| Geometry | **Shapely 2.1.2** | Validate/clip/union GISTDA crop polygons, intersect separate burn layers, independent synthetic-shape tests; Phase 3 |
| Crop snapshot input | **Supplied GISTDA JSON arrays**, local `json`/`hashlib` loader | UC1 message.txt, UC2 response.json and manifest; no API HTTP client/authentication/refresh; Phases 1 and 3 |
| Imagery acquisition | **Sentinel-2** provider/STAC evidence for each selected AOI | Preparation only; exact dates/coverage/frame/source hashes; Phase 3 |
| Projection/frame | **Rasterio 1.4.4** with its GDAL/PROJ dependencies | EPSG:4326↔32647 transforms, rounded source window and display affine; Phase 3 |
| Unit/integration tests | Python stdlib **unittest** | Actual helper/module tests; no extra pytest dependency required; Phases 1–6 |
| Development browser tools | Node.js; inspected **26.3.1**; **Playwright 1.58.2** with its matching Chromium | Controlled text-PDF generation, browser interaction, responsive/offline checks; Phases 1, 2, 5, 6 |
| Data/report artifacts | Versioned JSON/GeoJSON, text PDFs, deterministic Thai HTML/report template | Explicit mock/synthetic provenance, frozen snapshots and replay; Phases 2–6 |

Phase 1 must record a verified Python patch, Node version, Chromium revision and native-library versions. Pin direct Python packages plus resolved dependencies in `requirements.txt` and Node development dependencies in `package.json`/`package-lock.json`; manifests are future deliverables, not present files. If the supplied version baseline cannot be reproduced on a contributor's platform, report the constraint and agree on a version change before proceeding.

Reuse v2's compiled CSS by default. If new utility classes require recompilation, use the pinned Tailwind 3.4.17 development tool, never runtime CDN compilation. Node is not required to run the prepared pitch application; it is a preparation/QA dependency. Standard-library templates/math suffice; no FastAPI, React, database, OCR engine, LLM API or new detector package.

GISTDA inputs are the **two provided frozen files**, not documentation examples or mocked API replies. The user confirmed permission to publish these specific responses; record that attestation/attribution without inventing a blanket provider license. Verify raw hashes/schema and exact crop/AOI association. Endpoint/product/resolution/date-range/coverage and numeric yield are absent; document unknowns and obtain reviewed scenario/date assumptions rather than fetching replacements. Missing/corrupt/unsupported files fail closed. Credentials/authentication/rate-limit/connectivity testing and an API fetching adapter are removed from the MVP. Prepare new Sentinel-2 assets only after approval.

The pitch requires no external network after authorized evidence/assets/dependencies are prepared. The helper serves approved paths only, bounds uploads, escapes source text and binds 127.0.0.1. Do not serve ignored local research or arbitrary filesystem paths. Launch commands are to be implemented and verified later, not claimed now.

### Image/geometry requirements

Selected query rings are canonical in [data/origins/README.md](data/origins/README.md). Use EPSG:4326 [longitude, latitude] for requests/display and EPSG:32647 for these two AOIs' metre-area processing. GISTDA crop polygons and Sentinel-2 display frames must be prepared independently for each location and matched to the confirmed document period. Preserve returned geometry/source versions; derive clipped/unioned cultivation geometry with a separate audit. Returned query-area summaries are not an excuse to use AOI area as cultivation.

The original v2 images/projection metadata and copied WorldCereal `frontend/assets/usecase2/` packet are **superseded location references**, not the new cases' imagery/crop evidence. Do not reuse their 2021 dates, frame, AOI, 59.36-ha context extent or old synthetic square in runtime records. Preserve historical bytes/notices. Later acquire actual Sentinel-2 RGB and record crop/window/resize/object-fit transforms/hashes for each new AOI; no imagery painting or geographic-bbox-percentage overlay shortcut. No new images are acquired by this documentation revision.

Suggested display rounding: m²/ha/tonnes to 2 decimals, percentage to 1 decimal; retain unrounded reference values in trace JSON. Do not silently truncate or change denominators.

Reference tolerances: projected shape area 0.01 m²; coordinate round trip 0.01 m; geographic round-trip relative area error 1e-6; tonne calculations 1e-9 t; share ratios 1e-12. These match [tests/README.md](tests/README.md). Record actual CRS/method and justify any tolerance change before accepting it; display rounding is tested separately.

## 5. Phase execution and exit-gate rules

### Phase order and compatibility with folder guides

| Phase | Existing work-package label | Owner | Prerequisite | Focused effort | Current gate |
|---|---|---|---|---|---|
| 1 | W1 | Unassigned | Explicit implementation approval; GISTDA/imagery prerequisites identified | 1–1.5 h | NOT STARTED |
| 2 | W2 | Unassigned | G1 PASS | 2–3 h | NOT STARTED |
| 3 | W3 | Unassigned | G2 PASS | 2.5–4 h | NOT STARTED |
| 4 | W5 | Unassigned | G3 PASS | 2–3 h | NOT STARTED |
| 5 | W4 | Unassigned | G4 PASS | 3–4 h | NOT STARTED |
| 6 | W6 | Unassigned | G5 PASS | 3–4 h | NOT STARTED |

The W labels remain unchanged so component READMEs stay consistent: **W4 means frontend, W5 means assessment**, even though assessment is now scheduled first. The table retains prior implementation-only estimates (**13.5–19.5 hours** total); local snapshot qualification, new imagery/date selection and case-oracle revision require a new estimate after source/window review. Do not present the prior total as a complete estimate for the revised architecture.

Default to sequential gates. Independent component work may overlap only after shared contracts are frozen and owners agree; it cannot bypass prerequisite gates. No separate ownership/work-log system is required.

### Gate contract — applies to every phase

1. A phase has an entry condition, required stack, scoped files, test-first tasks and an explicit exit gate. Files/scripts named below are **proposed implementation targets**, not existing runnable commands/APIs.
2. For each behavior, run a small vertical RED → GREEN → REFACTOR cycle: write one focused failing test, verify the expected missing behavior, implement the minimum, rerun it and affected regressions, then refactor. Do not write all tests followed by all implementation. Split each listed task into those short actions.
3. Implement one cumulative verifier in Phase 1: `python scripts/verify_phase.py --phase N`. It runs gates 1 through N, manages any required test helper process, waits for an actual health response, records raw outputs and exits nonzero on any failed or blocked mandatory check. It must not count a skipped check, zero collected tests, a missing tool/file or a fabricated response as a pass.
4. Write actual evidence under `outputs/phase-N/`: `gate.json`, raw command logs and relevant per-test/per-case artifacts. Each gate record contains phase/criteria IDs, input/source hashes, tool versions, actual command/exit code, expected/observed results, tolerances, pass/fail/blocked status and evidence paths. Identify criteria as G1.1, G1.2, etc. in the listed order, and likewise for other gates. Record the starting Git revision and hashes of uncommitted source changes so the tested working tree is identifiable. A cumulative rerun must compare against the current source/input fingerprints, not accept an old PASS file.
5. **PASS:** every required criterion is verified, with fresh evidence, and earlier gates still pass. **FAIL:** a criterion is violated. **BLOCKED:** a prerequisite, test, tool or required review could not be executed. FAIL/BLOCKED keeps the gate closed; partial results do not authorize advancement.
6. On failure, retain evidence, identify the specific blocker/root cause, fix within scope, then rerun the phase and affected earlier gates. Do not weaken reference answers, hide missing data or mark a gate passed from screenshots/self-reports alone.
7. Update the phase status/owner in this plan only from actual execution. A gate PASS does not itself authorize commits, pushes, deployment or additional scope. Implementation proceeds only within the user's approved scope.

### Phase 1 — Foundation, contracts and reproducible tools (W1)

**Objective:** establish a reproducible, safe foundation before feature implementation.

**Entry:** explicit application/dependency-setup approval and supplied asset bundle available. **Owner:** unassigned. **Required stack:** Python 3.11/std-library HTTP, JSON, SHA-256 and unittest; pinned Python dependencies; Node/Playwright/Chromium for later preparation/QA.

**Scoped files:** create `requirements.txt`, `package.json`, `package-lock.json`, `backend/__init__.py`, `backend/server.py`, `backend/validation.py`, `scripts/preflight.py`, `scripts/launch.py`, `scripts/verify_phase.py`, `tests/__init__.py`, `tests/test_assets.py`, `tests/test_server.py`, `tests/test_contracts.py`, `tests/test_preflight.py`, `tests/test_gates.py`; refine `contracts/README.md` and `README.md` setup instructions. Preserve `docs/reference/autotrace-v2.html` and all inventoried originals.

**Test-first tasks:**

1. Test asset hash/font-reference closure and explicit missing-prerequisite failures; implement preflight without modifying historical assets. Define selected-AOI/source records and preparation versus runtime readiness; historical assets cannot satisfy selected-case imagery checks.
2. Freeze shared payloads, decimal serialization, state/revision semantics and logical endpoint contracts; test invalid required fields/enums/units and implement bounded validation. Keep one shared schema, not competing frontend/backend definitions.
3. Test `/health`, approved static roots, path containment and bounded request handling; implement the one loopback helper. Reserve API operations for actual later features rather than returning canned success payloads.
4. Test verifier behavior on nonzero exit, missing artifact/tool, skipped required check and zero test collection; implement cumulative gate/evidence handling.
5. Record/pin tool versions and transitive dependencies; verify setup in an isolated environment after authorization. Implement preflight/launch of the real helper at `127.0.0.1:8765`. Verify both response bytes against their manifest; do not require a GISTDA key/account/network. Source/date semantics and derived geometry are qualified by G3, not assumed from file presence.

**Verification:** `python scripts/preflight.py`; `python -m unittest tests.test_assets tests.test_server tests.test_contracts tests.test_preflight tests.test_gates -v`; `python scripts/verify_phase.py --phase 1`. The verifier must also exercise its own failure/blocked cases. Exit code 0 is necessary but insufficient without the criteria/evidence below.

**Exit gate G1 — all required:**

- [ ] Supplied hashes/licenses/font references pass; required assets are repository-relative and missing inputs fail clearly.
- [ ] Runtime/dev manifests and exact versions are recorded; a prepared environment can import all required libraries and launch matching Chromium. No private environment paths are required.
- [ ] Real helper health/static checks pass; bind is loopback-only; encoded/traversal/outside-root paths and oversized requests are rejected. No research/credential folders are served.
- [ ] Shared contracts, revision/fingerprint rules, frozen GISTDA/query-AOI versus cultivation provenance and factory crop-use metadata are agreed; corrected 5 km² cap recorded, actual missing source fields labelled unknown. No fake feature endpoint or GISTDA credentials prerequisite.
- [ ] Cumulative verifier fails closed in its negative tests and writes actual G1 evidence. No mandatory test is skipped or uncollected.

**Output/unlock:** pinned/preflighted tools, shared contracts, safe running helper and G1 evidence; unlocks actual document ingestion.

### Phase 2 — Actual PDF extraction and document review records (W2)

**Objective:** prove file contents determine extracted values and preserve correction/confirmation history.

**Entry:** G1 PASS. **Owner:** unassigned. **Required stack:** pypdf 6.19.0, Python JSON/Decimal/hashlib/unittest, Node Playwright 1.58.2/Chromium for offline text-PDF printing. No OCR/LLM extraction.

**Scoped files:** create `backend/ingestion/__init__.py`, `backend/ingestion/pdf_text.py`, `backend/ingestion/template_parser.py`, `backend/review.py`, `scripts/generate_documents.cjs`, `data/documents/template.html`, `data/documents/burn-linked.pdf`, `data/documents/zero-burn.pdf`, `tests/fixtures/document-oracles.json`, controlled PDF mutation inputs, `tests/test_extraction.py`, `tests/test_confirmation.py`; wire ingestion/review operations in `backend/server.py`.

**Test-first tasks:**

1. Independently specify the ten essential fields and source-page expectations; generate conspicuously fictional one-page text PDFs for selected-maize consuming factories. Include contextual factory type/crop end use (feed, human food, other/unspecified) without narrowing the crop to feed maize. Preserve exact selected origin IDs. Final period/quantity inputs await source qualification; test-only provisional inputs must be labelled. Distinguish PDF creation from extraction and do not derive oracle answers from the parser.
2. Test actual PDF bytes → page text → controlled-label fields/page-line pointers, including missing/duplicate labels; implement reader and parser separately.
3. Test same bytes with renamed files, changed bytes with the same filename, quantity 350 t, changed period and origin; implement validation that reads the content without fixture substitution.
4. Test corrupt/encrypted/image-only/unsupported-template input and missing/negative/nonfinite/unit/date errors; implement explicit states without claiming text extraction is OCR.
5. Test corrections, original/extracted/corrected audit data, confirmation fingerprints and edit/upload invalidation; implement document review operations. Assessment is not yet available and must not return a verdict.

**Preparation:** `node scripts/generate_documents.cjs` creates the agreed PDFs once, explicitly recording their hashes. Do not overwrite reviewed fixtures during cumulative gate reruns. Regeneration is a deliberate input revision, not an invisible test setup step.

**Verification:** `node scripts/generate_documents.cjs --check`; `python -m unittest tests.test_extraction tests.test_confirmation -v`; `python scripts/verify_phase.py --phase 2`. Implement `--check` as read-only validation of existing PDF/template content; byte identity of newly printed PDFs is not assumed because PDF metadata may contain timestamps. Gate re-extracts the actual PDFs and temporary mutation inputs via the helper, not only mocked parser calls.

**Exit gate G2 — all required:**

- [ ] Both fictional PDFs produce the ten expected field values and verifiable source text/page pointers; template/mock labels persist. Feed and human-food factory examples are supported as contextual metadata, never inferred crop subtypes. G2 ingestion tests may use explicit provisional dates/quantities; matched final case PDFs are revalidated by G3/G4.
- [ ] Renaming does not change extraction; changed contents do. Quantity/period/origin mutations produce the new values, not button/filename answers.
- [ ] Negative document/template/value cases produce named invalid/unsupported/review-needed outcomes, not confident defaults.
- [ ] Document corrections/confirmations and invalidation work through real helper calls with original values retained.
- [ ] Field-level correctness before correction, missing/incorrect/correction-required fields and correctness after scripted correction are recorded separately. Scripted review duration is not reported as human time.
- [ ] G1 regressions pass and actual G2 test/field evidence exists.

**Output/unlock:** actual extraction/review backend, supported PDFs and independent document oracles; unlocks origin/evidence processing.

### Phase 3 — GISTDA crop evidence, selected-AOI imagery and geometry (W3)

**Objective:** qualify/load the provided GISTDA exports locally and prepare matching Sentinel-2 frames for both selected AOIs, then process separate burn scenarios and explicit mock production assumptions. No GISTDA acquisition/refresh implementation.

**Entry:** G2 PASS, supplied response files/manifest, implementation/dependency approval and separate imagery-acquisition approval. **Owner:** unassigned. **Required stack:** Python local JSON/hashlib snapshot loader, Shapely 2.1.2, Rasterio 1.4.4/GDAL/PROJ, Decimal/unittest; Sentinel-2 source imagery/metadata. Only imagery preparation may use an approved network source; crop loading/pitch/replay are local. No geocoder, live crop API or new burn model.

**Scoped files (future):** create `backend/geospatial/__init__.py`, `backend/geospatial/gistda_snapshot.py` (local loader only), `backend/geospatial/origin_lookup.py`, `backend/geospatial/scenario_provider.py`, `backend/geospatial/geometry.py`, `backend/geospatial/image_frame.py`, `backend/geospatial/production.py`, `scripts/prepare_imagery.py`; derived `data/origins/th-demo-aoi-01.json`, `data/origins/th-demo-aoi-02.json`, `data/origins/image-frame-01.json`, `data/origins/image-frame-02.json`, new imagery under `frontend/assets/selected-aois/`, `data/scenarios/burn-linked.json`, `data/scenarios/zero-burn.json`, `data/scenarios/production.json`, `tests/fixtures/geometry-oracles.json`, `tests/test_gistda_snapshot.py`, `tests/test_origin_scenario.py`, `tests/test_geometry.py`, `tests/test_production.py`. The supplied `data/origins/gistda/usecase1/message.txt`, `usecase2/response.json` and manifest already exist; preserve originals. No `scripts/prepare_gistda.py` or API adapter is needed. Integrate helper operations without assessment verdicts.

**Test-first tasks:**

1. Test local raw-file/manifest loading: missing/corrupt/hash-mismatched/invalid-schema/duplicate-or-absent-maize inputs stop; UC1 parses JSON despite `.txt`; UC2 selects Maize rather than first-record Cassava or combined crops. Implement the bounded local loader; no fetching/authentication/refresh. Test changing source bytes invalidates affected evidence fingerprints.
2. Review source `update`/unknown request-period/coverage and geometry-composition semantics; record a supported window/policy and explicit mock assumptions. Test exact country/origin/crop/window lookup, unknown metadata and mismatches; preserve raw/query/derived shapes separately. Metadata gaps must not become invented fields or zero cultivation. Case/source association is user-declared, not embedded original request proof.
3. Test crop polygon clipping/union, CRS conversions, biweekly date/season handling and independent synthetic shape oracles; implement geometry using EPSG:32647. Do not sum repeated updates as new cultivation acreage or production. Whole AOI area, generic factory capacity and old context raster labels cannot substitute for cultivation area.
4. Acquire real Sentinel-2 for each new AOI/period; test source-frame/round trips/display object-fit mapping and matching dates/coverage. Preserve original RGB. Revalidate final documents/oracles after freezing supported dates/quantities.
5. Test separate ScenarioBurnProvider payloads for positive/complete empty/missing/unsupported burn coverage; derive conditional Q/b from reviewed clipped/unioned maize geometry and explicit mock yield/burn/timing/stock assumptions. These exports contain no `area`/`yield_avg`; compute geometry area, use reviewed mock yield and label it accordingly, never invent source yield or measured Q.

**Verification:** `python -m unittest tests.test_gistda_snapshot tests.test_origin_scenario tests.test_geometry tests.test_production -v`; `python scripts/verify_phase.py --phase 3`. Exercise the actual supplied files plus independent mutated negative fixtures with external-network requests blocked. G3 requires raw hash/schema/crop selection, honest source gaps, reviewed supported window/composition/assumptions and real derived-geometry/frame tests, not a successful API call or canned result. Imagery acquisition is separately approved preparation. Independent geometry checks use analytic rectangles/shoelace references; QGIS is optional, never claimed unless executed.

**Exit gate G3 — all required:**

- [ ] Exact UC1/UC2 query rings and supplied maize snapshots resolve under an explicitly reviewed supported evidence-window/composition policy with matched new Sentinel-2 frames. Unknown source request dates are not invented; unsupported country/address/crop/date/partial-period inputs stop. Factory end use does not reject human-food corn or invent subtype evidence.
- [ ] Both preserved response hashes/schema and exact maize selection pass offline; 5 km² user-corrected cap and user-confirmed publication permission are recorded. Absent request/product/CRS/period/coverage/yield fields remain unknown with reviewed assumptions/limits; update alone does not satisfy date support. Missing/corrupt/unsupported sources stop; no fetching, fallback or fabricated metadata.
- [ ] Complete synthetic empty coverage yields zero intersection/b; missing coverage remains unknown. The provider contains no preassigned assessment result.
- [ ] 1000×1000 m cultivation = 1,000,000 m² = 100 ha = 625 rai; 400×1000 m burn intersection = 400,000 m² = 40 ha. Clip/union/hole/disjoint/invalid-shape references pass without double-counting or area in degrees.
- [ ] Exact per-case source/display affine and coordinate round trips are verified for the newly selected locations; user query AOIs and clipped GISTDA crop polygons are distinct. No old image frame/date is substituted and no RGB pixels are repainted.
- [ ] Q/b use reviewed crop union area and explicit mock assumptions; independent toy tests retain Q=500/b=.4 or 0, but final case-specific reference answers are frozen separately from actual crop snapshots. Unknown/mismatched production inputs cannot become zeros/confident assessments.
- [ ] Geometry/provider/image/production provenance, CRS, timing, rounding/tolerances and prior-gate regressions are recorded in G3 evidence.

**Output/unlock:** supported AOI/frame fixtures, synthetic alternative layers and tested Q/b derivation; unlocks deterministic assessment.

### Phase 4 — Deterministic assessment, Thai template and replay (W5)

**Objective:** deliver a fully guarded assessment API and reproducible result/report records before UI integration.

**Entry:** G3 PASS. **Owner:** unassigned. **Required stack:** Python Decimal/JSON/hashlib/unittest, standard-library template/string escaping; existing confirmation and evidence modules. No LLM dependency.

**Scoped files:** create `backend/assessment/__init__.py`, `backend/assessment/mass_balance.py`, `backend/assessment/reporting.py`, `backend/assessment/trace.py`; `backend/assessment/templates/report-th.html`, `tests/fixtures/calculation-oracles.json`, `tests/test_calculation.py`, `tests/test_report_replay.py`, `tests/test_assessment_api.py`; extend `backend/review.py`/`backend/server.py` for evidence confirmation, guarded assessment and export/replay.

**Test-first tasks:**

1. Specify independent numerical/status answers; test the three equations with t/kg normalization, boundaries and R=0; implement pure calculation functions with raw precision separate from display rounding.
2. Test missing/nonfinite/negative values, b outside [0,1], unknown/nonzero replacement, R>Q under closed-origin assumptions and origin/period/unit mismatches; implement fail-closed status/reason handling.
3. Test direct assessment calls without current document/evidence confirmation, forged/stale fingerprints and changed inputs; enforce both backend gates. An uploaded or human-confirmed mock remains mock.
4. Test deterministic Thai report numbers/labels/limitations and source pointers; implement a labelled template, not a live-LLM response or compliance/misconduct verdict.
5. Test frozen snapshots, hash/version mismatch, correction provenance and replay; export trace JSON plus printable HTML only after report review confirmation. Replay uses frozen confirmed inputs, not current fixtures substituted silently.

**Verification:** `python -m unittest tests.test_calculation tests.test_report_replay tests.test_assessment_api -v`; `python scripts/verify_phase.py --phase 4`. Gate performs complete backend PDF→review→evidence→confirmation→assessment sequences for both cases and checks independently defined answers.

**Exit gate G4 — all required:**

- [ ] Independent toy math tests: Q=500,b=.4,R=400 → C=300,B_min=100,s_min=.25; b=0 → C=500,B_min=0,s_min=0. Actual selected-AOI cases also match separately defined source-backed geometry/mock-input oracles; toy values are not forced onto GISTDA results.
- [ ] Positive burn with R=250 gives no deficit; R=350 gives B_min=50 and s_min=1/7; R=C gives zero deficit; b=1,R=400 gives share 1; R=0 gives `no_purchases` with null/N/A share.
- [ ] 400000 kg maps explicitly to 400 t; R remains the denominator. All incompatible/missing/model-inconsistent cases return the specified non-confident states.
- [ ] Direct backend bypasses/stale confirmations are rejected; every valid result is linked to the immutable confirmed document/evidence snapshot.
- [ ] Thai template/export labels and numbers match the result; replay reproduces numeric/status/report body except declared run/timestamp metadata. All source and evidence hashes/corrections/assumptions are traceable.
- [ ] Prior gates and independently specified math/status/replay checks pass with actual G4 evidence.

**Output/unlock:** guarded, tested calculation/report/export backend; unlocks integration of the preserved UI with real operations.

### Phase 5 — v2 frontend and human-in-the-loop integration (W4)

**Objective:** complete both user walkthroughs in the actual UI without stale/early assessment behavior.

**Entry:** G4 PASS. **Owner:** unassigned. **Required stack:** HTML5, supplied compiled Tailwind 3.4.17 styling, vanilla JavaScript, DOM/SVG synthetic layers, local fonts/images; Playwright 1.58.2/Chromium against the actual helper. No frontend framework or browser-side alternate calculation engine.

**Scoped files:** create `frontend/index.html`, `frontend/styles.css`, `frontend/app.js`, `frontend/workflow-state.js`, `frontend/api.js`, `scripts/test_workflows.cjs`, `scripts/test_presentation.cjs`; retain inventoried assets/reference unchanged and update `frontend/README.md` for implemented behavior.

**Test-first tasks:**

1. Test no-document/no-results initial state and disabled gated actions; adapt the v2 presentation into new frontend files, removing old canned extraction and initial Medium results.
2. Test selecting/uploading actual PDFs, displaying source/pages/validation, editing critical fields and document confirmation; wire actual extraction/review endpoints.
3. Test selected AOI/crop-period evidence/assumption screens, GISTDA crop provenance versus user query boundary, crop-use/factory context, unchanged Sentinel-2 and distinct real/simulated/mock labels; wire operations. A feed-mill illustration or historical WorldCereal overlay is not the default identity/source for every factory.
4. Test backend result rendering, Thai report review/export, changed PDF/corrections/scenario assumptions and recomputation; keep original/extracted/corrected values traceable.
5. Force asynchronous responses to arrive out of order; test revision/fingerprint rejection and stale confirmation/result/export invalidation. Do not satisfy these tests with fixed frontend scenario answers.
6. Exercise comparison slider, narrative/equations, dashboard/fullscreen/exit, keyboard, reduced motion and responsive source-review controls without introducing a new design system.

**Verification:** `node scripts/test_workflows.cjs --base-url http://127.0.0.1:8765`; `node scripts/test_presentation.cjs --base-url http://127.0.0.1:8765`; `python scripts/verify_phase.py --phase 5`. The gate starts/checks the helper before browser tests; never rely on a blind sleep or screenshots of the archive.

**Exit gate G5 — all required:**

- [ ] Both required UI workflows read actual supported PDFs through review/correction, origin mapping, evidence/assumption confirmation, calculation, report review and export.
- [ ] Source text/page pointers and all critical editable fields/validation are usable; users cannot calculate before the required human confirmations.
- [ ] Quantity/period/origin document mutations and human corrections change results/support states; scenario/input edits revoke affected gates/results/exports.
- [ ] Late responses never replace current state; direct backend confirmation bypass protections from G4 still pass.
- [ ] New selected-AOI Sentinel-2 remains unchanged; user query bounds, GISTDA crop polygons, synthetic burn/mock production and provenance/unknown versus zero are visibly distinct. Human-food/feed/other factory metadata does not imply remotely verified corn end use.
- [ ] Desktop 1440×900/1280×800 and mobile 390×844/360×800 presentation checks, slider/dashboard/fullscreen/keyboard/reduced-motion checks and earlier gates pass. Record visual review alongside browser assertions.

**Output/unlock:** actual integrated two-case UI with human-review gates and trace exports; unlocks release-style evaluation/offline acceptance. Passing automated UI tests alone does not measure human review time or real-world accuracy.

### Phase 6 — Final evaluation, offline rehearsal and delivery (W6)

**Objective:** prove the agreed prototype is reproducible and pitch-ready, with honest measured evidence.

**Entry:** G5 PASS. **Owner:** unassigned. **Required stack:** locked runtime/dev stack from Phase 1, unittest, Playwright/Chromium, actual helper/fixtures/reporting; JSON evaluation records. No new mandatory service or package.

**Scoped files:** create `scripts/evaluate.py`, `scripts/test_offline.cjs`, `scripts/test_reproducibility.py`, `scripts/record_demo.cjs`, `docs/demo.md`, `docs/evaluation.md`; update actual `README.md` launch instructions/limitations; retain raw per-case/gate results under ignored `outputs/`.

**Test-first tasks:**

1. Test evaluation aggregation retains per-field/per-case denominators, failures/unsupported outcomes, corrections and separate automated/human timing; implement records without combining A/B/C into an unsupported accuracy metric.
2. Test offline failure detection, including an intentionally attempted external request; block every non-loopback browser request and deny helper egress during the test. Reload and complete both workflows and changed-document cases; record zero unexpected external requests, not just successful loading from prior cache.
3. Verify a fresh clone/isolated prepared environment with documented setup, exact dependency lockfiles, actual launch/health checks, both cases, negative paths and snapshot replay. Installation/preparation may use the network; the pitch run may not.
4. Perform a human-led rehearsal for each case with the user/designated reviewer; record actual review/corrections/interventions/timing separately from scripted interaction. If no human rehearsal is possible, record that criterion as BLOCKED rather than inventing human timings.
5. Prepare a backup recording, or a clearly identified runnable recording step with exact start conditions/command/output path and operator. Document limitations and sanitize any selected public evaluation summaries.

**Verification:** `python -m unittest discover -s tests -p 'test_*.py' -v`; `python scripts/evaluate.py`; `node scripts/test_offline.cjs --base-url http://127.0.0.1:8765`; `python scripts/test_reproducibility.py`; `python scripts/verify_phase.py --phase 6`. Optional recording command: `node scripts/record_demo.cjs --base-url http://127.0.0.1:8765`. These commands must be implemented/exercised before being advertised as launch/QA tools.

For offline verification, add a test-only helper network guard that rejects/logs non-loopback socket/DNS attempts as well as Playwright browser routing; prove the guard catches an intentional attempt. Report this as process-level egress denial, not an OS firewall test unless an OS-level block is actually exercised. The reproducibility script runs earlier gates and workflows in the isolated copy; it must not invoke itself recursively through another full G6 run.

If source changes are not yet committed, build the isolated test copy from a fresh checkout plus a recorded, sanitized snapshot of approved working-tree changes, and verify source/input hashes match. Label it isolated-source reproducibility, not published-clone completeness. After commit/push authorization, also verify an unmodified fresh remote clone. This avoids requiring an unauthorized commit just to run the gate.

**Exit gate G6 — final delivery gate, all required:**

- [ ] G1–G5 rerun successfully against the deliverable versions; both actual UI/backend workflows and required negative paths pass, with no skipped mandatory checks.
- [ ] Automated extraction before/after correction, missing/incorrect fields, software/math/geometry outcomes and reference quality are recorded separately. Real-world crop/fire accuracy is explicitly unvalidated.
- [ ] Both workflows, upload mutations, confirmations, exports and replay complete with external network blocked and helper egress denied. Offline harness negative control actually detects an external attempt.
- [ ] Fresh-clone/prepared-environment execution uses repository assets and documented commands; originals/hashes/licenses are preserved and no personal paths/credentials are required.
- [ ] Actual human rehearsals/timings/corrections/interventions are recorded separately from test automation; no unmeasured savings claim.
- [ ] Desktop/mobile/fullscreen results, report limitations, actual setup/launch/version instructions and backup video or identified recording step exist.
- [ ] Final `outputs/phase-6/gate.json` identifies every acceptance criterion, actual evidence and remaining limitations. Privacy/publication scope is checked; no private raw outputs are pushed automatically.

**Output:** verified prototype and reproducible delivery/evaluation evidence. If any mandatory criterion is FAIL/BLOCKED, report the exact incomplete gate and do not claim prototype completion.

## 6. Acceptance and evaluation

The detailed test matrix is in [tests/README.md](tests/README.md). Required gates:

1. Both workflows read actual supported PDF contents; no fixture substitution or filename-derived extraction.
2. Source text/page pointers, editable validation and explicit human confirmation work in UI and backend.
3. Changed PDF quantity/period/origin and corrected values affect the appropriate downstream values/states; stale results/exports are invalidated.
4. Unsupported countries/origins/crops/periods, corrupt/image-only/encrypted inputs, missing/negative/nonfinite values, invalid geometry/units and unknown/model-incompatible assumptions produce explicit states.
5. Complete synthetic empty burn is zero; missing evidence remains unknown. Burn-positive can yield no deficit.
6. Geographic/temporal/image/provider/fixture provenance is preserved. No province-wide extrapolation or RGB-derived tonnes.
7. Known synthetic geometry/union/clip/unit results and independently defined mass-balance values match tolerances.
8. Exports trace document → extraction/corrections → confirmations → fixtures/evidence/assumptions → result/report. Replaying a frozen snapshot reproduces numerical/status/report content aside from declared metadata.
9. Desktop 1440×900 and 1280×800; mobile 390×844 and 360×800; controls/source review, slider/layers, fullscreen/exit, keyboard and reduced motion tested. Name any browser limitation.
10. Reload and finish both cases with every non-loopback request blocked. Actual launch instructions, versions, limitations and backup recording/video step documented.

Evaluation separates A software/calculation correctness, B reference quality, C real crop/fire accuracy. C is unvalidated in core. Extraction reports before-human-correction field correctness, missing/incorrect/correction-required fields and correctness after correction separately. Retain per-case outcomes, actual auto/human processing time, failures/unsupported states and interventions. No time-savings claim without measured baseline, arbitrary-report accuracy claim or single AutoTrace accuracy percentage.

## 7. Optional independent source-quality study

Not on the core critical path; requires separate approval. Maximum two focused hours: 30 minutes suitability/permission check, 60 minutes native-resolution comparison only if qualified, 30 minutes results/gaps note.

Require independent authorized reference polygons/crop labels, measured cultivated extent/method, matching source year/season and known independence where possible. Compare GISTDA product geometry against those references, not against its own response or a screenshot. Do not treat official API status as an accuracy result, query boundaries as cultivation, corn as a remotely established feed/food subtype or unlabelled areas as negatives. WorldCereal comparison is not active scope.

Report area error/IoU only where valid; precision/recall only with sufficient explicitly labelled positive/negative coverage. Few selected parcels support a case study, not national accuracy. If references fail requirements/timebox, mark pending and do not block core.

Frozen source mapping, actual schema and remaining support gaps: [data/origins/README.md](data/origins/README.md). [GISTDA documentation](https://sphere.gistda.or.th/docs/web-service/crop-information/) is reference context, not a loader contract or required acquisition step.

## 8. Cut line and pitch claims

Never cut actual extraction, human gates, both cases, origin/period guards, explicit synthetic labels, math correctness, traceability, evaluation recording, mobile/offline checks or real launch documentation. Drop optional parcel work, extra animation, context overlays and export/video polish first. JSON plus printable HTML is sufficient; a clearly identified recording step may substitute for edited video. If required gates cannot pass, report a specific blocker rather than partial completion as success.

After actual acceptance verification, claim a working human-reviewed controlled document-to-assessment workflow with checkable scenario calculations and provenance. State the actual tested template/cases/test counts/timings. Do not claim real detector precision/recall, arbitrary report/OCR accuracy, real company sourcing/misconduct, physically destroyed grain, compliance, national validity or unmeasured savings.

## 9. Remaining approval and prerequisite boundary

The two GISTDA exports and provenance are supplied with user-confirmed publication permission; the cap is corrected to 5 km². No key/account/API fetching prerequisite remains. Owners are unassigned. Still pending: implementation approval, source update/window/composition review (request/product/coverage metadata is absent), clipped/unioned origin records, matched Sentinel-2 dates/frames, final case PDFs/oracles, separate scenarios, dependency setup and application tests. Never fabricate source metadata or treat file publication as working application acceptance. Keep personal paths/credentials out of shared docs.

**Stop before application implementation until the user explicitly approves that work.**

## 10. Risks and blocker response

| Risk | Required response; never silently bypass |
|---|---|
| Dependency/browser/native-library setup fails on another platform | Keep G1 BLOCKED; report actual import/launch/version failure and agree on a supported fix before changing the stack |
| Frozen response missing/corrupt/hash-mismatched, maize absent, or supported date/composition policy unresolved | Keep affected G3 criteria BLOCKED; review supplied source/assumptions, do not fetch replacements, invent metadata or revert to WorldCereal |
| Crop output is mistaken for surveyed farm geometry, feed/food subtype or fire evidence | Keep provenance/resolution/role labels explicit; user AOIs and intended scenario names do not validate these claims |
| Template printing changes text order or PDF bytes | Keep source text/field checks independent; revise/version the template deliberately, retain source hashes and do not infer from filenames |
| Rounded crop/display frame cannot be reconstructed or AOI is outside it | Keep G3 BLOCKED; verify source metadata/method, do not guess overlay placement or substitute another geography |
| Parallel changes drift contracts or invalidate prior evidence | Coordinate interfaces, rerun affected gates against new fingerprints; old PASS files do not count |
| Stock/timing/location/units do not fit the toy model | Return review/insufficient/unsupported/model-inconsistent state; do not zero unknowns or alter equations to force the demonstration |
| External fonts/services accidentally enter the workflow | Fail G6 offline checks, replace with authorized prepared assets; do not disable the network test |
| Human rehearsal or mandatory acceptance evidence is unavailable | Record BLOCKED with the exact missing check; do not fabricate reviewer timing, pass counts or a completed demonstration |
| Available time is shorter than the estimate | Apply the cut line in Section 8; retain all mandatory gates or report a narrower incomplete result honestly |
