import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MapPin, ArrowRight } from "lucide-react";

function LiveCount() {
  const [live, setLive] = useState(47);
  useEffect(() => {
    const t = setInterval(() => {
      setLive((v) => Math.max(30, Math.min(72, v + (Math.random() > 0.5 ? 1 : -1))));
    }, 10000);
    return () => clearInterval(t);
  }, []);
  return <>{live} training right now · 4.9★ on Google</>;
}

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);


  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const q = (sel: string) => root.querySelectorAll(sel);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Initial state (managed by GSAP, not JSX inline styles)
    gsap.set(q(".hero-line-inner"), { yPercent: reduced ? 0 : 100 });
    gsap.set(q(".hero-fade"), { opacity: reduced ? 1 : 0, y: reduced ? 0 : 10 });
    gsap.set(q(".hero-bar"), { scaleY: reduced ? 0 : 1, transformOrigin: "bottom" });

    if (reduced) {
      gsap.set(q(".map-india, .map-mh"), { autoAlpha: 0 });
      gsap.set(q(".map-city"), { autoAlpha: 1, scale: 1 });
      return;
    }


    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.set(q(".map-india"), { autoAlpha: 1, scale: 1 })
      .set(q(".map-mh"), { autoAlpha: 0, scale: 0.8 })
      .set(q(".map-city"), { autoAlpha: 0, scale: 0.8 })
      .to(q(".map-india"), { scale: 1.4, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, 0.4)
      .to(q(".map-mh"), { scale: 1, autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.4)
      .to(q(".map-mh"), { scale: 1.5, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 1.0)
      .to(q(".map-city"), { scale: 1, autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 1.0)
      .from(q(".map-pin"), { y: -40, autoAlpha: 0, duration: 0.5, ease: "back.out(2)" }, 1.3)
      .to(
        q(".hero-bar"),
        { scaleY: 0, duration: 0.7, stagger: 0.06, transformOrigin: "bottom", ease: "power3.inOut" },
        1.6,
      )
      .fromTo(
        q(".hero-line-inner"),
        { yPercent: 100 },
        { yPercent: 0, duration: 0.9, stagger: 0.12, ease: "power4.out" },
        1.9,
      )

      .to(q(".hero-fade"), { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" }, 2.6);

    return () => {
      tl.kill();
    };
  }, []);


  const skip = () => tlRef.current?.progress(1);

  return (
    <section
      ref={rootRef}
      onClick={skip}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Map layers */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="map-india absolute h-[70vh] w-[70vh] opacity-0">
          <path
            d="M120,60 L200,50 L280,80 L320,150 L300,240 L250,320 L180,340 L120,300 L90,220 L100,140 Z"
            fill="none"
            stroke="#888"
            strokeWidth="1.2"
          />
        </svg>
        <svg viewBox="0 0 400 400" className="map-mh absolute h-[70vh] w-[70vh] opacity-0">
          <path
            d="M80,180 L160,140 L240,150 L310,190 L320,240 L280,290 L200,300 L130,280 L80,240 Z"
            fill="none"
            stroke="#b8b8b8"
            strokeWidth="1.5"
          />
          <text x="200" y="220" textAnchor="middle" fill="#888" fontSize="10" fontFamily="Inter">
            MAHARASHTRA
          </text>
        </svg>
        <div className="map-city absolute flex flex-col items-center opacity-0">
          <div className="relative">
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 60,
                height: 60,
                border: "1px solid var(--burgundy-bright)",
                animation: "redfit-ping 1.2s ease-out infinite",
              }}
            />
            <MapPin className="map-pin relative" size={44} color="var(--burgundy-bright)" fill="var(--burgundy-bright)" />
          </div>
          <div className="mt-4 text-xs tracking-[0.3em] text-grey-muted">
            CHHATRAPATI SAMBHAJINAGAR
          </div>
        </div>
      </div>

      {/* Bars */}
      <div className="pointer-events-none absolute inset-0 flex">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="hero-bar h-full flex-1"
            style={{ background: i % 2 === 0 ? "#000" : "#0a0a0a" }}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16">
        <div className="max-w-5xl">
          <h1 className="font-display leading-[0.9]">
            <div className="overflow-hidden">
              <div
                className="hero-line-inner text-white"
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "clamp(64px, 14vw, 180px)",
                  letterSpacing: "2px",
                }}
              >
                RED
              </div>
            </div>
            <div className="overflow-hidden">
              <div
                className="hero-line-inner"
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "clamp(64px, 14vw, 180px)",
                  letterSpacing: "2px",
                  color: "var(--burgundy-bright)",
                }}
              >
                FIT
              </div>
            </div>
          </h1>

          <p className="hero-fade mt-6 text-xs md:text-sm uppercase tracking-[0.2em] text-grey-text">
            Premium strength training · Chhatrapati Sambhajinagar
          </p>

          <div className="hero-fade mt-10 flex flex-wrap gap-3">
            <a
              href="#contact"
              data-cursor="primary"
              className="sharp inline-flex items-center gap-2 bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-all hover:-translate-y-0.5 hover:border-burgundy-bright"
              style={{ border: "1px solid transparent" }}
            >
              Start Free Trial <ArrowRight size={14} />
            </a>
            <a
              href="#programs"
              className="sharp inline-flex items-center gap-2 border border-grey-border bg-transparent px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:border-white"
            >
              View Programs
            </a>
          </div>
        </div>

        {/* Live pulse */}
        <div className="hero-fade absolute bottom-8 left-6 flex items-center gap-3 md:left-16">

          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full"
              style={{
                background: "var(--burgundy-bright)",
                animation: "redfit-ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
              }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--burgundy-bright)" }} />
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-grey-text">
            <LiveCount />
          </span>

        </div>
      </div>

      <style>{`
        @keyframes redfit-ping {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
