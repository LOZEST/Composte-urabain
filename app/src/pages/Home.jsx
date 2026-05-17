import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Home.css'

function HeroMachine(){
  const ref=useRef(null)
  useEffect(()=>{const c=ref.current,r=new THREE.WebGLRenderer({canvas:c,antialias:true,alpha:true}),s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(50,c.clientWidth/c.clientHeight,.1,100);cam.position.set(0,1.5,5);r.setSize(c.clientWidth,c.clientHeight);r.setPixelRatio(Math.min(window.devicePixelRatio,2));s.add(new THREE.AmbientLight(0xffffff,.4));const key=new THREE.DirectionalLight(0xf6d08d,1.5);key.position.set(4,5,3);s.add(key);const body=new THREE.Mesh(new THREE.BoxGeometry(3,1.2,1.4),new THREE.MeshStandardMaterial({color:0x161616,metalness:.85,roughness:.25}));const top=new THREE.Mesh(new THREE.BoxGeometry(1.8,.6,1.2),new THREE.MeshStandardMaterial({color:0x1f1f1f,metalness:.75,roughness:.2}));top.position.y=.8;s.add(body,top);const ring=new THREE.Mesh(new THREE.TorusGeometry(1.7,.04,20,120),new THREE.MeshStandardMaterial({color:0xcaa46d,emissive:0x332211}));ring.rotation.x=Math.PI/2;ring.position.y=-.2;s.add(ring);let id;const a=()=>{id=requestAnimationFrame(a);body.rotation.y+=.004;top.rotation.y+=.004;ring.rotation.z+=.01;r.render(s,cam)};a();return()=>{cancelAnimationFrame(id);r.dispose()}},[])
  return <canvas ref={ref} className='hero-canvas'/>
}

export default function Home(){return <main className='tourbillon-style'>
<section id='hero' className='hero fs'><div className='container'><p className='overline'>GreenLoop · Hyper-Urban Composting</p><h1>POUR LA VILLE.<br/>POUR L'ÉTERNITÉ.</h1><p className='intro'>Un composteur urbain intelligent qui unit design, technologie et impact écologique dans une expérience premium.</p><a href='#conception' className='cta'>Explorer le projet</a></div><HeroMachine/></section>

<section id='conception' className='section fs'><div className='container split'><div><p className='overline'>Conception & application</p><h2>Une architecture pensée comme une machine de précision.</h2><p>GreenLoop combine composteur autonome, application mobile, QR code, pesée et suivi des données pour rendre le compostage urbain plus lisible.</p></div><iframe src='https://composte-urabain.vercel.app' title='Application GreenLoop'/></div></section>

<section id='vision' className='section dark'><div className='container'><p className='overline'>Vision écologique</p><h2>Transformer les biodéchets en ressource locale.</h2><div className='grid'>{['30% des déchets ménagers sont compostables','150–200 kg de biodéchets par foyer et par an','Moins de transport, moins d’incinération','Production d’engrais naturel local'].map(t=><article key={t}>{t}</article>)}</div></div></section>

<section id='equipe' className='section'><div className='container'><p className='overline'>Équipe & partenaires</p><h2>Un collectif qui conçoit, développe et déploie.</h2><div className='names'>{['Lucien Bisiaux','Louis Giraudel','Eliot Farys','Théophile Berenger','Clément Hintzy'].map(n=><span key={n}>{n}</span>)}</div></div></section>

<section id='modeles' className='section'><div className='container'><p className='overline'>Modèles 3D</p><h2>Explorer la conception du prototype.</h2><p>Visualisez l'assemblage final du composteur GreenLoop en 3D. Faites pivoter, zoomez et explorez chaque composant directement dans le navigateur.</p></div></section>
</main>}
