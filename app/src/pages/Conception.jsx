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

export default function Conception() {
  return (
    <PageTransition>
      <main>
        <section className="page-hero">
          <div className="container">
            <motion.div className="kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}>Conception & application</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .65, ease: [.22,1,.36,1] }}>
              Une solution technique pensée pour être simple à utiliser.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .55 }}>
              GreenLoop combine composteur autonome, application mobile, QR code, pesée et suivi des données pour rendre le compostage urbain plus lisible.
            </motion.p>
          </div>
        </section>

        <section className="block">
          <Section className="grid-2 container">
            <motion.article className="card" variants={fadeUp} whileHover={{ y: -4, transition: { duration: .2 } }}>
              <div className="kicker">Le composteur</div>
              <h3>Un fonctionnement autonome</h3>
              <div className="feature-list">
                <div className="feature-item"><strong>Accès sécurisé</strong><span>Ouverture via QR code pour relier l'action à l'utilisateur.</span></div>
                <div className="feature-item"><strong>Pesée automatique</strong><span>Le poids des déchets verts est mesuré lors du dépôt.</span></div>
                <div className="feature-item"><strong>Cuves multiples</strong><span>Le cycle de compostage est mieux organisé et suivi.</span></div>
                <div className="feature-item"><strong>Autonomie énergétique</strong><span>Le système peut être alimenté par une logique solaire et batterie.</span></div>
              </div>
            </motion.article>

            <motion.article className="card" variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="kicker">L'application</div>
              <h3>Un parcours clair sur smartphone</h3>
              <div className="phone-shell" style={{ position: 'relative', margin: '24px auto 0' }}>
                <div className="phone-screen">
                  <iframe
                    src="https://composte-urabain.vercel.app"
                    allow="geolocation"
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: 'inherit' }}
                    title="Application GreenLoop"
                  />
                </div>
              </div>
            </motion.article>
          </Section>
        </section>

        <section className="block">
          <Section>
            <div className="section-head container">
              <div>
                <motion.div className="kicker" variants={fadeUp}>Code & architecture</motion.div>
                <motion.h2 variants={fadeUp}>Une logique complète entre information, énergie et usage.</motion.h2>
              </div>
              <motion.p variants={fadeUp}>Le projet articule capteurs, microcontrôleur, actionneurs et interface mobile dans une chaîne cohérente.</motion.p>
            </div>
            <div className="grid-3 container">
              {[
                { title: "Chaîne d'information", desc: "Lecture du QR code, capteur de poids, traitement et retour d'information à l'utilisateur." },
                { title: "Chaîne d'énergie", desc: 'Panneau solaire, batterie, régulation et alimentation des composants du système.' },
                { title: 'Développement', desc: 'Programmation, logique de données, interface visuelle et pilotage du prototype.' },
              ].map(c => (
                <motion.article key={c.title} className="card" variants={fadeUp} whileHover={{ y: -4, transition: { duration: .2 } }}>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </motion.article>
              ))}
            </div>
          </Section>
        </section>

        <Section>
          <motion.div className="cta-band container" variants={fadeUp}>
            <div>
              <div className="kicker">Continuer</div>
              <h3>Voir maintenant l'impact écologique et la vision du projet.</h3>
            </div>
            <div className="index-links">
              <Link to="/vision">Vision écologique</Link>
              <Link to="/equipe">Équipe & partenaires</Link>
              <Link to="/modeles">Modèles 3D</Link>
            </div>
          </motion.div>
        </Section>
      </main>
    </PageTransition>
  )
}
