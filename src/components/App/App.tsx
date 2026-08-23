import { Navigate, Route, Routes } from "react-router-dom";

import { Layout } from "../Layout/Layout";
import { EventDetails } from "../Events/EventDetails";
import { ProgramDetail } from "../Programs/AdultProgramms/ProgramDetail";
import { GuestOnlyRoute } from "../AuthProvider/GuestOnlyRoute";

import {
  About,
  Contact,
  Events,
  HomePage,
  PageNotFound,
  ProgramsKids,
} from "../../pages";

import LoginPage from "../../pages/LoginPage/LoginPage";
import { Impressum } from "../../pages/Impressum/Impressum";
import { Privacy } from "../../pages/Privacy/Privacy";
import { AdultPrograms } from "../../pages/Programs/AdultPrograms";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ua" replace />} />

      <Route path="/:lang" element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route
          path="login"
          element={
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          }
        />

        <Route path="about" element={<About />} />

        <Route path="events" element={<Events />} />
        <Route path="events/:eventId" element={<EventDetails />} />

        <Route path="programs/kids" element={<ProgramsKids />} />
        <Route path="programs/adults" element={<AdultPrograms />} />
        <Route path="programs/adults/:id" element={<ProgramDetail />} />

        <Route path="contact" element={<Contact />} />
        <Route path="impressum" element={<Impressum />} />
        <Route path="privacy" element={<Privacy />} />

        <Route path="*" element={<PageNotFound />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;