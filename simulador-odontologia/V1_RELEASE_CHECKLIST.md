# Simulador de Odontología — V1 release checklist

Branch: `feature/simulador-odontologia-craneo-3d`

Production (`main`) must remain unchanged until manual QA is approved.

## 1. Stability and performance

- Mobile low-power WebGL profile.
- Reduced pixel ratio and FPS cap on mobile.
- Optional overlays disabled initially on mobile.
- WebGL context-loss detection and recovery UI.
- Tooth geometry downloads avoided in the skull viewer when only tooth bounds are needed.
- Separate lightweight dentition viewer renders only when interaction changes.

## 2. Interactive 3D dentition

- Permanent FDI positions supported from atlas tooth bounds.
- Upper/lower/all filters.
- Tooth selection and isolation.
- Crown/root educational morphology.
- Typical root pattern by tooth class.
- Vestibular, lingual/palatal, mesial, distal and occlusal/incisal viewpoints.
- Explicit disclaimer that dental proxies are educational morphology, not clinical segmentation.

## 3. Anatomical regions

- Temporal fossa.
- Infratemporal fossa.
- Pterygopalatine fossa.
- Orbit.
- Nasal cavity.
- Hard palate.
- Region-to-bone links back to the skull viewer.

## 4. Odontological neurovascular map

- V2 and V3 trunks.
- Infraorbital, superior alveolar, greater palatine and nasopalatine pathways.
- Inferior alveolar, lingual, buccal and auriculotemporal pathways.
- Maxillary artery overview.
- Anesthesia/clinical relevance notes.

## 5. TMJ, mastication and soft tissues

- TMJ surfaces/disc/capsule/ligament concepts.
- Opening movement demonstration.
- Masseter, temporalis, medial and lateral pterygoid review.
- Tongue, buccinator and floor of mouth overview.
- Parotid, submandibular and sublingual gland relations.

## 6. Radiology source safety

- Separate copyright/reuse and privacy documentation criteria.
- Project-generated educational CBCT marked production-safe.
- Clinical CBCT with incomplete privacy documentation remains preview-only.
- Open panoramic cases keep visible attribution/license.
- Preferred future CBCT source documented as desidentified CC BY 4.0 dataset.

## 7. Radiographic learning

- Panoramic schematic training.
- Open real panoramic cases.
- CBCT plane orientation.
- Controlled CBCT anatomy training.
- 3D ↔ image correlation.

## 8. Assessment

- Basic level.
- Partial level.
- Final level.
- Randomized bank.
- Direct 3D identification questions.
- Category/topic recording into local progress.
- Adaptive recovery integration.

## 9. Academic alignment

- Mapped against the official UNO Programa Analítico de Anatomía Normal for Odontología.
- Units I–X represented in the V1 curriculum map.
- Official PA bibliography listed in the simulator.
- No textbook pages/illustrations copied into the simulator.

## 10. UX, accessibility and release polish

- First-run help/tutorial.
- Skip-to-content link.
- Keyboard-friendly controls and visible focus.
- Reduced-motion support.
- Favorites and recent structures stored locally.
- Progress and exam history stored locally; no account required.
- Third-party license notices recorded in `THIRD_PARTY_NOTICES.md`.
- Preview remains `noindex` until production approval.

## Manual QA still required before merging to main

- Android phone: rotate/zoom, layers, dentition, exam, scrolling.
- iPhone/iPad Safari: WebGL/context, touch, localStorage, responsive controls.
- Desktop Chrome/Firefox/Edge/Safari: 3D selection, keyboard, focus and exam flows.
- Confirm all external image URLs still resolve and attribution is visible.
- Verify approved/preview source labels against the source-policy registry.
- Review anatomical wording against current cátedra instructions if a newer PA supersedes the published program.
