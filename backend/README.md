# Backend Development

**Current demo design:** the user agreed to a simplified read-only four-GET demo and proposed FastAPI. See [draft API design](../docs/design-backend-api.md) for JSON responses and the scope change. The full-workflow guide below remains a reference; its runtime extraction/confirmation requirements are outside the simplified demo. Response shapes await review; no implementation or installation has occurred.

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
