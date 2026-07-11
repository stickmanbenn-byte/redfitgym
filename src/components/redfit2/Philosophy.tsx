import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap-init";
import { SectionHeader } from "./Reveal";

export function Philosophy() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    initGsap();
    if (!ref.current) return;
    const root = ref.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const headline = root.querySelector<HTMLElement>(".rf-phil-headline");
    const bodyEls = root.querySelectorAll<HTMLElement>(".rf-phil-body p");

    let splitHead: SplitType | null = null;
    const splitBodies: SplitType[] = [];

    if (headline) splitHead = new SplitType(headline, { types: "words" });
    bodyEls.forEach((p) => splitBodies.push(new SplitType(p, { types: "words" })));

    const headWords = splitHead?.words ?? [];
    const bodyWords: HTMLElement[] = [];
    splitBodies.forEach((s) => s.words?.forEach((w) => bodyWords.push(w as HTMLElement)));

    if (reduced) {
      gsap.set([...headWords, ...bodyWords], { opacity: 1, filter: "blur(0px)" });
      return;
    }

    gsap.set(headWords, { opacity: 0.05, filter: "blur(12px)" });
    gsap.set(bodyWords, { opacity: 0.08, filter: "blur(8px)" });

    const triggers: ScrollTrigger[] = [];

    // Pinned scrub timeline: reveal headline → reveal body → hold
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=3200",
        scrub: 1.8,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    if (headWords.length) {
      tl.to(
        headWords,
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: { each: 1, from: "start" },
          duration: 1,
        },
        0,
      );
    }

    if (bodyWords.length) {
      tl.to(
        bodyWords,
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: { each: 0.4, from: "start" },
          duration: 1,
        },
        ">-2",
      );
    }

    // hold before releasing pin
    tl.to({}, { duration: 2 });

    if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);

    return () => {
      triggers.forEach((t) => t.kill());
      splitHead?.revert();
      splitBodies.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section ref={ref} id="philosophy" className="rf-section rf-philosophy">
      <div className="rf-container">
        <SectionHeader index="01" label="Philosophy" />
        <div className="rf-phil-grid">
          <h2 className="rf-phil-headline">
            Train Under <span className="rf-accent">Load.</span>{" "}
            Get <span className="rf-accent">Uncomfortable.</span>{" "}
            Come Back Sharper.
          </h2>
          <div className="rf-phil-body">
            <p>
              REDFIT is not a fitness studio. It's a workshop for people who want their body
              to actually do something. Strength, capacity, resilience — earned rep by rep,
              never bought in packaging.
            </p>
            <p>
              We built the room around real training: Red Strength racks, calibrated plates,
              open floor, no waiting. Coaches who cue you, not count for you. A community
              that shows up on the days it's hardest to.
            </p>
            <p>
              You don't leave here softer. You leave built.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
