import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
// import { useState } from 'react'
import "./App.styled.ts";
import { Layout } from "../Layout/Layout.tsx";
import {
  HomePage,
  Events,
  About,
  Programs,
  News,
  PageNotFound,
} from "../../pages";

 const pageAnimation = {
  initial: { opacity: 0, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 0 },
  transition: { duration: 0,  },
};

function App() {
  // const [count, setCount] = useState(0)
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={<motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit"><HomePage /></motion.div>}/>
          <Route path="/about" element={ <motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit"><About /> </motion.div>} />
          <Route path="/events" element={<motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit"><Events /></motion.div>} />
          <Route path="/programs" element={<motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit"><Programs /></motion.div>} />
          <Route path="/news" element={<motion.div variants={pageAnimation} initial="initial" animate="animate" exit="exit"><News /></motion.div>} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
