import BlurText from "./BlurText";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import dashboardImg from "@/assets/fitness-dashboard.png.asset.json";

export function Footer() {
  return (
    <footer className="rf-footer" id="footer">
      <div className="rf-container">
        <div className="rf-final-cta">
          <BlurText as="h2" delay={90} stepDuration={0.4}>
            {"Start "}<span className="accent">Your Transformation</span>
          </BlurText>

          <ContainerScroll titleComponent={null}>
            <img
              src={dashboardImg.url}
              alt="Live fitness stats dashboard showing speed, distance, time, calories and heart rate"
              className="mx-auto rounded-2xl object-contain h-full w-full"
              draggable={false}
            />
          </ContainerScroll>

          <a href="#pricing" className="rf-btn accent" style={{ padding: "22px 36px" }}>
            Book a Free Trial →
          </a>
        </div>

        <div className="rf-footer-cols">
          <div>
            <span className="rf-brand" style={{ display: "inline-block", marginBottom: 16 }}>RED<span>FIT</span></span>
            <p style={{ color: "var(--rf-fg-dim)", fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>
              Premium strength training. Chhatrapati Sambhajinagar. Built for people who
              want their body to actually do something.
            </p>
          </div>
          <div>
            <h5>Explore</h5>
            <a href="#programs">Programs</a>
            <a href="#trainers">Coaches</a>
            <a href="#facilities">Facilities</a>
            <a href="#pricing">Membership</a>
          </div>
          <div>
            <h5>Visit</h5>
            <a href="#visit">Location</a>
            <a href="#schedule">Schedule</a>
            <a href="mailto:hello@redfit360.com">Contact</a>
          </div>
          <div>
            <h5>Follow</h5>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
            <a href="#">Google Reviews</a>
          </div>
        </div>

        <div className="rf-footer-bottom">
          <span>© {new Date().getFullYear()} REDFIT · All rights reserved</span>
          <span>Chhatrapati Sambhajinagar · Maharashtra</span>
        </div>
      </div>
    </footer>
  );
}
