# Read-only demo backend API

**Status:** Approved, version 1; user accepted the design in chat on 2026-10-10 ("design-backend-api.md is done"). This accepts the design, not dependency installation or application implementation.
**Inspected:** 2026-10-10.

## Decisions and scope

The user agreed to four GET endpoints serving prepared UC1/UC2 data, then proposed FastAPI on 2026-10-09. This draft uses Python/FastAPI, Pydantic response models and Uvicorn in one local process at `127.0.0.1:8765`. Exact dependency versions will be checked/pinned during authorized implementation. FastAPI provides response validation and OpenAPI schemas: [official response-model documentation](https://fastapi.tiangolo.com/tutorial/response-model/).

This is the simplified hackathon scope agreed in chat. It replaces the earlier runtime upload, extraction, corrections, confirmation, GIS processing and replay workflow for this demo. Preparation can compute/extract values beforehand; GET requests only read prepared records. The route name `extract-doc` is retained for frontend convenience, but its response explicitly identifies prepared data. No runtime database, external API, login or editable calculation inputs are required.

The earlier full-workflow plan/contracts remain a reference for future work. Their implementation gates are not completed by this demo. This document proposes the replacement JSON contract; no application implementation, package installation, commit or push is authorized by drafting it.

## Requirements

| ID | Requirement and acceptance check |
|---|---|
| R1 | Exactly four application JSON GET routes as listed below. Case routes require `case_id`, exactly `UC1` or `UC2`; no implicit default. |
| R2 | Prepared document fields and calculations retain mock/synthetic labels and source/assumption information. Replies do not claim live extraction or calculation. |
| R3 | Image URLs resolve to the correct case's original files. The image response contains URLs only; provenance remains in accompanying asset documentation. |
| R4 | Prepared calculation values pass independent formula/unit checks before serving. Missing mandatory inputs or contradictory results produce an error rather than a successful incomplete result. |
| R5 | Both cases work from prepared repository files with external network blocked. Only approved public assets/documents are served. |

## Common conventions

- UTF-8 JSON; snake_case fields; direct objects without a `data` wrapper.
- Document/calculation replies include `case_id`; the image reply contains only `before_url` and `after_url`. All prepared files for a case must agree on its ID and origin.
- Quantities/areas/ratios are finite JSON numbers. Units appear in field names or explicit quantity objects. Ratios use 0–1; frontend multiplies by 100 to display percent. Display rounding does not change stored values.
- Dates use `YYYY-MM-DD`. Unknown metadata uses null. A null is never interpreted as zero.
- URLs are same-origin paths, not machine filesystem paths or base64 image data.
- Prepared case records proposed under `data/demo/UC1.json` and `data/demo/UC2.json` contain `document`, `imagery`, and `calculation` sections corresponding to the three case responses. These files do not exist yet. Original PDFs stay under `data/documents/`; images stay under `frontend/assets/selected-aois/`.
- Frontend selects a case, loads document/images/calculations, then displays the prepared walkthrough. Switching cases reloads all three replies; results belong to the selected case. There is no editable input or server confirmation state in this scope.

## GET /health

HTTP 200 means the process is responding, not that every case artifact is ready.

```json
{
  "status": "ok",
  "service": "autotrace",
  "mode": "prepared_demo"
}
```

## GET /extract-doc?case_id=UC1

Returns prepared document fields plus a source link. The layout below is an authoring example, not an HTTP 200 response ready to serve: null document values must be filled from the actual mock document first. No case PDF is currently supplied.

```json
{
  "case_id": "UC1",
  "fictional_company": "Factory A",
  "crop": "maize",
  "total_purchase_quantity": 5000,
  "purchase_from": "Area-1",
  "area_purchase_percentage": 30,
  "area_purchase_quantity_t": 1500
}
```

## GET /sentinel-pic?case_id=UC1

Returns two image URLs only. Serve `frontend/assets/` at `/assets/` on the same origin as the frontend/API so the browser can request these files directly.

```json
{
  "before_url": "/assets/selected-aois/UC1/UC1_before.jpg",
  "after_url": "/assets/selected-aois/UC1/UC1_after.png"
}
```

For `case_id=UC2`:

```json
{
  "before_url": "/assets/selected-aois/UC2/UC2_before.jpg",
  "after_url": "/assets/selected-aois/UC2/UC2_after.jpg"
}
```

Frontend usage with existing `<img id="before-image">` and `<img id="after-image">` elements:

```javascript
const response = await fetch(`/sentinel-pic?case_id=${caseId}`);
if (!response.ok) throw new Error("Unable to load image URLs");
const images = await response.json();
document.getElementById("before-image").src = images.before_url;
document.getElementById("after-image").src = images.after_url;
```

Assign each URL string to `src`, rather than the entire JSON response. If the frontend runs on a different origin during development, resolve the returned paths against the API base URL using `new URL(images.before_url, apiBaseUrl).href` (and likewise for the after image). Missing case images return the documented error instead of placeholder URLs. Static file delivery is additional file serving, not a fifth application JSON operation.

## GET /calculations?case_id=UC1

Returns prepared values and Thai narrative together. The following is an authoring layout; null numerical inputs/results and report must be supplied/validated before HTTP 200. Historical 100-ha/500-t examples are not UC1/UC2 results.

```json
{
  "case_id": "UC1",
  "total_yield_t" : 1513.61,
  "burn_linked_percentage" : 82.47,
  "non_burn_yield_t" : 265.37
}
```

Successful supported status values: `conditional_deficit`, `no_deficit_demonstrated`, `no_purchases`. Validate `Q = cultivation_area_ha × yield_t_per_ha`, `b = burn_linked_area_ha / cultivation_area_ha`, `C = Q × (1 − b)`, `B_min = max(0, R − C)` and `s_min = B_min / R`. When R=0, status is `no_purchases` and share is null. Carry-in/replacement must be explicitly reviewed zero for this closed-origin model; unknown/nonzero values or R>Q cannot be served as confident supported results.

R denotes declared-origin/period purchases. Area comes from qualified clipped/unioned GISTDA maize geometry, not the whole query boundary. Uniform yield and burn/stock/timing remain mock/synthetic. Period/date qualification and actual prepared case values are pending. Label limitations in Thai, including that the result is conditional and does not prove misconduct, compliance or grain destruction. The report must agree with the stored numerical result. Burn-positive does not itself require a deficit.

## Errors

Use a consistent FastAPI `detail` object. Missing/invalid case query: HTTP 422 (`invalid_case_id`). Missing required prepared data/file: HTTP 503 (`case_not_ready`). Malformed or inconsistent prepared data: HTTP 500 (`invalid_prepared_data`). Missing static URL/unknown route: HTTP 404. Error replies contain no partial successful assessment.

```json
{
  "detail": {
    "code": "case_not_ready",
    "message": "Prepared calculation data is not available for UC1.",
    "case_id": "UC1"
  }
}
```

`case_id` is null for a missing/invalid case query; do not echo arbitrary query text. Implementation must normalize FastAPI query-validation errors to this shape.

## Proposed validation and remaining inputs

Check both cases through real GET requests; compare each reply to its prepared record, request every returned local file URL, exercise invalid/missing case queries and absent/corrupt records, and independently verify equations/units and R=0. Confirm original image hashes remain unchanged and repeat the walkthrough offline. These are proposed checks; no API/tests exist or have passed yet.

Remaining inputs: source PDFs/prepared fields, image acquisition/provenance metadata, reviewed periods and mock assumptions, qualified cultivation/burn areas, numerical results and Thai report wording. JSON shapes are ready for review; actual case content is not invented by this design.
