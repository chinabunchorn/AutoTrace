# Opening story — Beats 1–7 concept review

A scoped, standalone review prototype, not the AutoTrace document-assessment application. The presenter handles their own narration; this preview contains no audio, voiceover or embedded speech script.

The current review target is a desktop/Mac presentation, not a dedicated mobile interface. Existing narrow-window styles are retained; further mobile UI work and mobile-specific QA are outside this pitch scope.

## Run

From the repository root, use Python's built-in development server:

```sh
python3 -m http.server 8772 --bind 127.0.0.1 --directory frontend
```

Open `http://127.0.0.1:8772/pitch/index.html`. This serves only the frontend directory; it is not the planned product helper/API. No package installation/build step is needed. Stop the server when finished. Direct opening of `index.html` is also a convenience path, but the local-server path is the verification target.

## Presenter navigation

- **Click the scene / Space / → / PageDown:** play October → January, then hold. The next input moves through the haze into the regional scene and holds there. One more input reveals Beat 3's question over the same stationary map. The next input descends through clouds to fictional Factory A and its claim. Another input pulls back into the supplier-map illustration and parks three trucks. The next input fades to Beat 6's cream question scene. The next input introduces AutoTrace, then each subsequent input reveals only one Beat 7 concept step. The preview ends at the concept closing, not a working application.
- **← / PageUp:** return one Beat 7 concept step at a time, then to the cream question, supplier hold, factory claim, question hold, regional hold, hazy January and clear October. Previous during a reveal/descent/delivery cancels travel and restores the preceding resting state.
- **R:** return to the clear opening, cancelling an in-flight transition.
- **F:** request fullscreen if supported by the host browser.
- OS reduced-motion preferences or `?motion=off` skip animated travel and pause ambient motion.
- Repeated Next inputs during a transition are ignored. Branding, review buttons/sliders, month gauge, status messages and separate footnotes are deliberately absent from the stage. Story topics/descriptions, the corner time label, relevant place/factory labels and the fictional speaker's claim are visible.
  Held-key autorepeat is also ignored, including under reduced motion; release and press again to advance or return another step.

The story progression does not autoplay. October → January lasts twelve seconds, with one slow, smooth day → night → day cycle: the sky darkens, the moon appears and windows/street lights illuminate, then daylight returns. Haze accumulates across the months and distant skyline layers fade, without globally blurring the city. The cycle stops on January daytime and holds until input; ambient traffic, a skytrain, boats, pedestrians and smog drift continue without advancing the calendar. The regional reveal retains its four-second duration. There is no timed jump between beats. Development-only `window.pitchReview.seek(scene, progress)` and `.state()` remain available for deterministic QA, not as visible controls or a frozen ambient-animation clock.

## Beat 3 — Beyond what we see

The original Beats 1–2 were visually accepted by the user; a subsequent Earth-themed background for Beats 2–3 is separately authorized and pending review. The third beat uses a 1.2-second caption crossfade without moving the camera, terrain or regional markers. Its English topic is **Beyond what we see.** The Thai question from the earlier draft is **แล้วคำกล่าวอ้างว่า “ไม่เผา” ตรวจสอบได้อย่างไร?** This copy remains pending visual review; it asks about checking a claim, without alleging actual sourcing or misconduct.

The question holds until presenter input; Next starts the separately authorized Beat 4 descent. Reset/previous cancel the reveal without stale text. Reduced motion shows the final question immediately. QA seeking supports `city`, `region`, `question`, `factory`, `suppliers`, `check` and `evidence` scenes with progress from 0 to 1. `evidence` also takes a third, integer step argument from 0 to 7; for example, `window.pitchReview.seek('evidence', 1, 6)` seeks the illustrative comparison. This is development access only, not product state.

## Beat 4 — Factory A's claim

On presenter input, a four-second cloud-covered descent replaces the regional map and Earth backdrop with an authored low-poly warehouse, grain silos and a suited businessman. The camera settles into an oblique factory view. A screen-space speech bubble fades in near the end, explicitly labelled **Factory A · โรงงานสมมติ**, with the Thai claim **“ข้าวโพดของเรา 100% มาจากแปลงที่ไม่เผา ในช่วงเวลาที่ระบุ”**. The topic is **Factory A's claim.** The description says **คำกล่าวอ้างของโรงงานสมมติ · ยังไม่ผ่านการตรวจสอบ**.

The factory, speaker and statement hold until input; Next starts Beat 5's pullback and deliveries. Previous returns directly to the question hold. Restart/previous cancel the descent without stale frames or a lingering claim. Reduced motion shows the completed factory scene immediately. The earlier January label disappears before the factory; it is story time, not a procurement/evidence date. No real period or company identity is invented. The yard is not a cultivation-origin polygon; descent does not establish a geographic link to a real factory. There are no emissions, certification badges, supplier trucks, document inputs or assessment results in this beat. Copy/visual acceptance and target-device rehearsal remain pending.

## Beat 5 — More than one supplier

On presenter input, a six-second sequence pulls the existing factory camera back, fades out the unverified claim and transitions into an authored SVG road-map illustration. Three fictional corn supplier nodes and three trucks are shown. The trucks follow separate curved routes, start slightly apart, finish in separate factory-yard lanes and stop. The topic is **More than one supplier.** The user-approved Thai description is **Factory A รับผลผลิตมาจากหลายแหล่ง โดยมีจำนวนที่แตกต่างกัน**. Different quantities are a qualitative part of the fictional story; no numeric purchases, cargo weights or measured sourcing are invented. Factory/supplier fictional labels remain visible.

Supplier 01 is highlighted as **Selected origin / แหล่งปลูกที่เลือก**, with stable narrative identifier `story-origin-01` for recognition in a later scene. This is a fictional field symbol, not a supported product AOI, reviewed GISTDA polygon, supplier address or source record. Any later product evidence must be matched/reviewed independently; do not derive geography, cultivated area, yield, tonnes, period or burn status from this illustration. Routes/trucks are not live logistics or verified procurement. There is no purchase total, assessment verdict or confirmation in this beat.

The diagram holds until presenter input, with all trucks parked and the origin highlight unchanged. Next starts the separately authorized Beat 6 question. Previous restores the full factory claim. Restart/previous cancel arrivals without stale callbacks; re-entry starts the trucks at their origins again. Reduced motion shows the completed diagram immediately. The SVG scene remains available after a forced or context-loss WebGL/Canvas2D factory fallback. During the initial pullback, the review API reports the actual factory renderer; the fully revealed diagram reports `renderer: "svg"` and `phase: "suppliers-hold"` at completion.

## Beat 6 — How can we check?

On presenter input, a 1.6-second transition fades the stationary supplier diagram and its caption to plain cream. The English topic **How can we check?** and a larger, left-aligned Thai question fade in, rendered on two lines:

> ถ้ามีข้าวโพดจากแปลงที่เผาเข้ามา
>
> เราจะตรวจสอบคำกล่าวอ้างได้อย่างไร?

The wording is conditional and uses the earlier draft's on-screen question; it does not assert actual burning, physical contamination, misconduct or a verified source. No icons, badges, maps, numbers, answer/results, narration or product controls accompany the question. The completed scene uses native HTML/CSS with `renderer: "html"` and `phase: "check-hold"`; the initial fading supplier underlay reports SVG. Copy/visual acceptance remains for review.

The question holds until presenter input. Next enters the separately authorized Beat 7 concept explanation. Previous restores the same parked trucks, selected-origin highlight and revised supplier caption. Restart/previous cancel the reveal and remove the cream overlay without stale callbacks. Reduced motion shows the completed question immediately; switching to reduced motion during travel also completes it safely. The question remains available after factory/terrain WebGL failure. No live confirmations, evidence inputs, assessment or exports are created.

## Beat 7 — From claim to checkable evidence

A two-second left-to-right wipe introduces AutoTrace and an authored procurement-paper sketch. Eight conceptual reveals hold individually for presenter input; subsequent reveals last 1.2 seconds. At the user's request, the supply/comparison pages are now visual, with no equations or letter-quantity shorthand. The enlarged field stays anchored while an orange hatched burn example fades in, then the green unburned part is emphasized. Other reveals use the existing crossfade. There is no autoplay, on-screen step counter, narration, review form or demo-launch button.

| Development step | Topic | What is explained |
|---|---|---|
| 0 | AutoTrace | Source document fields: fictional Supplier 01, corn, unspecified period and unspecified purchases. This HTML sketch is visibly fictional, not a PDF or extraction output. |
| 1 | Human review. | Read source text, correct and confirm before matching evidence. No actual document confirmation is performed. |
| 2 | Origin & evidence. | The exact authored corn-field symbol from Supplier 01 returns. GISTDA crop geometry is described as a role in the intended workflow; no GISTDA geometry is loaded or matched here. Synthetic burn and mock production remain separate roles. |
| 3 | From the field. | Enlarge the same authored corn field and ask what it could produce in the chosen period. No numeric area or production is invented. |
| 4 | Where burning is shown. | Fade in an orange hatched portion clipped to the illustrated field. It is an authored burn example, not measured fire, destroyed grain or contamination. |
| 5 | What comes from the unburned part? | Mute the burn example and emphasize the green part of the same field. Show the presentation-only no-carry-in/no-outside-replacement assumptions. |
| 6 | Check the claim. | Use two unscaled pictorial bands to illustrate a hypothetical purchase amount exceeding estimated supply from the unburned part of the same origin/period. The caption explicitly says the picture is not a quantity scale. Missing/inconsistent inputs require review, not a verdict. |
| 7 | Review the evidence. | Concept-only closing. State that the actual workflow demonstration is not connected; never fabricate a working application handoff. |

The map/field are narrative recognition cues, not geographic AOIs, reviewed GISTDA crop polygons or source records. They retain `story-origin-01` as a story identifier only. Crop rows/plants, highlight position/size and comparison-band lengths are authored illustration choices: they encode no area, production, burn fraction or purchase quantity. The field and comparison are visibly labelled as examples, not actual proportions/quantities. No dates, equations, letter quantities, numeric values, numerical scales, percentages, actual assessed case or company verdict appear. Exact numeric scenario inputs and period remain unreviewed; these diagrams create no scenario-provider data, PDF, acquisition or product evidence.

Previous restores each prior held concept; from the document reveal it restores Beat 6. Restart cancels travel and clears the concept layout. Rapid input cannot skip an in-flight reveal. Reduced motion finishes only the requested step; changing that preference mid-reveal preserves the current step. HTML/SVG remains available after factory/terrain renderer failures. Next at the closing does nothing. No helper request, PDF extraction, evidence matching, product confirmation, calculation or export occurs. A real product handoff remains blocked on application implementation/verification, not simulated by these illustrations.

## GitHub Pages publication

The presentation-only site is assembled with `python3 scripts/build_pitch_pages.py --out outputs/pages-site`. Use an empty output directory. The builder copies an explicit runtime-file allowlist plus referenced local fonts, favicon and both OFL notices; no backend, datasets, unrelated imagery or QA outputs enter the site. A root entry redirects to `pitch/`, retaining relative `assets/` references under the repository URL prefix.

`.github/workflows/deploy-pitch.yml` tests this packaging and deploys it on matching pushes to `main` or manual dispatch. Configure Settings → Pages → Source as **GitHub Actions**. The deployed URL is reported by the `github-pages` environment. This is a public concept presentation, not a deployed assessment API. To preview the exact artifact locally, serve its output directory with Python's HTTP server.

## Rendering and provenance

- Authored vector skyline, schematic country contours, low-poly terrain and fictional burning markers. These are not observed PM2.5, surveyed borders/elevation, GISTDA polygons, real hotspots or atmospheric transport evidence.
- Beat 5's fields, river, routes, trucks and factory icon are locally authored SVG. They are not georeferenced geometry or transport records; no new acquisition or third-party asset is used.
- Exaggerated dust-like motes drift around the upper towers, building in visibility/density toward January and continuing during its hold. They are illustrative, not visible-to-scale PM2.5 particles or concentration measurements. They fade with the city during the regional transition; reduced motion keeps them static. No additional on-stage labels are introduced.
- Real 3D triangle geometry, depth testing and camera projection use browser-native WebGL with no library/CDN dependency. Regional and factory Canvas2D fallbacks are available at `?flat=1` and on WebGL unavailability/context loss. The factory fallback projects the same geometry with software depth testing, at CSS-pixel resolution with cached resting frames; it does not rely on triangle-centroid painting that can hide doors behind walls. The factory context is initialized only when entered, independently of the regional context. Portrait camera distance adapts to keep the complete factory and speaker in frame.
- Beats 2–3 share an authored curved-Earth background: atmospheric rim, muted forest space, sparse stars, decorative globe lines/cloud wisps and a small satellite silhouette. It reveals with the existing ascent and remains still during Beat 3. Transparent WebGL/Canvas2D backgrounds reveal this layer without changing regional land geometry, labels or camera positioning. The curvature, globe lines, spacecraft and dotted arc are decorative, not georeferenced Earth imagery, a satellite acquisition or orbital tracking data. No new measured source evidence is implied. The backdrop is hidden in Beat 1.
- The skyline uses recognizable architectural cues, not a surveyed reconstruction or an acquired photograph. Regional geography is deliberately approximate and labelled illustrative; do not use it for factual geographic claims.
- DM Sans and IBM Plex Sans Thai use existing local font assets. Preserve the supplied [license notices](../assets/licenses/) and [third-party attribution](../../THIRD_PARTY_NOTICES.md) when distributing the preview.
- Native JavaScript/CSS/SVG/WebGL only. No framework change, live basemap, third-party model download, dependency install, backend call, document confirmation or assessment result.

## Files

- `index.html`: fixed storytelling stage, corner time label, cream question backdrop and captions.
- `pitch.css`: v2-aligned green/cream palette, layout and display fallbacks.
- `pitch.js`: deterministic seven-beat state, day/night progression, question reveals, factory descent, supplier pullback, eight conceptual reveals and click/keyboard navigation.
- `city.js`: authored building/street/river detail, night lighting and ambient SVG city life.
- `terrain.js`: authored illustrative terrain, 3D camera and flat fallback.
- `factory.js`: authored fictional warehouse/silos/businessman, descending camera and depth-tested Canvas2D fallback. No third-party model or company data.
- `suppliers.js`: authored fictional corn-origin/road/factory SVG and three path-following trucks. No geographic or procurement input.
- `evidence.js`: authored document/workflow explanation, reused/enlarged field, clipped orange burn example, masked green emphasis and an unscaled visual purchase example. No equations, live source text or product state.
- `earth.svg`, `satellite.svg`: locally authored decorative Earth/space assets; no third-party acquisition or runtime network required.
- [Browser QA script](../../scripts/test_pitch_review.mjs): development-only checks via an isolated Chrome CDP session; no new package required.

See [approved direction](../../docs/pitch-storyboard.md). This prototype's correctness/visual review does not pass core application G1–G6. Actual browser-check results and screenshots belong under ignored `outputs/pitch-review/`, not in production input fixtures.

## Review focus

Beats 1–6 retain their visuals/timing. Does the AutoTrace wipe flow naturally from the cream question? Does one enlarged field with orange/green emphasis explain supply more clearly than formulas? Is the purchase picture clearly hypothetical and unscaled, rather than an actual case verdict? Review Beat 7's copy/visuals and rehearse timing before claiming pitch readiness. Numeric case inputs and real application handoff are not implemented by this concept opening.

The selected Mac/browser/projector and clicker still need an actual human rehearsal. Headless browser checks do not establish projector readability, hardware-GPU performance, speaking synchronization or pitch readiness.

## Verdict: PARTIAL — browser concept validated; pitch setup pending

All seven concept beats, real camera animation, question/claim reveals, three moving/parked trucks, cream question, solution wipe and eight conceptual reveals have been exercised in isolated headless Chrome. QA covers presenter holds, keyboard navigation, reset/interruption, reduced motion, cold local loading with external requests blocked and forced/context-loss fallback. Generated desktop, mid-arrival/reveal and Mac-sized screenshots were inspected. QA checks layouts at 1440×900, 1280×800, 1920×1080 and 1728×1117, including supplier-label containment, caption spacing, two-line Thai question and all eight concept layouts. Factory QA also checks projected subject bounds and compares fallback surfaces with the WebGL render. The test renderer was SwiftShader software WebGL, not a measured hardware-GPU run.

The terrain/factory/supplier map and workflow remain authored illustrations; target-device/browser/fullscreen/projector/clicker rehearsal and the new solution sequence's visual/copy approval are still pending. Exact case values/period and the working product handoff are also pending. Do not extend this review verdict to the full product or environmental accuracy.

For browser QA, supply a separately launched isolated Chromium with a loopback CDP endpoint and the development server above, then run from the repository root:

```sh
node scripts/test_pitch_review.mjs --cdp http://127.0.0.1:9229 --url http://127.0.0.1:8772/pitch/index.html --out outputs/pitch-review
```

The script does not install or launch a browser. It writes actual checks/screenshots to `outputs/pitch-review/` and exits nonzero if required checks fail. Exact source fingerprints are retained with the local evidence; a report for earlier code does not validate later changes.
