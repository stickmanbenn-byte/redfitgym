import { SectionHeader } from "./Reveal";
import BlurText from "./BlurText";
import p1Before from "@/assets/p1_before.jpg.asset.json";
import p1After from "@/assets/p1_after.jpg.asset.json";
import liamBefore from "@/assets/liam_before.jpg.asset.json";
import liamAfter from "@/assets/liam_after.jpg.asset.json";
import p3Before from "@/assets/p3_before.jpg.asset.json";
import p3After from "@/assets/p3_after.jpg.asset.json";

const STORIES = [
  { name: "Sophia Mitchell · Down 14 kg / 9 mo", body: "I came in unable to squat a bar. I left with a 70 kg back squat and a body I recognize.", before: p1Before.url, after: p1After.url },
  { name: "Liam Anderson · +22 kg deadlift PR", body: "The programming actually made sense. Every block moved a number.", before: liamBefore.url, after: liamAfter.url },
  { name: "Ava Reynolds · First Hyrox finish", body: "Went from 5 min on the rower feeling done to finishing a full Hyrox in 1:38.", before: p3Before.url, after: p3After.url },
];

export function Transformations() {
  return (
    <section id="transformations" className="rf-section rf-transform">

      <div className="rf-container">
        <SectionHeader index="05" label="Transformations" />
        <BlurText as="blockquote" className="rf-quote" delay={55} stepDuration={0.4}>
          {"\u201CI didn\u2019t come here to "}<em>look</em>{" different. I came here to "}<em>feel</em>{" like I could actually "}<em>do</em>{" something. Both happened.\u201D"}
        </BlurText>
        <div style={{ marginTop: 24, fontSize: 11, letterSpacing: "0.3em", color: "var(--rf-fg-dim)", textTransform: "uppercase" }} data-reveal>
          — Neha S., Member since 2022
        </div>

        <div className="rf-transform-slider">
          {STORIES.map((s) => (
            <article key={s.name} className="rf-transform-card">
              <div className="rf-ba" data-label="Before" style={{ backgroundImage: `url(${s.before})` }} />
              <div className="rf-ba" data-label="After" style={{ backgroundImage: `url(${s.after})` }} />
              <div className="meta">
                <div className="name">{s.name}</div>
                <div className="body">{s.body}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
