# Shared Development Contracts

**Purpose:** frontend/backend/data/test contributors use one set of records and states. These are proposed contracts to freeze before implementation, not implemented APIs or generated JSON schemas.

**Output:** agreed versioned payload definitions and validation rules. **Owner:** unassigned; coordinate all interface changes with dependent components. Do not introduce separate schemas in different components. Test oracles never become runtime extraction/assessment inputs.

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
  origin_fixture_hash, scenario_hash, area_record_hash, imagery_manifest_hash
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
  geometry: {crs, type, coordinates}
  geometry_is_fictional=true, no_ownership_claim=true
  display_geojson_wgs84, imagery_ids[], image_frame_id
  provenance, version, sha256

ImageryFrame:
  requested_bbox_wgs84, crop_crs, crop_bounds, crop_affine
  crop_shape, display_shape, reconstruction_method
  images[{file,item_id,acquired_at,source_url,sha256,kind:'real_rgb'}]
```

Exact country/origin/crop/period lookup; province-only, foreign, unknown/partial/mismatched periods are unsupported/review-needed. Fixture geometry does not prove registration/ownership/real agricultural extent. Display WGS84 metadata does not justify area calculations in degrees. Verify crop/resize and object-fit transforms against unchanged imagery.

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
  cultivation_geometry, geometry_is_fictional=true
  area_method='projected_UTM', crs
  yield_t_per_ha, yield_basis='uniform_mock'
  synthetic_harvest_date, timing_is_synthetic=true
  policy_window, policy_definition, assumptions[], provenance

GeometryResult:
  union_cultivation_m2, union_burn_m2, intersected_burn_cultivation_m2
  cultivation_ha, burn_linked_ha
  method, crs, tolerance, rounding_policy
```

Complete synthetic coverage with empty burn features is intentional zero. Missing coverage cannot mean clean. Provider returns evidence, not Q/b/verdict/report text. Geometry computes unions/intersections; production derives Q and b only with explicit yield/timing policy. Real provider substitution requires qualified provenance/coverage/matching, not merely compatible JSON.

Under uniform mock yield: Q = cultivated hectares × yield; b = burn-associated intersection hectares / cultivated hectares. Empty cultivation cannot produce b. Invalid polygons fail rather than silently repairing unknown geometry. Residue burning after harvest can classify origin under an explicit policy but does not prove grain destroyed.

## 5. Assessment snapshot and result

```text
AssessmentSnapshot:
  schema_version, source_document_sha256, review_revision
  confirmed_document_values
  document_confirmation_id, evidence_confirmation_id
  origin_fixture_hash, imagery_manifest_hash, scenario_hash, area_record_hash
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
