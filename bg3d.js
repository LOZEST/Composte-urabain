/* ═══════════════════════════════════════════════════════════════════
   GreenLoop — bg3d.js  (v8 — FINAL)

   Modélisation Fusion 360 réelle, 13 pièces du composteur autonome.
   Couleurs site : #07130f → #1d5d40 → #38d67a
   Scroll bas  → explosion en tourbillon, pièces restent à l'écran
   Scroll haut → réassemblage PARFAIT (snap)
   Rotation lente en assemblé, éclairage dramatique vert
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Attente Three.js ─────────────────────────────────────────────── */
  function ready (cb) {
    if (typeof THREE !== 'undefined') return cb();
    const t = setInterval(() => { if (typeof THREE !== 'undefined') { clearInterval(t); cb(); } }, 60);
  }

  ready(function () {

    /* ════════════════════════════════════════════════════════════════
       COULEURS — palette exacte du site GreenLoop
    ════════════════════════════════════════════════════════════════ */
    // y normalisé ≈ -1.75 (bas) … +1.75 (haut)
    function siteColor (y) {
      const t = Math.max(0, Math.min(1, (y + 1.75) / 3.5));
      // bas : #1a1c22  →  haut : #a0b0c2  (gris acier)
      const palette = [
        [0x1a, 0x1c, 0x22],
        [0x28, 0x2c, 0x36],
        [0x3c, 0x42, 0x52],
        [0x56, 0x60, 0x74],
        [0x78, 0x86, 0x9a],
        [0xa0, 0xb0, 0xc2]
      ];
      const fi = t * (palette.length - 1);
      const i  = Math.min(Math.floor(fi), palette.length - 2);
      const f  = fi - i;
      const lo = palette[i], hi = palette[i + 1];
      const R  = Math.round(lo[0] + (hi[0] - lo[0]) * f);
      const G  = Math.round(lo[1] + (hi[1] - lo[1]) * f);
      const B  = Math.round(lo[2] + (hi[2] - lo[2]) * f);
      return (R << 16) | (G << 8) | B;
    }

    /* ════════════════════════════════════════════════════════════════
       PARAMÈTRES ANIMATION
    ════════════════════════════════════════════════════════════════ */
    const SPREAD       = 2.4;     // amplitude explosion
    const SWIRL        = 1.6;     // amplitude tourbillon latéral
    const MAX_DISP     = 2.8;     // clamp : pièces restent à l'écran
    const POS_LERP     = 0.052;
    const ROT_LERP     = 0.065;
    const SNAP         = 0.005;   // seuil snap parfait

    /* ════════════════════════════════════════════════════════════════
       RENDERER
    ════════════════════════════════════════════════════════════════ */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping      = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const cv = renderer.domElement;
    Object.assign(cv.style, {
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: '0',
      opacity: '0', transition: 'opacity 2.4s ease'
    });
    cv.id = 'bg3d-canvas';
    document.body.insertBefore(cv, document.body.firstChild);

    /* ════════════════════════════════════════════════════════════════
       SCÈNE & CAMÉRA
    ════════════════════════════════════════════════════════════════ */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      44, window.innerWidth / window.innerHeight, 0.01, 300
    );
    // Vue légèrement en dessous-côté pour un rendu 3D riche
    camera.position.set(0.8, 0.5, 6.0);
    camera.lookAt(0, 0.1, 0);

    /* ── Éclairage dramatique vert ── */
    scene.add(new THREE.AmbientLight(0x07130f, 0.9));           // fond sombre du site

    const key = new THREE.DirectionalLight(0xffffff, 1.60);     // lumière clé blanche
    key.position.set(-3, 8, 5);
    scene.add(key);

    const green = new THREE.DirectionalLight(0x38d67a, 1.20);   // accent vert caractéristique
    green.position.set(4, -2, -4);
    scene.add(green);

    const fill = new THREE.DirectionalLight(0x8cffbe, 0.45);    // fill vert clair
    fill.position.set(-5, 3, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.55);     // contour blanc
    rim.position.set(1, -5, -5);
    scene.add(rim);

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    /* ════════════════════════════════════════════════════════════════
       SCROLL
    ════════════════════════════════════════════════════════════════ */
    let tgt = 0, cur = 0;
    window.addEventListener('scroll', () => {
      tgt = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
    }, { passive: true });

    /* ════════════════════════════════════════════════════════════════
       CHARGEMENT MESH FUSION
    ════════════════════════════════════════════════════════════════ */
    fetch('CAO/parts_mesh.json')
      .then(r => r.json())
      .then(build)
      .catch(e => console.warn('[bg3d] Mesh load failed:', e));

    /* ════════════════════════════════════════════════════════════════
       CONSTRUCTION DE LA SCÈNE
    ════════════════════════════════════════════════════════════════ */
    function build (parts) {
      const objs = [];

      parts.forEach((part, idx) => {
        /* Géométrie */
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position',
          new THREE.BufferAttribute(new Float32Array(part.verts), 3));
        geo.computeVertexNormals();

        const [cx, cy, cz] = part.centroid;
        const col = siteColor(cy);

        /* ── Matériau principal : gris acier opaque ── */
        const mat = new THREE.MeshStandardMaterial({
          color:     col,
          emissive:  col,
          emissiveIntensity: 0.12,
          metalness: 0.72,
          roughness: 0.28,
          transparent: false,
          opacity: 1.0,
          depthWrite: true,
          side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);

        /* ── Halo acier (BackSide additive, légèrement plus grand) ── */
        const glowMat = new THREE.MeshBasicMaterial({
          color: 0xc0d0e0,
          transparent: true,
          opacity: 0.10,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const glowMesh = new THREE.Mesh(geo, glowMat);
        glowMesh.scale.setScalar(1.04);
        mesh.add(glowMesh);

        /* ── Arêtes acier claires ── */
        try {
          const eg  = new THREE.EdgesGeometry(geo, 22);
          const em  = new THREE.LineBasicMaterial({
            color: 0xd0dce8,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });
          mesh.add(new THREE.LineSegments(eg, em));
        } catch (_) {}

        /* ── Direction d'explosion ── */
        const dl  = Math.sqrt(cx*cx + cy*cy + cz*cz) || 1;
        const dir = { x: cx/dl, y: cy/dl, z: cz/dl };
        const mag = 0.90 + Math.abs(cy)*0.38 + Math.sqrt(cx*cx+cz*cz)*0.18;

        /* ── Vecteur tourbillon (perpendiculaire à dir dans XZ) ──
           Chaque pièce part dans un sens opposé pour l'effet "fan/swirl" */
        const sign  = idx % 2 === 0 ? 1 : -1;
        const sxRaw = -dir.z * sign, szRaw = dir.x * sign;
        const sLen  = Math.sqrt(sxRaw*sxRaw + szRaw*szRaw) || 1;
        const swirl = { x: sxRaw/sLen, y: 0.20 * sign, z: szRaw/sLen };

        /* ── Spin individuel ── */
        const sv = {
          x: (Math.random() - 0.5) * 0.012,
          y: (Math.random() - 0.5) * 0.016,
          z: (Math.random() - 0.5) * 0.007
        };

        /* ── Rotation accumulée (clampée ±2π) ── */
        const rot = { x: 0, y: 0, z: 0 };

        objs.push({ mesh, dir, mag, swirl, sv, rot });
      });

      /* Fade-in */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { cv.style.opacity = '0.94'; });
      });

      /* ════════════════════════════════════════════════════════════
         BOUCLE DE RENDU
      ════════════════════════════════════════════════════════════ */
      const T0 = Date.now();

      function tick () {
        requestAnimationFrame(tick);

        cur += (tgt - cur) * 0.038;
        const expl   = Math.pow(cur, 0.72);
        const snapping = cur < SNAP;
        const t      = (Date.now() - T0) * 0.001;

        for (const o of objs) {
          const { mesh, dir, mag, swirl, sv, rot } = o;

          if (snapping) {
            /* ── SNAP PARFAIT ── */
            mesh.position.set(0, 0, 0);
            mesh.rotation.set(0, 0, 0);
            mesh.scale.setScalar(1.0);
            rot.x = rot.y = rot.z = 0;
            mesh.material.opacity          = 1.0;
            mesh.material.emissiveIntensity = 0.12;
            mesh.material.depthWrite        = true;
            // halo & arêtes quand assemblé
            if (mesh.children[0]) mesh.children[0].material.opacity = 0.10;
            if (mesh.children[1]) mesh.children[1].material.opacity = 0.55;

          } else {
            /* ── POSITION avec tourbillon ──
               Composante radiale + composante tourbillon en sin(π·expl)
               → les pièces font un arc en sortant, retour direct en rentrant */
            let tx = dir.x * expl * SPREAD * mag;
            let ty = dir.y * expl * SPREAD * mag;
            let tz = dir.z * expl * SPREAD * mag;

            const swirlAmt = Math.sin(expl * Math.PI) * SWIRL * mag;
            tx += swirl.x * swirlAmt;
            ty += swirl.y * swirlAmt;
            tz += swirl.z * swirlAmt;

            /* Clamp : rien ne sort de l'écran */
            const dl2 = Math.sqrt(tx*tx + ty*ty + tz*tz);
            if (dl2 > MAX_DISP) { const s = MAX_DISP/dl2; tx*=s; ty*=s; tz*=s; }

            mesh.position.x += (tx - mesh.position.x) * POS_LERP;
            mesh.position.y += (ty - mesh.position.y) * POS_LERP;
            mesh.position.z += (tz - mesh.position.z) * POS_LERP;

            /* ── ROTATION individuelle ──
               rot.xyz accumule (clampé ±2π)
               affiché = rot × expl → revient à 0 quand expl→0 */
            rot.x = clamp(rot.x + sv.x * expl, -Math.PI*2, Math.PI*2);
            rot.y = clamp(rot.y + sv.y * expl, -Math.PI*2, Math.PI*2);
            rot.z = clamp(rot.z + sv.z * expl, -Math.PI*2, Math.PI*2);

            mesh.rotation.x += (rot.x * expl - mesh.rotation.x) * ROT_LERP;
            mesh.rotation.y += (rot.y * expl - mesh.rotation.y) * ROT_LERP;
            mesh.rotation.z += (rot.z * expl - mesh.rotation.z) * ROT_LERP;

            /* ── Légère expansion de la pièce ── */
            const tScale = 1.0 + expl * 0.06;
            mesh.scale.x += (tScale - mesh.scale.x) * 0.06;
            mesh.scale.y  = mesh.scale.x;
            mesh.scale.z  = mesh.scale.x;

            /* ── Opacité & émission ── */
            const tOp = 1.0 - expl * 0.25;
            mesh.material.opacity           += (tOp - mesh.material.opacity) * 0.05;
            mesh.material.emissiveIntensity  += ((0.12 + expl * 0.10) - mesh.material.emissiveIntensity) * 0.05;
            mesh.material.depthWrite          = mesh.material.opacity > 0.88;

            if (mesh.children[0]) mesh.children[0].material.opacity = tOp * 0.14 + expl * 0.08;
            if (mesh.children[1]) mesh.children[1].material.opacity = 0.55 + expl * 0.15;
          }
        }

        /* Rotation douce de la scène entière quand assemblé */
        scene.rotation.y += 0.00075 * (1 - cur * 0.88);
        /* Léger balancement (respiration) */
        scene.rotation.x  = Math.sin(t * 0.28) * 0.018 * (1 - cur);

        renderer.render(scene, camera);
      }

      tick();
    }

    function clamp (v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  }); /* ready */
})();
