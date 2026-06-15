import { useState } from 'react'
import './Nav.css'
const links=[['hero','Accueil'],['equipe','Équipe'],['conception','Conception'],['vision','Vision'],['modeles','3D']]
export default function Nav(){const[open,setOpen]=useState(false);return <header className='header'><div className='nav'><a className='brand' href='#hero'><span className='brand-mark'><img src='/logo.jpg' alt='GreenLoop'/></span><span className='brand-name'>GreenLoop One</span></a><button className='menu-toggle' onClick={()=>setOpen(!open)}><span/><span/><span/></button><nav className={`nav-links ${open?'open':''}`}>{links.map(([id,l])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{l}</a>)}</nav></div></header>}
