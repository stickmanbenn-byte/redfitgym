import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap-init";
import { SectionHeader } from "./Reveal";
import BlurText from "./BlurText";

const TIERS = [
  {
    name: "Basic",
    price: "1,999",
    per: "/ month",
    features: ["Full floor access", "Locker + shower", "Open gym hours", "Community events"],
    featured: false,
  },
  {
    name: "Pro",
    price: "3,499",
    per: "/ month",
    features: [
      "Everything in Basic",
      "All group classes (HIIT, Hyrox, Zumba, Yoga)",
      "Monthly form check with coach",
      "Recovery room access",
      "Guest passes · 2 / month",
    ],
    featured: true,
  },
  {
    name: "Elite",
    price: "6,999",
    per: "/ month",
    features: [
      "Everything in Pro",
      "Weekly 1:1 coaching",
      "Custom programming + tracking",
      "Nutrition consult · quarterly",
      "Priority booking",
    ],
    featured: false,
  },
];

export function Pricing() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    initGsap();
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll<HTMLElement>(".rf-price-card");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    gsap.set(cards, { opacity: 0, y: 60 });
    const bt = ScrollTrigger.batch(cards, {
      start: "top 85%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out" }),
    });
    return () => bt.forEach((t) => t.kill());
  }, []);
  return (
    <section ref={ref} id="pricing" className="rf-section rf-pricing">
      <div className="rf-container">
        <SectionHeader index="06" label="Membership" />
        <BlurText as="h2" className="rf-display" style={{ fontSize: "clamp(36px, 5vw, 72px)", marginBottom: 48, maxWidth: 900 }} delay={80}>
          Pick the tier. <span className="rf-accent">Show up.</span>
        </BlurText>
        <div className="rf-price-grid">
          {TIERS.map((t) => (
            <article key={t.name} className={`rf-price-card ${t.featured ? "featured" : ""}`}>
              <div className="rf-price-tier">{t.name}</div>
              <div className="rf-price-amt">
                ₹{t.price}
                <small>{t.per}</small>
              </div>
              <ul className="rf-price-list">
                {t.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <a href="#visit" className={`rf-btn ${t.featured ? "accent" : "ghost"}`}>
                {t.featured ? "Start Pro" : "Choose"} →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
