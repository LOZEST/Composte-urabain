import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Equipe from './pages/Equipe'
import Conception from './pages/Conception'
import Vision from './pages/Vision'
import Models from './pages/Models'
import './App.css'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/conception" element={<Conception />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/modeles" element={<Models />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <Nav />
        <AnimatedRoutes />
        <Footer />
      </div>
    </BrowserRouter>
  )
}
