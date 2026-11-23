# Auth Pages — Login & Signup

**Routes:** `#/login`, `#/signup`

## Layout

- Split screen from `lg` up: dark brand panel on the left, form column on the
  right. The panel collapses below `lg` and leaves a compact mobile brand header.
- Form column is capped at `max-w-md`, vertically centered, with the back link
  and theme toggle in a slim header.
- Desktop brand panel uses the deep navy `brand-950` surface, the shared
  `landing-grid` texture, soft blue/orange glows and the three product
  highlights. Its logo returns to the marketing site.

## Components

- **Form card:** white / `slate-900` surface, `rounded-2xl`, 1px border and
  `shadow-card`. Padding `24px` on mobile, `32px` from `sm`.
- **Inputs:** `rounded-xl`, `py-3`, leading Lucide icon, 1px border, brand focus
  ring. Error state switches to rose border and inline message with alert icon.
- **Password field:** trailing eye toggle with `aria-label` that flips between
  "Show password" and "Hide password".
- **Password checklist:** three inline requirements (length, letter, number)
  with check/cross icons and screen-reader text. Visible once typing starts.
- **Primary submit:** full-width `rounded-xl`, `brand-800` (dark: `brand-600`),
  spinner + present-participle label while submitting.
- **Remember me:** native checkbox with `accent-brand-600`, labelled with the
  30-day session duration.

## States

- Field-level validation on submit, cleared as the user edits.
- Server errors appear in a rose alert above the fields (`role="alert"`).
- Submit is disabled while a request is in flight.
- Signup success signs the user in and opens the requested workspace route.

## Accessibility

- Visible labels and `aria-describedby` for hints/errors.
- `aria-invalid` on invalid fields.
- No placeholder-only labels.
- Focus returns to the account button when the workspace menu closes with
  `Escape`.
- Contrast and focus rings follow the master design system; reduced motion is
  respected globally.
