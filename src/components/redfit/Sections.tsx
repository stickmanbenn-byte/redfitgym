import { useEffect, useRef, useState } from "react";
import {
  Coffee,
  Scissors,
  Activity,
  Salad,
  Dumbbell,
  Flame,
  HeartPulse,
  Timer,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Reveal } from "./Reveal";

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span
        className="text-[11px] uppercase tracking-[0.3em]"
        style={{ color: "var(--burgundy-bright)" }}
      >
        {n}
      </span>
      <span className="h-px flex-1 bg-grey-border" />
      <span className="text-[11px] uppercase tracking-[0.3em] text-grey-muted">{title}</span>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative bg-black px-6 py-28 md:px-16 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionLabel n="01" title="The Gym" />
        <Reveal>
          <h2
            className="text-white"
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "clamp(36px, 6vw, 76px)",
              lineHeight: 0.95,
              letterSpacing: "0.01em",
            }}
          >
            WORLD-CLASS GYM<br />
            EXPERIENCE IN<br />
            <span style={{ color: "var(--burgundy-bright)" }}>SAMBHAJINAGAR.</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-grey-text">
              REDFIT is a premium unisex fitness center engineered for people who
              take training seriously. Modern equipment. Certified coaches.
              A complete strength ecosystem under one roof.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="space-y-4 text-sm text-grey-text">
              {[
                "Certified strength & conditioning coaches",
                "Café, grooming salon, BMI analysis on-site",
                "Diet & supplement guidance included",
                "Dedicated women's studio & timings",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 border-b border-grey-border pb-4">
                  <span
                    className="mt-2 h-1.5 w-1.5"
                    style={{ background: "var(--burgundy-bright)" }}
                  />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const EQUIPMENT = [
  { name: "Power Rack", spec: "Heavy-gauge steel · 1000lb rated" },
  { name: "Olympic Platform", spec: "Rubberized · competition-grade" },
  { name: "Cable Crossover", spec: "Dual-stack · frictionless" },
  { name: "Deadlift Bar", spec: "27mm · aggressive knurl" },
  { name: "Hack Squat", spec: "Plate-loaded · 45°" },
  { name: "Assault Bike", spec: "Air resistance · unlimited" },
];

export function Equipment() {
  return (
    <section id="equipment" className="relative border-t border-grey-border bg-near-black px-6 py-28 md:px-16 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionLabel n="02" title="Red Strength" />
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <Reveal>
            <h2
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "clamp(32px, 4.5vw, 60px)",
                lineHeight: 0.95,
              }}
            >
              RED<br />STRENGTH.<br />
              <span style={{ color: "var(--burgundy-bright)" }}>BUILT HEAVY.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-grey-text">
              Our proprietary heavy-duty strength line. Every plate, bar and
              frame chosen for one job: moving real weight without excuses.
            </p>
          </Reveal>
        </div>
        <div className="mt-16 grid gap-px bg-grey-border sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPMENT.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.05}>
              <div
                data-cursor="hover"
                className="group relative bg-near-black p-8 transition-all duration-300 hover:bg-black"
                style={{ minHeight: 220 }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ boxShadow: "inset 0 0 0 1px var(--burgundy-bright)" }}
                />
                <div
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: "var(--burgundy-bright)" }}
                >
                  0{i + 1}
                </div>
                <div
                  className="mt-4"
                  style={{
                    fontFamily: "'Archivo Black', sans-serif",
                    fontSize: 28,
                    lineHeight: 1,
                  }}
                >
                  {e.name.toUpperCase()}
                </div>
                <div className="mt-3 text-xs uppercase tracking-[0.15em] text-grey-muted">
                  {e.spec}
                </div>
                <Dumbbell
                  size={40}
                  className="absolute bottom-6 right-6 text-grey-border transition-colors duration-300 group-hover:text-white"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROGRAMS = [
  { name: "Strength Training", desc: "Barbell fundamentals. Compound-first programming.", icon: Dumbbell },
  { name: "HIIT & Zumba", desc: "High-intensity conditioning and rhythm-driven cardio.", icon: Flame },
  { name: "Yoga", desc: "Mobility, breath control and recovery-focused sessions.", icon: HeartPulse },
  { name: "Hyrox Training", desc: "Race-format functional fitness. Row, run, ski, sled.", icon: Timer, hyrox: true },
];

function HyroxClock() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(t / 60) % 60).padStart(2, "0");
  const s = String(t % 60).padStart(2, "0");
  return (
    <div
      className="absolute right-6 top-6 font-mono text-xs tracking-widest"
      style={{ color: "var(--burgundy-bright)" }}
    >
      {m}:{s}
    </div>
  );
}

export function Programs() {
  return (
    <section id="programs" className="relative border-t border-grey-border bg-black px-6 py-28 md:px-16 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionLabel n="03" title="Programs" />
        <Reveal>
          <h2
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "clamp(36px, 6vw, 76px)",
              lineHeight: 0.95,
            }}
          >
            PICK YOUR<br />
            <span style={{ color: "var(--burgundy-bright)" }}>DISCIPLINE.</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {PROGRAMS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.name} delay={i * 0.05}>
                <div
                  data-cursor="hover"
                  className="group relative border border-grey-border bg-near-black p-10 transition-all duration-300 hover:border-white"
                >
                  {p.hyrox && <HyroxClock />}
                  <Icon size={28} className="text-white" />
                  <div
                    className="mt-8"
                    style={{
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: 32,
                      lineHeight: 1,
                    }}
                  >
                    {p.name.toUpperCase()}
                  </div>
                  <p className="mt-4 text-sm text-grey-text">{p.desc}</p>
                  <div
                    className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em]"
                    style={{ color: "var(--burgundy-bright)" }}
                  >
                    Enroll <span>→</span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Zones() {
  const [women, setWomen] = useState(false);
  return (
    <section id="zones" className="relative border-t border-grey-border bg-near-black px-6 py-28 md:px-16 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionLabel n="04" title="Studios" />
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Reveal>
            <h2
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "clamp(32px, 5vw, 64px)",
                lineHeight: 0.95,
              }}
            >
              TWO ZONES.<br />
              <span style={{ color: "var(--burgundy-bright)" }}>ONE STANDARD.</span>
            </h2>
          </Reveal>
          <button
            data-cursor="hover"
            onClick={() => setWomen((v) => !v)}
            className="relative flex items-center gap-4 border border-grey-border bg-black p-2"
            aria-label="Toggle zone"
          >
            <span
              className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${!women ? "text-white" : "text-grey-muted"}`}
            >
              Strength Zone
            </span>
            <span
              className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${women ? "text-white" : "text-grey-muted"}`}
            >
              Women's Studio
            </span>
            <span
              className="pointer-events-none absolute top-2 h-[calc(100%-16px)] transition-all duration-300"
              style={{
                width: women ? "48%" : "44%",
                left: women ? "50%" : "0.5rem",
                background: "var(--burgundy-bright)",
                mixBlendMode: "difference",
              }}
            />
          </button>
        </div>

        <div className="relative mt-14 min-h-[380px]">
          <div
            className={`absolute inset-0 grid gap-10 transition-opacity duration-300 md:grid-cols-2 ${women ? "pointer-events-none opacity-0" : "opacity-100"}`}
          >
            <div className="aspect-[4/3] w-full border border-grey-border bg-black" style={{
              backgroundImage: "linear-gradient(135deg, #0a0a0a 25%, #000 25%, #000 50%, #0a0a0a 50%, #0a0a0a 75%, #000 75%)",
              backgroundSize: "40px 40px",
            }}>
              <div className="flex h-full items-end p-6">
                <span className="font-display text-3xl" style={{ fontFamily: "'Archivo Black', sans-serif", color: "var(--burgundy-bright)" }}>
                  STRENGTH ZONE
                </span>
              </div>
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: 36,
                  lineHeight: 1,
                }}
              >
                HEAVY. LOUD. UNAPOLOGETIC.
              </h3>
              <p className="mt-6 text-grey-text">
                Home of the Red Strength line. Racks, platforms, chalk. Built
                for lifters chasing PRs, not selfies. Coaches on the floor.
                Music loud enough to drown out doubt.
              </p>
            </div>
          </div>

          <div
            className={`absolute inset-0 grid gap-10 transition-opacity duration-300 md:grid-cols-2 ${women ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <div className="aspect-[4/3] w-full border border-grey-border bg-black" style={{
              backgroundImage: "radial-gradient(circle at 30% 30%, #1a0008 0%, #000 60%)",
            }}>
              <div className="flex h-full items-end p-6">
                <span className="font-display text-3xl" style={{ fontFamily: "'Archivo Black', sans-serif", color: "var(--burgundy-bright)" }}>
                  WOMEN'S STUDIO
                </span>
              </div>
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: 36,
                  lineHeight: 1,
                }}
              >
                A STUDIO OF YOUR OWN.
              </h3>
              <p className="mt-6 text-grey-text">
                Dedicated female timings, female coaches, and a private training
                floor built for comfort and community. Strength training without
                the stares. Progress at your pace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const TRAINERS = [
  { name: "Rohan Deshmukh", spec: "Strength & Conditioning" },
  { name: "Anaya Kulkarni", spec: "Women's Strength Lead" },
  { name: "Vikram Pawar", spec: "Hyrox & HIIT" },
  { name: "Sneha Joshi", spec: "Yoga & Mobility" },
];

export function Trainers() {
  return (
    <section id="trainers" className="relative border-t border-grey-border bg-black px-6 py-28 md:px-16 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionLabel n="05" title="The Team" />
        <Reveal>
          <h2
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "clamp(36px, 6vw, 76px)",
              lineHeight: 0.95,
            }}
          >
            COACHES WHO<br />
            <span style={{ color: "var(--burgundy-bright)" }}>ACTUALLY COACH.</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRAINERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05}>
              <div
                data-cursor="hover"
                className="group relative overflow-hidden border border-grey-border bg-near-black transition-transform duration-300 hover:scale-[1.03]"
              >
                <div
                  className="aspect-[3/4] w-full"
                  style={{
                    background: `linear-gradient(180deg, #111 0%, #000 100%)`,
                  }}
                >
                  <div className="flex h-full items-center justify-center opacity-30 transition-opacity duration-300 group-hover:opacity-60">
                    <Dumbbell size={64} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div
                    style={{
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: 20,
                      lineHeight: 1,
                    }}
                  >
                    {t.name.toUpperCase()}
                  </div>
                  <div
                    className="mt-1 text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: "var(--burgundy-bright)" }}
                  >
                    {t.spec}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const QUOTES = [
  {
    q: "Absolutely one of the best gyms in the city. World-class equipment, premium atmosphere, and a highly motivating environment for workouts.",
    a: "Verified Google Review",
  },
  {
    q: "The Red Strength line is next level. Coaches actually correct your form. Feels like a proper strength gym, not a fashion show.",
    a: "Member since 2024",
  },
  {
    q: "Women's studio changed how I train. Comfortable, focused, and finally a place where I can lift heavy without being watched.",
    a: "Verified Google Review",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const next = () => setI((v) => (v + 1) % QUOTES.length);
  const prev = () => setI((v) => (v - 1 + QUOTES.length) % QUOTES.length);
  const q = QUOTES[i];
  return (
    <section id="testimonials" className="relative border-t border-grey-border bg-near-black px-6 py-28 md:px-16 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionLabel n="06" title="Reviews" />
        <div className="grid items-center gap-14 md:grid-cols-[auto_1fr]">
          <Reveal>
            <div>
              <div
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "clamp(80px, 12vw, 160px)",
                  lineHeight: 0.85,
                  color: "var(--burgundy-bright)",
                }}
              >
                4.9<span className="text-white">★</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-grey-muted">
                <Star size={12} fill="var(--burgundy-bright)" color="var(--burgundy-bright)" />
                Rated on Google
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="border-l border-grey-border pl-8">
              <p className="text-xl leading-relaxed text-white md:text-2xl" style={{ minHeight: 180 }}>
                &ldquo;{q.q}&rdquo;
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.3em] text-grey-muted">
                  — {q.a}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    aria-label="Previous"
                    className="border border-grey-border p-3 transition-colors hover:border-white"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next"
                    className="border border-grey-border p-3 transition-colors hover:border-white"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const AMENITIES = [
  { icon: Coffee, name: "Café" },
  { icon: Scissors, name: "Grooming Salon" },
  { icon: Activity, name: "BMI Analysis" },
  { icon: Salad, name: "Diet & Supplement Guidance" },
];

export function Amenities() {
  return (
    <section id="membership" className="relative border-t border-grey-border bg-black px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionLabel n="07" title="Amenities" />
        <div className="grid gap-px bg-grey-border sm:grid-cols-2 md:grid-cols-4">
          {AMENITIES.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.name} className="flex flex-col items-start gap-4 bg-black p-8">
                <Icon size={32} color="var(--burgundy-bright)" />
                <div className="text-sm uppercase tracking-[0.2em]">{a.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const HOURS = [
  { d: "Mon – Sat", h: "5:30 AM – 10:30 PM" },
  { d: "Sunday", h: "5:00 AM – 10:00 PM" },
];

export function Contact() {
  return (
    <section id="contact" className="relative border-t border-grey-border bg-near-black px-6 py-28 md:px-16 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionLabel n="08" title="Visit" />
        <Reveal>
          <h2
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "clamp(36px, 6vw, 84px)",
              lineHeight: 0.9,
            }}
          >
            COME<br />
            <span style={{ color: "var(--burgundy-bright)" }}>TRAIN WITH US.</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <Reveal>
            <div className="space-y-8">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-grey-muted">
                  <MapPin size={12} /> Address
                </div>
                <p className="text-white">
                  Beed Bypass Rd, near Renuka Mata Mandir, Kaman,<br />
                  Satara Deolai Parisar, Chhatrapati Sambhajinagar,<br />
                  Maharashtra 431001
                </p>
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-grey-muted">
                  <Clock size={12} /> Hours
                </div>
                <table className="text-sm text-white">
                  <tbody>
                    {HOURS.map((h) => (
                      <tr key={h.d}>
                        <td className="py-1 pr-8 text-grey-text">{h.d}</td>
                        <td className="py-1">{h.h}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-grey-muted">
                  <Phone size={12} /> Phone
                </div>
                <a href="tel:+918208290883" className="text-lg text-white hover:underline">
                  +91 82082 90883
                </a>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href="https://wa.me/918208290883"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="primary"
                  className="sharp inline-flex items-center gap-2 bg-white px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-black transition-all hover:-translate-y-0.5"
                >
                  Book Free Trial on WhatsApp
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=REDFIT+Chhatrapati+Sambhajinagar"
                  target="_blank"
                  rel="noreferrer"
                  className="sharp inline-flex items-center gap-2 border border-grey-border px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all hover:border-white"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className="relative h-full min-h-[380px] w-full overflow-hidden border border-grey-border"
              style={{
                background:
                  "radial-gradient(circle at 40% 60%, #1a0008 0%, #050505 40%, #000 100%)",
              }}
            >
              <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full opacity-40">
                <g stroke="#222" strokeWidth="0.5" fill="none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" x2="400" y1={i * 20} y2={i * 20} />
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line key={`v${i}`} y1="0" y2="400" x1={i * 20} x2={i * 20} />
                  ))}
                </g>
                <path d="M0,220 Q120,180 200,210 T400,190" stroke="#333" strokeWidth="1.5" fill="none" />
                <path d="M180,0 L210,180 L230,400" stroke="#333" strokeWidth="1.5" fill="none" />
              </svg>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="relative inline-block">
                  <span
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      width: 60,
                      height: 60,
                      border: "1px solid var(--burgundy-bright)",
                      animation: "redfit-ping 1.8s ease-out infinite",
                    }}
                  />
                  <MapPin size={40} color="var(--burgundy-bright)" fill="var(--burgundy-bright)" />
                </div>
                <div className="mt-4 text-[10px] uppercase tracking-[0.3em] text-grey-muted">
                  REDFIT · Beed Bypass Rd
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-grey-border bg-black px-6 py-14 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <div
            className="text-2xl"
            style={{ fontFamily: "'Archivo Black', sans-serif", letterSpacing: "0.1em" }}
          >
            RED<span style={{ color: "var(--burgundy-bright)" }}>FIT</span>
          </div>
          <p className="mt-3 max-w-xs text-xs text-grey-muted">
            Premium strength training in Chhatrapati Sambhajinagar. Built for
            people who take training seriously.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-[11px] uppercase tracking-[0.2em] text-grey-text">
          <a href="#programs" className="hover:text-white">Programs</a>
          <a href="#trainers" className="hover:text-white">Trainers</a>
          <a href="#membership" className="hover:text-white">Membership</a>
          <a href="#womens" className="hover:text-white">Women's Studio</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </div>
        <div>
          <div className="flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="border border-grey-border p-3 transition-colors hover:border-white"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
          <div className="mt-4 text-xs text-grey-muted">+91 82082 90883</div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl items-center justify-between border-t border-grey-border pt-6 text-[10px] uppercase tracking-[0.2em] text-grey-muted">
        <span>© {new Date().getFullYear()} REDFIT</span>
        <span>Chhatrapati Sambhajinagar · India</span>
      </div>
    </footer>
  );
}

// alias for #womens anchor -> scroll to zones
export function WomensAnchor() {
  return <span id="womens" className="block" />;
}
