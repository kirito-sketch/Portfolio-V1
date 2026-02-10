# Portfolio Website Design — Arun Peri

**Date:** 2026-02-10
**Type:** Senior UX Designer Portfolio
**Goal:** A portfolio that IS the proof of craft, not just a container for it

---

## Positioning

A senior UX designer who thinks deeply, drives real outcomes, and delivers impeccable craft. The site demonstrates all three before the visitor reads a single case study.

**Audience:** Hiring managers at top tech companies, design leaders evaluating for senior+ roles, and potential freelance/consulting clients.

**Personality:** Confident foundation, bold moments, warm and human. Not cold and sterile, not screaming for attention.

---

## Concept: The Cinematic Scroll

The entire portfolio is one continuous, crafted scroll journey. A visitor lands and is pulled into a cinematic flow. Each case study is a visual chapter told through images, GIFs, and videos with minimal guiding text. Between projects, brief interstitial moments act as palate cleansers.

A persistent floating nav and an early project overview section give visitors full control to jump between sections without breaking the flow for those who prefer to scroll.

---

## Site Structure

### 1. Hero / Landing

- **Your name** — large, bold, confident typography
- **A movie-inspired hook** — a creative pun (Jaws, Star Wars, Indiana Jones style) that shows personality immediately. Examples:
  - "Just when you thought it was safe to ship without a designer..."
  - "A long time ago in a product team far, far away..."
  - "In search of the lost user experience..."
- **Subtle scroll cue** — small animated arrow or gentle motion
- **No nav visible** — completely clean first impression
- **Background** — subtle ambient animation (slow-moving grain, soft color shift, or layered mesh gradient). Alive, not static.
- **Loading intro** — name types out or fades in over 1-2 seconds, setting cinematic tone

The floating nav fades in only once scrolling begins.

### 2. Project Overview (Table of Contents)

After the hero, a brief section showing 2-3 projects as large visual cards:

- Hero image or looping GIF from the project
- Project name
- One line — company/product and role
- 1-2 tags — "Mobile App", "Design System", "0 to 1"

Clicking a card smooth-scrolls to that case study. Ignoring it and continuing to scroll flows naturally into the first project.

This section is a menu, not a destination. Brief and visual.

### 3. Case Studies (2-3 Projects)

Each case study follows this visual rhythm:

**Opening shot** — Full-bleed hero image or autoplay video of the final product. Big, immersive, no competing text.

**The hook** — A relatable one-liner that frames the problem. Large bold text. Example: "Ever spent 30 minutes choosing what to watch... then watched nothing?"

**The setup** — 1-2 short sentences max. What was the product? What was the problem? Movie trailer voiceover energy.

**The problem, visually** — Show, don't tell:
- GIF/animation demonstrating the pain point
- A single key metric in large type
- Role/timeline as small subtle metadata, not a table

**Research highlights** — Only the 2-3 most compelling findings. Phone screens with short annotation overlays. Scroll through like flipping cards.

**The "aha" moment** — The pivot from problem to solution. Old flow fades out, new concept slides in. One line below: the core insight that drove the solution.

**Iteration, fast** — 3-4 screens in horizontal scroll or stacked sequence with subtle morph between versions. Labels like "V1 > V2 > Final" with one-liner explaining what changed and why.

**Feedback** — 1-2 punchy user quotes displayed large, like movie review pullquotes. Big quotation marks, their words, nothing else.

**Final designs, hero treatment** — The showpiece moment:
- Large device mockups with subtle floating/parallax effect
- Autoplay GIFs showing key interactions
- Short embedded video walkthrough if available

**Impact** — 2-3 metrics, each gets its own moment. Large animated numbers that count up on scroll. No paragraph needed.

### 4. Interstitials (Between Case Studies)

One screen height max. Options:
- A design principle displayed as a large quote
- A fun personal detail tying back to the movie theme
- A bold career metric: "12 products shipped. 3M+ users impacted."

Mental reset before the next case study. Personality between the work.

### 5. About / Closing

**About** — Not a bio paragraph. A character card:
- Photo (optional but humanizing)
- 3-4 short lines: name, location, current focus, one fun personal thing
- Book jacket energy, not resume summary

**What you're looking for** — One clear line. Full-time, freelance, or both.

**Contact** — Email, LinkedIn, maybe one more. No contact form. Single button: "Let's talk" opening email client with pre-filled subject line.

**Footer** — A final movie quip, easter egg, or clean sign-off. A smile on the way out.

### 6. Floating Nav

Persistent vertical stepper on the right side:
- Each dot = a section (Intro, Overview, Case Study 1, Case Study 2, etc.)
- Active dot highlights/expands as you scroll
- Hover shows tiny label with section name
- Click smooth-scrolls to that section
- Fades in after the hero, stays unobtrusive
- Small circles connected by a thin line

---

## Interaction & Animation Design

All animations are intentional, never gratuitous. They demonstrate interaction design mastery.

**Scroll-driven:**
- Images fade up and slightly scale entering viewport
- Text fades in with short delay after its image
- Stats/numbers count up when scrolled into view
- Case study heroes have subtle parallax depth
- Soft opacity shifts between sections

**Page load:**
- Brief animated intro (name types out or fades in, 1-2 seconds)
- Staggered reveal of hero elements (animation-delay)

**Hover/Interactive:**
- Custom cursor — small dot with trailing circle or subtle invert on hover
- Cards lift with shadow on hover
- Buttons with layered micro-interactions (ripple, lift, shadow)

**Transitions:**
- Before/after comparisons animate between states
- Iteration sequences morph between versions

---

## Aesthetic Direction

Based on Anthropic's Frontend Aesthetics Guide — baked into every step of the build.

### Typography
No generic fonts. Bold, distinctive choices with extreme contrast.

**Never use:** Inter, Roboto, Open Sans, Lato, Arial, system fonts, Space Grotesk

**Approach:**
- Display/heading font: bold, distinctive (e.g., Clash Display, Syne, Bricolage Grotesque, Cabinet Grotesk)
- Body font: clean but not boring (e.g., DM Sans, Satoshi, IBM Plex Sans)
- Extreme weight contrast: 100-200 vs 800-900, not 400 vs 600
- Size jumps of 3x+, not 1.5x

### Color & Theme
Commit to a cohesive palette. Dominant colors with sharp accents.

**Avoid:** Purple gradients on white, evenly distributed palettes, cliched schemes

**Approach:**
- Dark theme as base (cinematic feel)
- CSS variables for consistency
- One dominant color, one sharp accent
- Draw inspiration from film/cinema color grading

### Backgrounds
Atmosphere and depth, never flat solid colors.

- Layered CSS gradients (multiple radial gradients)
- Mesh gradient effects for sections
- Subtle grain or noise texture overlay
- Contextual effects matching the overall aesthetic

### Motion Principles
- CSS-only for most animations
- GSAP + ScrollTrigger for scroll-driven interactions
- Cubic-bezier timing: `cubic-bezier(0.4, 0, 0.2, 1)` for natural easing
- One orchestrated page load > scattered micro-interactions
- Staggered reveals with animation-delay

### Anti-Patterns to Avoid
- Cookie-cutter layouts
- Predictable component patterns
- Scattered, unmotivated animations
- Solid backgrounds without depth
- Convergence on "safe" choices

---

## Tech Stack

### Core
- **HTML** — Single page, semantic sections
- **CSS** — Custom properties, no framework (no Tailwind)
- **JavaScript** — Vanilla JS
- **GSAP + ScrollTrigger** — Scroll-driven animations, parallax, counters

### Hosting
- **Netlify or Vercel** — Free tier, custom domain, drag-and-drop deploy

### Content
- Images, GIFs, and videos in local `/assets` folder
- No CMS needed for 2-3 case studies
- All media optimized: compressed images, lazy-loaded videos

### Build Order
1. HTML structure with all sections and content placeholders
2. CSS styling and layout with design tokens (variables)
3. GSAP scroll animations and interactions
4. Media integration and optimization
5. Polish (cursor, loading animation, responsive)
6. Deploy

---

## Case Study Content: Mood-Based Discovery

The first case study to build, reimagined from the existing format.

**Project:** Solving Decision Fatigue with Mood-Based Discovery (streaming app)

**Cinematic retelling:**
1. Full-bleed final UI, autoplay GIF of mood swiping
2. Hook: "Ever spent 30 minutes choosing what to watch... then watched nothing?"
3. Problem shown visually: GIF of endless scrolling, key metric in large type
4. Research: 2-3 findings as annotated phone screens
5. Aha moment: old flow fades > new concept slides in. "What if we asked how you feel, not what you want?"
6. Iteration: 3-4 screens, V1 > V2 > Final with one-liner per jump
7. Feedback: 1-2 large pullquotes
8. Final designs: large mockups with parallax, GIFs of interactions
9. Impact: 2-3 animated counter metrics

---

## Open Items

- [ ] Exact movie quote for the hero
- [ ] Font pairing selection (will explore during build)
- [ ] Color palette selection (will explore during build)
- [ ] Content for case studies 2 and 3
- [ ] About section copy and photo
- [ ] Contact email and links
