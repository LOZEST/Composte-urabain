import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import './Home.css'

const steps = [
  { n: '1', title: 'Trouver', desc: "L'utilisateur localise le composteur GreenLoop le plus proche depuis l'application." },
  { n: '2', title: "S'identifier", desc: "Le QR code sécurise l'accès et permet de reconnaître l'utilisateur." },
  { n: '3', title: 'Déposer', desc: 'Les déchets verts sont pesés et valorisés automatiquement dans le système.' },
  { n: '4', title: 'Récupérer', desc: "Les points et le compost disponible peuvent être suivis depuis l'app." },
]

const partners = [
  { href: 'https://www.paprec.com/', src: '/assets/logo paprec.png', name: 'Paprec' },
  { href: 'https://www.derichebourg.com/', src: '/assets/logo derichbourg.png', name: 'Derichebourg' },
  { href: 'https://francebiodechets.org/', src: '/assets/logo france.png', name: 'France Biodéchets' },
  { href: 'https://www.adivalor.fr/', src: '/assets/logo adivalor.png', name: 'Adivalor' },
  { href: 'https://amorce.asso.fr/', src: '/assets/logo amorce.png', name: 'Amorce' },
]

export default function Home() {
  return (
    <PageTransition>
      <main className="home-v2">
        <section className="hero-v2 container">
          <div className="hero-panel">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hero-tag">GreenLoop • version 2</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}>
              Le compostage urbain devient une expérience simple et connectée.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}>
              GreenLoop simplifie le dépôt des déchets organiques en ville grâce à un composteur autonome, une identification par QR code et une application mobile claire.
            </motion.p>
            <div className="hero-buttons">
              <Link className="btn btn-primary" to="/conception">Découvrir l'application</Link>
              <Link className="btn btn-secondary" to="/vision">Voir la vision du projet</Link>
            </div>
          </div>
          <div className="hero-app">
            <div className="app-head"><strong>Application live</strong><span>Suivi des dépôts & points</span></div>
            <iframe src="https://composte-urabain.vercel.app" allow="geolocation" title="Application GreenLoop" />
          </div>
        </section>

        <motion.section initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}} className="container strip-metrics">
          <article><strong>Autonome</strong><p>Accès, pesée et suivi pensés pour un usage simple.</p></article>
          <article><strong>Connecté</strong><p>Application mobile et logique de points pour suivre les dépôts.</p></article>
          <article><strong>Urbain</strong><p>Une solution conçue pour les villes, collectivités et lieux partagés.</p></article>
        </motion.section>

        <motion.section initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}} className="container process-v2">
          <header>
            <p className="kicker">Le principe</p>
            <h2>Un parcours en 4 étapes.</h2>
          </header>
          <div className="timeline">
            {steps.map(s => (
              <article key={s.n} className="timeline-item">
                <span>{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}} className="container partners-v2">
          <header>
            <p className="kicker">Les partenaires</p>
            <h2>Des soutiens visibles sur le projet.</h2>
          </header>
          <div className="partners-grid-v2">
            {partners.map(p => (
              <a key={p.name} href={p.href} target="_blank" rel="noreferrer" className="partner-tile">
                <img src={p.src} alt={p.name} />
                <span>{p.name}</span>
              </a>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5}} className="container cta-v2">
          <div>
            <p className="kicker">Explorer GreenLoop</p>
            <h3>Poursuivre la découverte du projet.</h3>
          </div>
          <div className="index-links">
            <Link to="/equipe">Équipe & partenaires</Link>
            <Link to="/conception">Conception & app</Link>
            <Link to="/vision">Vision écologique</Link>
            <Link to="/modeles">Modèles 3D</Link>
          </div>
        </motion.section>
      </main>
    </PageTransition>
  )
}
