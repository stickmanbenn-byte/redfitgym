import { useEffect, useRef, useState } from "react";
import SplitType from "split-type";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap-init";
import SideRays from "@/components/SideRays";
import { BARBELL_FRAMES } from "@/assets/barbell/frames";

function LiveCount() {
  const [n, setN] = useState(47);
  useEffect(() => {
    const id = setInterval(
      () => setN((v) => Math.max(30, Math.min(78, v + (Math.random() > 0.5 ? 1 : -1)))),
      8000
    );
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <b>{n}</b> Training now \u00b7 4.9\u2605 on Google
    </>
  );
}

// Single source of truth for hero scroll distance
export const HERO_SCROLL_LENGTH = "+=200%";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Block 4: cursor-reactive ray offsets
  const [rayOffsetX, setRayOffsetX] = useState(0);
  const [rayOffsetY, setRayOffsetY] = useState(0);
  const quickX = useRef<((v: number) => void) | null>(null);
  const quickY = useRef<((v: number) => void) | null>(null);
  const offsetState = useRef({ x: 0, y: 0 });

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

    // Preload frames with progress dispatch for preloader
    const images: (HTMLImageElement | null)[] = new Array(N).fill(null);
    let loadedCount = 0;
    BARBELL_FRAMES.forEach((src, i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        images[i] = img;
        loadedCount++;
        // Dispatch progress for preloader
        window.dispatchEvent(
          new CustomEvent("rf-frame-progress", { detail: { loaded: loadedCount, total: N } })
        );
        const targetIdx = Math.min(N - 1, Math.round((state.frame / TOTAL) * (N - 1)));
        if (i === targetIdx) render();
      };
      img.src = src;
    });

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const p = Math.max(0, Math.min(1, state.frame / TOTAL));
      let idx = Math.min(N - 1, Math.round(p * (N - 1)));
      let img = images[idx];
      if (!img) {
        for (let d = 1; d < N && !img; d++) {
          img = images[Math.max(0, idx - d)] || images[Math.min(N - 1, idx + d)] || null;
        }
      }
      if (!img) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.min(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    };
    resize();

    // BUG 3: rAF-throttled resize
    let ticking = false;
    const onResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        resize();
        ticking = false;
      });
    };
    window.addEventListener("resize", onResize);

    // BUG 1: Split only static lines
    const staticLines = root.querySelectorAll<HTMLElement>(
      ".rf-hero-line:not(:has(.rf-swap-word-holder))"
    );
    let split: SplitType | null = null;
    if (staticLines.length) {
      split = new SplitType(staticLines, { types: "words,chars" });
      gsap.set(split.chars, { yPercent: 110, opacity: 0 });
    }

    const swapHolder = root.querySelector<HTMLElement>(".rf-swap-word-holder");
    if (swapHolder) {
      gsap.set(swapHolder, { yPercent: 100, opacity: 0 });
    }

    const allWords = root.querySelectorAll<HTMLElement>(".rf-hero-headline .rf-swap-word");
    gsap.set(allWords, {
      opacity: (i) => (i === 0 ? 1 : 0),
      y: (i) => (i === 0 ? 0 : 24),
    });

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lastWordIdx = 0;

    // Block 4: Cursor-reactive rays via gsap.quickTo
    quickX.current = gsap.quickTo(offsetState.current, "x", { duration: 0.6, ease: "power3" });
    quickY.current = gsap.quickTo(offsetState.current, "y", { duration: 0.6, ease: "power3" });

    const handleMouse = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      quickX.current?.(nx * 0.08); // max \u00b18% shift
      quickY.current?.(ny * 0.08);
    };

    // Update React state from offset object via ticker
    const tickerCb = () => {
      setRayOffsetX(offsetState.current.x);
      setRayOffsetY(offsetState.current.y);
    };
    gsap.ticker.add(tickerCb);

    if (!reduceMotion) {
      root.addEventListener("mousemove", handleMouse);
    }

    const ctxAnim = gsap.context(() => {
      ScrollTrigger.matchMedia({
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
          if (swapHolder) {
            inTl.from(swapHolder, { yPercent: 100, opacity: 0, duration: 0.9 }, "-=0.6");
          }
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

          // Pin with scroll-driven word rotation
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
                if (words.length > 1) {
                  const idx = Math.min(
                    words.length - 1,
                    Math.floor(self.progress * words.length)
                  );
                  if (idx !== lastWordIdx) {
                    gsap.to(words[lastWordIdx], {
                      y: -24,
                      opacity: 0,
                      duration: 0.45,
                      ease: "power3.inOut",
                      overwrite: "auto",
                    });
                    gsap.fromTo(
                      words[idx],
                      { y: 24, opacity: 0 },
                      { y: 0, opacity: 1, duration: 0.45, ease: "power3.inOut", overwrite: "auto" }
                    );
                    lastWordIdx = idx;
                  }
                }
              },
            },
          });

          // Consolidated dashboard timeline
          const dash = root.querySelector<HTMLElement>(".rf-hero-dashboard");
          if (dash) {
            gsap.set(dash, {
              opacity: 0,
              x: 120,
              scale: 0.9,
              rotateY: 10,
              filter: "blur(10px)",
              transformPerspective: 900,
              transformOrigin: "center center",
            });
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
            const dashTl = gsap.timeline({
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: HERO_SCROLL_LENGTH,
                scrub: 0.6,
              },
            });
            dashTl.to(dash, { yPercent: -10, rotate: 0.4, ease: "none", duration: 0.7 });
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

        "(max-width: 767px) and (prefers-reduced-motion: no-preference)": () => {
          const words = root.querySelectorAll<HTMLElement>(".rf-hero-headline .rf-swap-word");
          const inTl = gsap.timeline({ delay: 0.1, defaults: { ease: "power3.out" } });
          if (split?.chars?.length) {
            inTl.to(split.chars, { yPercent: 0, opacity: 1, stagger: 0.02, duration: 0.9 });
          }
          if (swapHolder) {
            inTl.from(swapHolder, { yPercent: 100, opacity: 0, duration: 0.7 }, "-=0.4");
          }
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

          // Mobile: timer-based word rotation fallback
          if (words.length > 1) {
            let mIdx = 0;
            const mInterval = window.setInterval(() => {
              const current = words[mIdx];
              const next = words[(mIdx + 1) % words.length];
              gsap.to(current, { y: -24, opacity: 0, duration: 0.6, ease: "power3.inOut", overwrite: "auto" });
              gsap.fromTo(next, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.inOut", overwrite: "auto" });
              mIdx = (mIdx + 1) % words.length;
            }, 2500);
            return () => window.clearInterval(mInterval);
          }

          const dashM = root.querySelector<HTMLElement>(".rf-hero-dashboard");
          if (dashM) {
            gsap.fromTo(
              dashM,
              { opacity: 0, y: 24, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out", delay: 0.3 }
            );
          }
        },

        "(prefers-reduced-motion: reduce)": () => {
          gsap.set(
            [".rf-hero-eyebrow", ".rf-hero-sub", ".rf-hero-cta-row", ".rf-hero-scroll-hint", ".rf-hero-counter"],
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

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    if (typeof document !== "undefined" && (document as any).fonts?.ready) {
      (document as any).fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
      root.removeEventListener("mousemove", handleMouse);
      gsap.ticker.remove(tickerCb);
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
          originOffsetX={rayOffsetX}
          originOffsetY={rayOffsetY}
        />
      </div>
      <div className="rf-hero-vignette" />

      {/* Block 4: Grain overlay */}
      <svg className="rf-hero-grain" aria-hidden="true">
        <filter id="rf-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#rf-grain)" />
      </svg>

      <div className="rf-hero-counter">
        <LiveCount />
      </div>

      <div className="rf-hero-content">
        <div className="rf-hero-eyebrow" style={{ transform: "translateY(10px)" }}>
          Chhatrapati Sambhajinagar \u00b7 Est. Strength
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
          Forged to last. A premium strength gym engineered around real training \u2014 Red Strength equipment,
          certified coaches, and a room that respects the work.
        </p>

        <div className="rf-hero-cta-row" style={{ transform: "translateY(10px)" }}>
          <a href="#pricing" className="rf-btn accent">Start Free Trial \u2192</a>
          <a href="#programs" className="rf-btn ghost">See Programs</a>
        </div>
      </div>
      <div className="rf-hero-scroll-hint">Scroll \u00b7 Load the Bar</div>
    </section>
  );
}
