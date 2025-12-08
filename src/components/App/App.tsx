import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "../Layout/Layout.tsx";
import {
  HomePage,
  Events,
  About,
  Programs,
  // News,
  PageNotFound,
} from "../../pages";

function App() {
  const location = useLocation();

  return (
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={<HomePage />}/>
          <Route path="/about" element={ <About /> } />
          <Route path="/events" element={<Events />} />
          <Route path="/programs" element={<Programs />} />
          {/* <Route path="/news" element={<News />} /> */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
  );
}

export default App;
