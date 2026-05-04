import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Home.css'

function Hero3D(){
 const ref=useRef(null)
 useEffect(()=>{const c=ref.current,r=new THREE.WebGLRenderer({canvas:c,antialias:true,alpha:true}),s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,c.clientWidth/c.clientHeight,.1,100);cam.position.set(0,.8,5);r.setSize(c.clientWidth,c.clientHeight);r.setPixelRatio(Math.min(devicePixelRatio,2));s.add(new THREE.AmbientLight(0xffffff,.5));const l=new THREE.DirectionalLight(0x8dffd2,1.4);l.position.set(3,2,3);s.add(l);const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2,2),new THREE.MeshStandardMaterial({color:0x22a873,metalness:.35,roughness:.2,wireframe:false}));s.add(m);let id;const a=()=>{id=requestAnimationFrame(a);m.rotation.x+=.003;m.rotation.y+=.004;r.render(s,cam)};a();return()=>{cancelAnimationFrame(id);r.dispose()}},[])
 return <canvas ref={ref} className='lux-canvas'/>
}

export default function Home(){return <main className='lux-home'>
<section className='cinematic-hero'><div className='bg-motion'/><div className='container hero-wrap'><div><p className='micro'>GREENLOOP · PREMIUM ECOLOGY</p><h1>Le compostage urbain en version cinématique.</h1><p>Une nouvelle manière de présenter GreenLoop : plus premium, plus clair, plus immersif.</p><div className='hero-actions'><Link to='/conception' className='btn prime'>Découvrir le concept</Link><Link to='/modeles' className='btn ghost'>Explorer la 3D</Link></div></div><div className='hero-view'><Hero3D/></div></div></section>
<section className='container teaser-grid'><article><p className='micro'>CONCEPTION</p><h3>Technologie & application</h3><p>Découvrez le système, la logique QR, la pesée et l'app mobile.</p><Link to='/conception'>Voir la page</Link></article><article><p className='micro'>VISION</p><h3>Impact écologique</h3><p>Comprendre pourquoi GreenLoop répond à un vrai enjeu urbain.</p><Link to='/vision'>Voir la page</Link></article><article><p className='micro'>ÉQUIPE</p><h3>Élèves & partenaires</h3><p>Rencontrez l'équipe et les soutiens qui portent le projet.</p><Link to='/equipe'>Voir la page</Link></article></section>
</main>}
