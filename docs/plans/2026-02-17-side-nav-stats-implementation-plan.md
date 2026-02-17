# Side Section Navigator + Stats Replacement — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the top progress bar with an expandable side section navigator on all case study pages, and replace fabricated statistics in Reimagining Search with a "Measuring Success" section.

**Architecture:** A fixed bottom-left floating panel built with vanilla JS + CSS. Uses IntersectionObserver to track the active section and scroll percentage for progress. The panel expands/collapses to show section links. Statistics in Reimagining Search get replaced with KPI cards.

**Tech Stack:** Vanilla HTML, CSS, JavaScript (no new dependencies)

---

### Task 1: Add section IDs to both case study HTML files

**Files:**
- Modify: `reimagining-search.html` (lines 65, 93, 103, 135, 150, 207, 218, 251, 283, 295, 336)
- Modify: `statera-command-center.html` (lines 65, 93, 133, 224, 281, 330, 341, 382, 418, 466, 509, 521, 568, 596)

**Step 1: Add IDs to reimagining-search.html sections**

Each `<section>` needs an `id` and a `data-nav-label` attribute for the navigator to read:

```html
<!-- line 65 -->
<section class="cs-hero" id="overview" data-nav-label="Overview">

<!-- line 93 -->
<section class="cs-block cs-block--centered" id="hook" data-nav-label="The Hook">

<!-- line 103 -->
<section class="cs-block" id="context" data-nav-label="Context">

<!-- line 135 -->
<section class="cs-block cs-block--dark" id="problem" data-nav-label="The Problem">

<!-- line 150 -->
<section class="cs-block" id="discovery" data-nav-label="Discovery">

<!-- line 207 -->
<section class="cs-block cs-block--centered cs-block--accent" id="insight" data-nav-label="The Shift">

<!-- line 218 -->
<section class="cs-block cs-block--alt" id="iteration" data-nav-label="Iteration">

<!-- line 251 -->
<section class="cs-block" id="final-design" data-nav-label="Final Design">

<!-- line 283 -->
<section class="cs-block cs-block--centered" id="user-voice" data-nav-label="User Voice">

<!-- line 295 — this will be replaced in Task 5, but add ID now -->
<section class="cs-block cs-block--dark" id="measuring-success" data-nav-label="Measuring Success">

<!-- line 336 -->
<section class="cs-block" id="reflection" data-nav-label="Reflection">
```

**Step 2: Add IDs to statera-command-center.html sections**

```html
<!-- Hero -->
<section class="cs-hero" id="overview" data-nav-label="Overview">

<!-- Project Overview -->
<section class="cs-block" id="project-overview" data-nav-label="Project">

<!-- Journey to Problem -->
<section class="cs-block cs-block--alt" id="discovery" data-nav-label="Discovery">

<!-- Findings -->
<section class="cs-block cs-block--alt" id="findings" data-nav-label="Findings">

<!-- Platform Limitation -->
<section class="cs-block" id="platform" data-nav-label="Platform">

<!-- The Solution -->
<section class="cs-block cs-block--centered cs-block--accent" id="solution" data-nav-label="The Solution">

<!-- Core Design Principles -->
<section class="cs-block" id="principles" data-nav-label="Principles">

<!-- Dashboard Evolution -->
<section class="cs-block cs-block--alt" id="dashboard" data-nav-label="Dashboard">

<!-- Campaign Management -->
<section class="cs-block" id="campaigns" data-nav-label="Campaigns">

<!-- Campaign Builder -->
<section class="cs-block cs-block--alt" id="builder" data-nav-label="Builder">

<!-- User Voice -->
<section class="cs-block cs-block--centered" id="user-voice" data-nav-label="User Voice">

<!-- Outcome -->
<section class="cs-block cs-block--dark" id="outcome" data-nav-label="Outcome">

<!-- Constraints -->
<section class="cs-block" id="constraints" data-nav-label="Constraints">

<!-- Learnings -->
<section class="cs-block" id="learnings" data-nav-label="Learnings">
```

**Step 3: Commit**

```bash
git add reimagining-search.html statera-command-center.html
git commit -m "feat: add section IDs and nav labels to case study pages"
```

---

### Task 2: Remove the top progress bar from HTML

**Files:**
- Modify: `reimagining-search.html` (lines 55-58)
- Modify: `statera-command-center.html` (same structure)

**Step 1: Remove progress bar HTML from both files**

Delete these lines from both case study HTML files:

```html
    <!-- Progress Bar -->
    <div class="cs-progress" role="progressbar" aria-label="Reading progress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
      <div class="cs-progress__bar"></div>
    </div>
```

**Step 2: Commit**

```bash
git add reimagining-search.html statera-command-center.html
git commit -m "feat: remove top progress bar from case studies"
```

---

### Task 3: Add the section navigator HTML to both case study files

**Files:**
- Modify: `reimagining-search.html` (insert before `</div><!-- .site-wrapper -->`)
- Modify: `statera-command-center.html` (same location)

**Step 1: Add navigator HTML just before `</div><!-- .site-wrapper -->`**

Insert this before the closing `</div>` of `.site-wrapper` (right before the `<script>` tags) in BOTH files:

```html
    <!-- Section Navigator -->
    <nav class="section-nav" aria-label="Case study sections">
      <button class="section-nav__toggle" aria-expanded="false" aria-controls="section-nav-list">
        <svg class="section-nav__hamburger" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="section-nav__current">Overview</span>
        <svg class="section-nav__chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4 6L7 9L10 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="section-nav__progress">0%</span>
      </button>
      <ul class="section-nav__list" id="section-nav-list"></ul>
    </nav>
```

The `<ul>` is empty — JavaScript will populate it from `data-nav-label` attributes.

**Step 2: Commit**

```bash
git add reimagining-search.html statera-command-center.html
git commit -m "feat: add section navigator HTML to case studies"
```

---

### Task 4: Write CSS for the section navigator

**Files:**
- Modify: `css/case-study.css` — add new section at the end (before responsive media queries), and update responsive blocks

**Step 1: Add section navigator styles**

Add before the `@media (prefers-reduced-motion)` block (before line 978):

```css
/* ==========================================================================
   SECTION NAVIGATOR — Fixed bottom-left expandable panel
   ========================================================================== */

.section-nav {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: 100;
  font-family: var(--font-body);
}

.section-nav__toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 50px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all var(--duration-fast) var(--ease-smooth);
  width: 100%;
}

.section-nav__toggle:hover {
  color: var(--text-primary);
  border-color: rgba(201, 131, 78, 0.2);
}

.section-nav__current {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.section-nav__chevron {
  transition: transform var(--duration-fast) var(--ease-smooth);
  flex-shrink: 0;
}

.section-nav[data-expanded="true"] .section-nav__chevron {
  transform: rotate(180deg);
}

.section-nav__progress {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--accent);
  flex-shrink: 0;
  min-width: 2.5em;
  text-align: right;
}

.section-nav__list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.3s var(--ease-smooth),
              opacity 0.2s var(--ease-smooth);
  pointer-events: none;
}

.section-nav[data-expanded="true"] .section-nav__list {
  max-height: 400px;
  opacity: 1;
  pointer-events: auto;
  overflow-y: auto;
}

.section-nav__item {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color var(--duration-fast),
              background var(--duration-fast);
  white-space: nowrap;
}

.section-nav__item:hover {
  color: var(--text-primary);
  background: rgba(201, 131, 78, 0.06);
}

.section-nav__item--active {
  color: var(--accent);
  font-weight: 600;
}
```

**Step 2: Remove old progress bar CSS**

Delete the `.cs-progress` and `.cs-progress__bar` rules (lines 55-70 of case-study.css):

```css
/* DELETE these rules */
.cs-progress { ... }
.cs-progress__bar { ... }
```

**Step 3: Add responsive styles**

In the `@media (max-width: 768px)` block, add:

```css
  .section-nav {
    bottom: 1rem;
    left: 1rem;
  }

  .section-nav__current {
    max-width: 100px;
  }
```

In the `@media (max-width: 480px)` block, add:

```css
  .section-nav {
    bottom: 0.75rem;
    left: 0.75rem;
    right: 0.75rem;
  }

  .section-nav__toggle {
    font-size: 0.8rem;
  }

  .section-nav__current {
    max-width: 80px;
  }
```

**Step 4: Commit**

```bash
git add css/case-study.css
git commit -m "feat: add section navigator CSS, remove top progress bar styles"
```

---

### Task 5: Write JavaScript for the section navigator

**Files:**
- Modify: `js/animations.js` — replace the progress bar code (lines 316-339) with section navigator logic

**Step 1: Replace progress bar JS with section navigator JS**

Replace the entire "5. Reading Progress Bar" block (lines 316-339) with:

```javascript
  /* ========================================================================
     5. Section Navigator (case study page)
     ======================================================================== */

  const sectionNav = document.querySelector('.section-nav');
  if (sectionNav) {
    const toggle = sectionNav.querySelector('.section-nav__toggle');
    const list = sectionNav.querySelector('.section-nav__list');
    const currentLabel = sectionNav.querySelector('.section-nav__current');
    const progressLabel = sectionNav.querySelector('.section-nav__progress');

    // Build section list from data-nav-label attributes
    const sections = [];
    document.querySelectorAll('main section[data-nav-label]').forEach(sec => {
      sections.push({ id: sec.id, label: sec.dataset.navLabel, el: sec });
      const li = document.createElement('li');
      li.className = 'section-nav__item';
      li.textContent = sec.dataset.navLabel;
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');
      li.addEventListener('click', () => {
        sec.scrollIntoView({ behavior: 'smooth' });
        closeNav();
      });
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          sec.scrollIntoView({ behavior: 'smooth' });
          closeNav();
        }
      });
      list.appendChild(li);
    });

    const listItems = list.querySelectorAll('.section-nav__item');

    // Toggle expand/collapse
    function openNav() {
      sectionNav.dataset.expanded = 'true';
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeNav() {
      sectionNav.dataset.expanded = 'false';
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
      const isExpanded = sectionNav.dataset.expanded === 'true';
      if (isExpanded) closeNav();
      else openNav();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!sectionNav.contains(e.target)) closeNav();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });

    // Track active section with IntersectionObserver
    let activeIndex = 0;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = sections.findIndex(s => s.el === entry.target);
          if (idx !== -1) {
            activeIndex = idx;
            currentLabel.textContent = sections[idx].label;
            listItems.forEach((li, i) => {
              li.classList.toggle('section-nav__item--active', i === idx);
            });
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(s => observer.observe(s.el));

    // Track scroll progress
    let progressTicking = false;
    window.addEventListener('scroll', () => {
      if (!progressTicking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.round((scrollTop / docHeight) * 100);
          progressLabel.textContent = progress + '%';
          progressTicking = false;
        });
        progressTicking = true;
      }
    });
  }
```

**Step 2: Commit**

```bash
git add js/animations.js
git commit -m "feat: add section navigator JS with IntersectionObserver"
```

---

### Task 6: Replace statistics with "Measuring Success" in Reimagining Search

**Files:**
- Modify: `reimagining-search.html` (lines 292-330)

**Step 1: Replace the Impact section HTML**

Replace the entire Impact section (lines 292-330) with:

```html
      <!-- ================================================================
           MEASURING SUCCESS — What I'd track if this shipped
           ================================================================ -->
      <section class="cs-block" id="measuring-success" data-nav-label="Measuring Success">
        <div class="cs-block__inner">
          <div class="cs-section-header cs-section-header--center" data-animate="fade-up">
            <span class="cs-label">Measuring Success</span>
            <h2 class="cs-heading">What I'd track</h2>
          </div>

          <div class="cs-kpis">
            <div class="cs-kpi" data-animate="fade-up">
              <h3 class="cs-kpi__name">Time to Content</h3>
              <p class="cs-kpi__rationale">The core problem was browsing fatigue. Measuring median time from search initiation to play would validate whether mood-based filters actually reduce the decision burden.</p>
            </div>
            <div class="cs-kpi" data-animate="fade-up" data-delay="0.1">
              <h3 class="cs-kpi__name">Browse-to-Play Conversion</h3>
              <p class="cs-kpi__rationale">What percentage of search sessions end with the user selecting content? A higher conversion rate means the discovery flow is guiding, not just displaying.</p>
            </div>
            <div class="cs-kpi" data-animate="fade-up" data-delay="0.2">
              <h3 class="cs-kpi__name">Search Refinement Rate</h3>
              <p class="cs-kpi__rationale">How often users modify their initial query or mood selection. Lower refinement suggests the first set of results was relevant enough to act on.</p>
            </div>
            <div class="cs-kpi" data-animate="fade-up" data-delay="0.3">
              <h3 class="cs-kpi__name">Return Search Usage</h3>
              <p class="cs-kpi__rationale">What percentage of returning users engage with mood-based search again? Repeat usage separates novelty from genuine utility.</p>
            </div>
          </div>
          <p class="cs-kpis__note">This project was validated through usability testing but did not ship to production.</p>
        </div>
      </section>
```

**Step 2: Commit**

```bash
git add reimagining-search.html
git commit -m "feat: replace fabricated metrics with 'Measuring Success' KPIs"
```

---

### Task 7: Add CSS for the "Measuring Success" KPI cards

**Files:**
- Modify: `css/case-study.css` — add new styles after the existing `.cs-metrics` block (after line 765)

**Step 1: Add KPI card styles**

```css
/* ==========================================================================
   MEASURING SUCCESS — KPI cards
   ========================================================================== */

.cs-kpis {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.cs-kpi {
  padding: var(--space-lg);
  border-radius: 16px;
  background: var(--card-bg, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--border-subtle);
  transition: border-color var(--duration-fast) var(--ease-smooth);
}

.cs-kpi:hover {
  border-color: rgba(201, 131, 78, 0.2);
}

.cs-kpi__name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--accent);
  margin-bottom: 0.75rem;
}

.cs-kpi__rationale {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.cs-kpis__note {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.35));
  text-align: center;
  margin-top: var(--space-lg);
  letter-spacing: 0.03em;
}
```

**Step 2: Add responsive rules**

In `@media (max-width: 768px)`:

```css
  .cs-kpis {
    grid-template-columns: 1fr;
  }
```

**Step 3: Commit**

```bash
git add css/case-study.css
git commit -m "feat: add Measuring Success KPI card styles"
```

---

### Task 8: Clean up old metrics counter animation code

**Files:**
- Modify: `js/animations.js` — remove counter animation that targeted `.cs-metric__number span[data-target]`

**Step 1: Find and remove the counter animation code**

Search for the GSAP counter animation in animations.js that animates `data-target` numbers (likely in section 3 or 4 of the file). The `.cs-stat-hero__value[data-target]` counter for the "68%" stat should remain — only remove the one for `.cs-metric__number` elements since those HTML elements no longer exist.

If the counter logic is shared (one function handles both), leave it — it will simply find no `.cs-metric` elements and be a no-op.

**Step 2: Commit**

```bash
git add js/animations.js
git commit -m "fix: clean up unused metrics counter animation"
```

---

### Task 9: Test and verify

**Step 1: Open both case study pages in browser and verify:**

- Section navigator appears bottom-left
- Collapsed state shows current section name + 0%
- Progress % updates on scroll
- Click toggle: panel expands with list of sections
- Click a section: smooth scrolls to that section, panel closes
- Active section is highlighted in accent color (#c9834e)
- Click outside panel: it closes
- Escape key: closes panel
- Theme toggle still works
- Reimagining Search: "Impact" section is gone, replaced by 4 KPI cards
- Statera: no changes to ending sections
- Mobile: panel is smaller but functional
- 480px: panel stretches to full width

**Step 2: Final commit if any fixes needed, then push**

```bash
git push origin main
```
