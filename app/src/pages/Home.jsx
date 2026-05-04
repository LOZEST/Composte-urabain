import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Home.css'

function Sculpture3D(){const r=useRef(null);useEffect(()=>{const c=r.current;const re=new THREE.WebGLRenderer({canvas:c,antialias:true,alpha:true});const s=new THREE.Scene();const cam=new THREE.PerspectiveCamera(48,c.clientWidth/c.clientHeight,.1,100);cam.position.set(0,.4,4.4);re.setSize(c.clientWidth,c.clientHeight);s.add(new THREE.AmbientLight(0xffffff,.5));const l=new THREE.DirectionalLight(0x8dffd0,1.4);l.position.set(2,3,3);s.add(l);const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1.15,1),new THREE.MeshStandardMaterial({color:0x2aa976,metalness:.35,roughness:.28}));s.add(m);let id;const a=()=>{id=requestAnimationFrame(a);m.rotation.x+=.002;m.rotation.y+=.004;re.render(s,cam)};a();return()=>{cancelAnimationFrame(id);re.dispose()}},[]);return <canvas ref={r} className='lux-canvas'/>}

export default function Home(){return <main className='lux'>
  <section className='hero-lux'><div className='moving-bg'/><div className='container hero-content'><p className='micro'>GREENLOOP / CINEMATIC EDITION</p><h1>Le compostage urbain devient une expérience premium.</h1><p className='intro'>Un premier aperçu fort du projet, puis des pages dédiées pour entrer en détail dans la conception, la vision écologique, l'équipe et les modèles 3D.</p><div className='hero-btns'><Link to='/conception' className='btn primary'>Entrer dans la conception</Link><Link to='/modeles' className='btn ghost'>Explorer la 3D</Link></div></div></section>

  <section className='section-lux split-lux container'><div><p className='micro'>APERÇU 3D</p><h2>Une présence visuelle cinématique.</h2><p>Le prototype est pensé comme un objet urbain technologique. Pour les détails complets de fonctionnement et d'architecture, consultez la page Conception & application.</p><Link to='/conception' className='text-link'>Voir la page conception →</Link></div><div className='canvas-shell'><Sculpture3D/></div></section>

  <section className='section-lux full-band'><div className='container'><p className='micro'>LES 4 UNIVERS DU PROJET</p><div className='teasers'><Link to='/equipe'><h3>Équipe & partenaires</h3><p>Le collectif, les rôles et les soutiens du projet.</p></Link><Link to='/conception'><h3>Conception & application</h3><p>QR code, pesée, énergie et expérience mobile.</p></Link><Link to='/vision'><h3>Vision écologique</h3><p>L'impact concret et les bénéfices en ville.</p></Link><Link to='/modeles'><h3>Modèles 3D</h3><p>Exploration visuelle des composants clés.</p></Link></div></div></section>
</main>}
