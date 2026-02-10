# Portfolio Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a cinematic single-page scroll portfolio for a senior UX designer, with scroll-driven animations, floating nav, and visual case study storytelling.

**Architecture:** Single HTML page with CSS custom properties for theming, vanilla JS for interactions, and GSAP + ScrollTrigger for scroll-driven animations. All content is static (no CMS). Media assets served from local `/assets` folder.

**Tech Stack:** HTML5, CSS3 (custom properties, no framework), vanilla JavaScript, GSAP 3 + ScrollTrigger (CDN), Google Fonts

**Design Reference:** `docs/plans/2026-02-10-portfolio-website-design.md`

**Aesthetic Guardrail:** Every CSS written must follow these rules:
- No generic fonts (Inter, Roboto, Open Sans, Lato, Arial, system fonts, Space Grotesk)
- No purple gradients on white backgrounds
- No cookie-cutter layouts
- Dominant colors with sharp accents, not evenly distributed palettes
- Backgrounds with depth (layered gradients, grain), never flat solids
- Extreme typography contrast (weight 200 vs 800, size jumps 3x+)
- Cubic-bezier easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- CSS variables for all colors, fonts, and spacing

---

### Task 1: Project Setup

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `css/animations.css`
- Create: `js/main.js`
- Create: `js/animations.js`
- Create: `assets/images/` (directory)
- Create: `assets/videos/` (directory)

**Step 1: Initialize git repo**

```bash
git init
```

**Step 2: Create folder structure**

```bash
mkdir -p css js assets/images assets/videos assets/fonts
```

**Step 3: Create index.html with boilerplate**

Create `index.html` with:
- HTML5 doctype
- Meta viewport for responsive
- Meta description for SEO
- Preconnect to Google Fonts
- Google Fonts link for chosen font pairing (select a distinctive display + body pair — NOT from the banned list. Explore options like Syne + DM Sans, Clash Display + Satoshi, or Bricolage Grotesque + IBM Plex Sans. Pick one pairing and commit to it.)
- CSS file links (`css/style.css`, `css/animations.css`)
- GSAP CDN (gsap core + ScrollTrigger plugin)
- JS file links (`js/main.js`, `js/animations.js`) with defer
- Empty `<body>` with a wrapper div

**Step 4: Create empty CSS and JS files**

Create placeholder files with comments indicating their purpose:
- `css/style.css` — Layout, typography, colors, components
- `css/animations.css` — All keyframes, transitions, scroll-triggered styles
- `js/main.js` — DOM interactions, nav, cursor, loading
- `js/animations.js` — GSAP/ScrollTrigger setup

**Step 5: Verify by opening in browser**

Run: `open index.html`
Expected: Blank page, no console errors, fonts loading in Network tab

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: project scaffolding with HTML, CSS, JS structure"
```

---

### Task 2: Design Tokens & Base CSS

**Files:**
- Modify: `css/style.css`

**Step 1: Define CSS custom properties**

At the top of `style.css`, create `:root` with:

**Colors** (dark cinematic theme, film-inspired):
- `--bg-primary` — Deep dark base (near black with warmth, not pure #000)
- `--bg-secondary` — Slightly lighter dark for sections
- `--text-primary` — Off-white for headings
- `--text-secondary` — Muted for body text
- `--accent` — One bold accent color (warm, cinematic — think amber, copper, or warm gold)
- `--accent-hover` — Slightly lighter/brighter variant
- `--surface` — Card/elevated surface color

**Typography:**
- `--font-display` — The display/heading font family
- `--font-body` — The body font family
- `--font-weight-light` — 200
- `--font-weight-bold` — 800

**Spacing:**
- `--space-xs` through `--space-3xl` — Consistent spacing scale
- `--section-padding` — Vertical padding for full sections
- `--content-width` — Max content width (around 1200px)

**Transitions:**
- `--ease-smooth` — `cubic-bezier(0.4, 0, 0.2, 1)`
- `--ease-bounce` — `cubic-bezier(0.34, 1.56, 0.64, 1)`
- `--duration-fast` — `0.3s`
- `--duration-normal` — `0.6s`

**Step 2: Write CSS reset and base styles**

- Modern CSS reset (box-sizing, margin reset, smooth scroll)
- `html { scroll-behavior: smooth; }`
- `body` — bg-primary, text-secondary, font-body, font-weight 400
- Headings — font-display, text-primary, font-weight-bold
- Selection color using accent
- Scrollbar styling (thin, matching theme)

**Step 3: Add grain/noise texture overlay**

Add a `body::after` pseudo-element with a subtle noise texture using an SVG filter or tiny repeating noise pattern. Low opacity (0.03-0.05). This adds film-like texture to the entire page.

**Step 4: Verify in browser**

Open `index.html`. Expected: Dark background with grain texture, correct font loading, no errors.

**Step 5: Commit**

```bash
git add css/style.css
git commit -m "style: design tokens, CSS reset, and base typography"
```

---

### Task 3: HTML Structure — All Sections

**Files:**
- Modify: `index.html`

**Step 1: Build the full HTML skeleton**

Inside the body wrapper, create these semantic sections in order. Use placeholder text where real content isn't finalized. Include all necessary class names for styling.

```
<!-- Loading screen overlay -->
<div class="loader"> ... </div>

<!-- Custom cursor -->
<div class="cursor"> ... </div>

<!-- Floating nav (right side) -->
<nav class="floating-nav"> ... </nav>

<!-- Main content -->
<main>
  <!-- Section 1: Hero -->
  <section id="hero" class="section hero">
    - Name (h1)
    - Movie-inspired tagline (p)
    - Scroll cue arrow (div)
    - Mesh gradient background (div)
  </section>

  <!-- Section 2: Project Overview -->
  <section id="projects" class="section projects-overview">
    - Section label
    - 2-3 project cards (use placeholder images)
      Each card: image/gif container, title, subtitle, tags
  </section>

  <!-- Section 3: Case Study 1 — Mood-Based Discovery -->
  <section id="case-study-1" class="section case-study">
    <div class="cs-hero"> full-bleed image/video </div>
    <div class="cs-hook"> one-liner </div>
    <div class="cs-setup"> 1-2 sentences </div>
    <div class="cs-problem"> visual + metric </div>
    <div class="cs-research"> 2-3 finding cards </div>
    <div class="cs-aha"> before/after + insight </div>
    <div class="cs-iteration"> version sequence </div>
    <div class="cs-feedback"> pullquotes </div>
    <div class="cs-finals"> large mockups </div>
    <div class="cs-impact"> animated metrics </div>
  </section>

  <!-- Interstitial 1 -->
  <section class="section interstitial">
    - Design principle quote or career metric
  </section>

  <!-- Section 4: Case Study 2 (placeholder) -->
  <section id="case-study-2" class="section case-study">
    - Same structure as Case Study 1
    - Placeholder content
  </section>

  <!-- Section 5: About / Closing -->
  <section id="about" class="section about">
    - Character card (name, location, focus, fun fact)
    - What you're looking for
    - Contact (email link, LinkedIn, "Let's talk" button)
  </section>

  <!-- Footer -->
  <footer class="footer">
    - Final movie quip / easter egg
  </footer>
</main>
```

**Step 2: Add content for Case Study 1**

Using the mood-based discovery case study from the design doc, fill in:
- Hook text: "Ever spent 30 minutes choosing what to watch... then watched nothing?"
- Setup text referencing the streaming app
- Placeholder `<img>` tags pointing to `assets/images/cs1-*.jpg` (we'll add real images later)
- Impact metrics with placeholder numbers
- Use `data-` attributes on elements that need scroll animation (e.g., `data-animate="fade-up"`)

**Step 3: Add floating nav dots**

The nav should have one dot per major section:
- Hero
- Projects
- Case Study 1
- Case Study 2
- About

Each dot: `<a href="#section-id" class="nav-dot" data-label="Section Name"><span></span></a>`

**Step 4: Verify structure in browser**

Expected: All text visible (unstyled), correct section flow, nav dots present, no broken elements.

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: complete HTML structure with all sections and content"
```

---

### Task 4: Hero Section — Styling & Animation

**Files:**
- Modify: `css/style.css`
- Modify: `css/animations.css`

**Step 1: Style the hero section**

- Full viewport height (`100vh`)
- Centered content (flexbox)
- Name: massive font size (clamp for responsive, something like `clamp(3rem, 8vw, 8rem)`), display font, weight 800
- Tagline: lighter weight (200), good size but smaller than name, slight letter-spacing
- Mesh gradient background using layered radial gradients (3-4 layers with accent color at low opacity, positioned at different points)
- Scroll cue at bottom, absolutely positioned

**Step 2: Add hero background animation**

In `css/animations.css`:
- `@keyframes float` for the mesh gradient — slow movement (20s+ duration), infinite, subtle position shifts
- `@keyframes fadeInUp` for staggered text reveal
- `@keyframes bounce` for the scroll cue arrow (gentle up-down)

**Step 3: Add loading screen styles**

- Full screen overlay, z-index above everything
- Background matches `--bg-primary`
- Name text center-positioned
- After animation completes, overlay slides up and away

**Step 4: Implement loading animation in JS**

In `js/main.js`:
- On `DOMContentLoaded`, trigger the name type-out or fade-in
- After 1.5-2 seconds, animate the loader away
- Reveal the hero content with staggered delays

**Step 5: Verify in browser**

Expected: Page loads with brief intro animation, hero text reveals with stagger, mesh gradient gently floats, scroll cue bounces.

**Step 6: Commit**

```bash
git add css/ js/main.js
git commit -m "feat: hero section with loading animation and mesh gradient"
```

---

### Task 5: Floating Nav

**Files:**
- Modify: `css/style.css`
- Modify: `js/main.js`

**Step 1: Style the floating nav**

- Fixed position, right side, vertically centered
- Small circles (8-10px) connected by a thin line
- Default state: muted color, small
- Active state: accent color, slightly larger, glow
- Hover: show label tooltip to the left of the dot
- Hidden by default (opacity 0), appears after scrolling past hero
- High z-index
- Smooth transitions on all state changes

**Step 2: Implement scroll tracking**

In `js/main.js`:
- Use `IntersectionObserver` to detect which section is currently in view
- When a section enters view, update the active dot
- On scroll past hero, fade in the nav
- On scroll back to hero, fade out the nav

**Step 3: Implement click-to-scroll**

- Each dot click smooth-scrolls to its target section
- Use `element.scrollIntoView({ behavior: 'smooth' })` or GSAP scrollTo

**Step 4: Verify in browser**

Expected: Nav hidden on hero, appears on scroll, dots highlight correctly, clicking jumps to sections, labels show on hover.

**Step 5: Commit**

```bash
git add css/style.css js/main.js
git commit -m "feat: floating nav with scroll tracking and smooth scroll"
```

---

### Task 6: Project Overview Section

**Files:**
- Modify: `css/style.css`

**Step 1: Style the overview section**

- Section padding using `--section-padding`
- Small section label/heading
- Project cards in a responsive layout (CSS Grid, 1-2 columns on large screens)
- Each card:
  - Large image/GIF container with aspect ratio
  - Overlay on hover with project name sliding up
  - Tags as small pills
  - Subtle border or surface background
  - Hover: lift (translateY), shadow increase, image slight scale
  - Cursor changes to pointer
- Cards should feel like movie posters — large, visual, minimal text

**Step 2: Verify in browser**

Expected: Cards display with placeholder content, hover effects work, responsive layout.

**Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: project overview cards with hover effects"
```

---

### Task 7: Case Study Layout & Styling

**Files:**
- Modify: `css/style.css`

**Step 1: Style the case study hero (cs-hero)**

- Full-bleed (100vw, break out of content container)
- Image/video fills the space
- Optional dark gradient overlay at bottom for text readability
- Minimum height ~70vh

**Step 2: Style the hook and setup (cs-hook, cs-setup)**

- Hook: large display font, centered, generous padding
- Setup: smaller body text, centered, max-width for readability (~700px)
- Both within content container

**Step 3: Style the problem section (cs-problem)**

- Visual (image/GIF) large and centered
- Metric: oversized number + label, accent color for the number
- Role/timeline metadata: small, muted, off to the side

**Step 4: Style research cards (cs-research)**

- Horizontal scroll container or stacked cards
- Each card: phone mockup image + short annotation overlay
- Subtle card surface background

**Step 5: Style aha moment (cs-aha)**

- Two-column layout: old on left, new on right (stacks on mobile)
- Divider or arrow between them
- Insight text below, centered

**Step 6: Style iteration sequence (cs-iteration)**

- Horizontal scroll or side-by-side
- Version labels (V1, V2, Final) as step indicators
- One-liner below each
- Connected by a progress line or arrow

**Step 7: Style feedback pullquotes (cs-feedback)**

- Large quotation marks (decorative, accent color, oversized)
- Quote text in display font, italic or light weight
- Attribution small below

**Step 8: Style final designs (cs-finals)**

- Large device mockups, centered
- Multiple images in a staggered or grid layout
- Generous whitespace around them

**Step 9: Style impact metrics (cs-impact)**

- Each metric gets its own row or large block
- Number: massive font size, accent color
- Label: smaller, below or beside the number
- `data-target` attribute on each number for the counter animation

**Step 10: Verify in browser**

Expected: Full case study flows top to bottom with correct layout, all sub-sections styled, placeholder content in place.

**Step 11: Commit**

```bash
git add css/style.css
git commit -m "feat: case study section layouts and styling"
```

---

### Task 8: Interstitial & About Sections

**Files:**
- Modify: `css/style.css`

**Step 1: Style interstitial section**

- Full viewport height, centered content
- Large quote in display font
- Different background treatment (subtle gradient shift or accent wash at low opacity)
- Feels like a breath between chapters

**Step 2: Style about section**

- Two-area layout: character card on one side, contact on other (stacks on mobile)
- Character card: clean lines, name prominent, details as a list
- Photo: if included, circular or rounded square, subtle border
- "Let's talk" button: large, accent color, layered hover effects (ripple + lift + shadow shift)
- Social links: minimal icons or text links

**Step 3: Style footer**

- Minimal, small text
- Movie quip centered
- Subtle separator from about section

**Step 4: Verify in browser**

Expected: Interstitials feel distinct from case studies, about section is clean and inviting, CTA button has satisfying hover.

**Step 5: Commit**

```bash
git add css/style.css
git commit -m "feat: interstitial sections and about/contact styling"
```

---

### Task 9: GSAP Scroll Animations

**Files:**
- Modify: `js/animations.js`

**Step 1: Initialize GSAP and ScrollTrigger**

```javascript
gsap.registerPlugin(ScrollTrigger);
```

**Step 2: Fade-up animations for all `[data-animate="fade-up"]` elements**

- Use `ScrollTrigger.batch()` or individual triggers
- Elements start: `opacity: 0, y: 40`
- Animate to: `opacity: 1, y: 0`
- Duration: 0.8s, ease: `power2.out`
- Trigger: when element enters viewport (top 80%)

**Step 3: Parallax on case study hero images**

- Images move slower than scroll speed
- `gsap.to('.cs-hero img', { y: '20%', scrollTrigger: { scrub: true } })`

**Step 4: Number counter animation**

- Select all elements with `data-target` attribute
- When they scroll into view, animate from 0 to `data-target` value
- Use GSAP `snap` for whole numbers
- Duration: 2s, ease: `power1.out`

**Step 5: Staggered reveals for research cards and iteration steps**

- Cards animate in with stagger delay (0.15s between each)
- Slight scale + fade + translateY

**Step 6: Aha moment transition**

- Old design fades out / slides left
- New design fades in / slides right
- Triggered by scroll position

**Step 7: Section background transitions**

- Subtle background color or gradient shifts as you scroll between sections
- Uses `scrub` for smooth, scroll-linked transition

**Step 8: Verify all animations in browser**

Scroll through entire page. Expected: smooth, intentional animations at each section. No janky triggers, no elements popping in too late or too early.

**Step 9: Commit**

```bash
git add js/animations.js
git commit -m "feat: GSAP scroll animations, parallax, and counters"
```

---

### Task 10: Custom Cursor

**Files:**
- Modify: `css/style.css`
- Modify: `js/main.js`

**Step 1: Hide default cursor**

```css
* { cursor: none; }
```

**Step 2: Style custom cursor elements**

- Inner dot: small (8px), accent color, solid circle
- Outer ring: larger (36px), border only (1px accent), follows with slight delay
- Both fixed position, pointer-events none, high z-index

**Step 3: Implement cursor tracking**

In `js/main.js`:
- On `mousemove`, update inner dot position immediately
- Outer ring follows with GSAP lerp or CSS transition (slight lag for smooth feel)
- On hover over interactive elements (links, buttons, cards): outer ring scales up, inner dot shrinks
- On click: brief scale pulse

**Step 4: Disable custom cursor on touch devices**

Check for touch support. If touch, don't create cursor elements.

**Step 5: Verify in browser**

Expected: Smooth cursor with trailing ring, hover states on interactive elements, no cursor on mobile.

**Step 6: Commit**

```bash
git add css/style.css js/main.js
git commit -m "feat: custom cursor with hover states"
```

---

### Task 11: Responsive Design

**Files:**
- Modify: `css/style.css`

**Step 1: Add responsive breakpoints**

Use mobile-first or desktop-first (match what was written). Key breakpoints:
- `768px` — tablet
- `480px` — mobile

**Step 2: Responsive adjustments**

- Hero: reduce font sizes, adjust spacing
- Project cards: single column on mobile
- Case study: full-width images, stack two-column layouts
- Research cards: vertical scroll instead of horizontal on mobile
- Floating nav: hide on mobile (or move to bottom as horizontal dots)
- Custom cursor: disabled on touch
- Interstitials: reduce quote size
- About: stack layout

**Step 3: Test at multiple widths**

Check: 1440px (desktop), 1024px (tablet landscape), 768px (tablet), 375px (mobile)

**Step 4: Commit**

```bash
git add css/style.css
git commit -m "feat: responsive design for all breakpoints"
```

---

### Task 12: Media Integration & Optimization

**Files:**
- Modify: `index.html`
- Modify: `js/main.js`

**Note:** This task requires the user to provide actual image/GIF/video assets. Use placeholders if assets aren't available yet.

**Step 1: Set up lazy loading**

- Add `loading="lazy"` to all images below the fold
- Videos: `preload="none"` with IntersectionObserver to play when in view

**Step 2: Add responsive images**

- Use `<picture>` elements with `srcset` for different screen sizes
- WebP format with JPEG fallback where possible

**Step 3: Optimize video autoplay**

- `autoplay muted loop playsinline` attributes
- Pause videos when out of viewport (IntersectionObserver)
- Play when they scroll back in

**Step 4: Add placeholder/skeleton states**

- While images load, show a subtle placeholder (blurred low-res version or accent-colored skeleton)

**Step 5: Verify**

Check Network tab for load performance. No huge assets blocking initial render.

**Step 6: Commit**

```bash
git add index.html js/main.js
git commit -m "feat: lazy loading, responsive images, video optimization"
```

---

### Task 13: Polish & Final Details

**Files:**
- Modify: `css/style.css`
- Modify: `css/animations.css`
- Modify: `js/main.js`
- Modify: `index.html`

**Step 1: Smooth scroll behavior polish**

- Ensure no janky scroll anywhere
- Test scroll snapping if appropriate
- Ensure GSAP ScrollTrigger doesn't conflict with native smooth scroll

**Step 2: Focus states for accessibility**

- Visible focus outlines on all interactive elements (using accent color)
- Skip-to-content link (hidden, visible on focus)
- Proper heading hierarchy
- Alt text on all images
- `aria-label` on nav dots

**Step 3: Meta tags and OG image**

- Open Graph tags for social sharing (title, description, image)
- Favicon
- `<title>` tag

**Step 4: Performance check**

- Minimize any render-blocking resources
- Ensure GSAP is loaded efficiently
- Check Lighthouse score, aim for 90+ performance

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: accessibility, meta tags, and performance polish"
```

---

### Task 14: Deploy

**Files:**
- Create: `netlify.toml` (if using Netlify)

**Step 1: Create deployment config**

For Netlify:
```toml
[build]
  publish = "."

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

**Step 2: Deploy**

Option A — Netlify CLI:
```bash
npx netlify-cli deploy --prod
```

Option B — Drag and drop the project folder to Netlify dashboard.

Option C — Connect GitHub repo for auto-deploy.

**Step 3: Verify live site**

- Check all sections load
- Test on mobile device
- Check animations perform well
- Verify fonts load from Google Fonts CDN

**Step 4: Commit deployment config**

```bash
git add netlify.toml
git commit -m "chore: add deployment config"
```

---

## Task Dependency Map

```
Task 1 (Setup)
  └─> Task 2 (Design Tokens)
       └─> Task 3 (HTML Structure)
            ├─> Task 4 (Hero) ─────────────┐
            ├─> Task 5 (Floating Nav)       │
            ├─> Task 6 (Project Overview)   │
            ├─> Task 7 (Case Study Layout)  ├─> Task 9 (GSAP Animations)
            └─> Task 8 (Interstitial/About) ┘        │
                                                      ├─> Task 10 (Cursor)
                                                      ├─> Task 11 (Responsive)
                                                      └─> Task 12 (Media)
                                                               │
                                                               └─> Task 13 (Polish)
                                                                        │
                                                                        └─> Task 14 (Deploy)
```

Tasks 4-8 can be done in any order after Task 3.
Tasks 10-12 can be done in any order after Task 9.
