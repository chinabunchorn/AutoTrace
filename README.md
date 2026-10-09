# AutoTrace

AutoTrace is a use-case-driven prototype for the **Beyond Green: Greenwashing Innovation Challenge**. It demonstrates a document-to-assessment workflow with automation and human review, not a production monitoring platform or validated fire detector.

## What it will demonstrate

```text
Supported procurement PDF
  → actual text extraction and field parsing
  → source-backed human review, correction and confirmation
  → supported cultivation-origin and period lookup
  → clearly labelled synthetic scenario evidence
  → deterministic supply calculation
  → traceable assessment and Thai report
```

Two alternative scenarios share the same real satellite-image base:

1. **Simulated burn-linked exposure:** supplied purchases and toy production assumptions demonstrate a positive conditional clean-supply deficit.
2. **Simulated zero-burn:** an explicitly complete empty burn layer and consistent supply/purchase inputs demonstrate no deficit under the scenario assumptions.

Burn-positive evidence does not automatically imply deficit. A zero result does not certify a company burn-free or compliant. Mock documents/data remain mock after human confirmation.

## Implementation approach

Preserve the authoritative standalone v2 HTML/Tailwind/vanilla-JavaScript presentation: green/cream style, typography, narrative, comparison viewer, calculation layout, dashboard/fullscreen and responsive behavior. Add one minimal local Python helper for actual PDF extraction and geospatial/calculation work. No production database, frontend rewrite, live third-party API or mandatory LLM.

Real imagery is presentation context with original dates/geography/provenance. Synthetic cultivation and burn layers remain separate. No burned maize area, crop tonnes or NBR is inferred from the RGB images.

## Development map

| Folder | Purpose |
|---|---|
| [frontend/](frontend/README.md) | Presentation, document review and workflow state |
| [backend/](backend/README.md) | Local API, extraction, GIS/scenarios, calculations and reporting |
| [contracts/](contracts/README.md) | Shared input/output records and confirmation/state rules |
| [data/](data/README.md) | Fictional PDFs, supported origin fixtures and synthetic scenarios |
| [tests/](tests/README.md) | Software/geometry/calculation and end-to-end acceptance |
| `scripts/` | Launch/preflight, PDF generation, browser/offline QA tools |
| `docs/` | Additional useful architecture/workflow explanations when needed |
| `outputs/` | Generated local trace reports and evaluation evidence, ignored by Git |

The full tree and responsibilities of smaller subfolders are in [AGENTS.md](AGENTS.md), avoiding redundant Markdown in every directory. Development work packages, owner fields, dependencies and completion checks are in [plan.md](plan.md).

## Current status

**Structure, development documentation and reusable reference/assets supplied.** Application implementation still requires explicit approval. There is no implemented server, new frontend application, generated demo PDF, executed application test suite or working launch command yet. Empty folders use `.gitkeep`; these are not feature stubs.

The unchanged [standalone v2](docs/reference/autotrace-v2.html) is included as a historical design reference, not the implemented application. Satellite images, matching fonts/icon, an illustrative photo, provenance, source projection metadata and license notices are included under `frontend/assets/`. See [docs/assets.md](docs/assets.md) for exact paths, reuse boundaries and remaining preparation checks, [asset-manifest.json](frontend/assets/asset-manifest.json) for hashes, and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution. Open the standalone HTML in a browser for design inspection; its fixed-value extraction is not actual PDF extraction.

Private proposals/research archives and unrelated v3 Journey inputs are excluded. Fictional procurement PDFs, supported AOI fixtures and synthetic scenarios still need to be created during approved implementation. Required project inputs use repository-relative paths, not personal workspace dependencies.

## What this prototype does not prove

No actual company sourcing/misconduct, greenwashing, grain destruction, chemical contamination, compliance, real crop/fire-detection accuracy, nationwide applicability or measured time savings. Software tests validate software and controlled scenario processing, not environmental ground truth.

No Journey/transport, cross-border imagery acquisition, atmospheric modelling or new model training is in mandatory scope.
