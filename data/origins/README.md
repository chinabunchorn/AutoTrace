# Selected AOIs and GISTDA Crop Evidence

This is the canonical coordinate and frozen-source brief for the prototype. Read [root plan](../../plan.md), [data guide](../README.md) and [shared contracts](../../contracts/README.md). Both user-supplied GISTDA responses are preserved locally with an [integrity/provenance manifest](gistda/manifest.json). The prototype will load these files instead of pulling the real API. No application implementation or new Sentinel-2 acquisition is supplied yet.

## Scope and evidence roles

- **Design choice:** the supplied GISTDA API exports are the frozen crop-classification/polygon source, replacing WorldCereal. No GISTDA fetching adapter, key, live refresh or network acquisition is required in the prototype. The selected crop remains maize/corn; factories using it may produce animal feed, human food or other products. Other returned crop labels do not expand prototype scope.
- **User-designated scenarios:** UC1 burnt field; UC2 non-burnt field. These labels describe intended cases, not verified fire evidence.
- **User-supplied geometry:** the rings below are query AOIs, not surveyed cultivation parcels, ownership boundaries or polygons already returned by GISTDA.
- **Required production geometry:** matched GISTDA crop Polygon/MultiPolygon clipped to the query AOI, deduplicated/unioned in a metre CRS and reviewed with dates/version/provenance. Do not use the whole AOI as cultivated maize area.
- **Unchanged mock scope:** fictional factory procurement/claims, explicitly mock production/stock/replacement assumptions, human review and deterministic assessment. Burn evidence stays a separately labelled synthetic scenario unless independently qualified real evidence is approved. GISTDA crop polygons do not establish burning or procurement.
- **Accuracy premise:** the user prefers GISTDA for improved crop/polygon accuracy. No comparative accuracy or cadastral precision has been measured. The documented maize endpoint name includes `50m`, but the supplied responses do not identify an endpoint or resolution; do not assign that metadata to them or call them surveyed/ground-truth farm polygons.

## Coordinates — WGS84 / EPSG:4326

GeoJSON uses **[longitude, latitude]**. UC1 was supplied as latitude, longitude pairs; the ring below swaps axes explicitly and adds the closing vertex. UC2 was supplied in GeoJSON longitude, latitude order and is already closed. Preserve numeric precision and vertex order; do not silently repair/change the requested area.

### UC1 — burnt-field scenario / planned ID `TH-DEMO-AOI-01`

Original input (latitude, longitude):

```text
16.676636, 101.053815
16.658834, 101.049309
16.655052, 101.069951
16.673717, 101.073642
```

Normalized closed ring (longitude, latitude):

```json
[
  [101.053815, 16.676636],
  [101.049309, 16.658834],
  [101.069951, 16.655052],
  [101.073642, 16.673717],
  [101.053815, 16.676636]
]
```

### UC2 — non-burnt-field scenario / planned ID `TH-DEMO-AOI-02`

Supplied closed ring (longitude, latitude):

```json
[
  [99.856711464629, 14.404965267850],
  [99.875262239307, 14.404897430670],
  [99.875332792781, 14.422978677858],
  [99.856780224208, 14.423046621511],
  [99.856711464629, 14.404965267850]
]
```

### Planning geometry check — not cultivated area

Both normalized polygons were checked as valid with Shapely 2.1.2 after Rasterio 1.4.4/GDAL transformation to **EPSG:32647 (UTM 47N)**. Straight polygon edges in projected coordinates give approximate planning areas:

| Query AOI | Projected area (m²) | Area (km²) | Area (ha) |
|---|---:|---:|---:|
| UC1 | 4,519,295.019 | 4.519295 | 451.929502 |
| UC2 | 4,000,003.686 | 4.000004 | 400.000369 |

These are software-computed areas of the supplied query polygons, not independent surveyed measurements, API-confirmed areas or crop production. GISTDA may apply a different area/limit method, for example a bounding extent; do not infer request acceptance from this check.

## API size constraint — corrected to 5 km²

The user corrected the maximum request area to **5 km² (5,000,000 m²)**. This replaces the previous unit error; the unit is no longer unresolved. Both planning polygon areas above are below that cap. The provider's measurement method/account rules are not embedded in the responses, so this is not an independently verified request-limit guarantee. No new GISTDA requests or automatic tiling/splitting are part of the prototype. Any future acquisition/changed AOI requires separate approval and provider-rule checks.

## Supplied responses — authoritative prototype inputs

| Case | Preserved file | Selected record | Geometry objects | Source update |
|---|---|---|---:|---|
| UC1 / `TH-DEMO-AOI-01` | [message.txt](gistda/usecase1/message.txt) | `result: "Maize"`, index 0 | 4 MultiPolygon objects, 65 polygon components | `2026-09-30` |
| UC2 / `TH-DEMO-AOI-02` | [response.json](gistda/usecase2/response.json) | `result: "Maize"`, index 1 | 8 Polygon/MultiPolygon objects, 125 polygon components | `2026-09-30` |

Both are JSON arrays despite UC1's `.txt` extension, not GeoJSON FeatureCollections. Each record has exactly `result`, `update` and `geom`; `geom` is an array of GeoJSON geometry objects. UC2 also contains Cassava (`2026-01-15`) and Sugarcane (`2026-09-30`). Preserve the full response; select maize by its exact label, not first-record position, and do not combine other crops into cultivation/Q. Component counts describe geometry structure, not surveyed farm counts.

The [manifest](gistda/manifest.json) records byte sizes/SHA-256, observed records/schema, user-declared case/AOI association, publication permission attestation and missing metadata. Both files are byte-identical to the supplied attachments, without detected credential fields/credentialed URLs. The user confirmed permission to publish these two responses on public GitHub; this is not a blanket GISTDA data license. Attribution: **GISTDA; API exports supplied by the project owner**.

Read-only Shapely inspection found all supplied geometry objects valid/nonempty and intersecting their associated user AOI. Some maize geometry crosses the AOI edges; clip to the exact canonical AOI before union/area processing in EPSG:32647. These checks are input inspection, not implemented application tests or proof of source completeness/authenticity. Case association is supplied by the user; no original request AOI is embedded in either response.

### Source gaps and support policy

The exports do **not** contain request `from`/`to`, endpoint/product/version/resolution, retrieval timestamp, explicit CRS, per-geometry observation/season dates, complete-coverage declarations, `area`, or `yield_avg`. Interpret GeoJSON axes as longitude/latitude with WGS84 as an explicit review assumption. Keep unknown metadata null/unknown. `update` is retained source metadata, **not** an acquisition date, procurement/harvest/burn period or complete biweekly history.

Define a human-reviewed supported evidence window and geometry-composition policy during implementation. Do not sum geometry objects/updates as distinct season production or silently declare them simultaneous surveyed parcels. If date/source semantics cannot support a proposed procurement period, stop/review or explicitly label a controlled scenario assumption; do not fabricate source metadata. Any composition/conditional area must stay traceable to the frozen bytes. Missing numeric yield is not zero: use separately reviewed mock yield/stock/burn assumptions. Both cases contain maize; no burn verdict is encoded.

The planned local snapshot loader verifies manifest/hash/schema/crop selection and supported AOI/date assumptions, with missing/corrupt/hash-mismatched/unsupported inputs stopping explicitly. No GISTDA authentication, connectivity, rate-limit, fetching or refresh tests are required for this frozen-source MVP. Replacing snapshots is an explicit reviewed input revision that invalidates downstream confirmations/results/exports; never silently download replacements or fall back to WorldCereal.

## Official API reference — context, not a runtime dependency

Primary documentation inspected: [GISTDA sphere Crop Information](https://sphere.gistda.or.th/docs/web-service/crop-information/).

The rendered official page documents the crop-area service:

```text
https://api.sphere.gistda.or.th/services/agri/maize-biweekly-50m
```

- Request: `geom` is GeoJSON Polygon/MultiPolygon; `from` and `to` are explicit dates; `key` is the user's API key.
- Documented example response fields: `result`, `update`, `geom`, `area` (rai) and `yield_avg` (tonnes/rai).
- This is not the generic cost/price `/services/info/crop` endpoint. Do not assume a point-query result includes a polygon.
- These documented fields/examples are not the supplied export schema: the actual files have no `area` or `yield_avg`, and do not identify this endpoint. Do not manufacture matching fields from documentation or assume the exact product/resolution. No new authenticated API request was executed by this project.
- Endpoint/account/date/area-method rules are relevant only to separately approved future acquisition, not prototype setup. The supplied exports and their actual limitations govern the local loader. Credentials, live requests and network-error behavior are out of this MVP's crop-input scope.

## Sentinel-2 and date selection — future work

Search/acquire actual Sentinel-2 imagery for **each new AOI** later, after authorization. Record clear/cloud/valid-pixel coverage, acquisition dates, item IDs/URLs, CRS, source affine/rounded crop window, display resize/object-fit mapping and hashes. Preserve RGB bytes and keep crop/burn overlays separate.

Both selected maize records contain source update `2026-09-30`; no new Sentinel-2 before/after dates, procurement period or harvest/burn chronology is fixed yet. Review the update/date semantics and supported evidence window, then select matching imagery/document assumptions deliberately. Do not request the latest crop data or reuse old 2021 images/dates.

The original v2 pair and the copied `frontend/assets/usecase2/` WorldCereal candidate packet cover previous locations and are **superseded historical references**, not selected-AOI evidence. Their 100-ha toy geometry and WorldCereal map-derived extent are not the new cultivation area. Keep old files/provenance intact; the local packet README now marks its superseded status.

## Integration exit conditions

Both cases need verified local snapshot hashes/schema, exact maize selection, a reviewed supported crop/evidence-window policy, clipped/unioned geometry/provenance and matched new Sentinel-2 frames before integrated spatial assessment can pass. The two response files are supplied, but no application phase/gate is passed by importing them. Missing/unsupported crop evidence remains insufficient/unknown, not zero cultivation or zero burn. A complete empty synthetic burn layer is scenario zero only.

Permission to publish these specific raw exports was confirmed by the user; preserve the attribution and limitations. New imagery/other third-party inputs require separate permission checks. Sentinel-2 preparation may need authorized network access later; GISTDA input reading and the pitch/replay use only these frozen repository files. No API key/account access is a setup prerequisite.
