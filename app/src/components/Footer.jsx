import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Footer.css'

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-inner">
        <div>
          <div className="brand" style={{ marginBottom: 12 }}>
            <span className="brand-mark"><img src="/logo.jpg" alt="GreenLoop" /></span>
            <span className="brand-name">GreenLoop</span>
          </div>
          <p className="small">Composteur urbain intelligent développé dans le cadre des Olympiades des Sciences de l'Ingénieur.</p>
          <p className="small" style={{ marginTop: 6 }}>© {new Date().getFullYear()} GreenLoop</p>
        </div>
        <div>
          <h4>Index du site</h4>
          <div className="footer-links">
            <Link to="/">Accueil</Link>
            <Link to="/equipe">Équipe & partenaires</Link>
            <Link to="/conception">Conception & app</Link>
            <Link to="/vision">Vision écologique</Link>
            <Link to="/modeles">Modèles 3D</Link>
          </div>
        </div>
        <div>
          <h4>Réseaux sociaux</h4>
          <div className="social-links">
            <a href="#" target="_blank" rel="noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noreferrer">TikTok</a>
            <a href="https://github.com/LOZEST/Composte-urabain" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
