# Shared Development Contracts

**Implemented read-only demo contract:** see [approved four-GET JSON design](../docs/design-backend-api.md) and [backend guide](../backend/README.md). Prepared records live in `data/demo/`; UC2 document/calculation sections remain an editable null template. The full-workflow records below remain a reference; they are not requirements to add runtime review/confirmation to this simplified demo.

**Purpose:** frontend/backend/data/test contributors use one set of records and states. These are proposed contracts to freeze before implementation, not implemented APIs or generated JSON schemas.

**Output:** agreed versioned payload definitions and validation rules. **Owner:** unassigned; coordinate all interface changes with dependent components. Do not introduce separate schemas in different components. Test oracles never become runtime extraction/assessment inputs.

Revised architecture: **the two supplied GISTDA exports replace WorldCereal and live fetching**; Sentinel-2 remains future preparation. Factories using maize/corn for feed, human food or other uses retain the same workflow. Canonical coordinates, source mappings/schema, corrected **5 km²** cap and honest source gaps are in [data/origins/README.md](../data/origins/README.md). Raw files/manifest are supplied; contracts/local loader remain unimplemented.

## 1. Document and extraction

Supported readable text-PDF template has ten essential logical fields:

```text
DocumentFields:
  document_id: string
  fictional_company: string
  environmental_claim: string
  crop: 'maize'
  origin_country: ISO country code
  origin_id: declared demo AOI identifier
  period_start: ISO date
  period_end: ISO date
  purchase_quantity: finite nonnegative decimal
  quantity_unit: 't' | 'kg'
```

Add explicit `template_version`, `is_mock=true`, and `origin_role='cultivation'` metadata. Origin is not a decoy supplier/headquarters address. Country, crop, identifier and period validation distinguish syntactically valid values from supported fixture matches.

Keep the ten essential fields. Optional source-backed metadata: `factory_type` (reviewed free text), `crop_use` (`animal_feed` | `human_food` | `other` | `unspecified`) and a reviewed description. These describe the fictional factory/document; they are not remotely verified crop subtypes and do not change the equations. No feed-only restriction. Other crop codes remain unsupported until product/period qualification is approved.

```text
ExtractionRecord:
  schema_version, extraction_id, parser_version
  source: {filename, sha256, media_type, page_count}
  pages: [{page_number, text}]
  fields: {field_name: {raw_text, parsed_value, page_number, line_numbers, validation}}
  errors[], warnings[], automated_ms
```

No guessing/defaults for missing/duplicate labels. File contents, not filename/case button, determine fields. Return corrupt/encrypted/image-only/unsupported-template states honestly; direct text extraction is not OCR.

## 2. Review and confirmations

```text
DocumentReview:
  document_sha256, revision
  extracted_values, corrected_values
  corrections: [{field, before, after, reason, page_pointer, at}]
  critical_fields_confirmed[]
  confirmation_id, snapshot_fingerprint, confirmed_at
  reviewer_label, human_review_ms, is_mock=true

EvidenceReview:
  document_confirmation_id
  origin_fixture_hash, query_aoi_hash, crop_evidence_hash
  scenario_hash, area_record_hash, imagery_manifest_hash
  confirmed_origin, confirmed_period, assumptions
  confirmation_id, snapshot_fingerprint, confirmed_at, human_review_ms
```

All fields are editable. At minimum critical company/claim/crop/cultivation origin/period/quantity/unit are reviewed before mapping/assessment. Separate document confirmation from mapped evidence/timing/assumption confirmation. Backend must reject unconfirmed/stale assessment requests; a checkbox alone is insufficient.

Changes increment revisions and revoke affected confirmation/result/export readiness. Async responses include fingerprints/revisions and cannot overwrite a newer state. Preserve original source and extracted values alongside corrections.

## 3. Origin and imagery frame

```text
OriginFixture:
  schema_version, origin_id, origin_country, origin_role='cultivation'
  crop, supported_periods[{start,end}]
  query_aoi: {crs:'EPSG:4326', type, coordinates, source:'user_supplied'}
  crop_evidence_id, crop_evidence_hash
  cultivation_geometry: {crs, type, coordinates}
  geometry_source='gistda_crop_product', derivation='clip_to_aoi_then_union'
  no_ownership_claim=true, is_surveyed_parcel=false
  display_geojson_wgs84, imagery_ids[], image_frame_id
  provenance, version, sha256

CropEvidence:
  provider='GISTDA', source_origin='user_supplied_api_export'
  source_path, source_manifest_hash, raw_response_hash
  case_aoi_association='user_declared', query_aoi_hash
  selected_crop='maize', source_result='Maize', source_update
  source_crop_geometry[], source_schema='result/update/geom_array'
  source_endpoint=null, source_product=null, source_resolution=null
  source_request_period=null, source_retrieved_at=null, source_crs_declaration=null
  coordinate_assumption='WGS84_longitude_latitude', assumption_review_id
  coverage_status: 'unknown' | 'missing' | 'unsupported'
  geometry_presence: 'present' | 'missing'
  source_area=null, source_yield=null, source_units=null
  supported_evidence_window, date_policy, geometry_composition_policy
  window_is_reviewed_assumption, normalization_method, derived_geometry_hash
  request_limit: {maximum:5, unit:'km2', method:null, source:'user_correction'}
  publication_permission='user_confirmed_specific_files', limitations[]

ImageryFrame:
  query_aoi_hash, requested_bbox_wgs84, crop_crs, crop_bounds, crop_affine
  crop_shape, display_shape, reconstruction_method
  images[{file,item_id,acquired_at,source_url,sha256,kind:'real_rgb'}]
```

Exact country/origin/crop/period lookup; province-only, foreign, unknown/partial/mismatched periods are unsupported/review-needed. User query polygons delimit requests, not cultivated area. GISTDA product polygons do not prove surveyed registration/ownership, factory procurement or feed/food subtype. Clip/union matching crop geometry in EPSG:32647; retain source/derived shapes separately. Preserve date slices/season semantics rather than summing repeated biweekly polygons as additional acreage/production. Display coordinates do not justify area in degrees. Verify new per-case crop/resize/object-fit transforms.

Old [frame metadata](../frontend/assets/image-frame-source.json), [imagery provenance](../frontend/assets/imagery-provenance.json) and WorldCereal candidate cover superseded locations. See [asset guide](../docs/assets.md). GISTDA exports are now supplied; only new Sentinel-2 frames/derived records are pending. Preserve raw source bytes and unknown metadata. Improved accuracy is a user premise, not a contract guarantee.

Raw files: [UC1 message.txt](../data/origins/gistda/usecase1/message.txt), [UC2 response.json](../data/origins/gistda/usecase2/response.json), [manifest](../data/origins/gistda/manifest.json). They are JSON arrays of `result`, `update`, `geom[]`; geometry objects are Polygon/MultiPolygon, not FeatureCollections. Select Maize by exact label; UC2 also contains Cassava/Sugarcane. Missing/duplicate maize, file/hash/schema errors and unsupported windows fail closed. Replacing raw bytes/manifest or supported assumptions revokes affected confirmation/result/export fingerprints.

The corrected cap is 5 km², user-reported; original request/area-method/endpoint metadata is absent. Both maize updates are 2026-09-30; do not map that directly to requested period, observation/harvest/burn dates or complete coverage. Preserve missing source fields as unknown/null and record reviewed scenario/window/composition assumptions separately. Do not invent area/yield/50 m resolution from API examples. Geometry presence is not complete crop coverage. No live authentication/fetching/refresh API, key/account prerequisite or WorldCereal fallback.

## 4. Scenario provider and production

```text
ScenarioRequest: origin_id, origin_country, crop, period, scenario_id

ScenarioEvidence:
  provider='ScenarioBurnProvider', provider_version, scenario_id
  origin_id, crop, period, crs, is_synthetic=true
  burn_features[], cultivation_record_id
  coverage_status: 'complete_synthetic' | 'missing' | 'unsupported'
  synthetic_event_date, classification_definition
  assumptions[], provenance{authoring_method,version,sha256}

AreaProductionRecord:
  record_id, origin_id, crop, period, is_mock=true
  cultivation_geometry, crop_evidence_hash, geometry_source='gistda_crop_product'
  query_aoi_hash, derivation_method, geometry_is_synthetic=false
  area_method='projected_UTM', crs
  yield_t_per_ha, yield_basis='uniform_mock'
  synthetic_harvest_date, timing_is_synthetic=true
  policy_window, policy_definition, assumptions[], provenance

GeometryResult:
  union_cultivation_m2, union_burn_m2, intersected_burn_cultivation_m2
  cultivation_ha, burn_linked_ha
  method, crs, tolerance, rounding_policy
```

Complete synthetic **burn** coverage with empty burn features is intentional scenario zero. GISTDA crop no-data is not zero cultivation/no-burn, and available crop coverage is not complete burn coverage. User UC1/UC2 labels do not certify fire status. The burn provider remains separate, returning evidence rather than Q/b/verdict prose. Geometry uses reviewed GISTDA crop union and separately labelled burn features; production derives Q/b only with explicit mock yield/timing assumptions. Source yield is retained separately; using it requires reviewed units/aggregation/date semantics, not merely a documentation example.

Under uniform mock yield: Q = cultivated hectares × yield; b = burn-associated intersection hectares / cultivated hectares. Empty cultivation cannot produce b. Invalid polygons fail rather than silently repairing unknown geometry. Residue burning after harvest can classify origin under an explicit policy but does not prove grain destroyed.

Independent synthetic 100-ha geometry/math fixtures remain test inputs only. Final integrated hectares/Q/b/R and report oracles are set from matched source evidence and explicit mock inputs after date qualification; no preassigned historical toy result.

## 5. Assessment snapshot and result

```text
AssessmentSnapshot:
  schema_version, source_document_sha256, review_revision
  confirmed_document_values
  document_confirmation_id, evidence_confirmation_id
  origin_fixture_hash, query_aoi_hash, crop_evidence_hash
  imagery_manifest_hash, scenario_hash, area_record_hash
  geometry_result, Q_t, b, R_t
  calculation_version, reporting_version
  assumptions:
    uniform_yield
    eligible_supply_access='all_non_burn_supply_first'
    carry_in_stock_t, stock_value_basis
    external_replacement_of_declared_origin_t, external_value_basis
    origin_period_closed, timing_policy_confirmed
  snapshot_fingerprint

CalculationResult:
  status: 'conditional_deficit' | 'no_deficit_demonstrated' | 'no_purchases' |
          'insufficient_data' | 'unsupported_input' | 'invalid_input' | 'model_inconsistent'
  Q_t, b, C_t, R_t, B_min_t, s_min_ratio
  denominator='R_t'
  reason_codes[], limitations[]
  is_scenario=true, is_probability=false
```

Normalize t/kg explicitly, retaining original unit/value/conversion factor. Compute C=Q(1−b), B_min=max(0,R−C), s_min=B_min/R only for R>0. R=0 has s_min=null/N/A and no-purchases state. Keep math pure and separate from report wording.

Missing/negative/nonfinite values, invalid b/unit/location/period cannot produce confident results. Unknown stock/replacement remains null/insufficient; nonzero replacement needs a different reviewed model. R>Q under closed-origin/no-replacement assumptions is inconsistent, not a confident burn-sourcing bound. Do not create a factory/whole-company denominator.

## 6. Report/export/replay and evaluation

```text
Report:
  run_id, input_fingerprint, result
  report_type='deterministic_thai_template'
  source/evidence/input pointers, assumptions, missing_evidence[], limitations[]
  reviewer_export_confirmation, generated_at, regenerated_from

EvaluationRecord:
  evaluation_id, test_id, case_id
  category: 'A_software' | 'B_reference_quality' | 'C_real_world_accuracy'
  input_hashes, implementation_versions
  expected, actual, tolerance, outcome, reason_codes
  extraction_before[{field,expected,actual,correct,missing}]
  human_corrections[], extraction_after[], denominators
  workflow_steps[{name,status,automated_ms,human_ms,intervention}]
  reference_quality{provenance,year,season,permission,independence,coverage}
  raw_output_paths[], started_at, finished_at
```

Trace bundles retain source PDF hash/text, original/extracted/corrected data, confirmations, origin/period, fixture/provider/image hashes, assumptions, computation and report. Replay freezes these inputs/versions; report body/numeric/status results repeat except declared timestamps/run metadata. Changed versions/hashes cannot silently substitute new evidence.

Include GISTDA query/source/derived geometry hashes, source crop/period/resolution/units/coverage/reuse metadata and Sentinel-2 per-case frame hashes. Render user boundaries, crop evidence, synthetic burn and mock production distinctly. Factory type/end use remains document context. No live API during replay/pitch; if source permission prevents reproducible caching, mark readiness blocked.

No live-LLM label on template reports; no probability, misconduct/compliance verdict or destroyed-grain claim. Separate before/after-correction correctness and auto/human timing. Core tests do not measure C.

## 7. Proposed interface operations and workflow states

Endpoint naming will be frozen with the integration owner; logical operations are:

1. Submit PDF bytes → ExtractionRecord.
2. Validate/confirm document revision → DocumentReview confirmation.
3. Resolve confirmed origin/crop/period → matching fixture or explicit unsupported state.
4. Load scenario and compute geometry/production → evidence/review inputs, not assessment verdict.
5. Confirm full evidence/assumption snapshot → EvidenceReview confirmation.
6. Assess immutable confirmed snapshot → CalculationResult.
7. Review/export/replay → source-backed run/report records.

UI states distinguish no-document, extracted-needs-review, document-confirmed, evidence-needs-review, ready-to-assess, calculating, assessed, stale, unsupported, invalid and insufficient. Server operations enforce confirmation/revision rules and guard uploads/static paths. Development interfaces may be explicit mocks during integration, but acceptance must execute actual extraction/calculation paths.
