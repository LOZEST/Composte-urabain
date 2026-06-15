import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Nav.css'

const links = [
  ['/', 'Accueil'],
  ['/conception', 'Conception'],
  ['/vision', 'Vision'],
  ['/equipe', 'Équipe'],
  ['/modeles', '3D'],
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className='header'>
      <div className='nav'>
        <NavLink className='brand' to='/' onClick={() => setOpen(false)}>
          <span className='brand-mark'><img src='/logo.jpg' alt='GreenLoop' /></span>
          <span className='brand-name'>GreenLoop Premium</span>
        </NavLink>
        <button className='menu-toggle' onClick={() => setOpen(v => !v)}><span /><span /><span /></button>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')} end={to === '/'}>{label}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
