import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "../Layout/Layout.tsx";
import { HomePage, Events, About, ProgramsKids, Contact, PageNotFound } from "../../pages";
import LoginPage from "../../pages/LoginPage/LoginPage.tsx";
import { EventDetails } from "../Events/EventDetails.tsx";
import { Impressum } from "../../pages/Impressum/Impressum.tsx";
import { Privacy } from "../../pages/Privacy/Privacy.tsx";
import { AdultPrograms } from "../../pages/Programs/AdultPrograms.tsx";
import { ProgramDetail } from "../Programs/AdultProgramms/ProgramDetail.tsx";

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/programs/kids" element={<ProgramsKids />} />
        <Route path="/programs/adults" element={<AdultPrograms />} />
        <Route path="/programs/adults/:id" element={<ProgramDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
