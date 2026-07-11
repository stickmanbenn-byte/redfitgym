import { SectionHeader } from "./Reveal";
import BlurText from "./BlurText";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS: Record<string, string[]> = {
  "06:00": ["Strength", "Hyrox", "Strength", "Conditioning", "Strength", "Open", "—"],
  "07:30": ["Conditioning", "Yoga", "Conditioning", "Powerlifting", "Conditioning", "Hyrox", "Mobility"],
  "17:00": ["Strength", "HIIT", "Strength", "HIIT", "Strength", "Open", "—"],
  "18:30": ["Powerlifting", "Zumba", "Women's Studio", "Zumba", "Powerlifting", "Open", "—"],
  "20:00": ["Conditioning", "Mobility", "Conditioning", "Mobility", "Conditioning", "—", "—"],
};

export function Schedule() {
  return (
    <section id="schedule" className="rf-section rf-schedule">
      <div className="rf-container">
        <SectionHeader index="07" label="Weekly Schedule" />
        <BlurText as="h2" className="rf-display" style={{ fontSize: "clamp(32px, 4.5vw, 60px)", marginBottom: 40, maxWidth: 900 }} delay={70}>
          Show up when it fits your <span className="rf-accent">week</span>.
        </BlurText>
        <div className="rf-sched-wrap" data-reveal>
          <table className="rf-sched-table">
            <thead>
              <tr>
                <th>Time</th>
                {DAYS.map((d) => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {Object.entries(SLOTS).map(([time, row]) => (
                <tr key={time}>
                  <td style={{ color: "var(--rf-fg)", fontFamily: "var(--rf-display)", letterSpacing: "0.15em" }}>{time}</td>
                  {row.map((cell, i) => (
                    <td key={i} className={cell === "Strength" || cell === "Powerlifting" ? "hot" : ""}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <BlurText style={{ marginTop: 20, fontSize: 12, color: "var(--rf-fg-dim)", letterSpacing: "0.15em", textTransform: "uppercase" }} delay={30} stepDuration={0.3}>
          Open floor: 5:00 — 23:00 · Book classes via the REDFIT app
        </BlurText>
      </div>
    </section>
  );
}
