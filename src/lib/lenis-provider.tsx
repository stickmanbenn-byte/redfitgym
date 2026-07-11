import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { initGsap, gsap, ScrollTrigger } from "./gsap-init";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initGsap();

    const lenis = new Lenis({
      // Ultra-smooth premium feel — long expo easing, tight lerp
      duration: 1.4,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      lerp: 0.09,
      syncTouch: true,
      syncTouchLerp: 0.06,
    } as ConstructorParameters<typeof Lenis>[0]);


    lenis.on("scroll", ScrollTrigger.update);

    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready?.then(refresh).catch(() => {});

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
