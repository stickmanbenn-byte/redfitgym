import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap-init";
import GlassSurface from "./GlassSurface";

// Block 3: DRY GlassSurface defaults
const GLASS_DEFAULTS = {
  height: 64,
  borderRadius: 50,
  backgroundOpacity: 0.4,
  saturation: 1.4,
  distortionScale: -180,
  redOffset: 0,
  greenOffset: 10,
  blueOffset: 20,
};

export function Nav() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "#programs", label: "Programs", section: "programs" },
    { href: "#trainers", label: "Trainers", section: "trainers" },
    { href: "#pricing", label: "Membership", section: "pricing" },
    { href: "#schedule", label: "Schedule", section: "schedule" },
    { href: "#visit", label: "Visit", section: "visit" },
  ];

  // Bug 4: Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Bug 4: Escape to close + focus trap
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    }, 100);

    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Block 3: Scroll-aware nav condensing
  useEffect(() => {
    initGsap();
    if (!navRef.current) return;

    const pills = navRef.current.querySelectorAll<HTMLElement>(
      ".rf-glass-pill, .rf-glass-pill--main, .rf-glass-pill--cta, .rf-glass-pill--menu"
    );

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "40px top",
      end: "max",
      onEnter: () => {
        gsap.to(pills, { height: 52, duration: 0.3, ease: "power3.out" });
      },
      onLeaveBack: () => {
        gsap.to(pills, { height: 64, duration: 0.3, ease: "power3.out" });
      },
    });

    return () => st.kill();
  }, []);

  // Block 3: Active section indicator via IntersectionObserver
  useEffect(() => {
    const sectionIds = new Set(links.map((l) => l.section));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sectionIds.has(entry.target.id)) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    // Observe after a tick to ensure DOM is ready
    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>("section[id], div[id]").forEach((s) => {
        if (sectionIds.has(s.id)) observer.observe(s);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Block 3: Skip-to-content link */}
      <a href="#main-content" className="rf-skip-link">
        Skip to content
      </a>

      <nav ref={navRef} className="rf-nav-glass" aria-label="Main navigation">
        <div className="rf-nav-glass-inner">
          {/* Left wide pill: brand + links */}
          <GlassSurface
            {...GLASS_DEFAULTS}
            width="100%"
            className="rf-glass-pill rf-glass-pill--main"
          >
            <div className="rf-glass-pill-row">
              <a href="#" className="rf-glass-brand">
                RED<span>FIT</span>
              </a>
              <div className="rf-glass-links">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className={activeSection === l.section ? "rf-nav-active" : ""}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </GlassSurface>

          {/* Right small pill: CTA */}
          <GlassSurface
            {...GLASS_DEFAULTS}
            width={160}
            className="rf-glass-pill rf-glass-pill--cta"
          >
            <a href="#pricing" className="rf-glass-cta">
              Book Trial
            </a>
          </GlassSurface>

          {/* Mobile menu toggle (glass) */}
          <GlassSurface
            {...GLASS_DEFAULTS}
            width={64}
            className="rf-glass-pill rf-glass-pill--menu"
          >
            <button
              ref={hamburgerRef}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="rf-glass-menu-btn"
            >
              <span />
              <span />
            </button>
          </GlassSurface>
        </div>
      </nav>

      {open && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(10,10,10,0.97)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
              hamburgerRef.current?.focus();
            }
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              right: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="rf-glass-brand">
              RED<span>FIT</span>
            </span>
            <button
              onClick={() => {
                setOpen(false);
                hamburgerRef.current?.focus();
              }}
              style={{
                background: "transparent",
                border: 0,
                color: "#fff",
                letterSpacing: "0.2em",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              CLOSE
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  fontFamily: "var(--rf-display)",
                  fontSize: 40,
                  color: "#fff",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  marginBottom: 16,
                  animation: `rfMenuIn 500ms cubic-bezier(0.4,0,0.2,1) ${i * 60}ms both`,
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <style>{`@keyframes rfMenuIn { from { opacity: 0; transform: translateY(20px);} to { opacity:1; transform: translateY(0);}}`}</style>
        </div>
      )}
    </>
  );
}
