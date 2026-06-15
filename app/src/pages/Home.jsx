import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'
import './Home.css'

export default function Home(){
  return <main className='home-premium'>
    <section className='hero-film' style={{'--hero-bg': `url(${heroImg})`}}>
      <div className='film-overlay'/>
      <div className='container hero-copy'>
        <p className='eyebrow'>GREENLOOP · CINÉMATIQUE ÉCOLOGIQUE</p>
        <h1>Un composteur urbain qui transforme le geste écologique en expérience premium.</h1>
        <p>GreenLoop simplifie le dépôt des déchets organiques en ville avec un système autonome, connecté et valorisant pour les citoyens, les collectivités et les entreprises.</p>
        <div className='hero-actions'>
          <Link to='/conception' className='btn primary'>Voir le fonctionnement</Link>
          <Link to='/vision' className='btn ghost'>Comprendre l'impact</Link>
        </div>
      </div>
    </section>

    <section className='section-premium container'>
      <p className='eyebrow'>LE PROJET</p>
      <h2>Un projet clair, pensé comme un produit.</h2>
      <div className='project-grid'>
        <article><h3>Autonome</h3><p>Accès, pesée et suivi conçus pour une utilisation fluide.</p></article>
        <article><h3>Connecté</h3><p>Application mobile et logique de points pour suivre les dépôts.</p></article>
        <article><h3>Urbain</h3><p>Solution adaptée aux immeubles, écoles, entreprises et espaces publics.</p></article>
      </div>
    </section>

    <section className='section-premium strip-dark'>
      <div className='container teaser-flow'>
        <div>
          <p className='eyebrow'>PARCOURS</p>
          <h2>Découvrez GreenLoop chapitre par chapitre.</h2>
        </div>
        <div className='teasers'>
          <Link to='/equipe'>Équipe & partenaires</Link>
          <Link to='/conception'>Conception & application</Link>
          <Link to='/vision'>Vision écologique</Link>
          <Link to='/modeles'>Modèles 3D</Link>
        </div>
      </div>
    </section>
  </main>
}
