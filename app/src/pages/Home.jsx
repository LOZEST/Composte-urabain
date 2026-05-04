import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Home.css'

function CinematicBackground(){const ref=useRef(null);useEffect(()=>{const c=ref.current;const r=new THREE.WebGLRenderer({canvas:c,antialias:true,alpha:true});const s=new THREE.Scene();const cam=new THREE.PerspectiveCamera(55,c.clientWidth/c.clientHeight,.1,100);cam.position.z=5;r.setSize(c.clientWidth,c.clientHeight);const stars=[];const g=new THREE.BufferGeometry();const p=[];for(let i=0;i<1200;i++){p.push((Math.random()-.5)*18,(Math.random()-.5)*10,(Math.random()-.5)*8)}g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));const pts=new THREE.Points(g,new THREE.PointsMaterial({color:0x8cffc8,size:.03}));s.add(pts);let id;const a=()=>{id=requestAnimationFrame(a);pts.rotation.y+=.0008;pts.rotation.x+=.0002;r.render(s,cam)};a();const rs=()=>{r.setSize(c.clientWidth,c.clientHeight);cam.aspect=c.clientWidth/c.clientHeight;cam.updateProjectionMatrix()};window.addEventListener('resize',rs);return()=>{cancelAnimationFrame(id);window.removeEventListener('resize',rs);r.dispose()}},[]);return <canvas ref={ref} className='bg-canvas'/>}

export default function Home(){return <main className='home-cine'>
  <section className='hero-cine'>
    <CinematicBackground/>
    <div className='container hero-inner'>
      <p className='micro'>GREENLOOP • EXPERIENCE</p>
      <h1>Compostage urbain premium, pensé pour la ville de demain.</h1>
      <p>GreenLoop modernise le geste écologique avec une expérience claire, connectée et valorisante.</p>
      <div className='hero-actions'><Link className='btn primary' to='/conception'>Conception & application</Link><Link className='btn ghost' to='/modeles'>Explorer les modèles 3D</Link></div>
    </div>
  </section>

  <section className='container teaser-grid'>
    <Link to='/equipe' className='teaser'><span>01</span><h3>Équipe & partenaires</h3><p>Rencontrez les acteurs du projet et l'écosystème qui le soutient.</p></Link>
    <Link to='/conception' className='teaser'><span>02</span><h3>Conception & application</h3><p>Découvrez le fonctionnement technique et l'expérience utilisateur.</p></Link>
    <Link to='/vision' className='teaser'><span>03</span><h3>Vision écologique</h3><p>Comprenez l'impact environnemental et la logique circulaire de GreenLoop.</p></Link>
    <Link to='/modeles' className='teaser'><span>04</span><h3>Modèles 3D</h3><p>Plongez dans la structure et les composants du prototype.</p></Link>
  </section>
</main>}
