# Runtime Demonstration Data

## Responsibility

Prepare the clearly fictional/synthetic runtime inputs used by the two cases. Read root [AGENTS.md](../AGENTS.md), [plan.md](../plan.md), and [contracts/README.md](../contracts/README.md).

**Owner:** unassigned, coordinated with W2/W3. **Status:** directories only; no PDFs/geometries/scenarios generated.

## Directory roles

| Folder | Contents to prepare | Expected consumer/output |
|---|---|---|
| `documents/` | Readable one-page text procurement/claim PDFs, conspicuously fictional | Actual ingestion bytes; never fields from filename/case button |
| `origins/` | Versioned/hashable supported cultivation-AOI geometry/country/crop/period and imagery linkage | Exact lookup and independently traceable demo geometry |
| `scenarios/` | Synthetic positive/complete-zero burn layers; fictional cultivation/yield/timing/stock assumptions | Scenario evidence and explicit mock production inputs, not final verdicts |

Small folders are described here and in AGENTS.md instead of separate guides.

## Tasks

1. Prepare a controlled PDF template with document ID, fictional company, claim, crop, cultivation country, AOI ID, start/end dates, purchase quantity and unit. Proposed English labels; Thai UI/report.
2. Supply matching supported origin/period records and explicitly fictional metre-based geometry. Do not invent farm ownership/registration or infer geometry from a province name.
3. Provide positive and complete empty burn scenarios over the same real image base. Keep missing coverage separate from intentionally zero coverage.
4. Record uniform mock yield, harvest/burn/policy dates and explicit stock/replacement assumptions. Do not derive tonnes or burn from RGB.
5. Version/hash records and record provenance/authoring methods/units/CRS. Coordinate changes with contracts, backend, UI and tests.

## Boundaries

Use fictional companies only. Human confirmation does not make data real. No hidden test expected-result JSON in runtime ingestion/provider/assessment. Independent answers belong in `tests/fixtures/`, not here.

Real presentation images/fonts live in `frontend/assets/` after authorized acquisition, retaining original dates/Thailand geography/hashes/attribution. Existing WorldCereal/MODIS context is not validated crop-fire/procurement truth. Native/reference datasets are outside core unless separately authorized.

Only deliberately prepared shareable fictional inputs belong here. Private proposals, local research, real uploads, credentials and machine-specific notes stay out of Git (`.local/` or authorized external storage). Runtime traces/results go to ignored `outputs/`.

## Done when

Both case PDFs actually extract and map to matching fixtures; changing supported quantity/period/origin changes extraction and downstream values/states. Scenario intersections match independent geometry references, synthetic labels/assumptions persist in UI/export, and original imagery remains unchanged.
