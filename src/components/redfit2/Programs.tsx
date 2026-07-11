import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { SectionHeader } from "./Reveal";
import BlurText from "./BlurText";

const PROGRAMS = [
  {
    n: "01",
    title: "Strength",
    body: "Barbell-first programming — squat, press, pull. Progressive overload, structured cycles, real numbers.",
    meta: ["3–5 sessions / wk", "All levels"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80",
  },
  {
    n: "02",
    title: "Conditioning",
    body: "Aerobic and anaerobic capacity built through purposeful intervals. Row, ski, sled, run.",
    meta: ["45 min", "Group / Solo"],
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1600&q=80",
  },
  {
    n: "03",
    title: "Powerlifting",
    body: "Peaking cycles for the big three. Competition-grade coaching for meet or PR chasing.",
    meta: ["12 wk cycles", "Coached"],
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1600&q=80",
  },
  {
    n: "04",
    title: "Hyrox Prep",
    body: "Race-specific pacing, transitions, and hybrid strength. Built for the event and for life.",
    meta: ["8 wk block", "Team option"],
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1600&q=80",
  },
  {
    n: "05",
    title: "Mobility",
    body: "Structured recovery — hips, shoulders, thoracic. Keeps the heavy days heavy for years.",
    meta: ["30 min", "Daily"],
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1600&q=80",
  },
  {
    n: "06",
    title: "Women's Strength",
    body: "Women's floor, women coaches, real weights. Zero gimmicks, full welcome.",
    meta: ["Studio access", "Certified"],
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&q=80",
  },
];

function StackCard({
  i,
  total,
  data,
  progress,
}: {
  i: number;
  total: number;
  data: (typeof PROGRAMS)[number];
  progress: MotionValue<number>;
}) {
  const start = i / total;
  const end = (i + 1) / total;
  const scale = useTransform(progress, [start, end], [1, 0.92]);
  const rotate = useTransform(progress, [start, end], [0, i % 2 === 0 ? -1.5 : 1.5]);

  return (
    <div className="rf-stack-slot" style={{ paddingTop: `${i * 22}px` }}>
      <motion.article
        style={{ scale, rotate }}
        className="rf-program-stack-card"
      >
        <div className="rf-psc-media">
          <img src={data.image} alt={data.title} loading="lazy" />
          <div className="rf-psc-shade" />
        </div>
        <div className="rf-psc-body">
          <div className="n">{data.n}</div>
          <div className="title">{data.title}</div>
          <p className="body">{data.body}</p>
          <div className="meta">
            {data.meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className="rf-psc-index">
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export function Programs() {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="programs" className="rf-section rf-programs">
      <div className="rf-container">
        <SectionHeader index="02" label="Programs" />
        <BlurText
          as="h2"
          className="rf-display"
          style={{ fontSize: "clamp(36px, 5vw, 72px)", marginBottom: 48, maxWidth: 900 }}
          delay={70}
        >
          Six ways to <span className="rf-accent">train hard</span>. One standard of coaching.
        </BlurText>

        <div ref={stackRef} className="rf-programs-stack">
          {PROGRAMS.map((p, i) => (
            <StackCard key={p.n} i={i} total={PROGRAMS.length} data={p} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
