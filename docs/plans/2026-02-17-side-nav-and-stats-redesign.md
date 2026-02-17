# Side Section Navigator + Stats Replacement Design

**Date:** 2026-02-17
**Scope:** Both case study pages (reimagining-search.html, statera-command-center.html)

---

## Feature 1: Side Section Navigator

### What it replaces
The thin top progress bar (`<div class="cs-progress">`) is removed entirely from all breakpoints.

### Collapsed state (default)
- Fixed bottom-left, 24px from viewport edges
- Small pill/card: `[hamburger icon] [Section Name] [XX%]`
- Background blur + subtle border, matching existing card style
- Click anywhere to expand

### Expanded state
- Panel grows upward, reveals vertical list of section names
- Header: hamburger icon + section name + chevron (flipped) + progress %
- Each section row is clickable; active section highlighted in accent color (#c9834e)
- Click section: smooth-scroll to target, then auto-collapse
- Click outside or chevron: collapse

### Section tracking
- `IntersectionObserver` watches each `<section>` with `id` attributes
- Most-visible section becomes "active"
- Progress % = scroll position / total scrollable height

### Responsive
- All screen sizes (desktop + mobile)
- Slightly smaller sizing on mobile (below 768px)
- Same expand/collapse behavior

### Sections to track

**Reimagining Search:**
1. Overview (hero)
2. Context
3. The Problem
4. Discovery
5. The Shift
6. Iteration
7. Final Design
8. Measuring Success
9. Reflection

**Statera Command Center:**
1. Overview (hero)
2. Discovery
3. Findings
4. The Solution
5. Design Principles
6. Dashboard
7. Campaign Management
8. Campaign Builder
9. Outcome
10. Learnings

---

## Feature 2: Replace Statistics (Reimagining Search only)

### What it replaces
The `.cs-metrics` grid showing 3 fabricated metrics (40% faster, 25% increase, 4.6/5 satisfaction) and the counter animation.

### New section: "Measuring Success"
- Label: `MEASURING SUCCESS`
- Heading: "What I'd track"
- 3-4 cards in a grid, each with:
  - **KPI name** (bold heading)
  - **Why it matters** (1-2 sentences explaining the rationale)
- Disclaimer note: "This project was validated through usability testing but did not ship to production."

### Suggested KPIs (content to refine during implementation)
1. **Time to Content** - Median time from search to play; validates whether filters reduce browsing fatigue
2. **Browse-to-Play Conversion** - % of search sessions that end in content selection; measures if discovery flow works
3. **Search Refinement Rate** - How often users modify their initial query; lower = better initial results
4. **Return Search Usage** - % of returning users who use the new search; measures adoption and habit formation

### Statera Command Center
No changes. Existing ending (honest outcome + validated items + constraints + learnings) is already well-structured.

---

## Technical notes
- No new dependencies; vanilla JS + CSS
- GSAP fade-up animations apply to new sections via existing `data-animate` attributes
- Remove counter animation JS for the metrics that no longer exist
