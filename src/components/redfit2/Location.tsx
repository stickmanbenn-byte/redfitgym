import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap-init";
import { SectionHeader } from "./Reveal";
import BlurText from "./BlurText";

export function Location() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    initGsap();
    if (!ref.current) return;
    const bg = ref.current.querySelector<HTMLElement>(".rf-loc-bg");
    if (!bg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = ScrollTrigger.create({
      trigger: ref.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => gsap.set(bg, { y: (self.progress - 0.5) * 120 }),
    });
    return () => t.kill();
  }, []);
  return (
    <section ref={ref} id="visit" className="rf-section rf-location">
      <div className="rf-loc-bg" />
      <div className="rf-container">
        <SectionHeader index="08" label="Visit" />
        <BlurText as="h2" className="rf-display" style={{ fontSize: "clamp(40px, 6vw, 90px)", marginBottom: 64, maxWidth: 900 }} delay={90}>
          Come <span className="rf-accent">train with us</span>.
        </BlurText>
        <div className="rf-loc-grid">
          <div className="rf-loc-item" data-reveal>
            <h4>Address</h4>
            <p>
              REDFIT Strength Club<br />
              Beed Bypass Road, near N-2<br />
              Chhatrapati Sambhajinagar, MH 431003
            </p>
            <h4 style={{ marginTop: 32 }}>Hours</h4>
            <p>Mon–Sat · 5:00 AM — 11:00 PM<br />Sun · 6:00 AM — 2:00 PM</p>
          </div>
          <div className="rf-loc-item" data-reveal>
            <h4>Contact</h4>
            <p>
              <a href="tel:+919999999999">+91 99999 99999</a><br />
              <a href="mailto:hello@redfit360.com">hello@redfit360.com</a>
            </p>
            <h4 style={{ marginTop: 32 }}>Follow</h4>
            <p>
              <a href="#" target="_blank" rel="noreferrer">Instagram · @redfit360</a><br />
              <a href="#" target="_blank" rel="noreferrer">YouTube · REDFIT</a>
            </p>
            <div style={{ marginTop: 40 }}>
              <a href="#pricing" className="rf-btn accent">Book Free Trial →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
