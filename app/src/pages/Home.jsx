import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import './Home.css'

function ProductStage() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 0.9, 4.4)
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const k = new THREE.DirectionalLight(0x8fffcf, 1.3)
    k.position.set(3, 4, 2)
    scene.add(k)

    const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 2.6, 48), new THREE.MeshStandardMaterial({ color: 0x1b8d62, metalness: 0.3, roughness: 0.25 }))
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.18, 48), new THREE.MeshStandardMaterial({ color: 0x102b20 }))
    lid.position.y = 1.4
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.16, 0.05, 28, 90), new THREE.MeshStandardMaterial({ color: 0xd8ffec, emissive: 0x1d5b41 }))
    ring.rotation.x = Math.PI / 2
    ring.position.y = 1.22
    scene.add(shell, lid, ring)

    let id
    const loop = () => { id = requestAnimationFrame(loop); shell.rotation.y += 0.0035; ring.rotation.z += 0.0075; renderer.render(scene, camera) }
    loop()

    const onResize = () => { renderer.setSize(canvas.clientWidth, canvas.clientHeight); camera.aspect = canvas.clientWidth / canvas.clientHeight; camera.updateProjectionMatrix() }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', onResize); renderer.dispose() }
  }, [])

  return <canvas ref={ref} className='stage-canvas' />
}

export default function Home() {
  return (
    <main className='home-premium'>
      <section className='hero-premium'>
        <div className='cinematic-overlay' />
        <div className='container hero-content'>
          <p className='kicker'>GREENLOOP / PREMIUM ECOLOGY</p>
          <h1>Le compostage urbain devient un produit d'excellence.</h1>
          <p>GreenLoop simplifie le dépôt des déchets organiques en ville grâce à un composteur autonome, une identification par QR code et une application mobile claire.</p>
          <div className='hero-links'>
            <Link to='/conception' className='cta-main'>Découvrir la conception</Link>
            <Link to='/modeles' className='cta-sub'>Explorer les modèles 3D</Link>
          </div>
        </div>
      </section>

      <section className='product-focus'>
        <div className='container'>
          <p className='kicker'>LE PRODUIT</p>
          <h2>Un composteur pensé comme une pièce centrale de la ville durable.</h2>
          <ProductStage />
        </div>
      </section>

      <section className='narrative-band'>
        <div className='container narrative-grid'>
          <div>
            <h3>Équipe & partenaires</h3>
            <p>Voir qui porte GreenLoop et les soutiens qui renforcent sa crédibilité.</p>
            <Link to='/equipe'>Aller à la page équipe</Link>
          </div>
          <div>
            <h3>Vision écologique</h3>
            <p>Comprendre l'impact concret : réduction des déchets, valorisation locale, circularité.</p>
            <Link to='/vision'>Voir la vision</Link>
          </div>
          <div>
            <h3>Conception & application</h3>
            <p>Découvrir l'expérience mobile, la sécurité QR et la logique technique complète.</p>
            <Link to='/conception'>Entrer dans la conception</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
