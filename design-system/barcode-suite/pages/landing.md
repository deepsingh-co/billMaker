# Landing Page Overrides

> **PROJECT:** Barcode Suite
> **Generated:** 2026-11-21
> **Page Type:** Marketing landing page

> **IMPORTANT:** Rules in this file **override** the Master file
> (`design-system/barcode-suite/MASTER.md`) for the landing page only. The
> dashboard, POS and transactions views continue to use the Master system.

---

## Page-Specific Rules

### Pattern

- **Name:** Scroll-Triggered Storytelling
- **Narrative:** Hero -> capabilities -> workflow -> product preview -> CTA
- **Conversion focus:** One primary action ("Open dashboard") repeated in the
  nav, hero, preview and closing band.

### Layout Overrides

- **Max Width:** 1200px (standard), centered content with full-width sections
- **Sections:**
  1. Hero with interactive WebGL barcode scene
  2. Capability grid
  3. Workflow (scan -> bill -> grow)
  4. Interactive dashboard preview
  5. Closing CTA band
  6. Footer

### Spacing Overrides

- Use the Master spacing scale, with generous vertical rhythm on marketing
  sections (96px desktop / 64px mobile).

### Typography Overrides

- **Display font:** Plus Jakarta Sans (landing headings only)
- **Body font:** Fira Sans (kept from the dashboard for brand continuity)
- **Code/labels:** Fira Code
- Marketing headings use tight tracking and a 1.05 line height.

### Color Overrides

- **Canvas:** Deep navy `#050b18` / brand-950 with sky-blue glow
- **Primary:** `#0EA5E9` (sky blue)
- **Secondary:** `#38BDF8` (light sky)
- **CTA:** `#F97316` (warm orange)
- **Text on dark:** `#F0F9FF`
- **Muted text on dark:** slate-300/slate-400

The landing page blends the marketing palette (`#0EA5E9`, `#38BDF8`,
`#F97316`) with the product's navy identity so it still feels like Barcode
Suite.

### Component Overrides

- Avoid unoptimized full-size images: the hero uses live WebGL instead of a
  screenshot.
- Avoid motion that ignores `prefers-reduced-motion`: provide a static hero
  fallback and disable tilt/reveal animation.

---

## Page-Specific Components

- `LandingNav` - fixed translucent navigation with mobile menu
- `Hero3D` / `HeroScene` - on-demand React Three Fiber scene with a floating
  invoice (procedural canvas texture), scanning beam, particle field and
  pointer parallax
- `FeatureGrid` - six capability cards
- `Workflow` - three-step scan -> invoice -> analytics narrative
- `DashboardPreview` - CSS 3D tilt preview of the real sales dashboard
- `CtaBand` / `LandingFooter` - closing actions and site footer

---

## Recommendations

- Effects: scroll-triggered reveals, gentle float, scanning beam, pointer
  parallax; disable all of them when reduced motion is requested.
- Performance: lazy-load the 3D bundle, cap device pixel ratio and skip WebGL
  entirely for reduced-motion, Save-Data and software-renderer visitors.
- Navigation: highlight the active section and keep a persistent primary CTA.
- CTA placement: nav, hero, dashboard preview and closing band.
