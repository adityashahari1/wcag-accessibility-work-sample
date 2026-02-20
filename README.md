# WCAG 2.1 AA Accessibility Demonstration Site

A work sample demonstrating practical WCAG 2.1 Level AA accessibility implementation, built for a university accessibility support role. No libraries, no frameworks — semantic HTML, vanilla CSS, and vanilla JavaScript only.

---

## Feature-to-WCAG Mapping

| Feature | WCAG SC | Level | Technique |
|---|---|---|---|
| `lang="en"` on `<html>` | 3.1.1 Language of Page | A | H57 |
| Descriptive `<title>` | 2.4.2 Page Titled | A | H25 |
| Skip link | 2.4.1 Bypass Blocks | A | G1 |
| Landmark regions (`<header>`, `<nav>`, `<main>`, `<footer>`) | 1.3.1 Info and Relationships | A | ARIA11 |
| `<nav aria-label>` (multiple navs distinguished) | 4.1.2 Name, Role, Value | A | ARIA6 |
| Visible focus ring (`:focus-visible`) | 2.4.7 Focus Visible | AA | C15 |
| No `outline: none` without replacement | 2.4.7 Focus Visible | AA | — |
| Colour contrast ≥ 4.5:1 for body text | 1.4.3 Contrast (Minimum) | AA | G18 |
| Underline on links (colour not sole indicator) | 1.4.1 Use of Colour | A | G183 |
| Text sizing in `rem` (respects browser preference) | 1.4.4 Resize text | AA | C28 |
| Horizontal scroll on narrow viewports | 1.4.10 Reflow | AA | — |
| `prefers-reduced-motion` media query | 2.3.3 Animation from Interactions | AAA (best practice at AA) | C39 |
| `<label for>` association on all form controls | 1.3.1, 3.3.2 | A | H44 |
| `aria-required="true"` on required inputs | 4.1.2, 3.3.2 | A | ARIA2 |
| `autocomplete` attributes on personal data fields | 1.3.5 Identify Input Purpose | AA | H98 |
| `aria-invalid="true"` on errored inputs | 4.1.2 Name, Role, Value | A | ARIA21 |
| `aria-live="polite"` error regions | 3.3.1 Error Identification, 4.1.3 Status Messages | A / AA | ARIA19 |
| Error text identifies problem and suggests correction | 3.3.3 Error Suggestion | AA | G85 |
| Focus moved to first invalid field on submit | 3.3.1 Error Identification | A | G139 |
| `<table>` with `<caption>` | 1.3.1 Info and Relationships | A | H39 |
| `scope="col"` on `<th>` | 1.3.1 Info and Relationships | A | H63 |
| `aria-sort` on active column header | 4.1.2 Name, Role, Value | A | ARIA16 |
| Live region for sort announcements | 4.1.3 Status Messages | AA | ARIA22 |
| Meaningful `alt` text on informative images | 1.1.1 Non-text Content | A | H37 |
| `alt=""` on decorative images | 1.1.1 Non-text Content | A | H67 |
| Modal: `role="dialog"`, `aria-modal`, `aria-labelledby` | 4.1.2 Name, Role, Value | A | ARIA6 |
| Modal: focus trap (Tab / Shift+Tab cycle) | 2.1.2 No Keyboard Trap | A | — |
| Modal: Escape key closes dialog | 2.1.1 Keyboard | A | — |
| Modal: focus returns to trigger on close | 2.4.3 Focus Order | A | — |
| `inert` attribute on background content when modal open | 2.1.2 / 4.1.2 | A | — |
| `<fieldset>` + `<legend>` for radio group | 1.3.1 Info and Relationships | A | H71 |
| External link "(opens in new tab)" `.sr-only` text | 2.4.4 Link Purpose | A | G200 |
| `<button>` for all interactive non-link actions | 4.1.2, 2.1.1 | A | — |
| Accessibility Statement | EN 301 549 / best practice | — | — |

---

## Testing Checklist

### Keyboard Navigation
- [ ] Tab through the entire page from top to bottom. Every interactive element (links, buttons, inputs, sort buttons) receives focus.
- [ ] Shift+Tab reverses focus order correctly.
- [ ] Skip link appears as the first tab stop and jumps to `#main-content` when activated (Enter).
- [ ] All buttons and links are operable with Enter. Buttons additionally operable with Space.
- [ ] The modal opens with the Open Modal Demo button (Enter/Space), traps focus within itself, and closes with Escape or the Close button.
- [ ] After closing the modal, focus returns to the trigger button.
- [ ] Table column sort buttons are reachable and operable via keyboard. Sort state changes on activation.
- [ ] The sortable table container scrolls horizontally with keyboard when the table is wider than the viewport.

### Visible Focus
- [ ] Every focused element has a clearly visible focus indicator.
- [ ] The focus indicator has sufficient contrast (recommended ≥ 3:1 against adjacent colours — SC 2.4.11 in WCAG 2.2).
- [ ] No element has `outline: none` without an accessible replacement.

### Screen Reader
- [ ] Page `<title>` is announced on load.
- [ ] All landmark regions are navigable by landmark (e.g., JAWS: `R` key; NVDA: `D` key).
- [ ] Form field labels are announced before each input.
- [ ] Required fields are announced as "required."
- [ ] Submitting the form empty triggers error announcements in each field's live region.
- [ ] The first invalid field receives focus and is read.
- [ ] After sorting the table, the live region announces the new sort order.
- [ ] `aria-sort` on the active column header reflects the current sort direction.
- [ ] The modal title is announced when the dialog opens.
- [ ] Decorative image is skipped (no announcement).
- [ ] Meaningful image alt text is read.

### Colour and Contrast
- [ ] All body text meets 4.5:1 contrast against its background.
- [ ] Large text (≥ 18pt or ≥ 14pt bold) meets 3:1.
- [ ] Links are distinguishable from surrounding text by more than colour (underline is present).
- [ ] Error states use both colour and text, not colour alone.
- [ ] Test with Windows High Contrast mode (and/or forced-colours: active CSS media query).

### Zoom and Reflow
- [ ] Browser text zoom to 200% does not cause content overlap or truncation.
- [ ] Page reflows to single column on 320px viewport width without horizontal scroll (except the table, which scrolls within its container).

### Reduced Motion
- [ ] Enable "Reduce Motion" in OS accessibility settings.
- [ ] Confirm the modal no longer animates in/out (transitions are suppressed).
- [ ] Smooth scroll is replaced with instant scroll.

### Images
- [ ] Meaningful image has a descriptive alt value.
- [ ] Decorative image has `alt=""` and is not announced by a screen reader.

---

## Screen Reader Testing Steps

### NVDA (Windows — free download from nvaccess.org)

1. **Set up:** Download NVDA. Use Firefox or Chrome (NVDA works best with Firefox).
2. **Start:** Press `Ctrl+Alt+N` to launch NVDA.
3. **Open the page:** Navigate to `index.html` in the browser.
4. **Browse mode:** Press `Esc` to switch to Browse mode. NVDA reads the page top to bottom.

| Task | Keys |
|---|---|
| Move to next element | `↓` or `Tab` |
| Navigate by heading | `H` (next heading), `Shift+H` (previous) |
| Navigate by landmark | `D` (next landmark), `Shift+D` (previous) |
| Navigate by form field | `F` |
| Navigate by table | `T`, then `Ctrl+Alt+Arrow` to move between cells |
| Activate link / button | `Enter` (links and buttons), `Space` (buttons) |
| Open Elements List | `NVDA+F7` — shows all headings, links, and landmarks |

5. **Test the form:** Tab into the form, leave fields empty, and submit. Listen for error announcements.
6. **Test the table:** Tab to any column sort button. Press `Enter`. Listen for the live region announcement and confirm `aria-sort` changes.
7. **Test the modal:** Tab to `Open Modal Demo` button, press `Enter`. Confirm dialog title is announced. Tab through modal elements — confirm focus cycles. Press `Escape` — confirm modal closes and focus returns to the button.

### JAWS (Windows — commercial, trial available at freedomscientific.com)

1. **Set up:** Install JAWS. Use Internet Explorer 11 or Chrome.
2. **Start JAWS** before opening the browser.
3. **Open the page.**
4. **Virtual cursor:** JAWS starts in virtual cursor mode.

| Task | Keys |
|---|---|
| Move by heading | `H` / `Shift+H` |
| Move by landmark | `R` / `Shift+R` |
| Move by form field | `F` |
| Move by table | `T`, then `Ctrl+Alt+Arrow` for cells |
| Open Headings List | `Insert+F6` |
| Open Links List | `Insert+F7` |
| Forms mode (interact) | `Enter` on a form field |
| Exit forms mode | `Numpad+` or `Escape` |

5. Follow the same functional tests as NVDA above.
6. Test form validation and modal behaviour identically.

### VoiceOver (macOS/iOS — built-in)

1. **Enable VoiceOver:** `Cmd+F5` on macOS.
2. **Use Safari** for best AT compatibility.
3. **Quick Nav:** Press `Left+Right arrows` simultaneously to enable Quick Nav.
4. Navigate headings with `Ctrl+Opt+Cmd+H`, landmarks with `Ctrl+Opt+Cmd+L`.

---

## Lighthouse Testing Instructions

Lighthouse is Google's open-source automated audit tool. It will not catch everything (automated tools can only detect ~30–40% of WCAG issues), but it is a useful first pass.

### In Chrome DevTools

1. Open Chrome and navigate to `index.html` (or deploy to GitHub Pages first for best results).
2. Open DevTools: `F12` or `Cmd+Opt+I`.
3. Click the **Lighthouse** tab.
4. Under **Categories**, select **Accessibility** (you can deselect others for a focused audit).
5. Under **Device**, select **Desktop** for initial testing.
6. Click **Analyze page load**.
7. Review the report:
   - **Score:** Aim for 90+. 100 is possible for a well-built page.
   - **Passed audits:** Review to understand what was detected.
   - **Failed audits:** Each failure links to documentation. Fix and re-run.
   - **Not applicable:** These are checks skipped because the element type is absent.

> **Important:** A Lighthouse score of 100 does not mean WCAG AA conformance. Manual and screen reader testing is still required. Lighthouse does not test keyboard operability, focus order, or the quality of alt text.

### Via CLI (for CI pipelines)

```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --only-categories=accessibility --output html --output-path ./report.html
open ./report.html
```

### Deploying to GitHub Pages

1. Push your repository to GitHub.
2. In the repository **Settings → Pages**, set the source to `main` branch, root (`/`).
3. Wait ~60 seconds. The page will be live at `https://<username>.github.io/<repo-name>/`.
4. Run Lighthouse against the live URL for the most accurate results.

---

## Reflection: Accessibility Trade-offs and Decisions

### Semantic HTML vs. ARIA

The foundational principle guiding this project was **"semantic HTML first, ARIA only when necessary."** This is directly from the W3C's own guidance: ARIA must not be used to add semantics that HTML already provides natively, because native semantics are more reliably supported across browsers and assistive technologies.

Practically, this meant:
- Using `<button>` instead of `<div role="button" tabindex="0">` — the native element handles keyboard events, focus, and role semantics automatically.
- Using `<label for="">` instead of `aria-label` on inputs — the native label association is more robust and click targets are enlarged for free.
- Using `<fieldset>` + `<legend>` for the radio group instead of `role="group"` + `aria-labelledby` — both work, but the native elements require no JavaScript or ARIA scaffolding.

ARIA was used in three cases where HTML has no native equivalent:
1. `aria-sort` on `<th>` — there is no HTML attribute for table sort state.
2. `aria-live` on error and status regions — HTML has no native mechanism for dynamic announcements.
3. `role="dialog"`, `aria-modal`, and `aria-labelledby` on the modal — the native `<dialog>` element is now well-supported, but we used the ARIA pattern explicitly to demonstrate the technique. In production, the native `<dialog>` element is preferred.

### `inert` vs. `aria-hidden` for Modal Background

When the modal is open, background content must be inaccessible to both keyboard and screen reader users. Two approaches exist:

- **`aria-hidden="true"` on every background sibling:** Hides background from the accessibility tree but does NOT prevent keyboard focus from reaching it if the user tabs quickly. Requires careful DOM management.
- **`inert` attribute on background siblings:** Prevents both keyboard focus and AT access in a single attribute. Modern browser support is excellent (Chrome, Firefox, Safari, Edge as of 2023).

We chose `inert` because it correctly implements the intent of SC 2.1.2 and is less error-prone than applying `aria-hidden` to multiple elements.

### `novalidate` on the Form

Using `novalidate` disables browser-native constraint validation UI. This is a deliberate trade-off: native browser validation is inconsistent across browsers, has limited styling options, and is not always announced correctly by screen readers. Our custom validation provides equivalent functionality with explicit `aria-live` announcements and `aria-invalid` state, giving us full control over the user experience without sacrificing accessibility.

### prefers-reduced-motion

This site uses CSS transitions on the modal (fade + slide) and on buttons (colour transitions). Some users experience vestibular disorders where motion can cause nausea or disorientation. The `@media (prefers-reduced-motion: reduce)` block sets all animation and transition durations to 0.01ms, effectively disabling them while preserving layout. We use `!important` here specifically — it is one of the few legitimate uses, ensuring no component-level transition can override the user's accessibility preference.

### Colour-Only Information

Every piece of information conveyed by colour is also conveyed by text or structure:
- Required field errors: red border + error text below (not just red border).
- Links: underlined in addition to being a different colour.
- Sort direction: the `aria-sort` attribute + live announcement + visual icon (which is `aria-hidden`).

This satisfies SC 1.4.1 and ensures the page is usable by people with colour vision deficiencies.

### What This Demo Does Not Cover

For completeness, the following WCAG AA criteria are not heavily demonstrated here (but would be addressed in a full production site):
- **SC 1.2.x (Captions/Audio Description):** No video or audio content is included.
- **SC 1.4.11 (Non-text Contrast):** UI component boundaries (input borders, focus rings) are targeted but not exhaustively verified against all possible system themes.
- **SC 2.5.x (Pointer Gestures):** Not demonstrated, as the site has no swipe/drag interactions.
