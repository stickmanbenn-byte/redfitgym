import { useEffect, useState } from "react";

const SETS = [
  { id: "about", label: "Set 1" },
  { id: "equipment", label: "Set 2" },
  { id: "programs", label: "Set 3" },
  { id: "zones", label: "Set 4" },
  { id: "trainers", label: "Set 5" },
  { id: "testimonials", label: "Set 6" },
  { id: "contact", label: "Set 7" },
];

export function SetNav() {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    SETS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 transition-opacity duration-300 md:flex ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      {SETS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group flex items-center gap-3"
          >
            <span
              className={`text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 ${isActive ? "text-white" : "text-grey-muted opacity-0 group-hover:opacity-100"}`}
              style={isActive ? { color: "var(--burgundy-bright)" } : undefined}
            >
              {s.label}
            </span>
            <span
              className="block h-2 w-2 rounded-full transition-all duration-200"
              style={{
                background: isActive ? "var(--burgundy-bright)" : "transparent",
                border: `1px solid ${isActive ? "var(--burgundy-bright)" : "#555"}`,
              }}
            />
          </a>
        );
      })}
    </div>
  );
}
