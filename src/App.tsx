import { Route, Routes } from 'react-router-dom';
// import { useState } from 'react'
import './App.css'
import { AppBar } from './components';
import { HomePage } from './pages/HomePage/HomePage';
import { Galery } from './pages/Galery/Galery'; 
import { Service } from './pages/Service/Services';

function App() {
  // const [count, setCount] = useState(0)


  return (
    <Routes>
      <Route path="/" element={<AppBar />}>
        <Route index element={<HomePage />} />
        <Route path="/service" element={<Service/>} />
        <Route path="/galery" element={<Galery />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default App