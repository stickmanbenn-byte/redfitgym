import { useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap-init";

export function useReveal() {
  useEffect(() => {
    initGsap();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }
    const els = gsap.utils.toArray<HTMLElement>("[data-reveal]:not([data-revealed])");
    const triggers: ScrollTrigger[] = [];
    els.forEach((el) => {
      el.dataset.revealed = "1";
      gsap.set(el, { opacity: 0, y: 40, willChange: "transform, opacity" });
      const t = ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () =>
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            onComplete: () => { el.style.willChange = "auto"; },
          }),
      });
      triggers.push(t);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);
}

export function Reveal({ children, className, style, as: Tag = "div" }: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}) {
  const Component = Tag as React.ElementType;
  return (
    <Component data-reveal className={className} style={style}>
      {children}
    </Component>
  );
}

export function SectionHeader({ index, label }: { index: string; label: string }) {
  return (
    <div className="rf-section-header" data-reveal>
      <span className="rf-eyebrow rf-accent">{index}</span>
      <span className="line" />
      <span className="rf-eyebrow">{label}</span>
    </div>
  );
}
