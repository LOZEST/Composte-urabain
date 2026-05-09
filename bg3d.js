/* ═══════════════════════════════════════════════════════════════
   GreenLoop — bg3d.js  (v6 — couleurs Fusion réelles, gris acier)
   · Couleurs "Acier – Satiné" extraites directement de Fusion
   · Pas de vert sur les pièces — reflet blanc-froid uniquement
   · Pièces restent dans l'écran (clamp)
   · Spin individuel proportionnel à l'explosion
   · RÉASSEMBLAGE PARFAIT : snap à (0,0,0) quand en haut
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

    /* ── Couleur gris acier par hauteur Y (comme Acier–Satiné Fusion) ── */
    function steelGrey(y) {
      // y ≈ -1.75 … +1.75 normalisé
      const t = Math.max(0, Math.min(1, (y + 1.75) / 3.5));
      // acier foncé #6b6e6c → acier clair #c2c4c2 (palette purement grise)
      const lo = { r: 0x6b, g: 0x6e, b: 0x6c };
      const hi = { r: 0xc2, g: 0xc4, b: 0xc2 };
      const R = Math.round(lo.r + (hi.r - lo.r) * t);
      const G = Math.round(lo.g + (hi.g - lo.g) * t);
      const B = Math.round(lo.b + (hi.b - lo.b) * t);
      return (R << 16) | (G << 8) | B;
    }

    /* ── Paramètres ───────────────────────────────────────────── */
    const SPREAD       = 2.0;   // amplitude explosion
    const MAX_DISPLACE = 2.5;   // clamp : tout reste dans l'écran
    const POS_LERP     = 0.06;
    const ROT_LERP     = 0.08;
    const SNAP_THRESH  = 0.008; // en dessous → snap parfait à 0

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

    /* ── Scène ────────────────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      44, window.innerWidth / window.innerHeight, 0.1, 200
    );
    camera.position.set(0, 0.3, 7.0);
    camera.lookAt(0, 0, 0);

    /* Éclairage : lumière studio neutre (pas de vert sur les pièces) */
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const keyL = new THREE.DirectionalLight(0xffffff, 1.10);
    keyL.position.set(5, 8, 6);
    scene.add(keyL);

    const fillL = new THREE.DirectionalLight(0xdde8ff, 0.45); // léger bleu-froid
    fillL.position.set(-4, -2, 5);
    scene.add(fillL);

    const rimL = new THREE.DirectionalLight(0xffffff, 0.30);
    rimL.position.set(0, -6, -5);
    scene.add(rimL);

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

    /* ── Chargement mesh ──────────────────────────────────────── */
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

        /* Matériau acier satiné — gris pur, reflet blanc froid */
        const mat = new THREE.MeshPhongMaterial({
          color:     steelGrey(cy),
          specular:  0xdddddd,    // reflet blanc-froid (acier)
          shininess: 90,
          transparent: true,
          opacity: 0.88,
          side: THREE.DoubleSide,
          depthWrite: false
        });
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);

        /* Arêtes grises fines (pas vertes) */
        try {
          mesh.add(new THREE.LineSegments(
            new THREE.EdgesGeometry(geo, 28),
            new THREE.LineBasicMaterial({
              color: 0xaaaaaa, transparent: true, opacity: 0.15
            })
          ));
        } catch(e) {}

        /* Direction d'explosion */
        const dl = Math.sqrt(cx*cx + cy*cy + cz*cz) || 1;
        const dir = { x: cx/dl, y: cy/dl, z: cz/dl };
        const mag = 0.85 + Math.abs(cy)*0.38 + Math.sqrt(cx*cx+cz*cz)*0.18;

        /* Spin individuel aléatoire */
        const sv = {
          x: (Math.random()-0.5)*0.011,
          y: (Math.random()-0.5)*0.015,
          z: (Math.random()-0.5)*0.007
        };

        /* Rotation accumulée par pièce (clampée ±2π) */
        const rot = { x:0, y:0, z:0 };

        objects.push({ mesh, dir, mag, sv, rot });
      });

      setTimeout(() => { cv.style.opacity = '0.92'; }, 350);

      /* ── Boucle rendu ─────────────────────────────────────────── */
      function animate() {
        requestAnimationFrame(animate);

        currentExplode += (targetExplode - currentExplode) * 0.038;
        const expl = Math.pow(currentExplode, 0.78);

        /* SNAP parfait : si on est tout en haut, tout à exactement zéro */
        const snapping = currentExplode < SNAP_THRESH;

        for (const o of objects) {
          const { mesh, dir, mag, sv, rot } = o;

          if (snapping) {
            /* ─ Réassemblage PARFAIT ─ */
            mesh.position.set(0, 0, 0);
            mesh.rotation.set(0, 0, 0);
            rot.x = 0; rot.y = 0; rot.z = 0;
          } else {
            /* ─ Position ─ */
            let tx = dir.x * expl * SPREAD * mag;
            let ty = dir.y * expl * SPREAD * mag;
            let tz = dir.z * expl * SPREAD * mag;
            const dl2 = Math.sqrt(tx*tx + ty*ty + tz*tz);
            if (dl2 > MAX_DISPLACE) { const s=MAX_DISPLACE/dl2; tx*=s; ty*=s; tz*=s; }
            mesh.position.x += (tx - mesh.position.x) * POS_LERP;
            mesh.position.y += (ty - mesh.position.y) * POS_LERP;
            mesh.position.z += (tz - mesh.position.z) * POS_LERP;

            /* ─ Rotation ─
               Chaque pièce accumule son spin (clampé à ±2π).
               Rotation affichée = accumulée × expl → revient à 0 naturellement. */
            rot.x = clamp(rot.x + sv.x * expl, -Math.PI*2, Math.PI*2);
            rot.y = clamp(rot.y + sv.y * expl, -Math.PI*2, Math.PI*2);
            rot.z = clamp(rot.z + sv.z * expl, -Math.PI*2, Math.PI*2);

            mesh.rotation.x += (rot.x * expl - mesh.rotation.x) * ROT_LERP;
            mesh.rotation.y += (rot.y * expl - mesh.rotation.y) * ROT_LERP;
            mesh.rotation.z += (rot.z * expl - mesh.rotation.z) * ROT_LERP;
          }

          /* Opacité */
          const tOp = snapping ? 0.88 : 0.88 - expl * 0.18;
          mesh.material.opacity += (tOp - mesh.material.opacity) * 0.05;
          if (mesh.children[0])
            mesh.children[0].material.opacity = tOp * 0.18;
        }

        /* Rotation lente de la scène entière (s'arrête quand explosion) */
        scene.rotation.y += 0.00075 * (1 - currentExplode * 0.85);

        renderer.render(scene, camera);
      }
      animate();
    }

    function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  });
})();
