import { Hero } from "../../components/HomePage/Hero/Hero";
import { HowWeHelp } from "../../components/HomePage/Sections/HowWeHelp";
import  OurMission  from "../../components/HomePage/Sections/OurMission";
import { Announcements } from "../../components/HomePage/Sections/Announcements";

export function HomePage() {

  return (
    <>
      <Hero />
      <HowWeHelp />
      <OurMission />
      <Announcements />
    </>
  );
}
