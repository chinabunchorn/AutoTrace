# Tests and Acceptance

**Current reduced demo:** `test_demo_api.py` verifies the four-GET FastAPI app, UC1 data, UC2 null template, image serving, invalid/missing data, real loopback launch and in-process external socket/DNS denial. Run `python -m unittest discover -s tests -p 'test_*.py' -v` in the prepared environment. 13 tests passed on 2026-10-10; logs are under `outputs/backend-demo/`. The larger acceptance matrix below remains future scope and is not passed by this suite.

## Responsibility

Verify actual software behavior and controlled scenario processing, not real agricultural/fire accuracy. Read [../plan.md](../plan.md) and [../contracts/README.md](../contracts/README.md).

**Owner:** unassigned; component owners write tests, W6 integrates/evaluates. **Status:** no test code or application results yet. Proposed targets below are not existing runnable scripts.

Updated architecture: the two supplied GISTDA JSON exports replace WorldCereal/live fetching; new Sentinel-2 is pending. Maize/corn-consuming factories for feed, human food or other uses retain the reviewed workflow. AOIs, corrected **5 km²** cap and source schema/gaps are canonical in [data/origins/README.md](../data/origins/README.md). Input inspection/import is not application acceptance; no test modules are implemented yet.

## Test locations and outputs

- Future unit/integration test modules may live directly here, grouped by component rather than extra empty package folders.
- `fixtures/` holds independent oracles and mutation/corrupt/unsupported test inputs. Do not calculate oracle values from the implementation under test or import them into runtime.
- Browser/offline QA utilities belong in `scripts/`; their results join unit/integration evidence under ignored `outputs/`.
- Record actual commands/exit codes, versions/input fingerprints, expected/observed values, tolerances and per-case/per-field outcomes.
- Use [asset-manifest.json](../frontend/assets/asset-manifest.json) as the preservation reference for supplied assets; read [docs/assets.md](../docs/assets.md) for archive-only inputs and unfinished frame checks. Asset identity/browser-loading checks are not application acceptance tests. The original imagery manifest's legacy overlay entries are intentionally not standalone runtime files.

## Required test matrix

| Proposed target | Exact behaviors/reference answers |
|---|---|
| `test_extraction.py` | Actual PDF page text and each of ten essential fields match oracle; pointers identify source. Rename same bytes → same values. Same filename with changed contents → changed values. R=350, changed origin and changed period read from text. Missing/duplicate/invalid keys, corrupt/encrypted/image-only PDF produce explicit errors/review-needed, never fake OCR |
| `test_confirmation.py` | Backend rejects unconfirmed document/assessment. Original/extracted/corrected values and reasons retained. Correction 350→400 plus re-confirmation changes result; edit/upload/scenario/assumption changes revoke affected confirmations/results/exports. Obsolete async response cannot replace newer revision |
| `test_origin_scenario.py` | Exact TH/AOI/maize/period resolves; unknown/foreign/province-only/supplier-address/crop/date/partial-period mismatch unsupported. Complete synthetic empty burn gives b=0; missing/unsupported evidence stays unknown. Provider does not return preassigned report/verdict |
| `test_gistda_snapshot.py` | Load actual UC1 .txt/UC2 .json as JSON arrays offline; manifest byte sizes/SHA-256 and result/update/geom-array schema match. UC1 maize has 4 geometry objects; UC2 maize has 8, and first crop Cassava must not be selected. Preserve all raw crops but process exact Maize only. Missing/corrupt/hash-mismatched/schema-invalid/duplicate-or-absent-maize and unsupported-window cases stop. Unknown endpoint/period/coverage/area/yield remain unknown, not API-example defaults. Snapshot/assumption changes revoke affected fingerprints. No authentication/connectivity/fetch/refresh or WorldCereal fallback |
| Factory/crop metadata | Mock feed/human-food/other factory documents parse and review without feed-only restriction. Prototype crop remains maize/corn; unsupported crop products still stop. End use is document context, not crop-classification evidence; changing it alone does not alter math inputs |
| `test_geometry.py` | Projected 1000×1000 m square=1,000,000 m²=100 ha=625 rai. 400×1000 m burn intersection=400,000 m²=40 ha. Half-in/out clipping reference, disjoint=0, duplicates and overlap union no double-count, known hole subtracts exactly, invalid self-intersection fails. CRS/unit conversions and independent analytic/shoelace cross-check. Crop/resize/object-fit mapping and round trips checked |
| `test_calculation.py` | Q=500,b=.4,R=400 → C=300,B=100,s=.25. b=0,R=400 → C=500,B=0,s=0. Positive burn,R=250 → B=0. R=350 → B=50,s=1/7. R=C → B=0. b=1,R=400 → B=400,s=1. R=0 → no_purchases,s=null. Missing/negative/nonfinite Q/R/yield, b outside [0,1], incompatible unit, zero cultivation denominator, unknown/nonzero replacement and R>Q under closed-origin assumptions do not yield confident assessments. 400000 kg normalizes to 400 t with conversion audit |
| Selected-AOI integration | Distinct supplied UC1/UC2 maize snapshots, reviewed supported evidence window and new Sentinel-2 frames. Source update alone is not crop-period support; missing per-geometry/biweekly chronology stays unknown, not reconstructed by guesswork. Clip/union without double-counting, derive conditional Q/b from reviewed mock yield/burn/composition assumptions and independent final case oracles. User scenario labels do not prove fire; toy values are not selected-AOI expected answers |
| `test_report_replay.py` | Source PDF/text/hash → fields/corrections/confirmations → origin/period/image/fixture/provider hashes → geometry/yield/timing/stock → calculation/report is traceable. Frozen snapshot repeats numeric/status/report body except declared timestamps/run IDs. Changed versions/hashes do not silently substitute new evidence. Report labelled deterministic Thai template; no probability/misconduct/compliance/grain-destruction claims |
| Browser workflow | Load each actual PDF, review source, edit/confirm, inspect mapped evidence/assumptions, confirm/calculate, review/export; modified documents change outcomes. Both happy/negative paths and workflow timing/interventions recorded |
| Desktop/mobile/fullscreen | 1440×900,1280×800,390×844,360×800; source controls readable/reachable, no unintended horizontal overflow, slider/layers/display alignment, dashboard/fullscreen/exit, keyboard/reduced motion and v2 design preservation. Name any untested browser/device limitations |
| Offline/local | Launch helper, block all non-loopback network, reload and finish both workflows/upload mutations/export. No dependence on cached external requests. Record actual launch/version/setup instructions; preserve original image/baseline checksums |

Exercise provided responses and independent mutated negative fixtures with external requests blocked. No GISTDA fetching/auth/rate-limit tests or key/account setup; future imagery acquisition needs separate approval. The cap is corrected, and permission for these specific raw exports is user-confirmed. G3 still needs actual loader/geometry/frame tests and reviewed supported window/composition policy: source update is not a date range, geometry presence is not complete coverage. Some polygons cross AOI edges; verify clipping/union without temporal/overlap double-counting. Yield is mock because the response has none. Old packet loading or source import alone does not pass application gates.

## Reference independence, tolerances and rounding

Use independently defined expected values; selected mass balance can be checked with a separate arithmetic implementation. Known rectangle clipping/union and shoelace references must not be generated by the same GIS function under test. Do not claim QGIS checks unless actually executed.

Proposed projected-shape area tolerance: 0.01 m²; chosen coordinate round-trip tolerance: 0.01 m; geographic round-trip relative area tolerance: 1e-6. Tonne tolerance: 1e-9; ratio tolerance: 1e-12. Record actual method/CRS and justify any tolerance change. Test display rounding separately from raw values; percentages never change denominators.

## Evaluation records

A: software/calculation correctness. B: reference-data quality. C: actual crop/burn detector precision/recall, **not evaluated in core**. Synthetic tests validate processing, not real fields/burns. No unsupported combined AutoTrace accuracy percentage.

GISTDA's documented service/output shape is not evidence of higher measured accuracy, parcel-boundary precision, feed/food subtype, ownership or burnt/non-burnt status. Independent accuracy work is optional and source-matched; never promote API product labels or AOI geometry checks to ground truth.

For controlled PDFs retain field-level correctness before correction, missing/incorrect fields, correction-required fields and correctness after human correction separately with denominators. Record successful/failed/unsupported steps, actual automated processing time, human review time and interventions. No arbitrary-report generalization or time-savings claim without measured baseline.

## Done when

Actual unit/integration/browser/offline execution satisfies root-plan acceptance, both workflows can be regenerated from their snapshots, per-case results are retained, and launch/limitations plus backup recording or clearly identified recording step are documented. Report a specific failed/blocking gate instead of claiming completion from files or screenshots.
