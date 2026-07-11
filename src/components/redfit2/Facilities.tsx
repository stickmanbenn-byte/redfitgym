import { SectionHeader } from "./Reveal";
import BlurText from "./BlurText";
import InfiniteMenu from "./InfiniteMenu";

const ITEMS = [
  { image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80", link: "#programs", title: "Strength Floor", description: "Barbell-first floor built for real load." },
  { image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=900&q=80", link: "#programs", title: "Rack Row", description: "Twelve calibrated racks, zero waiting." },
  { image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&q=80", link: "#programs", title: "Sled Track", description: "Conditioning on a proper 20m lane." },
  { image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80", link: "#programs", title: "Women's Studio", description: "Private floor, real weights, women coaches." },
  { image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80", link: "#programs", title: "Recovery Room", description: "Mobility, sauna, structured cool-down." },
  { image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=900&q=80", link: "#visit", title: "Café Bar", description: "Post-session protein and honest coffee." },
];

export function Facilities() {
  return (
    <section id="facilities" className="rf-section rf-facilities">
      <div className="rf-container">
        <SectionHeader index="04" label="Facilities" />
        <BlurText as="h2" className="rf-display" style={{ fontSize: "clamp(36px, 5vw, 72px)", marginBottom: 48, maxWidth: 900 }} delay={70}>
          A room built for <span className="rf-accent">the work</span>.
        </BlurText>
        <InfiniteMenu items={ITEMS} scale={1.0} />
      </div>
    </section>
  );
}
