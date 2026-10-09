# AutoTrace — Development Guide

Read [README.md](README.md) for the product, [plan.md](plan.md) for development tasks and acceptance criteria, and the relevant component guide before changing files. This file describes the repository structure; small folders do not need their own Markdown guide.

## Current state and authorization

The repository contains the approved folder structure, development documentation and authorized reusable v2 reference/assets. Asset preparation and publication are approved; application implementation, dependency installation and new scenario/PDF generation still await approval of the plan. Folder placeholders and the historical reference are not a working application. Commit, push and deployment require applicable authorization.

The product UI and deterministic report are planned in Thai. Publication of the two supplied GISTDA exports, source manifest and related documentation is authorized. This does not authorize application coding, dependency installation, new acquisition/PDF/scenario generation or deployment.

The two user-supplied GISTDA API exports are the active frozen crop-polygon inputs, replacing WorldCereal and live fetching. The cap is corrected by the user to **5 km²**. Factories using selected maize/corn may include feed, human food and other uses; keep workflow/human gates unchanged. Canonical AOIs, file mappings, actual schema/update metadata and remaining review gaps are in [data/origins/README.md](data/origins/README.md). No GISTDA key/account or fetching adapter is required.

## Project structure and responsibilities

```text
AutoTrace/
├── README.md                 Product purpose, workflow and current status
├── AGENTS.md                 This structure/development guide
├── plan.md                   Tasks, dependencies, schemas, acceptance and cut line
├── THIRD_PARTY_NOTICES.md     Asset licenses, attribution and reuse boundaries
├── frontend/
│   ├── README.md             Frontend tasks and expected UI behavior
│   └── assets/               Versioned images/fonts and presentation provenance
├── backend/
│   ├── README.md             Helper/API integration and backend responsibilities
│   ├── ingestion/            Actual PDF extraction and controlled-template parsing
│   ├── geospatial/           Origin mapping, scenario provider, geometry and yield
│   └── assessment/           Pure mass balance, reporting and trace replay
├── contracts/
│   └── README.md             Shared record/API schemas and workflow states
├── data/
│   ├── README.md             Runtime data boundaries and preparation requirements
│   ├── documents/            Clearly fictional procurement/claim PDFs
│   ├── origins/              Selected query AOIs, GISTDA crop snapshots and frames
│   │   ├── README.md         Canonical coordinates, frozen inputs and review gaps
│   │   └── gistda/           Supplied UC1/UC2 responses and integrity/provenance manifest
│   └── scenarios/            Synthetic burn layers and mock production records
├── tests/
│   ├── README.md             Unit/integration/browser acceptance matrix
│   └── fixtures/             Independently defined test inputs/oracles
├── scripts/                  Launch, PDF generation, browser/offline QA utilities
├── docs/                     Asset guide and architecture/workflow explanations
│   ├── assets.md             Supplied inputs and unfinished preparation checks
│   └── reference/            Preserved standalone v2; design reference only
└── outputs/                  Generated run/report/evaluation artifacts; ignored by Git
```

Empty coding/data/tool folders use `.gitkeep` so Git can retain their paths. A `.gitkeep` is not a module, generated fixture or result. Required demo inputs must be versioned in the repository, not available only on a contributor's machine. Read [docs/assets.md](docs/assets.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) before reusing supplied assets.

### Folder outputs and boundaries

| Folder | Expected output after implementation | Must not do |
|---|---|---|
| `frontend/` | v2-derived HTML/vanilla JS UI, editable source-backed review, gated assessment and traceable presentation | Framework redesign, fake extraction, stale/early results |
| `frontend/assets/` | Versioned image/font assets and original provenance, byte-identical real images | Repaint imagery, embed synthetic burn into RGB, use runtime CDN dependencies |
| `backend/` | One loopback helper and stable same-origin endpoints; component integration | Microservices, production DB, exposing arbitrary filesystem paths |
| `backend/ingestion/` | PDF page text, parsed fields/source pointers and validation | Load oracle JSON as extraction, infer from filename, call text extraction OCR |
| `backend/geospatial/` | Local GISTDA snapshot validation, supported lookup, crop union/intersection and separate burn/mock Q/b derivation | Live fetching/refresh, WorldCereal fallback, whole-AOI cultivation, real fire/accuracy claim, area in degrees |
| `backend/assessment/` | Deterministic calculations, accurately labelled Thai template, source-backed export/replay | Change numbers through prose, certify compliance or company misconduct |
| `contracts/` | Shared field definitions, states, confirmation/revision rules and endpoint payloads | Competing frontend/backend schemas or microservice scope |
| `data/` | Fictional factory documents, user query AOIs, permitted GISTDA records and separate burn/mock production | Test verdicts as evidence, unlicensed API publication, private company records |
| `tests/fixtures/` | Independent expected answers and controlled mutation inputs | Runtime dependency for extraction/assessment outcomes |
| `scripts/` | Small launch/preflight, document-generation and QA utilities | Mandatory external services or unapproved dependency installs |
| `docs/` | Useful product/technical explanations when needed | Machine-specific setup inventories or agent-management bureaucracy |
| `outputs/` | Actual per-run source/correction/input/result/report/evaluation records | Tracked private uploads, fabricated execution results |

## Shared assets and files to track in GitHub

The repository should provide everything needed to reproduce the two controlled cases after documented dependency setup. Required assets must not depend on a contributor's external folders or undocumented downloads. The historical v2 HTML, RGB images, font/icon/photo assets, original provenance, source projection metadata and license notices are now supplied; the implemented application, fictional PDFs, AOI/scenario fixtures and test code remain future deliverables. [asset-manifest.json](frontend/assets/asset-manifest.json) records actual supplied paths and hashes.

| Track in GitHub | Repository location | Required accompanying information |
|---|---|---|
| Original satellite presentation images, `before.webp` and `after.webp` | `frontend/assets/` | Preserve original bytes; identify each image's acquisition date and source |
| Imagery provenance manifest, such as `imagery-provenance.json` | `frontend/assets/` | Source URLs/item identifiers, attribution and reuse terms, Thailand geography, acquisition dates, SHA-256 hashes, CRS and crop/resize/display metadata |
| Fonts, icons and other assets required by the v2 design | `frontend/assets/` | License/attribution and version; serve from the repository without runtime CDN requests |
| v2-derived application HTML, CSS and JavaScript | `frontend/` | Preserve the approved design; make asset references repository-relative |
| Preserved standalone v2 and asset guide | `docs/reference/autotrace-v2.html`, `docs/assets.md` | Historical design reference only; fixed-value extraction/legacy outputs are not new workflow results |
| Fictional procurement/claim text PDFs for both cases | `data/documents/` | Conspicuous fictional/mock labels, template version and reproducible generation source/tooling |
| User query AOIs, permitted GISTDA crop snapshots and reviewed origin records | `data/origins/` | Distinct query/source/derived geometries, crop/date/CRS/resolution/coverage/source units, license, hashes and matched Sentinel-2 frames |
| Synthetic positive and complete-zero burn layers and mock production assumptions | `data/scenarios/` | Coverage status, units, yield/timing/stock assumptions, authoring provenance, version and hashes |
| Shared schemas, application code and independent test inputs/oracles | `contracts/`, `backend/`, `tests/` | Validation rules, supported versions and reference-answer methods; oracles must not supply runtime answers |
| Dependency manifests/lockfiles, launch and generation/QA scripts | Relevant component directories and `scripts/` | Reproducible setup and tested commands; no hard-coded machine paths or credentials |

The old image-frame metadata/imagery manifest and copied WorldCereal `frontend/assets/usecase2/` candidate are superseded location references. Their raster/map/overlay/AOI must not become active crop or selected-case imagery. Preserve the supplied `data/origins/gistda/usecase1/message.txt`, `usecase2/response.json` and manifest; derive reviewed crop records separately. Only new Sentinel-2 preparation remains after approval. Never modify historical or supplied raw bytes to pretend they contain new geography/metadata.

Before adding third-party assets, verify redistribution permission and include required attribution/license notices. If permission or provenance is missing, report the blocker rather than publishing the file or substituting invented metadata. Preserve historical prototypes separately; do not copy unrelated research archives into the application.

Keep credentials, private uploads, personal notes, environments, package caches, bulky intermediate satellite products and raw generated run outputs out of Git. Commit required compact presentation assets normally; if a required asset exceeds practical Git limits, agree on Git LFS or a versioned acquisition process with checksums before adding it. Any acquisition must happen during preparation, never during the offline pitch workflow.

Publish only deliberately selected, sanitized evaluation summaries or demonstration recordings when approved, using a tracked documentation location rather than committing the entire ignored `outputs/` directory. Do not claim an asset is included until its repository path and content have been verified.

## Product scope and evidence rules

AutoTrace demonstrates two alternative controlled scenarios: simulated burn-linked exposure and complete synthetic zero-burn. Both follow actual PDF contents → human review/correction/confirmation → supported cultivation-origin/period lookup → labelled scenario evidence → deterministic calculation → traceable report.

Preserve the authoritative standalone v2 green/cream design, typography, narrative, image viewer, equations, dashboard/fullscreen and responsiveness. Build from an authorized copy with repository-relative dependencies and preserve historical originals. Do not inherit the v3 Journey/transport scope.

Keep historical Sentinel-2 bytes/provenance intact, but do not reuse their dates/location as selected-case evidence. New acquisitions for both query AOIs are pending. GISTDA crop geometry is product evidence, not surveyed ownership or feed/food subtype truth; improved accuracy is an unmeasured user premise. User query AOIs, returned/clipped crop geometry, real RGB and separate synthetic burn/mock assumptions stay visibly distinct. Human-confirmed mock stays mock. MODIS/WorldCereal is historical context only.

Cultivation origin is not a warehouse, supplier address or headquarters. Country, origin, crop and period must match supported fixtures; unsupported inputs stop instead of reusing evidence. A province name does not establish a farm polygon or justify province-wide production in an image clip.

Load the frozen GISTDA files locally; verify manifest/hash/schema and select exact `result == "Maize"` rather than UC2's first crop. The exports contain only `result`, `update`, `geom`; no endpoint/resolution/request-period/coverage/area/yield metadata. Do not invent those fields or treat update `2026-09-30` as a procurement/harvest/burn date. Review evidence-window/composition/CRS assumptions; clip/union supplied geometry to the exact AOI. User-confirmed publication permission applies to these two files, not all GISTDA assets. No live fetching/refresh/key/account setup; missing/unsupported evidence cannot become zero or silently fall back to WorldCereal.

ScenarioBurnProvider supplies separate synthetic burn features/coverage/assumptions, not a real fire/procurement verdict. Complete empty synthetic burn coverage means scenario zero; missing evidence is unknown. Calculate cultivated area from matched GISTDA crop polygons clipped/unioned within the query AOI in EPSG:32647, not the whole AOI. Use each new Sentinel-2 crop/resize/display transform. Area-based b requires explicit mock yield/weights; user burnt/non-burnt names do not verify fire status.

C = Q × (1 − b); B_min = max(0, R − C); s_min = B_min / R for R > 0. R is declared-origin/period purchases, never factory capacity. R = 0 is a distinct no-purchases result. Unknown stock/replacement is not zero; unsupported/inconsistent inputs require review. Residue burning after harvest does not prove grain destruction.

No assessment before human confirmation, including through backend calls. Input edits revoke affected confirmations and stale results/exports; obsolete async responses must not replace current state. Separate math from prose; accurately label a deterministic template report.

No proof of greenwashing/misconduct, contamination, compliance, actual sourcing, statistical probability, real detector accuracy or unmeasured time savings. No live GISTDA fetching, mandatory LLM, OCR, model training, foreign acquisition, nationwide platform, application login or cloud. GISTDA account/API access is not a prototype preparation/runtime prerequisite; any future acquisition is separately approved scope.

## Task assignment and development

Use the work packages in root `plan.md`; each has an owner field, inputs, outputs, dependencies and verification. Leave owners unassigned until people agree on them. Do not introduce a separate ownership/work-log system.

Before editing, inspect Git status and relevant changes. Never reset, clean, stash or overwrite someone else's work. Coordinate shared `contracts/`, root plan and helper APIs before parallel implementation. Keep extraction, provider, geometry, production, math and reporting separate within one helper process.

After implementation approval, use small RED–GREEN–REFACTOR steps and exercise actual workflows. Report changed files/contracts, actual commands/exit codes, evidence paths, untested items and blockers. Run affected tests before declaring done. Working files or screenshots alone are not completed workflows.

Record software/calculation correctness, reference quality and real-world accuracy separately. Keep extraction before/after correction and automated/human timing separate. Retain actual per-case/per-test evidence under `outputs/`; never invent pass results or reduce everything to one AutoTrace accuracy percentage.

## Runtime and reproducibility

Use one helper bound to 127.0.0.1, serving only approved repository assets and bounded PDF uploads with escaped source text. Never execute document instructions. The complete pitch workflow must operate with external-network requests blocked after dependencies/assets are prepared. Document portable setup and launch commands, supported versions and missing prerequisites so another contributor can reproduce the workflow from a fresh clone. Never embed credentials or machine-specific filesystem paths in code or shared documentation.
