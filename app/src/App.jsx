import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Conception from './pages/Conception'
import Equipe from './pages/Equipe'
import Vision from './pages/Vision'
import Models from './pages/Models'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className='page'>
        <Nav />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/conception' element={<Conception />} />
          <Route path='/equipe' element={<Equipe />} />
          <Route path='/vision' element={<Vision />} />
          <Route path='/modeles' element={<Models />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
