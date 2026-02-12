# Arun Peri — Portfolio V3

## Quick Context for AI Assistants

This is a **UX designer portfolio website** for Arun Peri. It's vanilla HTML/CSS/JS — no React, no build tools, no Tailwind, no frameworks. The site uses GSAP 3.12.5 + ScrollTrigger for animations, loaded via CDN. The design follows a warm, editorial aesthetic with dark/light theme support.

**Live deployment:** Netlify (configured via `netlify.toml`)
**Repo:** https://github.com/kirito-sketch/Portfolio-V1.git

---

## File Structure

```
.
├── index.html              # Homepage — hero, intro, work gallery, about, footer
├── cs1.html                # Case study page — "Reimagining Search"
├── css/
│   ├── style.css           # All design tokens, layout, components (~1475 lines)
│   ├── animations.css      # Keyframes + GSAP scroll animation overrides
│   └── case-study.css      # Case study page styles (~1064 lines)
├── js/
│   ├── main.js             # DOM interactions, nav, cursor, theme toggle, video
│   ├── animations.js       # GSAP/ScrollTrigger scroll animations
│   └── pong-hero.js        # Canvas Pong breakout game for hero section
├── assets/
│   └── images/             # Case study phone screenshots (PNG, ~400-950KB each)
│       ├── before-landing.png
│       ├── before-input.png
│       ├── before-results.png
│       ├── iteration-v1.png
│       ├── final-mood-chips.png
│       ├── final-confidence-card.png
│       └── final-episodic.png
├── netlify.toml            # Netlify deployment config with cache headers
├── .gitignore              # Ignores .DS_Store, node_modules, editor files
└── PROJECT.md              # This file
```

---

## Design System

### Colors
- **Light theme:** Warm cream bg `#FAF7F2`, near-black text `#1C1917`
- **Dark theme:** Near-black bg `#0a0a0a`, light text `#F5F5F5`
- **Accent (both themes):** Copper `#c9834e`
- All colors use CSS custom properties defined in `:root` and `[data-theme="dark"]`

### Typography
- **Display font:** `Instrument Serif` (serif, italic for emphasis)
- **Body font:** `Inter` (sans-serif, variable weight)
- Both loaded from Google Fonts

### Spacing
Custom properties: `--space-xs` (0.5rem) through `--space-3xl` (12rem). Section padding uses `clamp()` for fluid responsive scaling.

### Theme System
- `data-theme` attribute on `<html>` element (`"dark"` or `"light"`)
- Persisted via `localStorage.getItem('theme')`
- Theme applied immediately in a blocking `<script>` before DOMContentLoaded to prevent flash
- Theme toggle button exists on both pages

---

## Pages

### Homepage (`index.html`)

**Sections in order:**
1. **Loading screen** — "Arun Peri" text with pulse animation, slides up after 1.8s
2. **Hero** — Full viewport `<canvas>` Pong breakout game. Ball bounces around pixel text "ARUN PERI / SR DESIGNER". 4 AI paddles track the ball. Theme-aware colors. Scroll cue at bottom.
3. **Intro** — Centered positioning statement in Instrument Serif
4. **Work Showcase** — "Selected Work" heading + 3 work cards:
   - Card 1: "Reimagining Search" → links to `cs1.html` (has image + hover button)
   - Card 2 & 3: "Coming Soon" placeholders with "In Progress" badges
   - Gallery has a focus effect: hovering one card dims/blurs siblings
5. **About** — Label + headline + two-column grid (bio text | structured details)
6. **Footer** — Rounded rectangle with animated retro perspective grid background, "Let's work together" CTA, email link with hover button, LinkedIn + Resume pill links, credit line

**Navigation:** Floating pill nav (glass morphism) — logo, Work, About links + theme toggle. Auto-hides on scroll down, reappears on scroll up. Compacts after 100px scroll.

**Custom cursor:** Desktop only (hidden on touch devices). Dot follows mouse instantly, ring follows with lerp easing. Expands on interactive element hover.

### Case Study (`cs1.html`)

**"Reimagining Search"** — Reducing decision fatigue on a streaming platform through mood-based discovery.

**Sections in order:**
1. **Hero** — Full viewport with ContainerScroll 3D effect:
   - Title + subtitle reveal with staggered delay
   - Phone image starts at `rotateX(20deg) scale(0.92)` with perspective
   - On scroll: phone flattens to `rotateX(0) scale(1)` (GSAP scrub)
   - Title floats up and fades out on scroll
   - Phone fades in after 0.7s delay
2. **The Hook** — "Ever spent 30 minutes choosing what to watch... then watched nothing?"
3. **Context** — Problem statement + project details grid (Role, Duration, Team, Platform)
4. **The Problem** — Big animated counter "68%" + before screenshot
5. **Discovery (Research)** — 3 findings in centered vertical flow:
   - Each: header → phone screenshot → callout annotation
   - Phone images have subtle parallax (y: 40 → -40, scrub)
6. **The Insight** — Accent background, "What if we asked how you feel, not what you want?"
7. **Before/After Comparison** — Side-by-side phone screenshots with divider arrow
8. **Evolution (Iteration)** — 3 versions in centered vertical flow:
   - V1: Reorganized by context
   - V2: Mood-first discovery
   - Final: The confidence card (accent callout)
   - Phone images have parallax same as findings
9. **Final Showcase** — 3 phones side-by-side, center one elevated, stagger fade-in
10. **User Voice** — Big pull quote with animated quotation mark, text, source
11. **Impact** — 3 metric cards with animated counters (40%, 25%, 4.6/5)
12. **Reflection** — "What I learned" closing text

**Navigation:** Fixed back button (top-left, pill-shaped, glass morphism) + theme toggle (top-right). Reading progress bar at very top.

**Footer:** "Back to All Projects" link + "Back to Top" button.

---

## JavaScript Architecture

### `main.js` — DOM Interactions
- **Theme:** Reads/writes `localStorage`, sets `data-theme` attribute
- **Loader:** Adds `.loaded` class after 1.8s timeout, reveals hero `[data-animate]` elements with staggered delays
- **Nav:** Scroll listener with `requestAnimationFrame` throttle. Adds `site-nav--compact` at 100px, `site-nav--hidden` on scroll down past 300px
- **Smooth scroll:** Nav links use `scrollIntoView({ behavior: 'smooth' })`
- **Custom cursor:** Only on non-touch devices. `mousemove` positions dot instantly, ring follows with `0.15` lerp. Hover/click states via class toggles
- **Video management:** IntersectionObserver auto-plays/pauses `<video>` elements

### `animations.js` — GSAP/ScrollTrigger
- **Scroll fade-up:** All `[data-animate]` elements NOT inside `.hero` or `.cs-hero` get GSAP `fromTo` with ScrollTrigger at `start: 'top 88%'`. Supports `fade-up`, `fade-left`, `fade-right`, `scale-in`.
- **CS Hero reveal:** `.cs-hero [data-animate]` elements get CSS class-based reveal (`.revealed`) with staggered `setTimeout`
- **ContainerScroll 3D:** Phone `opacity: 0 → 1` after 0.7s, then `rotateX/scale` flatten on scroll scrub. Title `y: -80, opacity: 0` on scroll.
- **Showcase phones:** Staggered fade-in with `y: 60 → 0`
- **Phone parallax:** `.cs-finding__phone` and `.cs-evolution__phone` get `y: 40 → -40` scrub
- **Counter animation:** `[data-target]` elements animate `innerText` from 0 to target with snap
- **Quote block:** Timeline — mark (scale bounce), text (fade up), source (fade in)
- **Progress bar:** Scroll listener updates width percentage
- **ScrollTrigger.refresh()** on `window.load` event

### `pong-hero.js` — Canvas Game
- Self-contained IIFE, no dependencies
- Pixel map for A-Z characters renders "ARUN PERI / SR DESIGNER"
- Ball bounces off walls, 4 AI paddles, and pixel blocks
- Pixels change to "hit" color when ball collides
- After all pixels hit, they regenerate after 3s delay
- Theme-aware: reads `data-theme` attribute each frame for colors
- IntersectionObserver pauses game when hero is not visible

---

## Animation System

### Two animation approaches coexist:

1. **CSS class-based reveals** (for hero sections):
   - Elements start with `opacity: 0; transform: translateY(30px)` via CSS
   - JS adds `.revealed` class after timeout → CSS transition handles the animation
   - Used in: `.hero [data-animate]` and `.cs-hero [data-animate]`

2. **GSAP `fromTo` with ScrollTrigger** (for everything else):
   - Elements start with `opacity: 0` via `animations.css` override
   - GSAP animates them on scroll trigger
   - The selector explicitly excludes hero elements: `:not(.hero [data-animate]):not(.cs-hero [data-animate])`

### Critical gotcha: CSS `transform` conflicts
CSS `transform` is a **single property** — transforms from different rules OVERRIDE each other, they don't stack. The hero phone uses `transform: rotateX(20deg) scale(0.92)` in CSS, so it must NOT have `data-animate` (which would set `transform: translateY(30px)` and overwrite the 3D effect). The phone's opacity reveal is handled separately via GSAP `gsap.to(phone, { opacity: 1 })`.

### Critical gotcha: GSAP inline styles
GSAP sets **inline styles** which permanently override CSS class-based styles. Elements that need class-based toggling (opacity, transform) should NOT also be animated by GSAP for those same properties.

---

## Responsive Breakpoints

- **1024px:** Context grid collapses to single column, phones/images get smaller max-widths
- **768px:** Work cards stack to single column, nav shrinks, footer reflows, case study block padding reduces, comparison goes vertical, metrics go single column
- **480px:** Full-width phones, showcase wraps, nav even smaller, hero tags shrink

---

## Key Decisions & Patterns

- **No build tools:** Everything is vanilla. CSS files are linked directly, JS loaded via `<script>` tags with `defer`.
- **BEM-ish naming:** `.block__element--modifier` pattern throughout (e.g., `.cs-hero__phone-wrapper`, `.work-card--placeholder`)
- **Glass morphism nav:** `backdrop-filter: blur(24px)` with semi-transparent background
- **Hover button effect:** Expanding circle animation — small dot scales to fill button on hover while text slides and swaps
- **Film grain overlay:** Subtle `body::after` pseudo-element with SVG noise filter at 2% opacity
- **Retro grid:** CSS perspective transform + linear gradient lines + scroll animation in footer
- **Copper accent:** `#c9834e` used consistently for highlights, links, decorative elements in both themes

---

## Deployment

- **Netlify:** `netlify.toml` publishes root directory (`.`)
- **Cache headers:** Assets get 1 year cache, CSS/JS get 1 day cache
- **No build step:** Netlify serves static files directly

---

## What's NOT Built Yet

- Case studies 2 and 3 (placeholder cards on homepage)
- No contact form (email link only)
- No blog/writing section
- Images are not optimized (PNGs, 400-950KB each — could be converted to WebP)
