# AutoTrace — Click-Driven Pitch Storyboard

## Status and purpose

**Approved direction; Beats 1–7 implemented as a scoped concept-review prototype.** See [preview instructions](../frontend/pitch/README.md). Beats 1–2 are visually accepted; the separately authorized question/Earth, factory, suppliers and cream question are retained. The user has authorized desktop/Mac-focused Beat 7 continuation, with eight held conceptual reveals. Further mobile-specific work is excluded. Numeric scenario inputs and a real product handoff remain pending; product integration is not implemented. This scope does not approve dependency installation, new source acquisition, general application implementation, commits, publication or deployment. Existing implementation gates in [the root plan](../plan.md) remain unchanged.

Explain the motivation, introduce a fictional burn-free sourcing claim, and hand over to the actual human-reviewed document-to-assessment workflow. Target delivery is within three minutes, including transitions and spoken explanation; this is a rehearsal target, not a measured duration. Headings/topics are English; short descriptions/dialogue are Thai. Exact copy remains pending approval.

[Thai captions and an optional earlier narration draft](pitch-script.md) are available. The presenter now handles their own speech; animation scope excludes voiceover/speech generation and does not require approval of that earlier script. The presenter plans to bring their own Mac; further mobile-interface development is not requested. Exact browser, display/adapter and clicker remain unknown. No target-display/clicker rehearsal has occurred.

## Approved experience

- Presenter-triggered cinematic transitions, not continuous scrolling or an autoplay video. Next/previous keyboard controls and a tested clicker are the primary navigation; scroll is optional, not required.
- Each transition finishes at a stable visual state that holds indefinitely. No critical story beat advances on a timer. Previous returns to a deterministic resting state without replaying the entire introduction.
- Mix 2D composition with low-poly 3D only where viewpoint changes improve comprehension. Camera, objects and HTML text overlays share one story progression. Avoid free-flight controls during the pitch.
- Preserve AutoTrace's green/cream design and supplied typography. Dialogue stays readable in screen-space overlays rather than being embedded in moving 3D objects.
- Local prepared libraries/assets only; no runtime CDN, remote basemap, API or font requirement. A real-3D renderer is a future scoped dependency decision, not a change to the core product stack.
- Illustrative landscapes, smoke, routes and hotspot markers are storytelling, not acquired satellite evidence, atmospheric modelling or actual sourcing records.

## Story beats and camera choreography

All headings below are working English topics, not approved final copy. Reuse a recognizable highlighted origin in the supply-chain and solution scenes; actual product evidence remains distinct from the illustrative opening.

| Beat | Working topic | Visual action | Resting state / speaking purpose |
|---|---|---|---|
| 1 | Bangkok, Over Time | Fixed 2D Bangkok composition. On start, the corner month moves October → November → December → January through one slow, smooth day → night → day cycle; illustrative haze gradually obscures distant skyline layers. Lit windows and street lights carry the city into night before daylight returns. No review chrome, month gauge or standalone footnotes; illustration context is part of the relevant description. Use no year or measured PM2.5 values unless separately sourced. | January daytime haze. Stop the day/night cycle; introduce the familiar pollution problem and wait for Next. |
| 2 | A Wider Picture | Approach the haze, then transition to a low-poly oblique aerial view of Thailand with schematic agricultural-burning markers. Myanmar and Laos may be peripheral context. Keep the geographic silhouette recognizable. The separately authorized backdrop adds a decorative curved-Earth horizon, atmosphere, sparse stars, globe lines/cloud wisps and a small satellite silhouette; this is authored illustration, not acquired satellite imagery or georeferenced globe/orbital data. | Regional overview. Clearly label as an illustration, not a historical hotspot dataset or pollution attribution; wait for Next. The new Earth decoration remains pending visual review. |
| 3 | Beyond What We See | Keep the accepted regional camera/terrain still; on presenter input, crossfade the topic and draft Thai question “แล้วคำกล่าวอ้างว่า ‘ไม่เผา’ ตรวจสอบได้อย่างไร?” over 1.2 seconds. Wording remains pending review. | Question remains visible while the presenter explains context; wait for Next to enter the separately authorized Beat 4. |
| 4 | Factory A's Claim | Four-second descent through stylized clouds to a low-poly businessman outside fictional Factory A, with warehouse and grain silos. A screen-space bubble fades in near the end, labelled “Factory A · โรงงานสมมติ”: “ข้าวโพดของเรา 100% มาจากแปลงที่ไม่เผา ในช่วงเวลาที่ระบุ”. | Factory, speaker and claim hold. Treat the statement as fictional/unverified, not certification or a real sourcing/geographic link. Next starts Beat 5; previous restores the question; reduced motion shows the final factory immediately. |
| 5 | More than one supplier. | Six-second pullback of the existing factory camera and transition into an authored 2D/SVG road-map illustration. Three fictional corn supplier nodes send three trucks along separate routes to Factory A. Highlight Supplier 01 as “Selected origin / แหล่งปลูกที่เลือก”, using recurring narrative symbol `story-origin-01`. | Trucks finish in separate yard lanes and stop; the origin highlight remains stationary. Explain multiple suppliers, but compare only the selected origin/period. Routes do not imply live logistics tracking. Next enters Beat 6; previous restores the full factory claim and reduced motion immediately shows the parked-truck diagram. |
| 6 | How can we check? | A 1.6-second transition fades the parked-truck diagram and caption to plain cream. Large left-aligned Thai text appears on two lines: “ถ้ามีข้าวโพดจากแปลงที่เผาเข้ามา / เราจะตรวจสอบคำกล่าวอ้างได้อย่างไร?” No maps, icons, numbers, narration or results. | Conditional question holds for speech, without asserting actual burning/sourcing/contamination. Next enters the solution wipe. Previous restores the exact supplier hold and revised caption; reduced motion shows the final question immediately. Copy remains for review. |
| 7 | From Claim to Checkable Evidence | Two-second left-to-right wipe introduces AutoTrace and a fictional paper sketch. Eight held reveals cover document, human review, the same story origin, an enlarged field, orange burn example, green unburned emphasis, unscaled purchase picture and closing. Equations/letter quantities are removed at the user's request. Later reveals last 1.2 seconds; the field stays anchored during highlight changes. | Concept-only closing, visibly not connected to the actual workflow. No numeric case, live confirmation, assessment or simulated working handoff. Previous returns one reveal at a time; reduced motion completes only the requested reveal. |

The supplier count is a visual explanation of possible multi-supplier sourcing. The prototype comparison concerns only purchases attributed to one supported cultivation origin and period; it must not compare total factory purchases across all suppliers to one field's supply.

Beat 5's user-approved Thai caption is **Factory A รับผลผลิตมาจากหลายแหล่ง โดยมีจำนวนที่แตกต่างกัน**. Quantity differences are qualitative fictional context, not numeric cargo/purchase records. Its recurring origin is an authored recognition cue, not a supported product AOI or reviewed GISTDA geometry. Later product evidence must be matched independently; the illustrated field, river and road shapes provide no area, yield, tonnes, timing, burn or verified sourcing data. No source acquisition, document confirmation or calculation is triggered by the pitch.

## Beat 7 — Product-aligned reveal

Use presenter-controlled sub-beats so the workflow and visual supply explanation do not appear all at once. The user has authorized this continuation and requested field/burn visualizations instead of equations; exact copy/visual acceptance remains for review. The current implementation splits the six conceptual steps below into eight held views by revealing the whole field, illustrative burn portion and unburned focus separately. See the [implemented view table](../frontend/pitch/README.md).

1. **Document:** show a clearly fictional procurement/claim document containing declared origin, crop, period and purchased quantity. A story illustration is not PDF extraction.
2. **Human review:** show source-backed review/correction and document confirmation. This is a brief explanation of the workflow, not silent confirmation of a live run.
3. **Origin and evidence:** highlight the specific supported query AOI and matched maize cultivation geometry. Identify GISTDA crop evidence separately from synthetic burn layers, imagery and mock yield assumptions; require evidence/assumption confirmation in the actual product.
4. **Supply composition:** reveal estimated production, the scenario burn-linked portion, then estimated non-burn supply. Keep origin and period consistent. Avoid implying burned residue physically contaminated or destroyed harvested grain.
5. **Purchase comparison:** reveal declared purchases from that same origin/period. Only then show any conditional shortfall and cautious warning.
6. **Handoff:** return to the actual workflow entry point. The story must not create reviewed inputs, invoke assessment, generate an export, or leave an assessed result in product state.

An illustrative explanation may preview the concept with clearly labelled mock inputs. It is not a live result. In the actual application, values and outcomes come from reviewed inputs and backend calculations, never from the animation, filename or independent test oracles. If the application is not implemented/verified, do not stage a fake working handoff.

The current concept version has no equations, letter-quantity shorthand, numeric case or specified period. It enlarges the same authored crop glyph, clips an orange hatched burn example to it, then masks the burn portion out of green emphasis. These shapes are illustration, not GISTDA geometry or synthetic provider fixtures; their proportions are not measurements. Two unscaled bands explain a hypothetical purchase/supply mismatch, with an explicit no-quantity-scale caption. The origin retains `story-origin-01`, not a real AOI. GISTDA remains an intended evidence role, not data loaded/matched by the story. Closed-scenario assumptions are visible during supply/comparison. The caution says **if declared purchases exceed estimated unburned supply**, with missing/inconsistent-input review, never an actual preset deficit. The closing states that the actual workflow demonstration is not connected. Numeric case preparation and real application integration remain separate work.

## Calculation and claim contract

These equations define the intended product calculation and remain a technical reference, **not on-screen Beat 7 content**. The presentation explains the same distinctions through field highlights and an unscaled hypothetical comparison.

- Use **Estimated production (Q)** rather than ambiguous “regional yield” when displaying tonnes. Yield is a rate such as tonnes/hectare; production is a quantity. The source exports contain no numeric yield.
- Use **Scenario burn-linked production (Q × b)** and **Estimated non-burn supply (C)**, with explicit mock yield/weight/timing assumptions. The burn-linked portion is a scenario classification, not chemically contaminated or destroyed grain.
- Calculate `C = Q × (1 − b)` and conditional shortfall `B_min = max(0, R − C)`. `R` is purchases from the declared origin and period, not factory capacity or total multi-origin purchases.
- A nonzero shortfall means non-burn supply alone cannot account for purchases under the reviewed model. It does not independently establish actual sourcing, contamination, misconduct or greenwashing.
- Closed-origin/carry-in/replacement assumptions must be explicitly reviewed. Unknown stock or outside supply cannot be treated as zero. `R > Q` is model-inconsistent, not a confident burn-linked conclusion. Missing evidence is unknown, not zero.
- **Approved presentation-only assumptions:** no carry-in stock and no replacement supply from outside the selected origin. State these visibly during the comparison. This does not set defaults or confirm assumptions for uploaded documents or live product assessments; those still require explicit review.
- Suggested warning meaning: “Declared purchases exceed estimated non-burn supply. The burn-free sourcing claim requires further verification.” Draft Thai wording is in [the script](pitch-script.md), pending copy approval.
- A zero shortfall does not certify a factory burn-free or compliant. The opening remains compatible with both approved controlled cases.

## Visual and evidence boundaries

- Months/haze illustrate the premise; they are not an observed seasonal time series. Do not assert crop burning is Bangkok's only pollution source.
- Regional markers are schematic. Do not claim they show all fires, an observed northern concentration, country contributions, or a proven smoke pathway into Bangkok. Myanmar/Laos context is not cross-border product coverage.
- Factory A, its businessman, suppliers and roads are fictional. Use subtle but legible illustration/fictional/scenario labels at the relevant scene boundaries.
- Feed maize is narrative context only. Crop geometry does not establish feed/food subtype, ownership or surveyed parcel boundaries.
- Crop evidence, query boundary, scenario burn, real RGB and mock production retain visibly different roles. Do not paint smoke/burn into real satellite images or reuse superseded imagery as selected-origin evidence.
- The product still requires actual PDF → human review → supported origin/evidence → assumption confirmation → calculation/report. Opening visuals are not a transport module, national detector or compliance certificate.

## Draft rehearsal budget

A proposed allocation is 15 / 20 / 10 / 15 / 15 / 15 / 70 seconds for Beats 1–7, including transitions and narration. The longer final beat includes the human review and progressive comparison. This leaves room within the three-minute target; it does not force automatic progression or guarantee delivery time. Revise from a real spoken rehearsal rather than adding a countdown that advances scenes.

## Remaining creative/input decisions

1. Review of on-screen Thai captions and English headings. The presenter handles speech independently; the earlier narration draft is optional, not a dependency.
2. Exact scenario period and Q/b/R. Presentation-only zero carry-in/no outside replacement assumptions are approved, but actual product inputs still need review; do not borrow old toy values or source update dates as new case evidence.
3. Choose the presenter's Mac/browser and confirm projector/adapter and clicker availability. Keyboard control must work without a clicker. Start in widescreen composition; verify readable Thai on the actual display.
4. Style-frame approval for skyline, regional terrain, businessman/factory and 2D/3D transitions. Lightweight stylized models are the proposed direction; assets still need creation/permission review.
5. Beats 1–2 are visually accepted; Beats 3–7 have scoped implementation authorization and their newer copy/visuals remain for review. The prototype uses authored assets/native WebGL/SVG/HTML without new dependencies. Numeric case inputs still need review; real product handoff requires separately authorized application implementation and readiness.

## Future acceptance checks

- Every beat/sub-beat waits for a presenter input; first-start, previous, restart, rapid clicks and interruption cannot skip important text or leave an in-between camera state.
- Thai overlays stay readable throughout camera movement and fullscreen; no clipped text or accidental page scrolling. Reduced-motion mode uses stable views/simple transitions.
- Rehearsal fits within three minutes without sacrificing the review/assumption explanation. Report measured timing only after rehearsal.
- A cold reload with external requests blocked loads all prepared assets and completes the story. Test actual target-browser 3D performance and a static fallback if WebGL is unavailable.
- Skipping/restarting/leaving the introduction does not mutate document confirmations, evidence confirmations, assessment inputs or exports. Product confirmation gates remain enforced in UI and backend.
- Illustrative maps/routes/hotspots cannot be mistaken for live evidence. Any live result matches the backend and current confirmed revision; no fixed dramatic verdict.
- Provide static backup views or an explicitly labelled recording; neither substitutes for real product acceptance.

Related guidance: [frontend](../frontend/README.md), [tests](../tests/README.md), [asset boundaries](assets.md), [origin inputs](../data/origins/README.md), and [implementation/claim gates](../plan.md).
