import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Home.css'

const steps = [
  { n: '01', title: 'Trouver', desc: "L'utilisateur localise le composteur GreenLoop le plus proche depuis l'application." },
  { n: '02', title: "S'identifier", desc: "Le QR code sécurise l'accès et permet de reconnaître l'utilisateur." },
  { n: '03', title: 'Déposer', desc: 'Les déchets verts sont pesés et valorisés automatiquement dans le système.' },
  { n: '04', title: 'Récupérer', desc: "Les points et le compost disponible peuvent être suivis depuis l'app." },
]

function Compost3D() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 1.1, 6)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    scene.add(new THREE.AmbientLight(0xffffff, 0.75))
    const key = new THREE.DirectionalLight(0x7cf7c4, 1.2)
    key.position.set(3, 5, 4)
    scene.add(key)

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(1.7, 2.3, 3.8, 40),
      new THREE.MeshStandardMaterial({ color: 0x1f242b, roughness: 0.35, metalness: 0.6 })
    )
    scene.add(body)

    const hatch = new THREE.Mesh(
      new THREE.TorusGeometry(1.72, 0.08, 18, 100),
      new THREE.MeshStandardMaterial({ color: 0x5ff5b1, emissive: 0x103428, metalness: 0.8 })
    )
    hatch.rotation.x = Math.PI / 2
    hatch.position.y = 1.6
    scene.add(hatch)

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(2.45, 2.45, 0.2, 40),
      new THREE.MeshStandardMaterial({ color: 0x0f1012, roughness: 0.9 })
    )
    base.position.y = -1.95
    scene.add(base)

    let id
    const loop = () => {
      id = requestAnimationFrame(loop)
      body.rotation.y += 0.0045
      hatch.rotation.z += 0.008
      renderer.render(scene, camera)
    }
    loop()

    const onResize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return <canvas ref={ref} className='showcase-canvas' />
}

export default function Home() {
  return (
    <main className='tourbillon-style'>
      <section id='hero' className='hero-film'>
        <div className='hero-overlay container'>
          <p className='hero-kicker'>GREENLOOP — COMPOSTAGE URBAIN</p>
          <h1>Une nouvelle expérience du compostage intelligent.</h1>
          <p>
            GreenLoop simplifie le dépôt des déchets organiques en ville grâce à un composteur autonome,
            une identification par QR code et une application mobile claire.
          </p>
          <div className='hero-actions'>
            <a href='#conception' className='btn-light'>Découvrir l'application</a>
            <a href='#vision' className='btn-outline'>Vision du projet</a>
          </div>
        </div>
      </section>

      <section id='modeles' className='showcase-3d container'>
        <div>
          <p className='section-kicker'>MODÈLES 3D</p>
          <h2>Explorer la conception du prototype.</h2>
          <p>Visualisez l'assemblage final du composteur GreenLoop en 3D.</p>
        </div>
        <Compost3D />
      </section>

      <section id='conception' className='section-split container'>
        <div className='phone-panel'>
          <iframe src='https://composte-urabain.vercel.app' title='Application GreenLoop' allow='geolocation' />
        </div>
        <div>
          <p className='section-kicker'>CONCEPTION & APPLICATION</p>
          <h2>Une solution technique pensée pour être simple à utiliser.</h2>
          <ul>
            <li><strong>Accès sécurisé</strong> via QR code.</li>
            <li><strong>Pesée automatique</strong> des dépôts.</li>
            <li><strong>Chaîne d'énergie</strong> solaire + batterie.</li>
            <li><strong>Suivi mobile</strong> des points et du compost.</li>
          </ul>
        </div>
      </section>

      <section id='vision' className='dark-band'>
        <div className='container'>
          <p className='section-kicker'>VISION ÉCOLOGIQUE</p>
          <h2>Rendre le compostage urbain plus visible, plus simple et plus utile.</h2>
          <div className='stats-row'>
            <article><strong>30%</strong><span>des déchets ménagers sont compostables.</span></article>
            <article><strong>150–200 kg</strong><span>de biodéchets par foyer et par an.</span></article>
            <article><strong>Impact local</strong><span>Moins de transport, moins d'incinération, plus d'engrais naturel.</span></article>
          </div>
        </div>
      </section>

      <section id='equipe' className='section-steps container'>
        <p className='section-kicker'>ÉQUIPE & PARCOURS UTILISATEUR</p>
        <h2>Du geste citoyen à la valorisation locale.</h2>
        <div className='steps-grid'>{steps.map(s => <article key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.desc}</p></article>)}</div>
      </section>
    </main>
  )
}
