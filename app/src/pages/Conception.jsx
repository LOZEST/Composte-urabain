import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import './Page.css'

const features = [
  ['Accès sécurisé', "Ouverture via QR code pour relier l'action à l'utilisateur."],
  ['Pesée automatique', 'Le poids des déchets verts est mesuré lors du dépôt.'],
  ['Cuves multiples', 'Le cycle de compostage est mieux organisé et suivi.'],
  ['Autonomie énergétique', 'Le système peut être alimenté par une logique solaire et batterie.'],
]

export default function Conception(){
  return <PageTransition><main className='page-v3'>
    <section className='hero-split container'>
      <div><p className='kicker'>Conception & application</p><h1>Une solution technique pensée pour être simple à utiliser.</h1><p>GreenLoop combine composteur autonome, application mobile, QR code, pesée et suivi des données pour rendre le compostage urbain plus lisible.</p></div>
      <div className='phone-box'><iframe src='https://composte-urabain.vercel.app' allow='geolocation' title='Application GreenLoop' /></div>
    </section>
    <section className='container panel'>
      <h2>Le composteur</h2><div className='list'>{features.map(([t,d])=><article key={t}><strong>{t}</strong><p>{d}</p></article>)}</div>
    </section>
    <section className='container panel grid-3'>
      {[['Chaîne d\'information','Lecture du QR code, capteur de poids, traitement et retour d\'information à l\'utilisateur.'],['Chaîne d\'énergie','Panneau solaire, batterie, régulation et alimentation des composants du système.'],['Développement','Programmation, logique de données, interface visuelle et pilotage du prototype.']].map(([t,d])=><article className='card' key={t}><h3>{t}</h3><p>{d}</p></article>)}
    </section>
    <section className='container cta-v2'><h3>Voir maintenant l'impact écologique et la vision du projet.</h3><div className='index-links'><Link to='/vision'>Vision écologique</Link><Link to='/equipe'>Équipe & partenaires</Link><Link to='/modeles'>Modèles 3D</Link></div></section>
  </main></PageTransition>
}
