import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className='page'>
        <Nav />
        <Routes>
          <Route path='*' element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
