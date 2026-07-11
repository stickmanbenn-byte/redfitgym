import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#programs", label: "Programs" },
  { href: "#trainers", label: "Trainers" },
  { href: "#membership", label: "Membership" },
  { href: "#womens", label: "Women's Studio" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-16">
        <a href="#" className="font-display text-xl tracking-[0.15em] text-white" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
          RED<span style={{ color: "var(--burgundy-bright)" }}>FIT</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-grey-text transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          data-cursor="primary"
          className="sharp hidden bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-black transition-all hover:bg-burgundy-bright hover:text-white md:inline-flex"
        >
          Book Trial
        </a>
        <button
          onClick={() => setOpen(true)}
          className="text-white md:hidden"
          aria-label="Open menu"
        >
          <Menu size={26} />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black">
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-display text-xl tracking-[0.15em]" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
              RED<span style={{ color: "var(--burgundy-bright)" }}>FIT</span>
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={26} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-6 px-8">
            {LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl text-white"
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  animation: `redfit-menu-in 500ms cubic-bezier(0.4,0,0.2,1) ${i * 50}ms both`,
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <style>{`
            @keyframes redfit-menu-in {
              from { opacity: 0; transform: translateY(16px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
