# Email Template Generator: Design and Implementation Plan

Status: draft for review. Nothing in this document is implemented yet.

## 1. Goal

Add a second generator to VetNote so the veterinarian can switch between the
existing chart (SOAP) template generator and a new client-facing email template
generator via top level tabs.

Confirmed requirements:

| Topic | Decision |
|---|---|
| Audience | Clients (pet owners), not colleagues |
| Templates | Several topic templates (CKD, FLUTD, and others) plus a Generic one |
| Inputs | Fully independent of the chart generator inputs |
| Output | Plain text, for pasting into an email client |
| Placeholders | Literal `***` markers, matching the chart templates. No name fields collected |
| Navigation | Top level tabs |

Non goals for this change: no backend, no persistence of patient data, no
authentication, no routing library, no email sending. The app stays a static
front end published to `gh-pages`.

## 2. Why the current code cannot simply be reused

The chart pipeline is well factored but it is HTML-native and SOAP-shaped from
end to end:

```
TemplateContext  (chart-specific fields: animal, visitType, abnormalities, murmurGrade...)
  -> buildObjectiveSection / Diagnostics / Assessment / Plan   (SOAP-specific)
    -> buildGeneric*(context, systemName, config)              (body-system-specific)
  -> renderTemplate(data)                                      (emits <div>/<ul>/<li>, hardcodes
                                                                OBJECTIVE/DIAGNOSTICS/ASSESSMENT/PLAN
                                                                headers and the KSW footer)
  -> dangerouslySetInnerHTML into a contentEditable div
  -> copyToClipboard()  (clones node, strips contentEditable, execCommand('copy'))
```

What is genuinely reusable:

- The overall shape: config objects hold text, builders assemble structured data,
  a renderer turns structured data into output, a component owns state.
- The path-based nested selection idea (`Eyes>Fluorescein Stain>Corneal Ulcer`)
  and its automatic-cleanup-on-uncheck behavior in `toggleSubOption`.
- Clipboard handling, once generalized to plain text.

What must not be reused as-is:

- `TemplateContext`, `TemplateData` and all four section builders. Every field is
  chart-specific. Forcing email content through them would mean union types
  everywhere and a context object where half the fields are meaningless.
- `templateRenderers.ts`. It emits HTML. Plain text needs its own renderer.

The correct seam is one level above `generateTemplate`: a mode abstraction where
chart and email are sibling implementations sharing a shell, not a shared
context.

## 3. Proposed architecture

### 3.1 Mode registry

```
src/modes/
  types.ts            TemplateMode interface
  registry.ts         MODES: TemplateMode[]  (chart, email)
```

```typescript
export interface TemplateMode {
  id: 'chart' | 'email';
  label: string;              // tab text
  Panel: React.ComponentType; // owns its own inputs, preview and copy button
}
```

Adding a third mode later (for example a discharge instruction generator) means
appending one registry entry. `App.tsx` renders the tab bar from the registry and
mounts panels. The chart mode's `Panel` is today's `TemplateGenerator` moved
under `src/modes/chart/`, unchanged in behavior.

Both panels stay mounted, with the inactive one hidden via CSS rather than
unmounted, so a half-filled email survives a trip to the chart tab. This is
cheaper and less error prone than lifting all state into `App`.

### 3.2 Email content model

The email domain is not SOAP-shaped, so it gets its own model. An email template
is an ordered list of blocks, each block optionally gated by a selected option.

```typescript
// src/modes/email/types.ts

export type EmailBlock =
  // Prose. Separated from neighbours by a blank line.
  | { kind: 'paragraph'; text: string }
  // A tight run of literal lines, no bullets, no blank lines between them.
  // Attaches directly under the preceding paragraph. Used for the diet
  // transition schedule.
  | { kind: 'lines'; items: string[] }
  // A bare URL with an optional trailing label on the same line. Email clients
  // auto-linkify plain URLs, so no markup is needed. Consecutive links are
  // separated by blank lines.
  | { kind: 'link'; urlId: string; label?: string }
  | { kind: 'bullets'; items: string[] };

export interface EmailOption {
  id: string;                 // stable key used in state
  label: string;              // checkbox text in the UI
  blocks: EmailBlock[];       // appended when selected
  children?: EmailOption[];   // nested, same path semantics as chart subOptions
}

export interface EmailInput {
  id: string;
  label: string;
  kind: 'text' | 'number' | 'select';
  choices?: string[];         // for kind: 'select'
  default?: string | number;
  placeholder?: string;
}

export interface EmailTemplate {
  id: string;                 // 'flutd' | 'kidney' | 'generic' | ...
  label: string;              // dropdown text
  subject?: string;           // rendered as a copyable subject line
  inputs?: EmailInput[];      // declarative free-text/select fields
  intro: EmailBlock[];        // greeting and opening
  options?: EmailOption[];    // selectable content
  outro?: EmailBlock[];       // closing, overridable per template
}
```

Three deliberate choices here:

**Placeholders stay literal `***`.** The CKD sample uses `***`, matching what
`sectionTexts.ts` already does in the chart templates ("recommend at \*\*\*",
"Dental estimate sent with owner lvl \*\*\*"). Keeping one marker across both
generators means no new habit to learn, and it sidesteps the angle-bracket
problem described in section 6 entirely. Blocks carry `***` inline as ordinary
text and the renderer does nothing special with them.

**Free-text inputs are typed but not built.** `EmailInput` stays in the type
definitions as the intended extension point, unimplemented until there is a
concrete request. The CKD sample has two placeholders on one line ("recheck \*\*\*
kidney values in \*\*\* months") and both are fine as literal markers she
overwrites in her email client. Building an input UI for them now would add a
state layer, an interpolation pass and a set of tests to save two keystrokes.
When a value needs to appear in more than one place in an email, or needs
formatting, that is the signal to implement it.

The reason to keep the type is the chart generator's murmur handling, which is
special-cased in three separate files (`systemTexts.ts` carries
`requiresGrade`/`requiresSide` flags, `AbnormalitiesSelector.tsx` renders the two
extra selectors inline, `TemplateGenerator.tsx` holds the state). Declaring the
extension point up front is what prevents the second generator from growing the
same shape by accident.

**URLs live in one registry.** `EmailBlock` references links by `urlId`, not by
literal URL, resolved against `src/modes/email/config/links.ts`. The CKD sample
alone carries four external URLs, two of them Chewy product pages whose IDs
change when a product is relisted. A dead link should be fixed in one place even
if it appears in several templates.

**Shared snippet library.** Several templates will almost certainly end with the
same closing ("please call the clinic with any questions", sign-off) and share
common paragraphs about follow-up or medication compliance. Those live in
`src/modes/email/config/snippets.ts` and are referenced by templates, so editing
the sign-off once updates every email.

```
src/modes/email/config/
  links.ts           external URLs by id, so a dead link is fixed once
  snippets.ts        shared reusable blocks (greeting, diet transition, closing)
  templates/
    ckd.ts
    flutd.ts
    generic.ts
    index.ts         EMAIL_TEMPLATES: EmailTemplate[]
```

Adding a new email topic means adding one file and one line in `index.ts`. No UI
or renderer changes. That is the flexibility requirement.

### 3.3 Plain text renderer

```
src/modes/email/render.ts
  renderEmail(template, state): { subject: string; body: string }
```

The email pipeline is string-native. It never produces HTML, which matters
because of `<TODO>`: any string containing angle brackets that reaches the DOM
via `innerHTML` will be parsed as a tag and silently vanish. Keeping the email
output as a plain string and displaying it in a `<textarea>` (not a
`contentEditable` div fed by `dangerouslySetInnerHTML`) avoids the entire class
of problem, and gives the vet a normally editable preview for free.

Spacing rules, derived from the CKD sample and centralized so they can change
without touching any template:

- A blank line separates every block from the next.
- Exception: a `lines` block attaches directly to the paragraph above it with no
  blank line, since the sample runs "see below:" straight into "Days 1&2".
- Consecutive `link` blocks are separated by blank lines, one URL per line, with
  the label trailing after a single space.
- Trailing whitespace is stripped from every line. The sample has stray trailing
  spaces from manual editing, and they should not be reproduced.
- Output ends with a single newline, no trailing blank lines.
- No hard wrapping by default. Email clients reflow plain text, and hard wraps
  look wrong when the reader's window is narrow.

### 3.4 Clipboard

Plain text copy uses `navigator.clipboard.writeText`, with the existing
`document.execCommand('copy')` path kept as a fallback for older browsers. Both
localhost and the deployed GitHub Pages URL are secure contexts, so the clipboard
API is available in development and production. The `HTTPS=true npm start` note
in the README relates to the older API and is not needed for this path.

Extracted to `src/hooks/useCopyToClipboard.ts` so both modes share the
"copied" confirmation state. The chart mode keeps its HTML copy path (stripping
`contentEditable`, forcing Arial 10pt) since that behavior is tuned for pasting
into charting software.

## 4. Refactors to do first

These are prerequisites, each independently verifiable and committable.

**R1. Fix the section builder wiring.** `ObjectiveSection` and `PlanSection`
iterate all 12 body systems, but `AssessmentSection` imports only 4
(Oral-Nasal-Throat, Ears, Eyes, Cardiovascular) and `DiagnosticsSection` only 3
(Ears, Eyes, Integument). The remaining systems have no `assessment` or
`diagnostics` in config today, so nothing is currently broken, but the moment
`respiratoryConfig` gains an `assessment` field it will silently never appear in
the output. This directly contradicts the "automatic discovery" promise in
`README.md` and `CONFIGURATION_GUIDE.md`.

Fix by iterating `allSystemConfigsList` and calling the generic builders, which
deletes roughly 40 hand-written imports across the four section files and makes
auto-discovery real. Snapshot tests protect this refactor: output must be byte
identical.

**R2. Move chart code under `src/modes/chart/`** and introduce the mode registry
plus tab shell in `App.tsx`. Behavior unchanged.

**R3. Extract `useCopyToClipboard`** from `TemplateGenerator`, preserving the
HTML-specific stripping logic as an option.

R1 is worth doing regardless of the email feature. R2 and R3 exist only to serve
it.

## 5. Testing plan

The existing suite is 22 tests: 5 snapshots of golden-path chart output plus
behavioral assertions per feature. Same approach for email.

- Snapshot the fully rendered body of each email template with no options
  selected, and with all options selected. Catches accidental copy changes.
- Per template, one behavioral test per option: selecting it adds its text,
  deselecting removes it.
- Nested option cleanup: selecting a child then deselecting the parent must clear
  the child, matching chart behavior.
- Input interpolation: setting an input value replaces its token, and an unset
  input leaves a visible `<TODO>` rather than an empty string or the literal
  token.
- Renderer unit tests on `renderEmail` directly, independent of React, for bullet
  formatting, blank line handling and nesting depth.
- Tab switching preserves each panel's state.
- Regression guard: the chart snapshots must not change at any point during R1
  through R3.

## 6. Pitfalls and gaps

Ordered by how much trouble they cause if ignored.

1. **Angle brackets and HTML.** Settled by two decisions rather than one: the
   email pipeline is string-native and previews in a `<textarea>`, and the
   placeholder marker is `***` rather than `<TODO>`. Either alone would be
   enough. Both together mean there is no code path where a placeholder can be
   parsed as a tag and silently disappear. If a future change reintroduces
   `<TODO>`, it must not reach `innerHTML`, and a renderer test should assert the
   markers survive.

2. **Editable preview losing edits. Fixed in `b43adcd`.** The chart preview was
   both `contentEditable` and fed by `dangerouslySetInnerHTML`, so hand-written
   additions were discarded by the next selection change. The generated HTML is
   now written imperatively from an effect, the write is skipped once the user
   types, and a notice offers to discard edits and regenerate. The email panel
   must adopt the same rule: while the user has edited the buffer, stop
   regenerating and say so, rather than overwriting silently.

3. **Test helper fragility.** The existing tests locate controls with
   `screen.getAllByRole('button', { name: 'Dog' })[0]` and
   `container.querySelector('[contenteditable="true"]')`. Adding a tab bar adds
   buttons and a second preview surface to the DOM. Tab labels must not collide
   with existing button labels, and both panels need stable `data-testid`
   attributes. Scoping the chart tests with `within(chartPanel)` before adding
   the email panel is the safe order of operations.

4. **Config naming collision.** `src/config/systemTexts.ts` and `sectionTexts.ts`
   become ambiguous once email content exists. R2 moves them to
   `src/modes/chart/config/`, keeping each mode's content self-contained.

5. **Weak typing in the chart builders.** `buildGeneric*` takes `config: any` and
   casts throughout, so a typo in `systemTexts.ts` fails silently at runtime
   rather than at compile time. The email config is typed strictly from the start
   so a malformed template is a build error. I am not proposing to retrofit the
   chart configs in this change, but it is the reason the email side does not
   copy that pattern.

6. **No routing or persistence.** The active tab resets on refresh and cannot be
   linked to. If that matters, `localStorage` for the last active tab is a few
   lines and needs no dependency. Deep links would need a router, which I would
   avoid for now.

7. **Snapshot churn as content evolves.** Email copy will change often in early
   use. Snapshots will need `-u` frequently, which trains people to update
   without reading diffs. Mitigation: keep snapshots to the two extremes per
   template (nothing selected, everything selected) and rely on targeted
   behavioral assertions for individual options.

8. **Deploy is manual and gated.** `gh-pages` currently matches `main` exactly. I
   will not run `npm run deploy` or `git push` until you say so. When ready the
   sequence is `git push origin main` then `npm run deploy`.

Answered by the CKD sample: placeholder marker is `***`, no greeting name, no
signature block (her email client supplies it), the closing is a single line
("Please let me know if you have any questions."), prose and tight literal lines
rather than bullets, and blank lines between everything.

Settled since:

- **No species handling.** The left-hand panel is a flat template picker (CKD,
  FLUTD, and so on) and the stakeholder chooses the right one. No animal toggle,
  no species variants inside a template. This removes a whole axis from the model.
- **All hyperlinks always render.** No wet-versus-dry choice, no optional link
  blocks. Re-pasting links is the most painful part of writing these emails by
  hand, so they are the one thing that must never require a click to appear.
- **Exactly one optional block in CKD**, the recheck line containing
  "\*\*\* kidney values in \*\*\* months". Everything else is unconditional. The
  option machinery therefore ships with a single real use, which is enough to
  prove the mechanism without inventing toggles she did not ask for.

Still open, and only for later templates:

- The actual copy for FLUTD and Generic.
- Whether the diet transition schedule is identical in FLUTD, so it can be a
  shared snippet rather than duplicated.
- Whether she wants a generated subject line. The sample has none, so `subject`
  stays optional in the type and unused.

## 7. Phasing

| Phase | Content | Verification |
|---|---|---|
| 0 | Done: dead file removal, snapshot refresh, lint fix | 22 tests pass, clean build |
| 0b | Done: preserve manual edits to the preview (`b43adcd`) | 29 tests pass, 5 snapshots unchanged |
| 1 | R1 section builder auto-discovery | Chart snapshots byte identical |
| 2 | R2 mode registry, tabs, chart moved under `modes/chart` | Chart snapshots identical, tab switch test |
| 3 | R3 `useCopyToClipboard` extraction | Existing copy test passes |
| 4 | Email framework: types, renderer, `links.ts`, `snippets.ts`, CKD template | Renderer unit tests, CKD snapshot |
| 5 | FLUTD and Generic templates from your samples | Snapshot plus behavioral tests each |
| 6 | Review with the stakeholder, then push and deploy on your go-ahead | Manual check on the live site |

Phase 4 is no longer blocked now that the CKD sample is in hand. It is the better
first template to build precisely because it exercises every block kind: prose,
labelled links, a tight literal run, and inline `***` markers. Phase 5 waits on
the FLUTD copy.

## 8. Worked example: CKD decomposition

How the sample maps onto the model, to validate it before any code is written.

| Sample text | Block | Source |
|---|---|---|
| `Hello,` | paragraph | `snippets.greeting`, shared |
| `Thank you for your patience for this email!` | paragraph | option, if delayed |
| `As discussed over the phone, ...see the links below.` | paragraph | `ckd.intro` |
| Chewy dry food URL + `Dry food` | link | `links.chewyKdDry` |
| Chewy wet food URL + `Wet food` | link | `links.chewyKdWet` |
| `I recommend slowly transitioning...see below:` | paragraph | `snippets.dietTransition` |
| `Days 1&2 ...` through `Days 7+ ...` | lines | `snippets.dietTransition` |
| `Below are links to more information...` | paragraph | `ckd` |
| VIN and Cornell URLs | link, link | `links.vinCkd`, `links.cornellCkd` |
| `I recommend rechecking *** kidney values in *** months.` | paragraph | `ckd` |
| `Please let me know if you have any questions.` | paragraph | `snippets.closing`, shared |

Three of the eleven blocks are shared snippets and four are registry links, which
means a new diet-change email of this shape is mostly assembly rather than
authoring.
