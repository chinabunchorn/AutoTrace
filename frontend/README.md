# Frontend Development

## Responsibility

Build the user-facing document-to-assessment workflow while preserving the authoritative standalone v2 HTML/Tailwind/vanilla-JavaScript visual design. Read root [AGENTS.md](../AGENTS.md), [plan.md](../plan.md) W4 and [contracts/README.md](../contracts/README.md).

**Owner:** unassigned. **Status:** reusable assets and preserved v2 reference supplied; application implementation awaits approval.

## Tasks

1. Adapt the supplied [standalone v2 reference](../docs/reference/autotrace-v2.html) into a separate frontend, preserving green/cream colors, typography, narrative, viewer, equation panels, dashboard/fullscreen and responsive/reduced-motion behavior. Do not edit the historical reference or retain its fixed-value extraction/early assessment as runtime behavior.
2. Load actual mock PDF bytes or user-selected supported PDFs through ingestion. A case button cannot return predefined fields.
3. Display the document/source text, page pointers, extracted values, validation and editable corrections. Keep original values alongside corrections.
4. Require document confirmation before origin mapping; display confirmed cultivation country/AOI/crop/period distinctly from company/supplier addresses.
5. Present unchanged real imagery and separate synthetic cultivation/burn layers with provenance, zero/unknown distinction and timing/yield/stock assumptions.
6. Require evidence/assumption confirmation before calculation. Render conditional deficit, no deficit, no purchases, insufficient, invalid and unsupported states honestly.
7. Invalidate affected confirmations/result/export on edits/new documents/scenario changes. Reject obsolete async responses by revision/fingerprint.
8. Show equations, inputs, denominator and results from backend; accurately label Thai template report, permit review/export and show missing evidence/limits.

## Inputs/dependencies

- Supplied [v2 HTML and assets](../docs/assets.md); originals remain unchanged. Use `assets/before.webp`, `assets/after.webp`, `assets/fonts.css` and its 14 WOFF2 files, `assets/favicon.svg`, and the original provenance/verified hash inventory. The factory photo is foreign illustration only, with its existing provenance/non-evidence label.
- Source projection/render metadata in `assets/image-frame-source.json`; W3 must validate exact display-frame alignment. Legacy context overlay entries in the original manifest are not synthetic scenario inputs.
- Shared document/review/origin/provider/result/API contracts.
- Working ingestion, evidence and assessment helper operations.

Keep presentation assets in `assets/`; its purpose/provenance rules are documented in root AGENTS.md. No machine-specific absolute asset paths or runtime CDN/API/font dependencies.

## Expected outputs

A working static frontend (future HTML/CSS/JS files), source-backed editable review, correct confirmation/revision state, aligned overlays, synchronized calculation/report/dashboard views and usable exports. No frontend math/prose may silently reinterpret backend values. No initial assessed Medium result before review.

## Done when

Both cases complete actual PDF-to-report flow; quantity/period/origin edits affect results/support states; gates cannot be bypassed; stale responses never become current results. Desktop 1440×900/1280×800 and mobile 390×844/360×800 work without unintended overflow. Review controls, slider/layers, dashboard/fullscreen/exit, keyboard and reduced motion are exercised. Reload/full workflow works with external requests blocked. Raw evidence goes to ignored `outputs/`.

Reusable frontend assets exist, but no new frontend application or application acceptance results exist yet. The archived HTML is a design reference, not proof of the agreed workflow. Preserve [third-party attribution and licenses](../THIRD_PARTY_NOTICES.md) in reused/distributed assets.
