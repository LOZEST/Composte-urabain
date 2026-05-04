import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Nav.css'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/equipe', label: 'Équipe & partenaires' },
  { to: '/conception', label: 'Conception & app' },
  { to: '/vision', label: 'Vision écologique' },
  { to: '/modeles', label: 'Modèles 3D' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <motion.header
      className="header"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nav">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <img src="/logo.jpg" alt="GreenLoop" />
          </span>
          <span className="brand-name">GreenLoop</span>
        </NavLink>

        <button className="menu-toggle" onClick={() => setOpen(v => !v)} aria-label="Ouvrir le menu">
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </motion.header>
  )
}
