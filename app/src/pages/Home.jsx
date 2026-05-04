import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <main className='home-premium'>
      <section className='hero-premium'>
        <div className='hero-overlay' />
        <div className='container hero-wrap'>
          <p className='label'>GREENLOOP / CINEMATIC ECOLOGY</p>
          <h1>Le composteur urbain intelligent, pensé comme un produit premium.</h1>
          <p className='sub'>Une vision écologique forte, une expérience claire, et un projet qui transforme les biodéchets en ressource locale.</p>
          <div className='hero-cta'>
            <Link to='/conception' className='btn primary'>Voir la conception</Link>
            <Link to='/vision' className='btn ghost'>Découvrir la vision</Link>
          </div>
        </div>
      </section>

      <section className='section-product container'>
        <div className='product-copy'>
          <p className='label'>LE PRODUIT</p>
          <h2>Une expérience continue entre composteur, données et application.</h2>
          <p>GreenLoop simplifie le dépôt des déchets organiques en ville grâce à un composteur autonome, une identification par QR code et une application mobile claire.</p>
          <div className='row-links'>
            <Link to='/modeles'>Explorer les modèles 3D</Link>
            <Link to='/equipe'>Rencontrer l'équipe</Link>
            <Link to='/conception'>Comprendre la technique</Link>
          </div>
        </div>
        <div className='product-frame'>
          <iframe src='https://composte-urabain.vercel.app' title='Application GreenLoop' />
        </div>
      </section>

      <section className='section-film'>
        <div className='container film-grid'>
          <article>
            <p className='label'>CHAPITRE 01</p>
            <h3>Équipe & partenaires</h3>
            <p>Les personnes et structures qui rendent le projet crédible et réalisable.</p>
            <Link to='/equipe'>Entrer dans le chapitre</Link>
          </article>
          <article>
            <p className='label'>CHAPITRE 02</p>
            <h3>Conception & application</h3>
            <p>La mécanique complète du système, de l'accès au suivi des données.</p>
            <Link to='/conception'>Entrer dans le chapitre</Link>
          </article>
          <article>
            <p className='label'>CHAPITRE 03</p>
            <h3>Vision écologique</h3>
            <p>Le sens du projet, ses enjeux et son impact dans la ville.</p>
            <Link to='/vision'>Entrer dans le chapitre</Link>
          </article>
        </div>
      </section>
    </main>
  )
}
