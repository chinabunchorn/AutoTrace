# AutoTrace — Development Plan

**Status:** project structure and documentation approved; application implementation awaits explicit user approval.

**Purpose:** define assignable coding work, shared interfaces, expected outputs and verification. Owners are unassigned until people agree on them. Folder creation does not complete a feature. Read [AGENTS.md](AGENTS.md) and [contracts/README.md](contracts/README.md) first.

## 1. Scope and success

Build a small local prototype that completes two controlled PDF-to-assessment workflows. Preserve the standalone v2 presentation and distinguish actual extraction/calculation automation from fictional procurement and synthetic environmental evidence. The narrower prototype requirements govern over any broader proposal.

Common workflow: PDF bytes → text/parser → editable source-backed review → document confirmation → supported cultivation-origin/period lookup → ScenarioBurnProvider and unchanged imagery → evidence/assumption confirmation → deterministic calculation → reviewed Thai template and trace export/replay.

No production platform, arbitrary annual-report extraction, OCR mandate, live LLM/API, trained detector, Journey/transport, nationwide coverage, cloud/database/login or third required cross-border use case.

## 2. Cases and assumptions to approve before implementation

Use fictional documents and one supported Thai demo AOI in the reused image extent. Proposed shared period: 2021-01-26 through 2021-03-12. These dates identify the supported toy window, not a measured procurement history.

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

These are proposed reference answers checked during planning, not application execution results. The same base/inputs isolate the scenario change; the provider must not store a preassigned verdict.

Explicit assumptions: all declared purchases concern the mapped origin/crop/period; uniform mock yield; all eligible non-burn supply can be selected first; explicit mock carry-in stock and external replacement are zero. Unknown or nonzero replacement is outside this closed-origin toy model and requires review.

Proposed synthetic harvest date 2021-02-15 and burn date 2021-02-20. Policy classifies burn-associated cultivation origins within the declared window, including residue burning after harvest. It does not classify grain as physically destroyed. All chronology is synthetic.

What-if references: burn-positive with R=250 t gives no deficit; changed PDF R=350 t gives B_min=50 t and s_min=1/7 after confirmation; R=0 gives `no_purchases` and null/N/A share. R>Q is inconsistent with the declared closed-origin assumptions, not a confident sourcing conclusion.

## 3. Working versus simulated components

| Component | Nature | Boundary |
|---|---|---|
| PDF reading/parser, lookup, GIS processing, calculation and reporting | Actual software automation | Must execute with real inputs; controlled supported template only |
| Procurement/claim PDFs, yield/stock/policy records | Clearly fictional/mock | Human confirmation does not make them real |
| Cultivation boundaries and burn layers | Synthetic environmental evidence | Scenario processing, not a real detector |
| Sentinel-2 true-colour base | Cached real imagery | Original Thailand geography/dates/provenance; not verified maize-fire pair |
| Field correction and document/evidence/report confirmation | Human interventions | Logged separately from automated processing |
| Real parcels/detector validation, OCR/LLM/cross-border | Deferred | No capability or accuracy claim without qualified execution |

## 4. Architecture and outputs

- `frontend/`: v2-derived static HTML/compiled styling/local fonts and vanilla JS, no framework migration.
- `backend/`: one loopback-only Python helper; `ingestion/`, `geospatial/`, `assessment/` are separate modules in that process, not microservices.
- `contracts/`: one shared definition for document/review/origin/provider/calculation/evaluation records.
- `data/documents/`: fictional text PDFs; `data/origins/`: matching geometry/period fixtures; `data/scenarios/`: synthetic burn/production records.
- `tests/fixtures/`: independent test oracle/mutation inputs, never extraction or assessment runtime answers.
- `scripts/`: launch/preflight, controlled-PDF creation, UI/offline test and recording tools.
- `outputs/`: actual run snapshots, reports and per-case evaluation evidence, ignored by Git.

Prefer Python 3.11+, pypdf, Shapely and an available suitable projection implementation (the inspected environment used Rasterio/GDAL). Standard-library HTTP/JSON/Decimal/unittest is sufficient for core. Existing Playwright/Chromium can generate readable PDFs and exercise UI. Verify available tools rather than silently installing a stack. Any dependency installation needs authorization. Record versions and avoid inherited Python package-path conflicts.

The pitch requires no external network after local assets/dependencies are prepared. The helper serves approved paths only, bounds uploads, escapes source text and binds 127.0.0.1. Do not serve ignored local research or arbitrary filesystem paths. Launch commands are to be implemented and verified later, not claimed now.

### Image/geometry requirements

Real imagery: 26 January and 12 March 2021, original Thailand context. Preserve original files/hashes/source attribution. Synthetic overlays remain separate. The original presentation used UTM EPSG:32647 crop/resize; reconstruct precise frame mapping and account for viewer object-fit, rather than mapping geographic bbox percentages blindly.

Proposed cultivation square UTM bounds: `[715450,1844200,716450,1845200]`; burn-positive rectangle: `[715450,1844200,715850,1845200]`. Validate that both lie within the actual supplied image frame before using them. These are fictional geometry, not registered farms. Calculate union/intersection areas in a suitable metre CRS; keep full precision. The two cases use alternative layers over the same base.

Suggested display rounding: m²/ha/tonnes to 2 decimals, percentage to 1 decimal; retain unrounded reference values in trace JSON. Do not silently truncate or change denominators.

## 5. Assignable work packages

Effort ranges are provisional focused working time, not a fixed calendar promise. Previous total estimate: 13.5–19.5 hours excluding optional study and unexpected blockers. Every package requires actual tests after implementation approval.

| ID / owner | Task | Required inputs/dependencies | Expected output | Done when | Effort |
|---|---|---|---|---|---|
| W1 / unassigned | Freeze shared contracts, provenance/input requirements; minimal helper/static serving and preflight | Implementation approval; authorized v2/assets/tools | Contracts, checked input manifest, working local server | Correct local routing, bounded uploads and missing-prerequisite states; originals unchanged | 1–1.5 h |
| W2 / unassigned | Generate mock text PDFs; implement extraction/parser/source pointers | W1 document schema; PDF generation tool | `backend/ingestion/`, fictional PDFs, extraction tests | Actual PDF contents match oracle; same-name/renamed mutations and invalid files handled | 2–3 h |
| W3 / unassigned | Origin/provider/GIS/frame/production processing | W1 schemas and authorized image metadata | `backend/geospatial/`, origin/scenario fixtures, geometry tests | Origin/period guards, zero versus unknown, independent area checks and overlay alignment pass | 2.5–4 h |
| W4 / unassigned | Preserve v2 UI and connect actual review/gates/revisions/two workflows | W2/W3 interfaces; confirmation contract | `frontend/`, editable source-backed review and gated screens | Both workflows, corrections, invalidation and stale async responses exercise correctly | 3–4 h |
| W5 / unassigned | Pure math, deterministic Thai report, export/replay | W1 snapshot schema; W2/W3; integrate W4 | `backend/assessment/`, source-backed run/report records | Reference values/guards/units/denominator and replay tests pass; prose does not alter facts | 2–3 h |
| W6 / unassigned | Integration, evaluation, responsive/fullscreen/offline checks and launch/recording docs | W4/W5 integrated | Actual `outputs/` evidence, launch docs and video or identified recording step | Acceptance matrix verified; unmet gates named; no inflated claims | 3–4 h |

Parallelize W2/W3 only after agreeing on contracts. W4 may develop presentation against explicitly named development interfaces but cannot be reported complete until connected to actual extraction/assessment. Coordinate server/API/root contracts before concurrent changes. No automatic assignments or agent-management ledger is required.

For each code-producing step: write failing test → execute/record RED → minimal implementation → execute/record GREEN → refactor and re-run. Handoffs identify files, contract changes, actual commands/results, raw evidence paths and blockers.

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

## 7. Optional independent parcel study

Not on the core critical path; requires separate approval. Maximum two focused hours: 30 minutes suitability/permission check, 60 minutes native-resolution comparison only if qualified, 30 minutes results/gaps note.

Require independent authorized polygon, measured actual cultivated extent/method, crop identity, matching 2021 year/season, provenance and known independence from training/calibration where possible. Use native-resolution WorldCereal classification, not screenshots/downsampled presentation layers. Do not treat WorldCereal as its own ground truth, current crop labels as 2021 reference, ownership extent as cultivated extent or unlabelled areas as negatives.

Report area error/IoU only where valid; precision/recall only with sufficient explicitly labelled positive/negative coverage. Few selected parcels support a case study, not national accuracy. If references fail requirements/timebox, mark pending and do not block core.

Official product reference: https://esa-worldcereal.org/en/products/global-maps

## 8. Cut line and pitch claims

Never cut actual extraction, human gates, both cases, origin/period guards, explicit synthetic labels, math correctness, traceability, evaluation recording, mobile/offline checks or real launch documentation. Drop optional parcel work, extra animation, context overlays and export/video polish first. JSON plus printable HTML is sufficient; a clearly identified recording step may substitute for edited video. If required gates cannot pass, report a specific blocker rather than partial completion as success.

After actual acceptance verification, claim a working human-reviewed controlled document-to-assessment workflow with checkable scenario calculations and provenance. State the actual tested template/cases/test counts/timings. Do not claim real detector precision/recall, arbitrary report/OCR accuracy, real company sourcing/misconduct, physically destroyed grain, compliance, national validity or unmeasured savings.

## 9. Remaining approval and prerequisite boundary

No blocking product clarification remains for structuring the repository. Owners are intentionally unassigned. Defaults and implementation still need explicit approval. Authorized portable v2/assets/provenance are needed for implementation, but no local absolute paths should appear in shared developer docs. Missing artifacts/tools are specific blockers; never fabricate them. Private discovery notes are retained in ignored local storage.

**Stop before application implementation until the user explicitly approves that work.**
