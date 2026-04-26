import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import './Page.css'
import './Vision.css'

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

const impacts = [
  { icon: '🚛', label: 'Moins de transport de déchets' },
  { icon: '🔥', label: "Moins d'incinération" },
  { icon: '🌱', label: "Production d'engrais naturel local" },
  { icon: '💨', label: 'Réduction des émissions liées aux circuits classiques' },
]

const deployments = [
  { icon: '🏢', title: 'Immeubles', desc: 'Installé dans les parties communes, il permet aux résidents de composter facilement sans sortir de leur quartier.' },
  { icon: '🏭', title: 'Entreprises', desc: "Les déchets de restauration collective sont valorisés sur place, réduisant les coûts de collecte et l'empreinte carbone." },
  { icon: '🏫', title: 'Écoles', desc: "Un outil pédagogique concret pour sensibiliser les élèves au recyclage et à l'économie circulaire." },
  { icon: '🏛️', title: 'Espaces publics', desc: "Marchés, places, centres commerciaux — partout où les déchets organiques s'accumulent." },
  { icon: '🌳', title: 'Parcs', desc: 'Le compost produit peut directement nourrir les espaces verts environnants, fermant la boucle localement.' },
]

export default function Vision() {
  return (
    <PageTransition>
      <main>
        <section className="page-hero">
          <div className="container">
            <motion.div className="kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}>Vision écologique</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .65, ease: [.22,1,.36,1] }}>
              Rendre le compostage urbain plus visible, plus simple et plus utile.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .55 }}>
              En ville, le compostage reste encore peu présent et souvent difficile à pratiquer. GreenLoop propose une réponse concrète : un système autonome qui transforme les déchets organiques en ressource locale.
            </motion.p>
          </div>
        </section>

        {/* Chiffres clés */}
        <section className="block">
          <Section>
            <div className="section-head container">
              <div>
                <motion.div className="kicker" variants={fadeUp}>Chiffres clés</motion.div>
                <motion.h2 variants={fadeUp}>Une problématique bien réelle.</motion.h2>
              </div>
            </div>
            <div className="grid-2 container">
              {[
                { stat: '30%', desc: 'des déchets ménagers sont compostables en moyenne.' },
                { stat: '150–200 kg', desc: 'de biodéchets produits par foyer et par an.' },
              ].map(s => (
                <motion.article key={s.stat} className="card stat-card" variants={fadeUp} whileHover={{ y: -4, transition: { duration: .2 } }}>
                  <div className="stat-number">{s.stat}</div>
                  <p>{s.desc}</p>
                </motion.article>
              ))}
            </div>
          </Section>
        </section>

        {/* Cartes principales */}
        <section className="block">
          <Section className="grid-3 container">
            {[
              { title: 'Réduire les déchets', desc: "Les biodéchets sont valorisés au lieu d'être perdus dans les circuits classiques." },
              { title: 'Créer une ressource locale', desc: 'Le compost produit peut être récupéré et utilisé à proximité, dans une logique plus circulaire.' },
              { title: 'Encourager le geste', desc: "L'application et le système de points rendent l'usage plus concret et plus motivant." },
            ].map(c => (
              <motion.article key={c.title} className="card" variants={fadeUp} whileHover={{ y: -4, transition: { duration: .2 } }}>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </motion.article>
            ))}
          </Section>
        </section>

        {/* Notre impact */}
        <section className="block">
          <Section>
            <motion.div className="impact-box container" variants={fadeUp}>
              <div className="kicker">Notre impact</div>
              <h2>Ce que GreenLoop change concrètement.</h2>
              <div className="impact-grid">
                {impacts.map(i => (
                  <motion.div key={i.label} className="impact-item" variants={fadeUp} whileHover={{ scale: 1.02, transition: { duration: .2 } }}>
                    <span className="impact-icon">{i.icon}</span>
                    <span>{i.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Section>
        </section>

        {/* Déploiement */}
        <section className="block">
          <Section>
            <div className="section-head container">
              <div>
                <motion.div className="kicker" variants={fadeUp}>Déploiement</motion.div>
                <motion.h2 variants={fadeUp}>Où GreenLoop s'intègre.</motion.h2>
              </div>
              <motion.p variants={fadeUp}>GreenLoop est conçu pour s'adapter à de nombreux environnements urbains et partagés.</motion.p>
            </div>
            <div className="grid-3 container" style={{ gridTemplateColumns: 'repeat(3,minmax(0,1fr))' }}>
              {deployments.map(d => (
                <motion.article key={d.title} className="card deploy-card" variants={fadeUp} whileHover={{ y: -4, transition: { duration: .2 } }}>
                  <span className="deploy-icon">{d.icon}</span>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                </motion.article>
              ))}
            </div>
          </Section>
        </section>

        {/* Pourquoi */}
        <section className="block">
          <Section>
            <div className="section-head container">
              <div>
                <motion.div className="kicker" variants={fadeUp}>Pourquoi GreenLoop</motion.div>
                <motion.h2 variants={fadeUp}>Une ville plus verte a besoin d'outils simples.</motion.h2>
              </div>
              <motion.p variants={fadeUp}>Le projet répond à un constat clair : composter en intérieur ou en ville est encore compliqué. GreenLoop rend cette action plus accessible et plus moderne.</motion.p>
            </div>
            <div className="grid-2 container">
              {[
                { title: 'Pour les citoyens', desc: 'Une expérience plus simple, plus claire, avec une vraie récompense visuelle et un suivi concret.' },
                { title: 'Pour les collectivités et entreprises', desc: "Une solution qui valorise l'engagement écologique et donne une image innovante du territoire ou du lieu équipé." },
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
              <div className="kicker">Voir plus</div>
              <h3>Explorer l'équipe, la conception et les modèles du projet.</h3>
            </div>
            <div className="index-links">
              <Link to="/equipe">Équipe & partenaires</Link>
              <Link to="/conception">Conception & app</Link>
              <Link to="/modeles">Modèles 3D</Link>
            </div>
          </motion.div>
        </Section>
      </main>
    </PageTransition>
  )
}
