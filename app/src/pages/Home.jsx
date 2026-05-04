import { Link } from 'react-router-dom'
import './Home.css'

export default function Home(){
  return <main className='premium-home'>
    <section className='cinematic hero-eco'>
      <div className='container story'>
        <p className='label'>GREENLOOP / ÉDITION PREMIUM</p>
        <h1>Le compostage urbain devient un produit d'exception.</h1>
        <p>GreenLoop simplifie le dépôt des déchets organiques en ville grâce à un composteur autonome, une identification par QR code et une application mobile claire.</p>
        <div className='actions'><Link to='/conception' className='btn btn-main'>Découvrir le produit</Link><Link to='/modeles' className='btn btn-alt'>Voir la conception 3D</Link></div>
      </div>
    </section>

    <section className='cinematic dark-cut'>
      <div className='container split-copy'>
        <div><p className='label'>UNE VISION</p><h2>Une écologie élégante, simple et utile.</h2></div>
        <p>GreenLoop valorise un geste quotidien en une expérience haut de gamme : moins de déchets incinérés, plus de compost local, et un suivi concret pour chaque utilisateur.</p>
      </div>
    </section>

    <section className='cinematic route-cut'>
      <div className='container route-grid'>
        <Link to='/equipe'><span>01</span><h3>Équipe & partenaires</h3><p>Les acteurs qui portent le projet.</p></Link>
        <Link to='/conception'><span>02</span><h3>Conception & application</h3><p>Le fonctionnement technique et l'expérience utilisateur.</p></Link>
        <Link to='/vision'><span>03</span><h3>Vision écologique</h3><p>L'impact environnemental et la logique circulaire.</p></Link>
        <Link to='/modeles'><span>04</span><h3>Modèles 3D</h3><p>La structure et les composants du prototype.</p></Link>
      </div>
    </section>
  </main>
}
