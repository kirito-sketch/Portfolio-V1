# Side Projects Section — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Side Projects" section to the homepage between Work and About, plus a dedicated `/budget-tracker` project page showcasing the budget tracker PWA.

**Architecture:** Homepage gets a new `<section id="side-projects">` with a horizontal card (phone mockup left, content right). The card links to `budget-tracker.html`, a lightweight project page reusing case study layout patterns (back nav, theme toggle, content blocks). No new JS files — existing `animations.js` handles scroll reveals via `data-animate` attributes.

**Tech Stack:** Vanilla HTML, CSS (BEM), GSAP ScrollTrigger (existing)

---

### Task 1: Rename Screenshot Files

**Files:**
- Rename: 9 files in `assets/images/budget tracker app/`

**Step 1: Rename UUID files to descriptive names**

```bash
cd "assets/images/budget tracker app"
mv "288CCC17-63B1-4587-9E69-352651317DF5_4_5005_c.jpeg" "home-personal.jpeg"
mv "A58ECE76-8F09-4002-B68D-C9436F523AD6_4_5005_c.jpeg" "manual-entry.jpeg"
mv "2FF1081C-40CF-46D2-995D-5A9A687A11B7_4_5005_c.jpeg" "category-picker.jpeg"
mv "B18C8948-EDA9-4F5E-9640-BA090F016FFB_4_5005_c.jpeg" "home-joint.jpeg"
mv "E78A52A9-582C-49AC-A66F-A463C96CDB87_4_5005_c.jpeg" "transactions.jpeg"
mv "D4CD01F2-6600-4FD2-AD85-217E9910158A_4_5005_c.jpeg" "export.jpeg"
mv "B52C8276-0F0D-4436-9756-EAF3BD7ACC95_4_5005_c.jpeg" "insights.jpeg"
mv "2EACFCAA-A1D5-4385-AECC-889189D6FE0E_4_5005_c.jpeg" "ai-chat.jpeg"
mv "D6563094-5099-40F8-BC62-5DF7435D9771_4_5005_c.jpeg" "settings.jpeg"
```

**Step 2: Commit**

```bash
git add "assets/images/budget tracker app/"
git commit -m "chore: rename budget tracker screenshots to descriptive names"
```

---

### Task 2: Homepage Side Projects Section — HTML

**Files:**
- Modify: `index.html` (insert between Work section closing `</section>` at ~line 161 and About section `<section id="about">` at ~line 166)

**Step 1: Add Side Projects section HTML**

Insert this block between the closing `</section>` of Work and the opening `<!-- ABOUT -->` comment:

```html
      <!-- ================================================================
           SIDE PROJECTS
           ================================================================ -->
      <section id="side-projects" class="section side-projects">
        <div class="container">
          <h2 class="side-projects__title" data-animate="fade-up">Side Projects</h2>
          <p class="side-projects__subtitle" data-animate="fade-up" data-delay="0.1">Problems I solved with code</p>
        </div>

        <div class="container">
          <a href="budget-tracker" class="project-card" data-animate="fade-up" data-delay="0.2">
            <div class="project-card__image">
              <img src="assets/images/budget tracker app/home-personal.jpeg" alt="Budget tracker home screen showing instant Log Transaction input" width="390" height="844">
            </div>
            <div class="project-card__content">
              <h3 class="project-card__name">Budget Tracker</h3>
              <p class="project-card__tagline">A PWA that puts transaction logging front and center — no buried menus, no bank connections.</p>
              <p class="project-card__summary">Built for my wife and me after every budget app we tried buried the one action we needed most behind multiple screens. Open the app, log the transaction, done.</p>
              <div class="project-card__pills">
                <span class="project-card__pill">PWA</span>
                <span class="project-card__pill">Groq AI</span>
                <span class="project-card__pill">Design OS</span>
              </div>
              <span class="hover-btn">
                <span class="hover-btn__text">View Project</span>
                <span class="hover-btn__hover-content">
                  <span>View Project</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
                <span class="hover-btn__circle"></span>
              </span>
            </div>
          </a>
        </div>
      </section>
```

**Step 2: Add "Side Projects" nav link**

In the `<nav class="site-nav__links">`, add between Work and About:

```html
<a href="#side-projects" class="site-nav__link">Projects</a>
```

---

### Task 3: Homepage Side Projects Section — CSS

**Files:**
- Modify: `css/style.css` (add after the Work section styles, before the About section styles)

**Step 1: Add Side Projects section styles**

Find the end of the Work section styles (after the `.work-card--soon` styles and responsive rules) and add:

```css
/* ─── Side Projects ─── */

.side-projects {
  padding: var(--space-2xl) 0;
}

.side-projects__title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  text-align: center;
  margin-bottom: var(--space-xs);
}

.side-projects__subtitle {
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--space-lg);
}

/* Project Card — horizontal layout */
.project-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-lg);
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.project-card__image {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  background: var(--bg-secondary);
}

.project-card__image img {
  width: 220px;
  height: auto;
  border-radius: 16px;
  object-fit: cover;
}

.project-card__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-lg) var(--space-lg) var(--space-lg) 0;
  gap: var(--space-sm);
}

.project-card__name {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
}

.project-card__tagline {
  font-size: clamp(0.95rem, 1.3vw, 1.1rem);
  color: var(--text-secondary);
  font-style: italic;
  max-width: 500px;
}

.project-card__summary {
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  color: var(--text-secondary);
  max-width: 500px;
  line-height: 1.6;
}

.project-card__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: var(--space-xs);
}

.project-card__pill {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 50px;
  color: var(--text-secondary);
}

/* Responsive: stack on mobile */
@media (max-width: 768px) {
  .project-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .project-card__content {
    padding: 0 var(--space-md) var(--space-lg);
    align-items: center;
  }

  .project-card__tagline,
  .project-card__summary {
    max-width: 100%;
  }

  .project-card__pills {
    justify-content: center;
  }

  .project-card__image img {
    width: 180px;
  }
}
```

**Step 2: Verify locally** — open `index.html` in browser, confirm card renders between Work and About.

---

### Task 4: Commit Homepage Changes

```bash
git add index.html css/style.css
git commit -m "feat: add Side Projects section to homepage with budget tracker card"
```

---

### Task 5: Create Budget Tracker Project Page — HTML

**Files:**
- Create: `budget-tracker.html`

**Step 1: Create the project page**

Follow the case study page pattern (back nav, theme toggle, content blocks) but lighter — no section navigator, no password gate.

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Budget Tracker — a PWA that puts transaction logging front and center. Built by Arun Peri.">
  <title>Budget Tracker | Arun Peri</title>

  <meta property="og:title" content="Budget Tracker | Arun Peri">
  <meta property="og:description" content="A PWA that puts transaction logging front and center — no buried menus, no bank connections.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#10022;</text></svg>">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:opsz,wght@14..32,100..900&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/animations.css">
  <link rel="stylesheet" href="css/case-study.css">
</head>
<body>

  <div class="site-wrapper">

    <a href="#main-content" class="skip-link">Skip to content</a>

    <!-- Custom Cursor -->
    <div class="cursor">
      <div class="cursor__dot"></div>
      <div class="cursor__ring"></div>
    </div>

    <!-- Back nav -->
    <nav class="cs-nav" aria-label="Back to homepage">
      <a href="/" class="cs-nav__back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        <span>Home</span>
      </a>
      <button class="cs-nav__theme theme-toggle" aria-label="Toggle theme">
        <svg class="theme-toggle__sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg class="theme-toggle__moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </nav>

    <main id="main-content">

      <!-- ── Hero ── -->
      <section class="cs-hero">
        <div class="cs-hero__gradient" aria-hidden="true"></div>
        <div class="cs-hero__content">
          <div class="cs-hero__meta">
            <span class="cs-hero__tag">PWA</span>
            <span class="cs-hero__tag">Groq AI</span>
            <span class="cs-hero__tag">Design OS</span>
          </div>
          <h1 class="cs-hero__title" style="font-size: clamp(3rem, 8vw, 6rem);">Budget Tracker</h1>
          <p class="cs-hero__subtitle">A personal finance app that puts logging front and center — because the best budget app is the one you actually use.</p>
          <div class="cs-hero__phone-wrapper">
            <img class="cs-hero__phone" src="assets/images/budget tracker app/home-personal.jpeg" alt="Budget tracker home screen with instant Log Transaction input" width="390" height="844">
          </div>
        </div>
      </section>

      <!-- ── The Problem ── -->
      <section class="cs-block">
        <div class="cs-block__inner">
          <h2 class="cs-block__heading" data-animate="fade-up">The Problem</h2>
          <div class="cs-block__text" data-animate="fade-up" data-delay="0.1">
            <p>Every budget app my wife and I tried had the same issue: the core action — logging a transaction — was buried behind multiple taps, menus, and screens. By the time you navigated there, you'd already lost motivation.</p>
            <p>On top of that, most apps require connecting your bank account. Handing over credentials to a third-party service never felt right.</p>
            <p>I wanted something simple: open the app, log the transaction, done. No bank connections, no syncing, no friction.</p>
          </div>
        </div>
      </section>

      <!-- ── The Approach ── -->
      <section class="cs-block">
        <div class="cs-block__inner">
          <h2 class="cs-block__heading" data-animate="fade-up">The Approach</h2>
          <div class="cs-block__text" data-animate="fade-up" data-delay="0.1">
            <p>I started with a <strong>Design OS</strong> — a set of tokens, components, and layout primitives — to establish the visual foundation quickly and consistently.</p>
            <p>From there, I built it as a <strong>Progressive Web App</strong> so it feels native on any phone without the friction of an app store. All data stays local on the device.</p>
            <p>I used <strong>Claude Code</strong> throughout — from scaffolding the app to building features. It was a real test of what's possible when a designer codes with AI assistance.</p>
          </div>
        </div>
      </section>

      <!-- ── Key Features ── -->
      <section class="cs-block">
        <div class="cs-block__inner">
          <h2 class="cs-block__heading" data-animate="fade-up">Key Features</h2>
        </div>

        <div class="cs-block__inner">

          <!-- Feature: Instant Logging -->
          <div class="project-feature" data-animate="fade-up">
            <div class="project-feature__text">
              <h3 class="project-feature__name">Instant Transaction Logging</h3>
              <p>The home screen opens directly to Log Transaction. Type naturally — "Spent 500 on lunch" — or expand the manual form for full control over amount, category, and date.</p>
            </div>
            <div class="project-feature__screens">
              <img src="assets/images/budget tracker app/home-personal.jpeg" alt="Home screen with natural language input" width="390" height="844">
              <img src="assets/images/budget tracker app/manual-entry.jpeg" alt="Manual entry form expanded" width="390" height="844">
            </div>
          </div>

          <!-- Feature: Joint Account -->
          <div class="project-feature project-feature--reverse" data-animate="fade-up">
            <div class="project-feature__text">
              <h3 class="project-feature__name">Personal & Joint Accounts</h3>
              <p>Switch between personal and joint accounts with a single tap. My wife and I track shared household expenses separately from individual spending.</p>
            </div>
            <div class="project-feature__screens">
              <img src="assets/images/budget tracker app/home-joint.jpeg" alt="Joint account view - Our Nest" width="390" height="844">
            </div>
          </div>

          <!-- Feature: Transactions -->
          <div class="project-feature" data-animate="fade-up">
            <div class="project-feature__text">
              <h3 class="project-feature__name">Transaction History & Export</h3>
              <p>Monthly breakdowns with opening/closing balances. Export any date range — current month, last quarter, or custom — as a file for your records.</p>
            </div>
            <div class="project-feature__screens">
              <img src="assets/images/budget tracker app/transactions.jpeg" alt="Transaction history with monthly breakdown" width="390" height="844">
              <img src="assets/images/budget tracker app/export.jpeg" alt="Export transactions with date range selection" width="390" height="844">
            </div>
          </div>

          <!-- Feature: AI Insights -->
          <div class="project-feature project-feature--reverse" data-animate="fade-up">
            <div class="project-feature__text">
              <h3 class="project-feature__name">AI-Powered Insights</h3>
              <p>A dashboard with spending breakdowns and a chat assistant powered by Groq AI. Ask questions like "How much did I spend on food this month?" and get instant answers.</p>
            </div>
            <div class="project-feature__screens">
              <img src="assets/images/budget tracker app/insights.jpeg" alt="Insights dashboard with spending categories" width="390" height="844">
              <img src="assets/images/budget tracker app/ai-chat.jpeg" alt="AI chat assistant for spending questions" width="390" height="844">
            </div>
          </div>

          <!-- Feature: Settings -->
          <div class="project-feature" data-animate="fade-up">
            <div class="project-feature__text">
              <h3 class="project-feature__name">Customizable & Private</h3>
              <p>Dark, light, and system themes. Groq API key stays on your device. All data stored locally — no servers, no bank connections, no tracking.</p>
            </div>
            <div class="project-feature__screens">
              <img src="assets/images/budget tracker app/settings.jpeg" alt="Settings with theme options and API key" width="390" height="844">
            </div>
          </div>

        </div>
      </section>

      <!-- ── What I Learned ── -->
      <section class="cs-block">
        <div class="cs-block__inner">
          <h2 class="cs-block__heading" data-animate="fade-up">What I Learned</h2>
          <div class="cs-block__text" data-animate="fade-up" data-delay="0.1">
            <p>Building this taught me that the best way to understand users is to be one. Every design decision was tested by daily use — if something felt slow or awkward, I fixed it immediately.</p>
            <p>Working with AI (Claude Code) as a build partner was eye-opening. The Design OS gave me a consistent visual language from the start, and AI handled the implementation plumbing. My role was the same as always: deciding what to build, how it should feel, and when something wasn't right.</p>
            <p>The biggest takeaway? Solving your own problem is the purest form of user-centered design.</p>
          </div>
        </div>
      </section>

    </main>

    <!-- ── Footer (back to home) ── -->
    <footer class="cs-footer">
      <div class="cs-footer__inner" data-animate="fade-up">
        <a href="/" class="cs-footer__back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to all projects
        </a>
      </div>
    </footer>

  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="js/main.js" defer></script>
  <script src="js/animations.js" defer></script>

</body>
</html>
```

---

### Task 6: Project Page Feature Layout — CSS

**Files:**
- Modify: `css/case-study.css` (add at the end, before any final media queries)

**Step 1: Add project feature styles**

These styles handle the alternating screenshot/text layout on the project page:

```css
/* ─── Project Feature (side projects page) ─── */

.project-feature {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  align-items: center;
  margin-bottom: var(--space-xl);
}

.project-feature--reverse {
  direction: rtl;
}

.project-feature--reverse > * {
  direction: ltr;
}

.project-feature__name {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.5vw, 1.8rem);
  font-weight: 400;
  margin-bottom: var(--space-sm);
}

.project-feature__text p {
  font-size: clamp(0.95rem, 1.2vw, 1.05rem);
  color: var(--text-secondary);
  line-height: 1.7;
}

.project-feature__screens {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

.project-feature__screens img {
  width: 180px;
  height: auto;
  border-radius: 16px;
  border: 1px solid var(--border-light);
  object-fit: cover;
}

/* Footer back link for project pages */
.cs-footer {
  padding: var(--space-xl) 0 var(--space-lg);
  text-align: center;
}

.cs-footer__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.cs-footer__back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.cs-footer__back-link:hover {
  color: var(--accent);
}

@media (max-width: 768px) {
  .project-feature {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .project-feature--reverse {
    direction: ltr;
  }

  .project-feature__screens {
    justify-content: center;
  }

  .project-feature__screens img {
    width: 150px;
  }
}

@media (max-width: 480px) {
  .project-feature__screens img {
    width: 130px;
  }
}
```

**Step 2: Verify locally** — open `budget-tracker.html` in browser, check all sections render, screenshots display, responsive layout works.

---

### Task 7: Commit Project Page

```bash
git add budget-tracker.html css/case-study.css
git commit -m "feat: add budget tracker project page with feature showcase"
```

---

### Task 8: Final Verification & Push

**Step 1: Check all pages**

- Homepage: Side Projects section visible between Work and About, card links to `/budget-tracker`
- Budget Tracker page: Hero, Problem, Approach, Features (with screenshots), What I Learned, footer back link
- Both themes (dark/light) work on both pages
- Mobile responsive on both pages
- Scroll animations trigger on both pages
- Nav link "Projects" scrolls to side projects section

**Step 2: Push**

```bash
git push origin main
```
