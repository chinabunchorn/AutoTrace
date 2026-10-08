# Backend Development

## Responsibility

One minimal Python helper integrates actual document extraction, supported geography/scenario processing and deterministic assessment. This is not a microservice architecture. Read root [AGENTS.md](../AGENTS.md), [plan.md](../plan.md) W1/W2/W3/W5 and [contracts/README.md](../contracts/README.md).

**Owners:** unassigned per work package. **Status:** documentation only; implementation awaits approval.

## Integration responsibilities (W1)

Serve frontend/authorized data from one loopback origin, bound to 127.0.0.1. Provide stable extraction/confirmation/lookup/evidence/assessment/export operations. Validate payloads, cap PDF bytes/pages, escape source strings and restrict static paths; never expose the vault/private storage or execute PDF text.

Backend must enforce confirmed immutable revisions/snapshots, not trust a UI checkbox. Changing data cannot reuse stale confirmation/evidence/report. No mandatory external calls, database, login or live LLM. Verify local tools and versions before setup; installation needs authorization.

## Component tasks and outputs

| Component | Tasks | Inputs | Outputs | Completion checks |
|---|---|---|---|---|
| `ingestion/` — W2 | Read PDF bytes/pages; controlled-template parsing; source pointers; field validation | Supported text PDF, template contract | ExtractionRecord with raw text/parsed values/page pointers/errors; never a lookup verdict | Ten essential fields correct; mutations change extraction; filename independence; missing/duplicate/corrupt/encrypted/image-only explicit states |
| `geospatial/` — W3 | Exact origin/country/crop/period lookup; ScenarioBurnProvider; validate/project/union/clip geometry; derive explicit mock Q/b | Confirmed document, supported AOI/image frame, synthetic burn/cultivation/yield/timing records | OriginFixture, ScenarioEvidence, GeometryResult and traceable production inputs/assumptions | Unsupported inputs stop; empty-complete versus missing distinct; independent known-area tests; overlay frame correct; units/timing explicit |
| `assessment/` — W5 | Pure math/guards; deterministic Thai reporting; source-backed export/replay | Fully confirmed snapshot with matched origin/period/unit and explicit assumptions | CalculationResult, reviewed template report, immutable trace bundle | Reference formulas/units/guards pass; no changed denominator/unknown=zero; replay repeats numbers/status/report body |

These folders use this shared guide; separate readmes for each small component are unnecessary. Keep provider/extraction/geometry/production/math/reporting implementations separate internally to prevent fixture coupling. Coordinate contracts before parallel work.

## Calculation and semantic guards

C=Q(1−b), B_min=max(0,R−C), s_min=B_min/R only for R>0. R is purchases from this AOI/period; no factory-capacity/whole-company denominator. R=0 → no purchases/null share. Unknown stock/replacement stays unknown; nonzero replacements or R>Q under closed-origin assumptions cannot produce a confident scenario assessment.

Q/b are synthetic unless separately qualified; area share implies production share only under explicit uniform yield/weights. Residue burn after harvest is not proof grain was destroyed. Missing environmental evidence is not zero-burn. Report wording never creates extra facts or alters numbers.

## Done when

Unit/integration tests plus both actual UI workflows exercise helper operations, confirmations, corrections, mismatches, missing/invalid/inconsistent data and replay. Software/reference quality/real-world accuracy remain separate. Actual commands/exit codes and per-case evidence are retained under `outputs/`; no server/API/module is implemented yet.
