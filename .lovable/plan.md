## REDFIT — Award-Caliber Rebuild Plan

Rebuilding the entire single-page site with cinematic hero, Lenis smooth scroll, GSAP scrub sequences, and 11 fully-built sections. Pure CSS (no Tailwind for new work — will use plain CSS file alongside existing styles). GSAP + ScrollTrigger + Lenis + SplitType.

### Dependencies
Install: `lenis`, `split-type` (gsap already present).

### File structure
- `src/lib/gsap.ts` — register ScrollTrigger once
- `src/lib/lenis.tsx` — Lenis provider, ScrollTrigger scrollerProxy wiring, refresh on load
- `src/styles/redfit.css` — brand tokens, section styles (imported in `styles.css`)
- `src/components/redfit2/` (new folder, keeps old files untouched then swap):
  - `Hero.tsx` — pinned canvas image-sequence scrub + SplitType headline load-in + scroll-tied secondary line + delayed CTA + matchMedia mobile fallback
  - `StatsBar.tsx` — 4 counters, count-up on view, `once: true`
  - `Philosophy.tsx` — line-by-line SplitType reveal, pinned parallax panel
  - `Programs.tsx` — card grid with `ScrollTrigger.batch`, hover glow
  - `Trainers.tsx` — horizontal scroll-snap row, per-card parallax speeds
  - `Facilities.tsx` — alternating tile gallery, scale-in reveals
  - `Transformations.tsx` — lightweight GSAP+Lenis snap slider with kinetic quote emphasis
  - `Pricing.tsx` — 3 tiers, middle elevated, staggered rise-in
  - `Schedule.tsx` — restrained weekly table
  - `Location.tsx` — address/hours + parallax bg image
  - `Footer.tsx` — closing CTA + footer, no heavy motion
- `src/routes/index.tsx` — replace with new composition

### Hero technical notes
- Canvas 2D, `frames[]` preloaded from placeholder URLs (Unsplash barbell shots as stand-ins — 30 frames array; documented so real frames swap in later)
- `gsap.to(state, { frame: last, snap: 'value', ease: 'none', scrollTrigger: { trigger, start: 'top top', end: '+=400%', pin: true, scrub: true, invalidateOnRefresh: true }, onUpdate: render })`
- SplitType chars staggered on mount (`toggleActions: play none none none`), separate scroll-tied timeline moves secondary word line per "plate"
- CTA fades in via timeline label after scrub completes (separate ScrollTrigger at end position)
- `ScrollTrigger.matchMedia` → mobile: no pin, static hero image, headline reveal only

### Global rules enforced
- All one-shot reveals: `toggleActions: 'play none none none'` + `once: true`
- Scrub motion: transform/opacity only
- `ScrollTrigger.refresh()` on `window load`
- Cleanup all triggers + Lenis on unmount
- One `Reveal` helper for line/word reveals to keep consistency

### Delivery
Ship all 11 sections in one pass. If output length forces a split, finish current section fully before pausing and continue next message.

Approve to build.