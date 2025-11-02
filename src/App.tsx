import { Route, Routes } from 'react-router-dom';
// import { useState } from 'react'
import './App.css'
import { AppBar } from './components';
import { HomePage } from './pages/HomePage/HomePage';
import { Events } from './pages/Events/Events'; 
import { About } from './pages/About/About';
import { Programs } from './pages/Programs/Programs'; 
import { News } from './pages/News/News';
import { PageNotFound } from './pages/PageNotFound/PageNotFound';


function App() {
  // const [count, setCount] = useState(0)


  return (
    <Routes>
      <Route path="/" element={<AppBar />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<About/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/programs" element={<Programs/>} />
        <Route path="/news" element={<News/>} />  
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  )
}

export default App