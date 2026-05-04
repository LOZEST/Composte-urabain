import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Home.css'

function Sculpture3D() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 0.6, 4.8)
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const key = new THREE.DirectionalLight(0x8fffd1, 1.5)
    key.position.set(3, 3, 3)
    scene.add(key)

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.9, 1.5, 16, 30), new THREE.MeshStandardMaterial({ color: 0x1f9f70, metalness: 0.35, roughness: 0.25 }))
    scene.add(body)
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.06, 28, 80), new THREE.MeshStandardMaterial({ color: 0xd5ffe9, emissive: 0x1b4f3a }))
    halo.rotation.x = Math.PI / 2
    halo.position.y = 0.8
    scene.add(halo)

    const animate = () => {
      body.rotation.y += 0.004
      halo.rotation.z += 0.008
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    let raf = requestAnimationFrame(animate)

    const onResize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); renderer.dispose() }
  }, [])

  return <canvas ref={canvasRef} className='lux-canvas' />
}

export default function Home() {
  return (
    <main className='lux'>
      <section id='hero' className='hero-lux'>
        <div className='container hero-content'>
          <p className='micro'>GREENLOOP / URBAN COMPOST SYSTEM</p>
          <h1>Une nouvelle référence du compostage urbain.</h1>
          <p className='intro'>GreenLoop simplifie le dépôt des déchets organiques en ville grâce à un composteur autonome, une identification par QR code et une application mobile claire.</p>
          <div className='hero-btns'><a href='#conception' className='btn primary'>Découvrir l'application</a><a href='#vision' className='btn ghost'>Vision écologique</a></div>
        </div>
      </section>

      <section id='modeles' className='section-lux split-lux container'>
        <div><p className='micro'>SCULPTED IN 3D</p><h2>Prototype 3D signature.</h2><p>Visualisez l'assemblage final du composteur GreenLoop en 3D. Faites pivoter, zoomez et explorez chaque composant directement dans le navigateur.</p></div>
        <div className='canvas-shell'><Sculpture3D /></div>
      </section>

      <section id='conception' className='section-lux container'>
        <p className='micro'>CONCEPTION & APPLICATION</p><h2>Technique, usage, fluidité.</h2>
        <div className='grid-lux'>
          <iframe src='https://composte-urabain.vercel.app' title='Application GreenLoop' />
          <article><h3>Accès sécurisé</h3><p>Ouverture via QR code pour relier l'action à l'utilisateur.</p><h3>Pesée automatique</h3><p>Le poids des déchets verts est mesuré lors du dépôt.</p><h3>Chaîne complète</h3><p>Information, énergie et interface mobile dans un système cohérent.</p></article>
        </div>
      </section>

      <section id='vision' className='section-lux full-band'>
        <div className='container'><p className='micro'>VISION ÉCOLOGIQUE</p><h2>Rendre le compostage urbain plus visible, plus simple et plus utile.</h2><div className='stats'><span>30% de déchets ménagers compostables</span><span>150–200 kg de biodéchets / foyer / an</span><span>Production d'engrais naturel local</span><span>Réduction des émissions</span></div></div>
      </section>

      <section id='equipe' className='section-lux container'>
        <p className='micro'>ÉQUIPE & PARTENAIRES</p><h2>Un collectif engagé.</h2>
        <div className='names'>{['Lucien Bisiaux','Louis Giraudel','Eliot Farys','Théophile Berenger','Clément Hintzy'].map(n => <span key={n}>{n}</span>)}</div>
      </section>
    </main>
  )
}
