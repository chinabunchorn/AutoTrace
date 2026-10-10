# Backend Development

The read-only FastAPI app is implemented in `app.py`, following the [approved API design](../docs/design-backend-api.md). It serves four GET endpoints and prepared case values; no calculation or extraction runs during requests.

## Setup and launch

From the repository root, use Python 3.12 (tested with 3.12.14):

```powershell
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
.venv/Scripts/python.exe -m backend
```

The last command starts Uvicorn at `http://127.0.0.1:8765`. Stop it with Ctrl+C. Dependencies are pinned in `requirements.txt`, including HTTPX for tests. Install once during setup; the prepared app requires no external network. On macOS/Linux use `.venv/bin/python` in place of `.venv/Scripts/python.exe` (not yet tested on those platforms).

| Endpoint | Result |
|---|---|
| `GET /health` | Process status |
| `GET /extract-doc?case_id=UC1` | Prepared fictional-company fields |
| `GET /sentinel-pic?case_id=UC1` | `before_url` and `after_url` |
| `GET /calculations?case_id=UC1` | Stored Q, burn-linked percentage and C |

Case routes require exactly `UC1` or `UC2`; missing/invalid IDs return 422. Original selected-case images are served under `/assets/selected-aois/`; other repository folders are not exposed. Swagger UI is available at `http://127.0.0.1:8765/docs`, with its schema at `/openapi.json`. These documentation routes are additional to the four demo endpoints. Swagger uses FastAPI's default CDN-hosted UI assets; the demo endpoints and local images work offline independently of the developer documentation. The frontend can assign the returned same-origin image URLs to `<img>.src`.

## Filling UC2

Edit [data/demo/UC2.json](../data/demo/UC2.json), replacing null document and calculation values with actual prepared values. Sections are read anew on every request, so no restart is needed. Until completed, those endpoints return 503 `case_not_ready`. UC2 images already work. Malformed JSON, incorrect case IDs, out-of-range percentages, negative/nonfinite/non-number values or unsafe image paths return 500 `invalid_prepared_data`.

UC1 contains the approved fictional document example and Q=1513.61 t, burn-linked percentage=82.47, C=265.37 t. [Prepared-data notes](../data/demo/README.md) record units, assumptions, rounding and the 2021-mask/2026-crop temporal mismatch. These values do not measure destroyed grain or prove a procurement/compliance claim. Selected image source metadata and UC2 values remain to be filled by the user.

## Verification

```powershell
.venv/Scripts/python.exe -m unittest discover -s tests -p 'test_*.py' -v
```

13 tests passed on Windows/Python 3.12.14: exact UC1 replies, editable UC2 template, missing/corrupt/invalid data, original image bytes, path containment, four-route/read-only behavior, a real Uvicorn launch and prepared routes with process-level external socket/DNS denial (including negative controls). Logs are retained locally under `outputs/backend-demo/`. The real-server test starts and stops its own loopback server on a free port. HTTPX currently emits an upstream Starlette deprecation warning; tests pass with the pinned versions.

No frontend UI integration/browser rehearsal, UC2 completed calculations, historical environmental validation or full-workflow gates are claimed.

## Earlier full-workflow reference

The guide below describes the earlier larger scope, not the implemented four-GET demo. Its module/gate expectations remain future reference.

## Responsibility

One minimal Python helper integrates actual document extraction, supported geography/scenario processing and deterministic assessment. This is not a microservice architecture. Read root [AGENTS.md](../AGENTS.md), [plan.md](../plan.md) W1/W2/W3/W5 and [contracts/README.md](../contracts/README.md).

**Owners:** unassigned per work package. **Status:** documentation only; implementation awaits approval.

The provided GISTDA API exports are the frozen crop inputs, replacing WorldCereal/live fetching. Factories using maize/corn for feed, human food or other uses retain the same workflow. [data/origins/README.md](../data/origins/README.md) holds exact AOIs, the corrected **5 km²** cap, source files and review gaps. No loader/adapter/application is implemented yet.

## Integration responsibilities (W1)

Serve frontend/authorized data from one loopback origin, bound to 127.0.0.1. Provide stable extraction/confirmation/lookup/evidence/assessment/export operations. Validate payloads, cap PDF bytes/pages, escape source strings and restrict static paths; never expose the vault/private storage or execute PDF text.

Backend must enforce immutable confirmed revisions, not trust a UI checkbox. Changes revoke stale evidence/report. No external crop calls, GISTDA credentials/account setup, database, application login or mandatory LLM. Verify local tools before separately authorized installation.

## Component tasks and outputs

| Component | Tasks | Inputs | Outputs | Completion checks |
|---|---|---|---|---|
| `ingestion/` — W2 | Read PDF bytes/pages; controlled-template parsing; source pointers; field validation | Supported text PDF, template contract | ExtractionRecord with raw text/parsed values/page pointers/errors; never a lookup verdict | Ten essential fields correct; mutations change extraction; filename independence; missing/duplicate/corrupt/encrypted/image-only explicit states |
| `geospatial/` — W3 | Local `gistda_snapshot.py` loader, hash/schema/maize selection and exact origin/evidence-window lookup; clipping/union, separate burn provider and mock Q/b | Supplied UC1/UC2 files and manifest, confirmed document, canonical AOI, new Sentinel-2 frame, mock yield/burn/timing | Reviewed OriginFixture/CropEvidence, derived geometry and conditional production | Source hashes/schema, unknown metadata and reviewed window/composition pass offline; no API call, no-data versus zero distinct, no WorldCereal fallback |
| `assessment/` — W5 | Pure math/guards; deterministic Thai reporting; source-backed export/replay | Fully confirmed snapshot with matched origin/period/unit and explicit assumptions | CalculationResult, reviewed template report, immutable trace bundle | Reference formulas/units/guards pass; no changed denominator/unknown=zero; replay repeats numbers/status/report body |

These folders use this shared guide; separate readmes for each small component are unnecessary. Keep provider/extraction/geometry/production/math/reporting implementations separate internally to prevent fixture coupling. Coordinate contracts before parallel work.

For W3, preserve old imagery/frame/WorldCereal as superseded references. Load the actual [UC1 file](../data/origins/gistda/usecase1/message.txt) and [UC2 file](../data/origins/gistda/usecase2/response.json), checking [manifest](../data/origins/gistda/manifest.json). Both are JSON arrays (`result`, `update`, `geom[]`), including Polygon/MultiPolygon objects; UC1 extension is .txt. UC2's first record is Cassava, so select Maize by exact label and exclude other crops from Q. No fetching adapter or `prepare_gistda.py` script. Prepare new Sentinel-2 later; keep query/source/derived shapes distinct.

The user confirmed public redistribution permission for these two exports. Their maize `update` is 2026-09-30, but request dates/endpoint/resolution/coverage/CRS declaration/area/yield are absent. Preserve unknowns and review a supported date-window/geometry-composition policy; never invent documentation-example fields. Some geometry crosses AOI edges: validate, clip and union in EPSG:32647 without summing duplicate/overlapping or assumed temporal production. Missing/corrupt/hash-mismatched/unsupported crop/date inputs stop. Snapshot replacement explicitly revokes downstream evidence/results; no refresh/fetch/fallback. Factory use remains metadata. Mock yield is separately reviewed, not API-measured yield.

## Calculation and semantic guards

C=Q(1−b), B_min=max(0,R−C), s_min=B_min/R only for R>0. R is purchases from this AOI/period; no factory-capacity/whole-company denominator. R=0 → no purchases/null share. Unknown stock/replacement stays unknown; nonzero replacements or R>Q under closed-origin assumptions cannot produce a confident scenario assessment.

Q is conditional crop-union area × explicit mock yield; b is separately qualified burn intersection share, synthetic by default. Neither the full query AOI nor toy test area supplies runtime cultivation. Area share implies production share only under explicit yield/weights. Residue burning does not prove grain destruction; missing crop/burn evidence is unknown, not zero-burn. No unmeasured GISTDA accuracy/surveyed-boundary claim. Report wording never alters facts/numbers.

## Done when

Unit/integration tests plus both actual UI workflows exercise helper operations, confirmations, corrections, mismatches, missing/invalid/inconsistent data and replay. Software/reference quality/real-world accuracy remain separate. Actual commands/exit codes and per-case evidence are retained under `outputs/`; no server/API/module is implemented yet.
