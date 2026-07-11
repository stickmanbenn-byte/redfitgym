import { useEffect, useState } from "react";
import GlassSurface from "./GlassSurface";

export function Nav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  const links = [
    { href: "#programs", label: "Programs" },
    { href: "#trainers", label: "Trainers" },
    { href: "#pricing", label: "Membership" },
    { href: "#schedule", label: "Schedule" },
    { href: "#visit", label: "Visit" },
  ];
  return (
    <>
      <header className="rf-nav-glass">
        <div className="rf-nav-glass-inner">
          {/* Left wide pill: brand + links */}
          <GlassSurface
            height={64}
            width="auto"
            borderRadius={40}
            backgroundOpacity={0.4}
            saturation={1.8}
            distortionScale={-140}
            redOffset={5}
            greenOffset={10}
            blueOffset={18}
            className="rf-glass-pill rf-glass-pill--main"
          >
            <div className="rf-glass-pill-row">
              <a href="#top" className="rf-brand rf-glass-brand">
                RED<span>FIT</span>
              </a>
              <nav className="rf-nav-links rf-glass-links">
                {links.map((l) => (
                  <a key={l.href} href={l.href}>{l.label}</a>
                ))}
              </nav>
            </div>
          </GlassSurface>

          {/* Right small pill: CTA */}
          <GlassSurface
            height={64}
            width="auto"
            borderRadius={40}
            backgroundOpacity={0.4}
            saturation={1.8}
            distortionScale={-140}
            redOffset={5}
            greenOffset={10}
            blueOffset={18}
            className="rf-glass-pill rf-glass-pill--cta"
          >
            <a href="#pricing" className="rf-glass-cta">
              Book Trial
            </a>
          </GlassSurface>

          {/* Mobile menu toggle (glass) */}
          <GlassSurface
            height={56}
            width={56}
            borderRadius={40}
            backgroundOpacity={0.4}
            saturation={1.8}
            distortionScale={-140}
            redOffset={5}
            greenOffset={10}
            blueOffset={18}
            className="rf-glass-pill rf-glass-pill--menu"
          >
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rf-glass-menu-btn"
            >
              <span /><span /><span />
            </button>
          </GlassSurface>
        </div>
      </header>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "#0a0a0a",
            display: "flex", flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", padding: "22px 24px", alignItems: "center" }}>
            <span className="rf-brand">RED<span>FIT</span></span>
            <button onClick={() => setOpen(false)} style={{ background: "transparent", border: 0, color: "#fff", letterSpacing: "0.2em" }}>CLOSE</button>
          </div>
          <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px", gap: 20 }}>
            {links.map((l, i) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                 style={{
                   fontFamily: "var(--rf-display)", fontSize: 40, color: "#fff",
                   textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.02em",
                   animation: `rfMenuIn 500ms cubic-bezier(0.4,0,0.2,1) ${i * 60}ms both`,
                 }}>
                {l.label}
              </a>
            ))}
          </nav>
          <style>{`@keyframes rfMenuIn { from { opacity: 0; transform: translateY(20px);} to { opacity:1; transform: translateY(0);} }`}</style>
        </div>
      )}
    </>
  );
}
