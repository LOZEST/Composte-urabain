import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import * as THREE from 'three'
import PageTransition from '../components/PageTransition'
import './Page.css'
import './Models.css'

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

const components3d = [
  { icon: '🏗️', title: 'Structure principale', desc: 'Châssis en acier galvanisé avec isolation thermique. Conçu pour résister aux intempéries et aux cycles de compostage.' },
  { icon: '🧺', title: '4 cuves de compostage', desc: 'Remplissage → Ramollissement → Digestion active → Stockage. Chaque cuve suit un cycle précis avec capteurs de température intégrés.' },
  { icon: '⚖️', title: 'Système de pesée', desc: 'Cellule de charge connectée au microcontrôleur. Mesure automatiquement le poids des dépôts à chaque ouverture.' },
  { icon: '📡', title: 'Module électronique', desc: "Microcontrôleur central, lecteur QR code, connectivité Bluetooth/WiFi pour la liaison avec l'application mobile." },
  { icon: '☀️', title: 'Alimentation solaire', desc: "Panneau solaire + batterie pour une autonomie complète. Pas de raccordement électrique nécessaire." },
  { icon: '🔒', title: 'Trappe sécurisée', desc: "Accès verrouillé, ouvert uniquement via QR code depuis l'application. Empêche tout dépôt non identifié." },
]

function Viewer3D() {
  const canvasRef = useRef(null)
  const loaderRef = useRef(null)
  const stateRef = useRef({ autoRotate: true, wireframe: false, rotX: 0, rotY: 0, zoom: 1, mesh: null, isDragging: false, prevX: 0, prevY: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const loaderEl = loaderRef.current
    const s = stateRef.current

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.shadowMap.enabled = true

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x060e0a)

    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.01, 1000)
    camera.position.set(2, 2, 4)

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dl = new THREE.DirectionalLight(0x8cffbe, 1.2)
    dl.position.set(5, 10, 7)
    scene.add(dl)
    const dl2 = new THREE.DirectionalLight(0x38d67a, 0.4)
    dl2.position.set(-5, -3, -5)
    scene.add(dl2)

    const grid = new THREE.GridHelper(10, 20, 0x1a3d2a, 0x112a1c)
    grid.position.y = -1
    scene.add(grid)

    function parseOBJ(text) {
      const positions = [], vertices = [], lines = text.split('\n')
      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        if (parts[0] === 'v') positions.push(+parts[1], +parts[2], +parts[3])
        else if (parts[0] === 'f') {
          const face = parts.slice(1).map(p => p.split('/').map(Number))
          for (let i = 1; i < face.length - 1; i++) {
            [face[0], face[i], face[i+1]].forEach(([vi]) => {
              const idx = (vi - 1) * 3
              vertices.push(positions[idx], positions[idx+1], positions[idx+2])
            })
          }
        }
      }
      return new Float32Array(vertices)
    }

    fetch('https://raw.githubusercontent.com/LOZEST/Composte-urabain/main/CAO/assemblage-final.obj')
      .then(r => { if (!r.ok) throw new Error(); return r.text() })
      .then(text => {
        const verts = parseOBJ(text)
        if (!verts.length) throw new Error()
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(verts, 3))
        geo.computeVertexNormals()
        geo.center()
        const box = new THREE.Box3().setFromBufferAttribute(geo.attributes.position)
        const size = new THREE.Vector3()
        box.getSize(size)
        const sc = 2.5 / Math.max(size.x, size.y, size.z)
        geo.scale(sc, sc, sc)
        const mat = new THREE.MeshStandardMaterial({ color: 0x38d67a, roughness: .45, metalness: .2, side: THREE.DoubleSide })
        s.mesh = new THREE.Mesh(geo, mat)
        scene.add(s.mesh)
        loaderEl.style.display = 'none'
      })
      .catch(() => {
        loaderEl.innerHTML = '<span style="font-size:2rem">⚠️</span><span>Modèle non trouvé. Vérifiez que <code>assemblage-final.obj</code> est bien dans le dossier CAO du repo GitHub.</span>'
      })

    const onMouseDown = e => { s.isDragging = true; s.prevX = e.clientX; s.prevY = e.clientY; s.autoRotate = false }
    const onMouseUp = () => { s.isDragging = false }
    const onMouseMove = e => {
      if (!s.isDragging || !s.mesh) return
      s.rotY += (e.clientX - s.prevX) * .008
      s.rotX += (e.clientY - s.prevY) * .008
      s.rotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, s.rotX))
      s.prevX = e.clientX; s.prevY = e.clientY
    }
    const onWheel = e => { s.zoom *= (1 + e.deltaY * .001); s.zoom = Math.max(.3, Math.min(5, s.zoom)) }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('wheel', onWheel)

    const onResize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    let rafId
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      if (s.mesh) {
        if (s.autoRotate) s.rotY += .005
        s.mesh.rotation.x = s.rotX
        s.mesh.rotation.y = s.rotY
        camera.position.set(0, 0, 5 * s.zoom)
      }
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  const s = stateRef.current
  return (
    <div className="viewer-wrap container">
      <canvas ref={canvasRef} className="three-canvas" />
      <div ref={loaderRef} className="loader-msg">
        <div className="spinner" />
        <span>Chargement du modèle 3D…</span>
      </div>
      <div className="viewer-controls">
        <button className="ctrl-btn active" onClick={() => { s.autoRotate = !s.autoRotate }}>⟳ Rotation auto</button>
        <button className="ctrl-btn" onClick={() => { s.wireframe = !s.wireframe; if (s.mesh) s.mesh.material.wireframe = s.wireframe }}>⬡ Filaire</button>
        <button className="ctrl-btn" onClick={() => { s.rotX = 0; s.rotY = 0; s.zoom = 1; s.autoRotate = true }}>⌖ Recentrer</button>
        <div className="legend">
          <div className="legend-item"><div className="legend-dot" style={{ background: '#38d67a' }} /> Structure</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: '#8cffbe' }} /> Cuves</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: '#ffd100' }} /> Électronique</div>
        </div>
        <span className="hint">🖱 Clic + glisser pour tourner · Molette pour zoomer</span>
      </div>
    </div>
  )
}

export default function Models() {
  return (
    <PageTransition>
      <main>
        <section className="page-hero">
          <div className="container">
            <motion.div className="kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}>Modèles 3D</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .65, ease: [.22,1,.36,1] }}>
              Explorer la conception du prototype.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .55 }}>
              Visualisez l'assemblage final du composteur GreenLoop en 3D. Faites pivoter, zoomez et explorez chaque composant directement dans le navigateur.
            </motion.p>
          </div>
        </section>

        <section className="block">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4, duration: .6 }}>
            <Viewer3D />
          </motion.div>
        </section>

        <section className="block">
          <Section>
            <div className="section-head container">
              <div>
                <motion.div className="kicker" variants={fadeUp}>Schéma de l'assemblage</motion.div>
                <motion.h2 variants={fadeUp}>Les composants clés du système.</motion.h2>
              </div>
            </div>
            <div className="grid-3 container">
              {components3d.map(c => (
                <motion.article key={c.title} className="card deploy-card" variants={fadeUp} whileHover={{ y: -4, transition: { duration: .2 } }}>
                  <span className="deploy-icon">{c.icon}</span>
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
              <h3>Découvrir la conception technique et l'application.</h3>
            </div>
            <div className="index-links">
              <Link to="/conception">Conception & app</Link>
              <Link to="/vision">Vision écologique</Link>
              <Link to="/equipe">Équipe & partenaires</Link>
            </div>
          </motion.div>
        </Section>
      </main>
    </PageTransition>
  )
}
