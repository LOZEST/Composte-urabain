import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import './Home.css'

const fadeUp = { hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }

function Section({ children, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

const steps = [
  { n: '1', title: 'Trouver', desc: "L'utilisateur localise le composteur GreenLoop le plus proche depuis l'application." },
  { n: '2', title: "S'identifier", desc: "Le QR code sécurise l'accès et permet de reconnaître l'utilisateur." },
  { n: '3', title: 'Déposer', desc: 'Les déchets verts sont pesés et valorisés automatiquement dans le système.' },
  { n: '4', title: 'Récupérer', desc: "Les points et le compost disponible peuvent être suivis depuis l'app." },
]

const partners = [
  { href: 'https://www.paprec.com/', src: '/assets/logo paprec.png', name: 'Paprec' },
  { href: 'https://www.derichebourg.com/', src: '/assets/logo derichbourg.png', name: 'Derichebourg' },
  { href: 'https://www.rueilmalmaison.fr/', src: '/assets/logo rueill.png', name: 'Ville de Rueil-Malmaison' },
  { href: 'https://francebiodechets.org/', src: '/assets/logo france.png', name: 'France Biodéchets' },
  { href: 'https://www.adivalor.fr/', src: '/assets/logo adivalor.png', name: 'Adivalor' },
  { href: 'https://amorce.asso.fr/', src: '/assets/logo amorce.png', name: 'Amorce' },
]

export default function Home() {
  return (
    <PageTransition>
      <main>
        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-grid container">
            <div className="hero-copy">
              <motion.span
                className="eyebrow"
                initial={{ opacity: 0, scale: .88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: .1, duration: .5 }}
              >
                <span className="eyebrow-dot" /> Compostage urbain nouvelle génération
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .25, duration: .7, ease: [.22,1,.36,1] }}
              >
                Le composteur urbain intelligent.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .4, duration: .6 }}
              >
                GreenLoop simplifie le dépôt des déchets organiques en ville grâce à un composteur autonome, une identification par QR code et une application mobile claire.
              </motion.p>

              <motion.div
                className="hero-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .55, duration: .55 }}
              >
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}>
                  <Link className="btn btn-primary" to="/conception">Découvrir l'application</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}>
                  <Link className="btn btn-secondary" to="/vision">Voir la vision du projet</Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="metrics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: .75, duration: .6 }}
              >
                <div className="metric"><strong>Autonome</strong><span>Accès, pesée et suivi pensés pour un usage simple.</span></div>
                <div className="metric"><strong>Connecté</strong><span>Application mobile et logique de points pour suivre les dépôts.</span></div>
                <div className="metric"><strong>Urbain</strong><span>Une solution conçue pour les villes, collectivités et lieux partagés.</span></div>
              </motion.div>
            </div>

            <motion.div
              className="device-wrap"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: .3, duration: .8, ease: [.22,1,.36,1] }}
            >
              <div className="glow" />
              <div className="phone-shell">
                <div className="phone-screen">
                  <iframe
                    src="https://composte-urabain.vercel.app"
                    allow="geolocation"
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: 'inherit' }}
                    title="Application GreenLoop"
                  />
                </div>
              </div>
              <motion.div
                className="floating-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .9, duration: .5 }}
              >
                <strong>+240 pts</strong>
                <p>Valorisation du dépôt et estimation du compost produit.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Principe ── */}
        <section className="block">
          <Section>
            <div className="section-head container">
              <div>
                <motion.div className="kicker" variants={fadeUp}>Le principe</motion.div>
                <motion.h2 variants={fadeUp}>Un parcours simple du déchet au compost.</motion.h2>
              </div>
            </div>
            <div className="grid-4 container">
              {steps.map(s => (
                <motion.article key={s.n} className="card" variants={fadeUp} whileHover={{ y: -5, transition: { duration: .2 } }}>
                  <div className="step-number">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </motion.article>
              ))}
            </div>
          </Section>
        </section>

        {/* ── Partenaires ── */}
        <section className="block">
          <Section>
            <div className="section-head container">
              <div>
                <motion.div className="kicker" variants={fadeUp}>Les partenaires</motion.div>
                <motion.h2 variants={fadeUp}>Des soutiens visibles sur le projet.</motion.h2>
              </div>
              <motion.p variants={fadeUp}>Des acteurs engagés qui accompagnent et soutiennent le projet GreenLoop.</motion.p>
            </div>
            <div className="partner-logos container">
              {partners.map(p => (
                <motion.a
                  key={p.name}
                  className="logo-card"
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  variants={fadeUp}
                  whileHover={{ y: -5, transition: { duration: .2 } }}
                >
                  <div className="logo-box">
                    <img src={p.src} alt={p.name} />
                  </div>
                  <strong>{p.name}</strong>
                </motion.a>
              ))}
            </div>
          </Section>
        </section>

        {/* ── CTA band ── */}
        <Section>
          <motion.div className="cta-band container" variants={fadeUp}>
            <div>
              <div className="kicker">Explorer GreenLoop</div>
              <h3>Poursuivre la découverte du projet.</h3>
            </div>
            <div className="index-links">
              <Link to="/equipe">Équipe & partenaires</Link>
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
