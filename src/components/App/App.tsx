import { Route, Routes } from "react-router-dom";
// import { useState } from 'react'
import "./App.styled.ts";
import { AppBar } from "..";
import {
  HomePage,
  Events,
  About,
  Programs,
  News,
  PageNotFound,
} from "../../pages";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<AppBar />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/news" element={<News />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
