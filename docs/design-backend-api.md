# Read-only demo backend API

**Status:** Approved, version 1; user accepted the design in chat on 2026-10-10 ("design-backend-api.md is done"). The user subsequently authorized the FastAPI implementation with prepared UC1 values and an empty UC2 data template. The backend is implemented; see [setup and verification](../backend/README.md).
**Inspected:** 2026-10-10.

## Decisions and scope

The user agreed to four GET endpoints serving prepared UC1/UC2 data, then proposed FastAPI on 2026-10-09. This draft uses Python/FastAPI, Pydantic response models and Uvicorn in one local process at `127.0.0.1:8765`. Exact dependency versions will be checked/pinned during authorized implementation. FastAPI provides response validation and OpenAPI schemas: [official response-model documentation](https://fastapi.tiangolo.com/tutorial/response-model/).

This is the simplified hackathon scope agreed in chat. It replaces the earlier runtime upload, extraction, corrections, confirmation, GIS processing and replay workflow for this demo. Preparation can compute/extract values beforehand; GET requests only read prepared records. The route name `extract-doc` is retained for frontend convenience, but its response explicitly identifies prepared data. No runtime database, external API, login or editable calculation inputs are required.

The earlier full-workflow plan/contracts remain a reference for future work. Their implementation gates are not completed by this demo. Implementation uses the replacement contract below. No new commit/push/deployment was requested as part of this implementation.

## Requirements

| ID | Requirement and acceptance check |
|---|---|
| R1 | Exactly four application JSON GET routes as listed below. Case routes require `case_id`, exactly `UC1` or `UC2`; no implicit default. |
| R2 | Prepared document fields and calculations retain source/assumption and mock/candidate-mask labels in accompanying data documentation. Replies do not claim live extraction or calculation. |
| R3 | Image URLs resolve to the correct case's original files. The image response contains URLs only; provenance remains in accompanying asset documentation. |
| R4 | Prepared calculation values pass independent formula/unit checks before serving. Missing mandatory inputs or contradictory results produce an error rather than a successful incomplete result. |
| R5 | Both cases work from prepared repository files with external network blocked. Only approved public assets/documents are served. |

## Common conventions

- UTF-8 JSON; snake_case fields; direct objects without a `data` wrapper.
- Document/calculation replies include `case_id`; the image reply contains only `before_url` and `after_url`. All prepared files for a case must agree on its ID and origin.
- Quantities are finite JSON numbers in tonnes. `area_purchase_percentage` and `burn_linked_percentage` use 0–100; frontend adds `%` without multiplying by 100. Display rounding does not change stored values.
- Dates use `YYYY-MM-DD`. Unknown metadata uses null. A null is never interpreted as zero.
- URLs are same-origin paths, not machine filesystem paths or base64 image data.
- Prepared case records at `data/demo/UC1.json` and `data/demo/UC2.json` contain `document`, `imagery`, and `calculation` sections corresponding to the three case responses. UC2 document/calculation values are null until filled; those endpoints return 503 meanwhile. Images stay under `frontend/assets/selected-aois/`. Records are read each request; no restart is needed after editing.
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

Returns the prepared fictional-company values below. Both purchase quantities are in tonnes; `area_purchase_quantity_t` is declared-origin purchases R. No actual extraction runs and no case PDF has been generated.

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

Returns the agreed prepared UC1 Q, burn-linked percentage and C below. No computation runs during a request. The response has no additional assessment status or Thai report field. UC2 has the same keys with null data values in its editable record, so requests return 503 until those values are filled.

```json
{
  "case_id": "UC1",
  "total_yield_t" : 1513.61,
  "burn_linked_percentage" : 82.47,
  "non_burn_yield_t" : 265.37
}
```

Preparation checks Q = cultivation_area_ha × yield_t_per_ha, b = burn_linked_area_ha / cultivation_area_ha and C = Q × (1 − b), retaining the effect of rounding. Here maize area=216.23 ha, candidate scar overlap=178.32 ha and assumed yield=7 t/ha. The endpoint returns stored values, without computing B_min/s_min or a sourcing verdict. Independent tests check the agreed numbers; request-time validation checks types/ranges and C <= Q.

R denotes declared-origin purchases, not total company purchases. UC1 maize geometry was clipped to the query polygon with overlap duplicates excluded. The supplied candidate burn mask is from January–March 2021 and maize polygons are updated September 2026. This temporal mismatch and assumed 7 t/ha yield make these conditional spatial-overlap estimates, not measured production or destroyed grain. The mask is a heuristic candidate, not a synthetic layer or validated perimeter. [Prepared-data notes](../data/demo/README.md) retain those limitations and the fictional purchase basis.

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

13 backend tests passed: exact UC1 replies and independent arithmetic, both image pairs byte-for-byte, invalid/missing cases, corrupt/invalid/absent records, UC2 missing-data handling and template edits, path containment, four application routes, a real Uvicorn launch and prepared requests with external socket/DNS denial. Actual logs are retained under `outputs/backend-demo/`. These do not pass the earlier full-workflow gates or environmental validation.

Remaining inputs: UC2 prepared document/calculation values and selected-image acquisition/provenance metadata. No frontend/browser walkthrough or full historical crop/fire validation is implemented here.
