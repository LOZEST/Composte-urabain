import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Home.css'

function Scene3D(){
  const ref=useRef(null)
  useEffect(()=>{const c=ref.current;const r=new THREE.WebGLRenderer({canvas:c,antialias:true,alpha:true});const s=new THREE.Scene();const cam=new THREE.PerspectiveCamera(55,c.clientWidth/c.clientHeight,.1,100);cam.position.set(0,1.2,4);r.setSize(c.clientWidth,c.clientHeight);r.setPixelRatio(Math.min(devicePixelRatio,2));s.add(new THREE.AmbientLight(0xffffff,.65));const dl=new THREE.DirectionalLight(0x9effd1,1.1);dl.position.set(2,4,3);s.add(dl);const base=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.5,2.2,32),new THREE.MeshStandardMaterial({color:0x1d7c57,metalness:.2,roughness:.35}));s.add(base);const ring=new THREE.Mesh(new THREE.TorusGeometry(1.15,.08,24,80),new THREE.MeshStandardMaterial({color:0x98ffcb,emissive:0x123f2e}));ring.rotation.x=Math.PI/2;ring.position.y=.95;s.add(ring);const lid=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,.15,32),new THREE.MeshStandardMaterial({color:0x123f2e}));lid.position.y=1.15;s.add(lid);let id;const loop=()=>{id=requestAnimationFrame(loop);base.rotation.y+=.005;ring.rotation.z+=.01;r.render(s,cam)};loop();const rs=()=>{r.setSize(c.clientWidth,c.clientHeight);cam.aspect=c.clientWidth/c.clientHeight;cam.updateProjectionMatrix()};window.addEventListener('resize',rs);return()=>{cancelAnimationFrame(id);window.removeEventListener('resize',rs);r.dispose()}},[])
  return <canvas ref={ref} className='hero-canvas'/>
}

export default function Home(){return <main className='onepage'>
  <section id='hero' className='hero'><div className='container hero-grid'><div><p className='tag'>GreenLoop · Nouvelle version</p><h1>Un site vitrine fort pour un composteur urbain intelligent.</h1><p className='lead'>GreenLoop simplifie le dépôt des déchets organiques en ville grâce à un composteur autonome, une identification par QR code et une application mobile claire.</p><div className='actions'><a href='#conception' className='btn primary'>Découvrir l'application</a><a href='#vision' className='btn ghost'>Voir la vision du projet</a></div></div><div className='hero-3d'><Scene3D/></div></div></section>

  <section id='conception' className='section container'><h2>Conception & application</h2><div className='split'><iframe src='https://composte-urabain.vercel.app' title='app' /><div className='stack'><article><h3>Accès sécurisé</h3><p>Ouverture via QR code pour relier l'action à l'utilisateur.</p></article><article><h3>Pesée automatique</h3><p>Le poids des déchets verts est mesuré lors du dépôt.</p></article><article><h3>Chaîne complète</h3><p>Information, énergie et interface mobile dans un système cohérent.</p></article></div></div></section>

  <section id='vision' className='section dark'><div className='container'><h2>Vision écologique</h2><p>Rendre le compostage urbain plus visible, plus simple et plus utile.</p><div className='chips'><span>30% des déchets ménagers compostables</span><span>150–200 kg par foyer / an</span><span>Production d'engrais naturel local</span><span>Réduction des émissions</span></div></div></section>

  <section id='equipe' className='section container'><h2>Équipe & partenaires</h2><div className='team'>{['Lucien Bisiaux','Louis Giraudel','Eliot Farys','Théophile Berenger','Clément Hintzy'].map(n=><div key={n} className='pill'>{n}</div>)}</div></section>

  <section id='modeles' className='section container'><h2>Modèles 3D</h2><p>Visualisez l'assemblage final du composteur GreenLoop en 3D. Faites pivoter, zoomez et explorez chaque composant directement dans le navigateur.</p><div className='cards'>{['Structure principale','4 cuves de compostage','Système de pesée','Module électronique','Alimentation solaire','Trappe sécurisée'].map(c=><article key={c}>{c}</article>)}</div></section>
</main>}
