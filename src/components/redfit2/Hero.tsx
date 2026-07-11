import { useEffect, useRef, useState } from "react";
import SplitType from "split-type";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap-init";
import SideRays from "@/components/SideRays";
import { BARBELL_FRAMES } from "@/assets/barbell/frames";

function LiveCount() {
  const [n, setN] = useState(47);
  useEffect(() => {
    const id = setInterval(() => setN((v) => Math.max(30, Math.min(78, v + (Math.random() > 0.5 ? 1 : -1)))), 8000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <b>{n}</b> Training now · 4.9★ on Google
    </>
  );
}

// ── Single source of truth for hero scroll distance (BUG 2 + ENHANCE 1) ──
const HERO_SCROLL_LENGTH = "+=200%";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initGsap();
    if (!rootRef.current || !canvasRef.current) return;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = { frame: 0 };
    const TOTAL = 1;
    const N = BARBELL_FRAMES.length;

    // Preload frames — progressive; render whichever is currently needed as it arrives
    const images: (HTMLImageElement | null)[] = new Array(N).fill(null);
    let loadedCount = 0;
    BARBELL_FRAMES.forEach((src, i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        images[i] = img;
        loadedCount++;
        // Re-render if the frame we just got is close to current
        const targetIdx = Math.min(N - 1, Math.round((state.frame / TOTAL) * (N - 1)));
        if (i === targetIdx) render();
      };
      img.src = src;
    });

    // Draw the frame nearest to state.frame using object-fit: cover math
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      // Keep canvas transparent so the plate can float above the hero text.
      ctx.clearRect(0, 0, w, h);


      const p = Math.max(0, Math.min(1, state.frame / TOTAL));
      let idx = Math.min(N - 1, Math.round(p * (N - 1)));
      // Fall back to nearest loaded frame if current not ready yet
      let img = images[idx];
      if (!img) {
        for (let d = 1; d < N && !img; d++) {
          img = images[Math.max(0, idx - d)] || images[Math.min(N - 1, idx + d)] || null;
        }
      }
      if (!img) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      // Use "contain" math so the plate keeps its aspect ratio and never stretches.
      const scale = Math.min(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    // Resize handler — re-set canvas dimensions to the current DPR and re-render
    // the current frame so the placeholder doesn't stretch/crop.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    };
    resize();

    // BUG 3 FIX: rAF-throttled resize to prevent jank on mobile address-bar toggle
    let ticking = false;
    const onResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { resize(); ticking = false; });
    };
    window.addEventListener("resize", onResize);

    // BUG 1 FIX: Split only the static lines, exclude .rf-swap-word-holder entirely
    const staticLines = root.querySelectorAll<HTMLElement>(".rf-hero-line:not(:has(.rf-swap-word-holder))");
    let split: SplitType | null = null;
    if (staticLines.length) {
      split = new SplitType(staticLines, { types: "words,chars" });
      gsap.set(split.chars, { yPercent: 110, opacity: 0 });
    }

    // Hide swap-word-holder initially for block entrance animation
    const swapHolder = root.querySelector<HTMLElement>(".rf-swap-word-holder");
    if (swapHolder) {
      gsap.set(swapHolder, { yPercent: 100, opacity: 0 });
    }

    // Initialize word swap stack — only first word visible, others below and hidden
    const allWords = root.querySelectorAll<HTMLElement>(".rf-hero-headline .rf-swap-word");
    gsap.set(allWords, {
      opacity: (i) => (i === 0 ? 1 : 0),
      y: (i) => (i === 0 ? 0 : 24),
    });

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ENHANCE 2: track current word index for scroll-driven rotation
    let lastWordIdx = 0;

    const ctxAnim = gsap.context(() => {
      ScrollTrigger.matchMedia({
        // DESKTOP + TABLET (motion allowed) — pinned scrub sequence
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)": () => {
          const words = root.querySelectorAll<HTMLElement>(".rf-hero-headline .rf-swap-word");
          const inTl = gsap.timeline({ delay: 0.15, defaults: { ease: "power4.out" } });
          if (split?.chars?.length) {
            inTl.to(split.chars, {
              yPercent: 0,
              opacity: 1,
              stagger: 0.024,
              duration: 1.1,
            });
          }
          // BUG 1 FIX: Animate swap-word-holder as a single block (not char-split)
          if (swapHolder) {
            inTl.from(swapHolder, { yPercent: 100, opacity: 0, duration: 0.9 }, "-=0.6");
          }
          // After entrance, force only first swap word visible
          inTl.set(words, {
            opacity: (i) => (i === 0 ? 1 : 0),
            y: (i) => (i === 0 ? 0 : 24),
          });
          inTl
            .to(".rf-hero-eyebrow", { opacity: 1, y: 0, duration: 0.6 }, 0.2)
            .to(".rf-hero-counter", { opacity: 1, duration: 0.6 }, 0.4)
            .to(".rf-hero-sub", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
            .to(".rf-hero-cta-row", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
            .to(".rf-hero-scroll-hint", { opacity: 1, duration: 0.6 }, "-=0.4");


          // Pin hero for barbell animation with ENHANCE 2 scroll-driven word rotation
          gsap.to(state, {
            frame: TOTAL,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: HERO_SCROLL_LENGTH,
              pin: true,
              pinSpacing: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                render();
                // ENHANCE 2: scroll-driven word crossfade
                if (words.length > 1) {
                  const idx = Math.min(words.length - 1, Math.floor(self.progress * words.length));
                  if (idx !== lastWordIdx) {
                    const current = words[lastWordIdx];
                    const next = words[idx];
                    gsap.to(current, {
                      y: -24,
                      opacity: 0,
                      duration: 0.45,
                      ease: "power3.inOut",
                      overwrite: "auto",
                    });
                    gsap.fromTo(
                      next,
                      { y: 24, opacity: 0 },
                      { y: 0, opacity: 1, duration: 0.45, ease: "power3.inOut", overwrite: "auto" }
                    );
                    lastWordIdx = idx;
                  }
                }
              },
            },
          });


          // ENHANCE 3: Consolidated dashboard motion — one timeline, one ScrollTrigger
          const dash = root.querySelector<HTMLElement>(".rf-hero-dashboard");
          if (dash) {
            // Initial hidden state
            gsap.set(dash, {
              opacity: 0,
              x: 120,
              scale: 0.9,
              rotateY: 10,
              filter: "blur(10px)",
              transformPerspective: 900,
              transformOrigin: "center center",
            });
            // One-shot entrance (not scroll-linked)
            gsap.to(dash, {
              opacity: 1,
              x: 0,
              scale: 1,
              rotateY: 4,
              filter: "blur(0px)",
              duration: 1.4,
              ease: "power3.out",
              delay: 0.35,
            });

            // Single scroll timeline: float/drift (0–70%) then exit (70–100%)
            const dashTl = gsap.timeline({
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: HERO_SCROLL_LENGTH,
                scrub: 0.6,
              },
            });
            // Drift phase: gentle upward movement with slight rotation
            dashTl.to(dash, {
              yPercent: -10,
              rotate: 0.4,
              ease: "none",
              duration: 0.7,
            });
            // Exit phase: accelerate out, fade, blur
            dashTl.to(dash, {
              y: -80,
              opacity: 0,
              scale: 0.95,
              filter: "blur(8px)",
              ease: "power2.in",
              duration: 0.3,
            });
          }
        },


        // MOBILE (motion allowed) — lighter static hero, no pin, cycle words on timer
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)": () => {
          const words = root.querySelectorAll<HTMLElement>(".rf-hero-headline .rf-swap-word");
          const inTl = gsap.timeline({ delay: 0.1, defaults: { ease: "power3.out" } });
          if (split?.chars?.length) {
            inTl.to(split.chars, { yPercent: 0, opacity: 1, stagger: 0.02, duration: 0.9 });
          }
          // BUG 1 FIX: Block-animate swap holder on mobile too
          if (swapHolder) {
            inTl.from(swapHolder, { yPercent: 100, opacity: 0, duration: 0.7 }, "-=0.4");
          }
          // After char reveal, force only first swap word visible
          inTl.set(words, {
            opacity: (i) => (i === 0 ? 1 : 0),
            y: (i) => (i === 0 ? 0 : 24),
          });
          inTl
            .to(".rf-hero-eyebrow", { opacity: 1, y: 0, duration: 0.5 }, 0.1)
            .to(".rf-hero-sub", { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
            .to(".rf-hero-cta-row", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
            .to(".rf-hero-counter", { opacity: 1, duration: 0.5 }, "-=0.3");

          gsap.to(state, { frame: TOTAL, duration: 4, ease: "power2.inOut", onUpdate: render });

          // Mobile: keep timer-based word rotation (no scroll pin to drive it)
          if (words.length > 1) {
            let mIdx = 0;
            const mInterval = window.setInterval(() => {
              const current = words[mIdx];
              const next = words[(mIdx + 1) % words.length];
              gsap.to(current, { y: -24, opacity: 0, duration: 0.6, ease: "power3.inOut", overwrite: "auto" });
              gsap.fromTo(next, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.inOut", overwrite: "auto" });
              mIdx = (mIdx + 1) % words.length;
            }, 2500);
            // ScrollTrigger.matchMedia cleanup handles this automatically
            return () => window.clearInterval(mInterval);
          }

          // DASHBOARD — mobile fade-in only
          const dashM = root.querySelector<HTMLElement>(".rf-hero-dashboard");
          if (dashM) {
            gsap.fromTo(
              dashM,
              { opacity: 0, y: 24, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out", delay: 0.3 }
            );
          }
        },


        // REDUCED MOTION — no pin, no scrub, everything visible immediately
        "(prefers-reduced-motion: reduce)": () => {
          gsap.set(
            [
              ".rf-hero-eyebrow",
              ".rf-hero-sub",
              ".rf-hero-cta-row",
              ".rf-hero-scroll-hint",
              ".rf-hero-counter",
            ],
            { opacity: 1, y: 0 }
          );
          gsap.set(".rf-hero-dashboard", { opacity: 1, x: 0, scale: 1, rotateY: 4, filter: "none" });
          if (split?.chars) gsap.set(split.chars, { opacity: 1, yPercent: 0 });
          if (swapHolder) gsap.set(swapHolder, { opacity: 1, yPercent: 0 });
          const words = root.querySelectorAll<HTMLElement>(".rf-hero-headline .rf-swap-word");
          gsap.set(words, { opacity: (i) => (i === 0 ? 1 : 0), y: (i) => (i === 0 ? 0 : 24) });
          state.frame = TOTAL;
          render();
        },
      });
    }, root);

    // Refresh on window load (late images) AND on fonts ready (SplitType char
    // widths shift once the display font swaps in).
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    if (typeof document !== "undefined" && (document as any).fonts?.ready) {
      (document as any).fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
      split?.revert();
      ctxAnim.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="rf-hero" aria-label="REDFIT hero">
      <canvas ref={canvasRef} className="rf-hero-canvas" />
      <div className="rf-hero-rays">
        <SideRays
          rayColor1="#8B0000"
          rayColor2="#B01030"
          origin="top-right"
          speed={2.5}
          intensity={2}
          spread={1.7}
          tilt={1}
          saturation={1.55}
          blend={1}
          falloff={4}
          opacity={1}
        />
      </div>
      <div className="rf-hero-vignette" />

      <div className="rf-hero-counter">
        <LiveCount />
      </div>

      <div className="rf-hero-content">
        <div className="rf-hero-eyebrow" style={{ transform: "translateY(10px)" }}>
          Chhatrapati Sambhajinagar · Est. Strength
        </div>

        <h1 className="rf-hero-headline">
          <span className="rf-hero-line">Built</span>
          <span className="rf-hero-line accent">Under</span>
          <span className="rf-hero-line">
            <span className="rf-swap-word-holder">
              <span className="rf-swap-word-ghost" aria-hidden="true">Discipline</span>
              <span className="rf-swap-word">Iron</span>
              <span className="rf-swap-word">Discipline</span>
              <span className="rf-swap-word">Pressure</span>
              <span className="rf-swap-word">Grit</span>
              <span className="rf-swap-word">Power</span>
              <span className="rf-swap-word">Strength</span>
            </span>
          </span>
        </h1>


        <p className="rf-hero-sub" style={{ transform: "translateY(10px)" }}>
          Forged to last. A premium strength gym engineered around real training — Red Strength equipment,
          certified coaches, and a room that respects the work.
        </p>

        <div className="rf-hero-cta-row" style={{ transform: "translateY(10px)" }}>
          <a href="#pricing" className="rf-btn accent">Start Free Trial →</a>
          <a href="#programs" className="rf-btn ghost">See Programs</a>
        </div>
      </div>
      <div className="rf-hero-scroll-hint">Scroll · Load the Bar</div>
    </section>
  );
}
