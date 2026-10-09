# Frontend Development

## Responsibility

Build the user-facing document-to-assessment workflow while preserving the authoritative standalone v2 HTML/Tailwind/vanilla-JavaScript visual design. Read root [AGENTS.md](../AGENTS.md), [plan.md](../plan.md) W4 and [contracts/README.md](../contracts/README.md).

**Owner:** unassigned. **Status:** reusable assets and preserved v2 reference supplied; application implementation awaits approval.

Revised source/concept: frozen user-supplied GISTDA exports replace WorldCereal/live fetching, with new Sentinel-2 still pending. Factories using maize/corn may produce feed, human food or other products. Exact AOIs, corrected **5 km²** cap, supplied response mappings/schema and review gaps are in [the origin brief](../data/origins/README.md). No application is implemented yet.

## Tasks

1. Adapt the supplied [standalone v2 reference](../docs/reference/autotrace-v2.html) into a separate frontend, preserving green/cream colors, typography, narrative, viewer, equation panels, dashboard/fullscreen and responsive/reduced-motion behavior. Do not edit the historical reference or retain its fixed-value extraction/early assessment as runtime behavior.
2. Load actual mock PDF bytes or user-selected supported PDFs through ingestion. A case button cannot return predefined fields.
3. Display the document/source text, page pointers, extracted values, validation and editable corrections. Keep original values alongside corrections.
4. Require document confirmation before origin mapping; display confirmed cultivation country/AOI/crop/period distinctly from company/supplier addresses.
5. Present each selected query AOI separately from reviewed GISTDA crop polygons and synthetic burn overlays; show new matched Sentinel-2 with dates/source/resolution and mock yield/stock/timing. API crop evidence does not prove burning, surveyed ownership or feed/food subtype. User scenario labels alone are not real burn evidence.
6. Require evidence/assumption confirmation before calculation. Render conditional deficit, no deficit, no purchases, insufficient, invalid and unsupported states honestly.
7. Invalidate affected confirmations/result/export on edits/new documents/scenario changes. Reject obsolete async responses by revision/fingerprint.
8. Show equations, inputs, denominator and results from backend; accurately label Thai template report, permit review/export and show missing evidence/limits.

## Inputs/dependencies

- Supplied [v2 HTML/style/fonts/icon](../docs/assets.md); preserve the historical reference. Its imagery and copied WorldCereal candidate cover superseded locations. Do not use them as new-AOI evidence or a WorldCereal runtime source. The foreign feed-mill photo is a generic historical illustration only, not every factory's identity.
- Supplied [UC1 response](../data/origins/gistda/usecase1/message.txt), [UC2 response](../data/origins/gistda/usecase2/response.json) and [manifest](../data/origins/gistda/manifest.json), with future derived origin records/new Sentinel-2 frames. W3 validates local bytes/schema/maize selection and supported window/composition. No key, account, fetch/refresh button or remote API/map/CDN requirement.
- Shared document/review/origin/provider/result/API contracts.
- Working ingestion, evidence and assessment helper operations.

Keep presentation assets in `assets/`; its purpose/provenance rules are documented in root AGENTS.md. No machine-specific absolute asset paths or runtime CDN/API/font dependencies.

## Expected outputs

A working static frontend (future HTML/CSS/JS files), source-backed editable review, correct confirmation/revision state, aligned overlays, synchronized calculation/report/dashboard views and usable exports. No frontend math/prose may silently reinterpret backend values. No initial assessed Medium result before review.

Display factory type/end use as reviewed document context, not inferred subtype. Show GISTDA frozen-source attribution/hash and source update 2026-09-30 separately from supported scenario/procurement/imagery dates. Source area/yield/request-period/coverage/endpoint/resolution are absent; label unknowns and reviewed assumptions rather than inventing complete coverage. UC2 retains other crops in its source file, but only Maize contributes to the prototype. Unsupported dates/missing evidence stop, not clean/zero. Human gates remain unchanged.

## Done when

Both cases complete actual PDF-to-report flow; quantity/period/origin edits affect results/support states; gates cannot be bypassed; stale responses never become current results. Desktop 1440×900/1280×800 and mobile 390×844/360×800 work without unintended overflow. Review controls, slider/layers, dashboard/fullscreen/exit, keyboard and reduced motion are exercised. Reload/full workflow works with external requests blocked. Raw evidence goes to ignored `outputs/`.

Reusable frontend assets exist, but no new frontend application or application acceptance results exist yet. The archived HTML is a design reference, not proof of the agreed workflow. Preserve [third-party attribution and licenses](../THIRD_PARTY_NOTICES.md) in reused/distributed assets.
