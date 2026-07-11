import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Dumbbell } from "lucide-react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("redfit-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const icon = iconRef.current!;

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.22, ease: "power3" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.22, ease: "power3" });
    const xToIcon = gsap.quickTo(icon, "x", { duration: 0.22, ease: "power3" });
    const yToIcon = gsap.quickTo(icon, "y", { duration: 0.22, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
      xToIcon(e.clientX);
      yToIcon(e.clientY);
    };

    const setHover = (isHover: boolean, isPrimary: boolean) => {
      gsap.to(ring, {
        width: isHover ? 50 : 30,
        height: isHover ? 50 : 30,
        backgroundColor: isHover ? "rgba(224,52,74,0.10)" : "rgba(224,52,74,0)",
        borderColor: isHover ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)",
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.to(dot, { scale: isHover ? 0.7 : 1, duration: 0.2 });
      gsap.to(icon, { opacity: isHover && isPrimary ? 0.6 : 0, duration: 0.2 });
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const el = t.closest("a,button,[data-cursor='hover'],[data-cursor='primary']");
      if (el) {
        const primary = el.getAttribute("data-cursor") === "primary";
        setHover(true, primary);
      } else {
        setHover(false, false);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("redfit-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          width: 10,
          height: 10,
          marginLeft: -5,
          marginTop: -5,
          background: "var(--burgundy-bright)",
          borderRadius: 999,
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block"
        style={{
          width: 30,
          height: 30,
          marginLeft: -15,
          marginTop: -15,
          border: "1px solid rgba(255,255,255,0.4)",
          borderRadius: 999,
        }}
      />
      <div
        ref={iconRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:flex items-center justify-center"
        style={{ width: 50, height: 50, marginLeft: -25, marginTop: -25, opacity: 0, color: "var(--burgundy-bright)" }}
      >
        <Dumbbell size={16} />
      </div>
    </>
  );
}
