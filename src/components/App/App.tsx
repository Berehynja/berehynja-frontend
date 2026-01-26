import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "../Layout/Layout.tsx";
import { HomePage, Events, About, Programs, Contact, PageNotFound } from "../../pages";
import LoginPage from "../../pages/LoginPage/LoginPage.tsx";
import { EventDetails } from "../Events/EventDetails.tsx";

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
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
