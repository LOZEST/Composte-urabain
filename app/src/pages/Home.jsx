import { Link } from 'react-router-dom'
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
    camera.position.set(0, 0.7, 4.8)
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const light = new THREE.PointLight(0x7df5be, 2, 20)
    light.position.set(0, 2, 2)
    scene.add(light)
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.9, 1.5, 16, 30), new THREE.MeshStandardMaterial({ color: 0x1f9f70, metalness: 0.35, roughness: 0.25 }))
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.06, 28, 80), new THREE.MeshStandardMaterial({ color: 0xd5ffe9, emissive: 0x1b4f3a }))
    halo.rotation.x = Math.PI / 2
    halo.position.y = 0.8
    scene.add(body); scene.add(halo)
    let raf
    const loop = () => { body.rotation.y += 0.004; halo.rotation.z += 0.008; renderer.render(scene, camera); raf = requestAnimationFrame(loop) }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} className='lux-canvas' />
}

export default function Home() {
  return (
    <main className='lux'>
      <section className='hero-lux'>
        <div className='container hero-content'>
          <p className='micro'>GREENLOOP / CINEMATIC EDITION</p>
          <h1>Le compostage urbain dans une nouvelle dimension premium.</h1>
          <p className='intro'>Une expérience fluide, élégante et écologique. Découvrez l'univers GreenLoop, puis explorez chaque page pour entrer dans le détail du projet.</p>
          <div className='hero-btns'>
            <Link to='/conception' className='btn primary'>Commencer la découverte</Link>
            <Link to='/modeles' className='btn ghost'>Explorer la 3D</Link>
          </div>
        </div>
      </section>

      <section className='section-lux split-lux container'>
        <div><p className='micro'>APERÇU 3D</p><h2>Une présence visuelle forte.</h2><p>Le prototype prend vie dans une scène 3D dédiée. La suite vous attend dans la page Modèles 3D.</p></div>
        <div className='canvas-shell'><Sculpture3D /></div>
      </section>

      <section className='section-lux container teaser-grid'>
        <article><h3>Conception & application</h3><p>Le parcours utilisateur et l'architecture technique en détail.</p><Link to='/conception'>Voir la page</Link></article>
        <article><h3>Vision écologique</h3><p>Impact environnemental, chiffres clés et ambition de déploiement.</p><Link to='/vision'>Voir la page</Link></article>
        <article><h3>Équipe & partenaires</h3><p>Le collectif GreenLoop et les soutiens qui crédibilisent le projet.</p><Link to='/equipe'>Voir la page</Link></article>
      </section>
    </main>
  )
}
