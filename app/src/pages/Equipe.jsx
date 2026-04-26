import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import './Page.css'

const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

function Section({ children, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

const team = [
  { initials: 'LB', name: 'Lucien Bisiaux', role: 'Vision du projet · présentation globale' },
  { initials: 'LG', name: 'Louis Giraudel', role: 'Développement · support technique' },
  { initials: 'EF', name: 'Eliot Farys', role: 'Conception · coordination' },
  { initials: 'TB', name: 'Théophile Berenger', role: 'Maquette · logique du système' },
  { initials: 'CH', name: 'Clément Hintzy', role: 'Communication · valorisation du projet' },
]

const partners = [
  { href: 'https://www.paprec.com/', src: '/assets/logo paprec.png', name: 'Paprec' },
  { href: 'https://www.derichebourg.com/', src: '/assets/logo derichbourg.png', name: 'Derichebourg' },
  { href: 'https://www.rueilmalmaison.fr/', src: '/assets/logo rueill.png', name: 'Ville de Rueil-Malmaison' },
  { href: 'https://francebiodechets.org/', src: '/assets/logo france.png', name: 'France Biodéchets' },
  { href: 'https://www.adivalor.fr/', src: '/assets/logo adivalor.png', name: 'Adivalor' },
  { href: 'https://amorce.asso.fr/', src: '/assets/logo amorce.png', name: 'Amorce' },
]

export default function Equipe() {
  return (
    <PageTransition>
      <main>
        <section className="page-hero">
          <div className="container">
            <motion.div className="kicker" variants={fadeUp} initial="hidden" animate="visible">L'équipe GreenLoop</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .65, ease: [.22,1,.36,1] }}>
              Cinq élèves, un projet, une ambition commune.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .55 }}>
              GreenLoop rassemble un travail d'équipe autour de la conception, du développement, de la communication et de la présentation du projet.
            </motion.p>
          </div>
        </section>

        <section className="block">
          <Section className="grid-3 container">
            {team.map(m => (
              <motion.article key={m.name} className="card team-card" variants={fadeUp} whileHover={{ y: -5, transition: { duration: .2 } }}>
                <div className="team-avatar">{m.initials}</div>
                <h3>{m.name}</h3>
                <p>{m.role}</p>
              </motion.article>
            ))}
            <motion.article className="card" variants={fadeUp}>
              <div className="kicker">Cadre du projet</div>
              <h3>Olympiades des Sciences de l'Ingénieur</h3>
              <p>Les entreprises ci-dessous nous font confiance et nous soutiennent, notre projet regroupe de grandes entreprises pour de grandes ambitions.</p>
            </motion.article>
          </Section>
        </section>

        <section className="block">
          <Section>
            <div className="section-head container">
              <div>
                <motion.div className="kicker" variants={fadeUp}>Partenaires & soutiens</motion.div>
                <motion.h2 variants={fadeUp}>Un écosystème qui renforce la crédibilité du projet.</motion.h2>
              </div>
              <motion.p variants={fadeUp}>Des acteurs engagés qui accompagnent et soutiennent le projet GreenLoop.</motion.p>
            </div>
            <div className="partner-logos container">
              {partners.map(p => (
                <motion.a
                  key={p.name} className="logo-card"
                  href={p.href} target="_blank" rel="noreferrer"
                  variants={fadeUp} whileHover={{ y: -5, transition: { duration: .2 } }}
                >
                  <div className="logo-box"><img src={p.src} alt={p.name} /></div>
                  <strong>{p.name}</strong>
                </motion.a>
              ))}
            </div>
          </Section>
        </section>

        <Section>
          <motion.div className="cta-band container" variants={fadeUp}>
            <div>
              <div className="kicker">Suivre le projet</div>
              <h3>Découvrir le fonctionnement et l'application.</h3>
            </div>
            <div className="index-links">
              <Link to="/conception">Conception & app</Link>
              <Link to="/vision">Vision écologique</Link>
              <Link to="/modeles">Modèles 3D</Link>
            </div>
          </motion.div>
        </Section>
      </main>
    </PageTransition>
  )
}
