/* ═══════════════════════════════════════════════════════════════
   GreenLoop — bg3d.js  (v5)
   · Géométrie réelle Fusion (13 pièces)
   · Couleurs gris-métal (clair, bien visible)
   · Pièces clampées dans l'écran pendant l'explosion
   · Spin individuel sur chaque pièce (rotation sur elle-même)
   · Retour PROPRE à 0 quand on scroll en haut (pas de rotation résiduelle)
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function waitThree(cb) {
    if (typeof THREE !== 'undefined') { cb(); return; }
    const id = setInterval(() => {
      if (typeof THREE !== 'undefined') { clearInterval(id); cb(); }
    }, 80);
  }

  waitThree(function () {

    /* ── Couleurs gris-métal (lisibles sur fond sombre) ───────── */
    function pickColor(y) {
      const t = Math.max(0, Math.min(1, (y + 1.75) / 3.5));
      // gris-acier foncé → gris clair argenté
      const dark  = { r: 0x55, g: 0x70, b: 0x68 };
      const light = { r: 0xc2, g: 0xd4, b: 0xce };
      const r = Math.round(dark.r + (light.r - dark.r) * t);
      const g = Math.round(dark.g + (light.g - dark.g) * t);
      const b = Math.round(dark.b + (light.b - dark.b) * t);
      return (r << 16) | (g << 8) | b;
    }

    /* ── Config ───────────────────────────────────────────────── */
    const SPREAD       = 1.9;   // distance d'explosion max
    const MAX_DISPLACE = 2.4;   // clamp : pièces restent dans l'écran
    const POS_LERP     = 0.055;
    const ROT_RETURN   = 0.18;  // retour rotation vers 0 (rapide)

    /* ── Renderer ─────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const cv = renderer.domElement;
    Object.assign(cv.style, {
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: '0',
      opacity: '0', transition: 'opacity 2s ease'
    });
    cv.id = 'bg3d-canvas';
    document.body.insertBefore(cv, document.body.firstChild);

    /* ── Scène / Caméra ───────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      44, window.innerWidth / window.innerHeight, 0.1, 200
    );
    camera.position.set(0, 0.3, 7.0);
    camera.lookAt(0, 0, 0);

    /* Éclairage naturel + accent vert froid */
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));

    const k = new THREE.DirectionalLight(0xf0f8f4, 1.15);
    k.position.set(4, 7, 5);  scene.add(k);

    const f = new THREE.DirectionalLight(0xc0dcd4, 0.40);
    f.position.set(-5, -2, 4); scene.add(f);

    const r = new THREE.DirectionalLight(0x38d67a, 0.35);
    r.position.set(1, -4, -4); scene.add(r);

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    /* ── Scroll ───────────────────────────────────────────────── */
    let targetExplode = 0, currentExplode = 0;
    window.addEventListener('scroll', () => {
      const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      targetExplode = window.scrollY / max;
    }, { passive: true });

    /* ── Chargement mesh Fusion ───────────────────────────────── */
    fetch('CAO/parts_mesh.json')
      .then(r => r.json())
      .then(buildScene)
      .catch(e => console.warn('bg3d:', e));

    function buildScene(parts) {
      const objects = [];

      parts.forEach(part => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position',
          new THREE.BufferAttribute(new Float32Array(part.verts), 3));
        geo.computeVertexNormals();

        const [cx, cy, cz] = part.centroid;

        const mat = new THREE.MeshPhongMaterial({
          color:     pickColor(cy),
          specular:  0x4de89a,   // reflet vert doux
          shininess: 85,
          transparent: true,
          opacity: 0.90,
          side: THREE.DoubleSide,
          depthWrite: false
        });

        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);

        /* Arêtes lumineuses */
        try {
          mesh.add(new THREE.LineSegments(
            new THREE.EdgesGeometry(geo, 26),
            new THREE.LineBasicMaterial({ color: 0x38d67a, transparent: true, opacity: 0.22 })
          ));
        } catch(e) {}

        /* Direction d'explosion */
        const dl = Math.sqrt(cx*cx + cy*cy + cz*cz) || 1;
        const dir = { x: cx/dl, y: cy/dl, z: cz/dl };
        const mag = 0.85 + Math.abs(cy)*0.38 + Math.sqrt(cx*cx+cz*cz)*0.18;

        /* Spin individuel aléatoire par pièce */
        const sv = {
          x: (Math.random()-0.5)*0.012,
          y: (Math.random()-0.5)*0.016,
          z: (Math.random()-0.5)*0.007
        };

        /* Rotation accumulée (variable d'état par pièce) — CLAMPÉE à ±2π */
        const rot = { x: 0, y: 0, z: 0 };

        objects.push({ mesh, dir, mag, sv, rot });
      });

      setTimeout(() => { cv.style.opacity = '0.95'; }, 350);

      /* ── Boucle rendu ─────────────────────────────────────────── */
      function animate() {
        requestAnimationFrame(animate);

        currentExplode += (targetExplode - currentExplode) * 0.038;
        const expl = Math.pow(currentExplode, 0.78);
        const assembling = currentExplode < 0.03;

        for (const o of objects) {
          const { mesh, dir, mag, sv, rot } = o;

          /* ── Position ── */
          let tx = dir.x * expl * SPREAD * mag;
          let ty = dir.y * expl * SPREAD * mag;
          let tz = dir.z * expl * SPREAD * mag;

          /* Clamp : les pièces ne quittent pas l'écran */
          const dl = Math.sqrt(tx*tx + ty*ty + tz*tz);
          if (dl > MAX_DISPLACE) { const s = MAX_DISPLACE/dl; tx*=s; ty*=s; tz*=s; }

          mesh.position.x += (tx - mesh.position.x) * POS_LERP;
          mesh.position.y += (ty - mesh.position.y) * POS_LERP;
          mesh.position.z += (tz - mesh.position.z) * POS_LERP;

          /* ── Rotation ──
             Principe : rot.x/y/z s'accumule CLAMPÉE à ±TWO_PI.
             La rotation affichée = rot * expl   → 0 automatiquement quand expl→0.
             Aucune rotation résiduelle au sommet de la page. */
          if (!assembling) {
            rot.x = clamp(rot.x + sv.x * expl, -Math.PI*2, Math.PI*2);
            rot.y = clamp(rot.y + sv.y * expl, -Math.PI*2, Math.PI*2);
            rot.z = clamp(rot.z + sv.z * expl, -Math.PI*2, Math.PI*2);
          } else {
            /* Scroll tout en haut : reset rot.x/y/z vers 0 vite */
            rot.x *= (1 - ROT_RETURN);
            rot.y *= (1 - ROT_RETURN);
            rot.z *= (1 - ROT_RETURN);
          }

          /* Rotation affichée proportionnelle à l'explosion */
          const trx = rot.x * expl;
          const try_ = rot.y * expl;
          const trz = rot.z * expl;
          mesh.rotation.x += (trx - mesh.rotation.x) * 0.07;
          mesh.rotation.y += (try_ - mesh.rotation.y) * 0.07;
          mesh.rotation.z += (trz - mesh.rotation.z) * 0.07;

          /* ── Opacité ── */
          const tOp = 0.90 - expl * 0.18;
          mesh.material.opacity += (tOp - mesh.material.opacity) * 0.05;
          if (mesh.children[0])
            mesh.children[0].material.opacity = tOp * 0.26;
        }

        /* Rotation lente de la scène (s'arrête pendant l'explosion) */
        scene.rotation.y += 0.00070 * (1 - currentExplode * 0.80);

        renderer.render(scene, camera);
      }
      animate();
    }

    function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  });
})();
