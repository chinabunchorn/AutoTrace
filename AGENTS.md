# AutoTrace — Development Guide

Read [README.md](README.md) for the product, [plan.md](plan.md) for development tasks and acceptance criteria, and the relevant component guide before changing files. This file describes the repository structure; small folders do not need their own Markdown guide.

## Current state and authorization

The repository contains the approved folder structure, development documentation and authorized reusable v2 reference/assets. Asset preparation and publication are approved; application implementation, dependency installation and new scenario/PDF generation still await approval of the plan. Folder placeholders and the historical reference are not a working application. Commit, push and deployment require applicable authorization.

The product UI and deterministic report are planned in Thai.

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
│   ├── origins/              Supported AOI/period geometry fixtures
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
| `backend/geospatial/` | Supported origin resolution, synthetic evidence, union/intersection areas, explicit mock Q/b derivation | Real fire detector claim, geocode arbitrary origins, compute m² in degrees |
| `backend/assessment/` | Deterministic calculations, accurately labelled Thai template, source-backed export/replay | Change numbers through prose, certify compliance or company misconduct |
| `contracts/` | Shared field definitions, states, confirmation/revision rules and endpoint payloads | Competing frontend/backend schemas or microservice scope |
| `data/` | Versioned/hashable runtime fictional documents, AOIs and scenarios | Test verdicts disguised as environmental inputs, private real-company records |
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
| Supported origin/AOI geometry and period records | `data/origins/` | Country, crop, supported periods, CRS, fictional-boundary labels, imagery linkage, version and hashes |
| Synthetic positive and complete-zero burn layers and mock production assumptions | `data/scenarios/` | Coverage status, units, yield/timing/stock assumptions, authoring provenance, version and hashes |
| Shared schemas, application code and independent test inputs/oracles | `contracts/`, `backend/`, `tests/` | Validation rules, supported versions and reference-answer methods; oracles must not supply runtime answers |
| Dependency manifests/lockfiles, launch and generation/QA scripts | Relevant component directories and `scripts/` | Reproducible setup and tested commands; no hard-coded machine paths or credentials |

Use `frontend/assets/image-frame-source.json` to reconstruct the image transform, and validate alignment before placing synthetic layers. Preserve the original imagery manifest, but do not load its legacy MODIS/WorldCereal overlay entries as scenario inputs; the standalone context PNGs are intentionally not imported.

Before adding third-party assets, verify redistribution permission and include required attribution/license notices. If permission or provenance is missing, report the blocker rather than publishing the file or substituting invented metadata. Preserve historical prototypes separately; do not copy unrelated research archives into the application.

Keep credentials, private uploads, personal notes, environments, package caches, bulky intermediate satellite products and raw generated run outputs out of Git. Commit required compact presentation assets normally; if a required asset exceeds practical Git limits, agree on Git LFS or a versioned acquisition process with checksums before adding it. Any acquisition must happen during preparation, never during the offline pitch workflow.

Publish only deliberately selected, sanitized evaluation summaries or demonstration recordings when approved, using a tracked documentation location rather than committing the entire ignored `outputs/` directory. Do not claim an asset is included until its repository path and content have been verified.

## Product scope and evidence rules

AutoTrace demonstrates two alternative controlled scenarios: simulated burn-linked exposure and complete synthetic zero-burn. Both follow actual PDF contents → human review/correction/confirmation → supported cultivation-origin/period lookup → labelled scenario evidence → deterministic calculation → traceable report.

Preserve the authoritative standalone v2 green/cream design, typography, narrative, image viewer, equations, dashboard/fullscreen and responsiveness. Build from an authorized copy with repository-relative dependencies and preserve historical originals. Do not inherit the v3 Journey/transport scope.

Keep real Sentinel-2 true-colour imagery unchanged, with Thailand geography, 26 January/12 March 2021 acquisition dates and provenance. It is not a verified maize-fire pair. No NBR, burned crop area or tonnes derived from RGB appearance. Synthetic cultivation/burn evidence stays separate and visibly labelled. Human-confirmed mock stays mock. MODIS/WorldCereal context is not validated procurement/maize-burn ground truth.

Cultivation origin is not a warehouse, supplier address or headquarters. Country, origin, crop and period must match supported fixtures; unsupported inputs stop instead of reusing evidence. A province name does not establish a farm polygon or justify province-wide production in an image clip.

ScenarioBurnProvider supplies synthetic features, coverage and assumptions, not a detected-fire or procurement verdict. Complete empty synthetic coverage means zero; missing evidence means unknown. Project geometry uses a suitable metre-based CRS and the original crop/resize/display transform. Area-based b requires explicit uniform mock yield or documented weights.

C = Q × (1 − b); B_min = max(0, R − C); s_min = B_min / R for R > 0. R is declared-origin/period purchases, never factory capacity. R = 0 is a distinct no-purchases result. Unknown stock/replacement is not zero; unsupported/inconsistent inputs require review. Residue burning after harvest does not prove grain destruction.

No assessment before human confirmation, including through backend calls. Input edits revoke affected confirmations and stale results/exports; obsolete async responses must not replace current state. Separate math from prose; accurately label a deterministic template report.

No proof of greenwashing/misconduct, contamination, compliance, actual sourcing, statistical probability, real detector accuracy or unmeasured time savings. No mandatory live LLM/API, OCR, model training, foreign acquisition, nationwide platform, login or cloud.

## Task assignment and development

Use the work packages in root `plan.md`; each has an owner field, inputs, outputs, dependencies and verification. Leave owners unassigned until people agree on them. Do not introduce a separate ownership/work-log system.

Before editing, inspect Git status and relevant changes. Never reset, clean, stash or overwrite someone else's work. Coordinate shared `contracts/`, root plan and helper APIs before parallel implementation. Keep extraction, provider, geometry, production, math and reporting separate within one helper process.

After implementation approval, use small RED–GREEN–REFACTOR steps and exercise actual workflows. Report changed files/contracts, actual commands/exit codes, evidence paths, untested items and blockers. Run affected tests before declaring done. Working files or screenshots alone are not completed workflows.

Record software/calculation correctness, reference quality and real-world accuracy separately. Keep extraction before/after correction and automated/human timing separate. Retain actual per-case/per-test evidence under `outputs/`; never invent pass results or reduce everything to one AutoTrace accuracy percentage.

## Runtime and reproducibility

Use one helper bound to 127.0.0.1, serving only approved repository assets and bounded PDF uploads with escaped source text. Never execute document instructions. The complete pitch workflow must operate with external-network requests blocked after dependencies/assets are prepared. Document portable setup and launch commands, supported versions and missing prerequisites so another contributor can reproduce the workflow from a fresh clone. Never embed credentials or machine-specific filesystem paths in code or shared documentation.
