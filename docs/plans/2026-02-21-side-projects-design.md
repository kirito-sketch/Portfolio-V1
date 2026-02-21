# Side Projects Section — Design

## Summary

Add a "Side Projects" section to the homepage between Work and About, plus a dedicated project page for the budget tracker PWA. Visually distinct from the case study cards — lighter, more personal tone.

## Homepage Section

### Placement
Between the Work gallery and About section.

### Visual Identity
- Section header: "Side Projects" with subtitle "Problems I solved with code"
- Horizontal card layout (image left, content right)
- Visually distinct from Work cards — no numbered cards, no "View Case Study" language
- Uses existing design tokens but with a more relaxed feel

### Card Structure
- **Left**: Phone mockup showing the home screen (Log Transaction front and center)
- **Right**:
  - Project name + tagline
  - 2-3 sentence summary of the problem/solution
  - Tech pills: PWA, Groq AI, Design OS
  - "View Project" link
- Card links to `/budget-tracker` (dedicated page)

### Scalability
Cards stack vertically. Works with one project now, scales naturally as more are added.

## Dedicated Project Page (`budget-tracker.html`)

Lightweight page — not a full case study, more of a project showcase.

### Structure

1. **Hero**
   - App name + tagline
   - Phone screenshot (home screen)
   - Tech pills

2. **The Problem**
   - Existing budget apps bury the core action (logging a transaction) behind multiple screens
   - Connecting bank accounts to third-party apps feels unsafe
   - "I wanted to open the app and immediately do the one thing I came to do"

3. **The Approach**
   - Used a design OS to establish the visual foundation
   - Built with AI assistance (Claude Code)
   - PWA for native-like experience without app store friction

4. **Key Features** (screenshot gallery)
   - Instant transaction logging on open (natural language + manual)
   - Voice input support
   - Transaction history with monthly breakdowns
   - AI-powered insights and spending chat
   - Personal/Joint account switching
   - Local data storage (no bank connection needed)
   - Dark/light/system theme support

5. **What I Learned**
   - Brief reflection on building with AI, design OS workflow, solving your own problems

### Navigation
- Back link to homepage (same pattern as case study pages)
- Theme toggle
- No section navigator (page is shorter than case studies)

## Screenshots Available

9 screenshots in `assets/images/budget tracker app/`:
- Home screen with Log Transaction
- Manual entry expanded
- Transactions list
- Insights dashboard
- AI chat assistant
- Settings page
- (3 more screens)

## Tech Notes
- No new CSS file needed — styles go in `css/style.css` (homepage section) and `css/case-study.css` (project page reuses case study layout patterns)
- No new JS needed — existing animations.js handles scroll reveals
- Phone mockup screenshots need renaming from UUIDs to descriptive names
