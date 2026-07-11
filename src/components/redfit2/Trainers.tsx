import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap-init";
import { SectionHeader } from "./Reveal";
import BlurText from "./BlurText";
import ethanAsset from "@/assets/ethan.jpg.asset.json";
import masonAsset from "@/assets/mason.jpg.asset.json";
import noahAsset from "@/assets/noah.jpg.asset.json";
import oliviaAsset from "@/assets/olivia.jpg.asset.json";
import emmaAsset from "@/assets/emma.jpg.asset.json";

const TRAINERS = [
  { name: "Ethan Walker", spec: "Head Coach · Strength", img: ethanAsset.url },
  { name: "Mason Carter", spec: "Barbell · Olympic Lifts", img: masonAsset.url },
  { name: "Noah Bennett", spec: "Hyrox · Conditioning", img: noahAsset.url },
  { name: "Olivia Brooks", spec: "Women's Floor · Powerlifting", img: oliviaAsset.url },
  { name: "Emma Collins", spec: "Mobility · Recovery", img: emmaAsset.url },
];

export function Trainers() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    initGsap();
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll<HTMLElement>(".rf-trainer-card");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const triggers: ScrollTrigger[] = [];
    cards.forEach((card, i) => {
      const bg = card.querySelector<HTMLElement>(".rf-trainer-bg");
      if (!bg) return;
      const speed = 20 + (i % 3) * 15;
      triggers.push(
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(bg, { y: (self.progress - 0.5) * speed });
          },
        }),
      );
    });
    // reveal cards
    gsap.set(cards, { opacity: 0, y: 40 });
    const batchTriggers = ScrollTrigger.batch(cards, {
      start: "top 90%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }),
    });
    return () => {
      triggers.forEach((t) => t.kill());
      batchTriggers.forEach((t) => t.kill());
    };
  }, []);
  return (
    <section ref={ref} id="trainers" className="rf-section rf-trainers">
      <div className="rf-container">
        <SectionHeader index="03" label="Coaches" />
        <BlurText as="h2" className="rf-display" style={{ fontSize: "clamp(36px, 5vw, 72px)", marginBottom: 32, maxWidth: 900 }} delay={70}>
          The people who <span className="rf-accent">put you under the bar</span>.
        </BlurText>
      </div>
      <div className="rf-trainers-scroll">
        {TRAINERS.map((t) => (
          <article key={t.name} className="rf-trainer-card">
            <div className="rf-trainer-bg" style={{ backgroundImage: `url(${t.img})` }} />
            <div className="rf-trainer-info">
              <div className="name">{t.name}</div>
              <div className="spec">{t.spec}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
