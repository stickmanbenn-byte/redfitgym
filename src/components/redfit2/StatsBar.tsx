import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap-init";

const STATS = [
  { end: 2400, suffix: "+", label: "Members Trained" },
  { end: 8, suffix: "yr", label: "Years Running" },
  { end: 92, suffix: "%", label: "Avg. Transformation" },
  { end: 14, suffix: "", label: "Certified Trainers" },
];

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    initGsap();
    if (!ref.current) return;
    const nums = ref.current.querySelectorAll<HTMLElement>(".rf-stat-num .val");
    const triggers: ScrollTrigger[] = [];
    nums.forEach((el, i) => {
      const end = STATS[i].end;
      const state = { v: 0 };
      const t = ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(state, {
            v: end,
            duration: 2,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = Math.floor(state.v).toLocaleString();
            },
          });
        },
      });
      triggers.push(t);
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);
  return (
    <section ref={ref} className="rf-stats">
      <div className="rf-container">
        <div className="rf-stats-grid">
          {STATS.map((s) => (
            <div key={s.label} className="rf-stat">
              <div className="rf-stat-num">
                <span className="val">0</span>
                <span className="suffix">{s.suffix}</span>
              </div>
              <div className="rf-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
