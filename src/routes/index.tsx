import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { LenisProvider } from "@/lib/lenis-provider";
import { gsap, ScrollTrigger, initGsap } from "@/lib/gsap-init";
import { Nav } from "@/components/redfit2/Nav";
import { Hero } from "@/components/redfit2/Hero";
import { StatsBar } from "@/components/redfit2/StatsBar";
import { Philosophy } from "@/components/redfit2/Philosophy";
import { Programs } from "@/components/redfit2/Programs";
import { Trainers } from "@/components/redfit2/Trainers";
import { Facilities } from "@/components/redfit2/Facilities";
import { Transformations } from "@/components/redfit2/Transformations";
import { Pricing } from "@/components/redfit2/Pricing";
import { Schedule } from "@/components/redfit2/Schedule";
import { Location } from "@/components/redfit2/Location";
import { Footer } from "@/components/redfit2/Footer";
import { Preloader } from "@/components/redfit2/Preloader";
import { useReveal } from "@/components/redfit2/Reveal";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "REDFIT \u2014 Premium Strength Gym \u00b7 Chhatrapati Sambhajinagar" },
      {
        name: "description",
        content:
          "REDFIT is a premium strength gym in Chhatrapati Sambhajinagar. Red Strength equipment, certified coaches, Hyrox, HIIT, Powerlifting, Women's Studio, caf\u00e9 and more.",
      },
    ],
  }),
});

// Block 2: Scroll progress rail
function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    initGsap();
    if (!barRef.current) return;
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (barRef.current) {
          barRef.current.style.width = `${self.progress * 100}%`;
        }
      },
    });
    return () => st.kill();
  }, []);
  return <div ref={barRef} className="rf-scroll-progress" />;
}

function Body() {
  useReveal();
  return (
    <>
      <ScrollProgressBar />
      <Nav />
      <main id="main-content">
        <Hero />
        <StatsBar />
        <Philosophy />
        <Programs />
        <Trainers />
        <Facilities />
        <Transformations />
        <Pricing />
        <Schedule />
        <Location />
      </main>
      <Footer />
    </>
  );
}

function Index() {
  return (
    <LenisProvider>
      <Preloader />
      <Body />
    </LenisProvider>
  );
}
