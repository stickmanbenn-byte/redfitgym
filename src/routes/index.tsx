import { createFileRoute } from "@tanstack/react-router";
import { LenisProvider } from "@/lib/lenis-provider";
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
import { useReveal } from "@/components/redfit2/Reveal";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "REDFIT — Premium Strength Gym · Chhatrapati Sambhajinagar" },
      {
        name: "description",
        content:
          "REDFIT is a premium strength gym in Chhatrapati Sambhajinagar. Red Strength equipment, certified coaches, Hyrox, HIIT, Powerlifting, Women's Studio, café and more.",
      },
    ],
  }),
});

function Body() {
  useReveal();
  return (
    <main id="top" className="rf-root">
      <Nav />
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
      <Footer />
    </main>
  );
}

function Index() {
  return (
    <LenisProvider>
      <Body />
    </LenisProvider>
  );
}
