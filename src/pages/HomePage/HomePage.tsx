import { Hero } from "../../components/HomePage/Hero/Hero";
import { HowWeHelp } from "../../components/HomePage/Sections/HowWeHelp";
import  OurMission  from "../../components/HomePage/Sections/OurMission";
import { ProgramsSection } from "../../components/HomePage/Sections/ProgramsSection";
import { EventsSection } from "../../components/HomePage/Sections/EventsSection";

export function HomePage() {

  return (
    <>
      <Hero />
      <HowWeHelp />
      <OurMission />
      <ProgramsSection />
      <EventsSection />
    </>
  );
}
