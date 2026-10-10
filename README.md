# AutoTrace

**Current hackathon demo:** the [read-only FastAPI backend](backend/README.md) now serves four GET endpoints with prepared data. UC1 document/calculation values and both image pairs are available; UC2 document/calculation fields are an editable null template in `data/demo/UC2.json`. Launch from the repository root with `.venv/Scripts/python.exe -m backend` after the documented dependency setup. The larger product workflow below remains future scope.

AutoTrace is a use-case-driven prototype for the **Beyond Green: Greenwashing Innovation Challenge**. It demonstrates a document-to-assessment workflow with automation and human review, not a production monitoring platform or validated fire detector.

The concept covers factories consuming selected maize/corn for animal feed, human food and other uses. End use comes from reviewed documents, not remotely inferred subtypes. **The two supplied GISTDA API response exports replace WorldCereal and live crop fetching.**

## What it will demonstrate

```text
Supported procurement PDF
  → actual text extraction and field parsing
  → source-backed human review, correction and confirmation
  → supported AOI/crop/period lookup against prepared GISTDA crop polygons
  → matched Sentinel-2 context and separately labelled burn scenario evidence
  → deterministic supply calculation
  → traceable assessment and Thai report
```

Two scenarios use the newly selected, distinct query AOIs in [data/origins/README.md](data/origins/README.md):

1. **UC1 — user-designated burnt field:** GISTDA crop evidence, matched imagery and separately labelled burn/mock production assumptions support a conditional assessment, not a preassigned deficit.
2. **UC2 — user-designated non-burnt field:** a complete empty synthetic burn layer can demonstrate no deficit under explicit mock assumptions; the location label itself is not verified no-burn evidence.

Burn-positive evidence does not automatically imply deficit. A zero result does not certify a company burn-free or compliant. Mock documents/data remain mock after human confirmation.

## Implementation approach

Preserve the authoritative v2 HTML/Tailwind/vanilla-JavaScript design. Plan one local Python helper that reads frozen crop inputs; separately prepare new Sentinel-2 after approval. No GISTDA fetching/refresh/key/account prerequisite, production database, frontend rewrite or mandatory LLM. The pitch uses only repository inputs.

The unchanged order remains extraction → human review → origin/evidence → confirmation → calculation/report. Local GISTDA validation/derivation and future Sentinel-2 preparation precede the offline walkthrough. Query AOIs, crop polygons, real imagery and synthetic burn/mock production remain separate evidence roles. No crop tonnes or burn conclusion is inferred from RGB or factory end use.

## Development map

| Folder | Purpose |
|---|---|
| [frontend/](frontend/README.md) | Presentation, document review and workflow state |
| [backend/](backend/README.md) | Local API, extraction, GIS/scenarios, calculations and reporting |
| [contracts/](contracts/README.md) | Shared input/output records and confirmation/state rules |
| [data/](data/README.md) | Fictional factory PDFs, selected AOIs/GISTDA snapshots and separate burn/mock production scenarios |
| [tests/](tests/README.md) | Software/geometry/calculation and end-to-end acceptance |
| `scripts/` | Launch/preflight, PDF generation, browser/offline QA tools |
| `docs/` | Additional useful architecture/workflow explanations when needed |
| `outputs/` | Generated local trace reports and evaluation evidence, ignored by Git |

The full tree and responsibilities of smaller subfolders are in [AGENTS.md](AGENTS.md), avoiding redundant Markdown in every directory. Development work packages, owner fields, dependencies and completion checks are in [plan.md](plan.md).

## Current status

**Read-only backend implemented under the user's 2026-10-10 authorization.** Its 13 backend tests pass; see [backend setup/results](backend/README.md). No new frontend application or generated demo PDF is implemented. The earlier full extraction/review/GIS/report workflow is not complete. Remaining empty folders use `.gitkeep`; these are not feature stubs.

The unchanged [standalone v2](docs/reference/autotrace-v2.html) is included as a historical design reference, not the implemented application. Satellite images, matching fonts/icon, an illustrative photo, provenance, source projection metadata and license notices are included under `frontend/assets/`. See [docs/assets.md](docs/assets.md) for exact paths, reuse boundaries and remaining preparation checks, [asset-manifest.json](frontend/assets/asset-manifest.json) for hashes, and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution. Open the standalone HTML in a browser for design inspection; its fixed-value extraction is not actual PDF extraction.

The corrected API cap is **5 km²**, not the earlier unit error; both planning AOIs are below it. [The AOI brief](data/origins/README.md) preserves exact rings and source gaps. Supplied files:

- **UC1:** [message.txt](data/origins/gistda/usecase1/message.txt), JSON array containing Maize.
- **UC2:** [response.json](data/origins/gistda/usecase2/response.json), JSON array containing Cassava, Maize and Sugarcane; the prototype selects **Maize** only.
- [Integrity/provenance manifest](data/origins/gistda/manifest.json), with original hashes, observed schema and user-confirmed public redistribution permission.

Both maize records have source update `2026-09-30`, not a verified procurement/imagery/harvest period. No request/date-range, endpoint/resolution, coverage assertion, area or yield is embedded. Keep these unknown; review a supported evidence window and explicit mock yield/composition policy. No GISTDA API key/network is required. GISTDA accuracy remains unmeasured.

The old imagery and WorldCereal candidate packet are superseded location references. Both provided response files are preserved byte-for-byte; no new API call, image acquisition or application implementation occurred. Derived origin records, new Sentinel-2, fictional PDFs, final case oracles and separate scenarios still await approved preparation/implementation. Importing/publishing source files and these docs does not pass an application gate.

## What this prototype does not prove

No actual company sourcing/misconduct, greenwashing, grain destruction, chemical contamination, compliance, real crop/fire-detection accuracy, nationwide applicability or measured time savings. Software tests validate software and controlled scenario processing, not environmental ground truth.

No Journey/transport, cross-border imagery acquisition, atmospheric modelling or new model training is in mandatory scope.
