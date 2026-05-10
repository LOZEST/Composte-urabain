/* ═══════════════════════════════════════════════════════════════════
   GreenLoop — Animation Engine v3.0
   ─ Custom cursor + trail
   ─ Loading screen
   ─ Three.js hero (OBJ model + particles + orbit rings)
   ─ Ambient background particle canvas
   ─ Scroll reveal (IntersectionObserver)
   ─ Card 3D tilt on hover
   ─ Magnetic buttons
   ─ Number counter animation
   ─ Parallax orbs
═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── Year ───────────────────────────────────────────────────────── */
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ── Loading Screen ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('gl-loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('loaded');
    setTimeout(() => loader.remove(), 600);
  }, 700);
});


/* ── Scroll Reveal ──────────────────────────────────────────────── */
(function() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.revealDelay || 0;
      setTimeout(() => el.classList.add('is-visible'), +delay);
      io.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

  const sel = [
    '.card','.logo-card','.metric','.feature-item',
    '.section-head > div','section.block .kicker',
    '.page-hero h1','.page-hero p',
    '.cta-band > *','.team-card','.partner'
  ].join(',');

  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.revealDelay = (i % 7) * 70;
    io.observe(el);
  });
})();

/* ── Card 3D Tilt ───────────────────────────────────────────────── */
(function() {
  document.querySelectorAll('.card,.logo-card').forEach(card => {
    let raf;
    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 11}deg) rotateX(${-y * 11}deg) scale3d(1.025,1.025,1.025)`;
        card.style.boxShadow = `${-x * 18}px ${-y * 18}px 40px rgba(56,214,122,.13), 0 28px 60px rgba(0,0,0,.32)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .45s cubic-bezier(.22,1,.36,1), box-shadow .45s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
      setTimeout(() => (card.style.transition = ''), 450);
    });
  });
})();

/* ── Magnetic Buttons ───────────────────────────────────────────── */
(function() {
  document.querySelectorAll('.btn-primary,.btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.28;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

/* ── Number Counters ────────────────────────────────────────────── */
(function() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = +el.dataset.count;
      const sfx = el.dataset.suffix  || '';
      const pfx = el.dataset.prefix  || '';
      const dur = 1800;
      const t0  = performance.now();
      (function tick(now) {
        const p    = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        el.textContent = pfx + Math.round(ease * end) + sfx;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
})();

/* ── Parallax Orbs on Scroll ────────────────────────────────────── */
(function() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = 0.06 + i * 0.035;
        orb.style.transform = `translateY(${sy * speed}px)`;
      });
      ticking = false;
    });
  });
})();

/* ── Ambient Background Particles ──────────────────────────────── */
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const N = 65;
  const pts = Array.from({ length: N }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    r:  Math.random() * 1.4 + 0.3,
    vy: -(Math.random() * 0.35 + 0.08),
    o:  Math.random() * 0.45 + 0.08,
  }));

  function frame() {
    requestAnimationFrame(frame);
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.y += p.vy;
      if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,214,122,${p.o})`;
      ctx.fill();
    }
  }
  frame();
})();

/* ── THREE.JS HERO ──────────────────────────────────────────────── */
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  /* wait for Three.js CDN */
  function waitForThree(cb) {
    if (typeof THREE !== 'undefined') { cb(); return; }
    setTimeout(() => waitForThree(cb), 150);
  }

  waitForThree(function() {

    /* ── Renderer ──────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
    camera.position.set(0, 0.4, 7.5);
    resize();
    window.addEventListener('resize', resize);

    /* ── Lights ──────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const greenA = new THREE.PointLight(0x38d67a, 4.0, 12);
    greenA.position.set(-2.5, 1, 3);
    scene.add(greenA);

    const greenB = new THREE.PointLight(0x8cffbe, 1.8, 9);
    greenB.position.set(3, 3, 2);
    scene.add(greenB);

    const rimLight = new THREE.PointLight(0x38d67a, 1.2, 7);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    /* ── Particle Cloud ──────────────────────────────────────── */
    const PCNT = 280;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PCNT * 3);
    for (let i = 0; i < PCNT; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 7 - 2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x38d67a, size: 0.055,
      transparent: true, opacity: 0.5, sizeAttenuation: true,
    });
    scene.add(new THREE.Points(pGeo, pMat));

    /* ── Orbit Rings ─────────────────────────────────────────── */
    function makeRing(inner, outer, color, opacity, rotX, rotY) {
      const geo = new THREE.RingGeometry(inner, outer, 80);
      const mat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity, side: THREE.DoubleSide,
      });
      const m   = new THREE.Mesh(geo, mat);
      m.rotation.x = rotX;
      m.rotation.y = rotY || 0;
      scene.add(m);
      return m;
    }
    const ring1 = makeRing(2.1, 2.16, 0x38d67a, 0.14, Math.PI / 2.1, 0);
    const ring2 = makeRing(2.85, 2.89, 0x8cffbe, 0.07, Math.PI / 2.6, 0.25);
    const ring3 = makeRing(3.6,  3.63, 0x38d67a, 0.04, Math.PI / 3.2, -0.4);

    /* ── OBJ parser ──────────────────────────────────────────── */
    function parseOBJ(text) {
      const pos = [], verts = [];
      for (const raw of text.split('\n')) {
        const p = raw.trim().split(/\s+/);
        if (p[0] === 'v') { pos.push(+p[1], +p[2], +p[3]); }
        else if (p[0] === 'f') {
          const face = p.slice(1).map(s => s.split('/').map(Number));
          for (let i = 1; i < face.length - 1; i++) {
            [face[0], face[i], face[i + 1]].forEach(([vi]) => {
              const idx = (vi - 1) * 3;
              verts.push(pos[idx], pos[idx + 1], pos[idx + 2]);
            });
          }
        }
      }
      return new Float32Array(verts);
    }

    /* ── Fallback procedural composter ──────────────────────── */
    function buildFallback() {
      const g = new THREE.Group();

      const darkMat = new THREE.MeshStandardMaterial({
        color: 0x0d2218, roughness: 0.22, metalness: 0.72,
        emissive: 0x091810, emissiveIntensity: 0.28,
      });
      const greenMat = new THREE.MeshStandardMaterial({
        color: 0x38d67a, roughness: 0.08, metalness: 0.95,
        emissive: 0x38d67a, emissiveIntensity: 0.55,
      });
      const lidMat = new THREE.MeshStandardMaterial({
        color: 0x1a5a38, roughness: 0.18, metalness: 0.82,
      });

      /* body */
      g.add(new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.95, 1.45), darkMat));

      /* corner pillars */
      [[-0.725, -0.725], [0.725, -0.725], [-0.725, 0.725], [0.725, 0.725]].forEach(([x, z]) => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.98, 0.07), greenMat);
        pillar.position.set(x, 0, z);
        g.add(pillar);
      });

      /* horizontal glowing bands */
      [-0.6, -0.1, 0.45].forEach(y => {
        const band = new THREE.Mesh(
          new THREE.BoxGeometry(1.46, 0.03, 1.46),
          new THREE.MeshStandardMaterial({
            color: 0x38d67a, emissive: 0x38d67a, emissiveIntensity: 0.6,
            transparent: true, opacity: 0.75,
          })
        );
        band.position.y = y;
        g.add(band);
      });

      /* lid */
      const lid = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.16, 1.52), lidMat);
      lid.position.y = 1.05;
      g.add(lid);

      /* lid handle */
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 12), greenMat);
      handle.position.set(0, 1.28, 0);
      g.add(handle);

      /* wireframe overlay */
      g.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(1.46, 1.96, 1.46)),
        new THREE.LineBasicMaterial({ color: 0x38d67a, transparent: true, opacity: 0.18 })
      ));

      return g;
    }

    /* ── Load model ──────────────────────────────────────────── */
    let mesh = null;

    fetch('https://raw.githubusercontent.com/LOZEST/Composte-urabain/main/CAO/assemblage-final.obj')
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => {
        const verts = parseOBJ(text);
        if (!verts.length) throw new Error('empty');

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
        geo.computeVertexNormals();
        geo.center();

        const bb = new THREE.Box3().setFromBufferAttribute(geo.attributes.position);
        const sz = new THREE.Vector3(); bb.getSize(sz);
        const s  = 2.5 / Math.max(sz.x, sz.y, sz.z);
        geo.scale(s, s, s);

        const mat = new THREE.MeshStandardMaterial({
          color: 0x0e2519, roughness: 0.22, metalness: 0.68,
          emissive: 0x0b1e12, emissiveIntensity: 0.22,
          side: THREE.DoubleSide,
        });
        mesh = new THREE.Mesh(geo, mat);

        /* subtle wireframe overlay */
        mesh.add(new THREE.Mesh(geo.clone(),
          new THREE.MeshBasicMaterial({ color: 0x38d67a, wireframe: true, transparent: true, opacity: 0.07 })
        ));

        scene.add(mesh);
      })
      .catch(() => {
        mesh = buildFallback();
        scene.add(mesh);
      });

    /* ── Mouse parallax ──────────────────────────────────────── */
    let txY = 0, txX = 0, cxY = 0, cxX = 0;
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        txY = ((e.clientX - r.left) / r.width  - 0.5) * 0.7;
        txX = -((e.clientY - r.top)  / r.height - 0.5) * 0.35;
      });
      hero.addEventListener('mouseleave', () => { txY = 0; txX = 0; });
    }

    /* ── Render loop ─────────────────────────────────────────── */
    let t = 0;
    (function animate() {
      requestAnimationFrame(animate);
      t += 0.009;

      cxY += (txY - cxY) * 0.038;
      cxX += (txX - cxX) * 0.038;

      if (mesh) {
        mesh.rotation.y = t * 0.32 + cxY;
        mesh.rotation.x = Math.sin(t * 0.38) * 0.065 + cxX;
        mesh.position.y  = Math.sin(t * 0.55) * 0.12;
      }

      ring1.rotation.z += 0.004;
      ring2.rotation.z -= 0.0025;
      ring3.rotation.z += 0.0018;

      /* drift particles */
      const pa = pGeo.attributes.position.array;
      for (let i = 0; i < PCNT; i++) {
        pa[i * 3 + 1] += 0.004;
        if (pa[i * 3 + 1] > 7) pa[i * 3 + 1] = -7;
      }
      pGeo.attributes.position.needsUpdate = true;

      /* pulse green light */
      greenA.intensity = 3.5 + Math.sin(t * 1.4) * 1.0;

      renderer.render(scene, camera);
    })();
  });
})();
