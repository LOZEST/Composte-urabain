/* ═══════════════════════════════════════════════════════════════
   GreenLoop — bg3d.js  (v7 — rendu premium product showcase)
   Style : grande modélisation 3D acier, éclairage studio, scroll = explosion
   · MeshStandardMaterial PBR (metalness/roughness) — acier vrai
   · depthWrite correct → pièces solides, pas de transparence parasite
   · Assemblé = opaque parfait, dépecé = légère transparence
   · Rotation lente sur Y en assemblé, spin individuel en explosé
   · Snap parfait position + rotation à (0,0,0) au top de la page
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function waitThree (cb) {
    if (typeof THREE !== 'undefined') { cb(); return; }
    const id = setInterval(() => {
      if (typeof THREE !== 'undefined') { clearInterval(id); cb(); }
    }, 80);
  }

  waitThree(function () {

    /* ═══════════════════════════════════════════════════════════
       PARAMÈTRES
    ═══════════════════════════════════════════════════════════ */
    const SPREAD        = 2.2;    // amplitude explosion
    const MAX_DISPLACE  = 2.8;    // clamp : rien ne sort de l'écran
    const POS_LERP      = 0.055;
    const ROT_LERP      = 0.07;
    const SNAP_THRESH   = 0.006;  // snap parfait en dessous de cette valeur

    /* ═══════════════════════════════════════════════════════════
       RENDERER
    ═══════════════════════════════════════════════════════════ */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = false;
    // tone mapping pour look cinématique
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const cv = renderer.domElement;
    Object.assign(cv.style, {
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: '0',
      opacity: '0', transition: 'opacity 2.2s ease'
    });
    cv.id = 'bg3d-canvas';
    document.body.insertBefore(cv, document.body.firstChild);

    /* ═══════════════════════════════════════════════════════════
       SCÈNE & CAMÉRA
    ═══════════════════════════════════════════════════════════ */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42, window.innerWidth / window.innerHeight, 0.01, 200
    );
    // caméra proche : modèle grand et présent
    camera.position.set(0.6, 0.4, 6.2);
    camera.lookAt(0, 0, 0);

    /* ─── Éclairage studio acier ─── */

    // Ambiance froide légère
    scene.add(new THREE.AmbientLight(0xd0e4f0, 0.40));

    // Lumière clé — forte, légèrement chaude, venant du dessus-gauche
    const keyL = new THREE.DirectionalLight(0xfff4e8, 1.80);
    keyL.position.set(-4, 8, 5);
    scene.add(keyL);

    // Lumière de remplissage — froide, droite
    const fillL = new THREE.DirectionalLight(0xc8dcff, 0.55);
    fillL.position.set(6, 2, 3);
    scene.add(fillL);

    // Rimlight — contour blanc, derrière
    const rimL = new THREE.DirectionalLight(0xffffff, 0.70);
    rimL.position.set(0, -3, -6);
    scene.add(rimL);

    // Accent bas chaud (sol réfléchi)
    const groundL = new THREE.DirectionalLight(0xffe8c0, 0.25);
    groundL.position.set(0, -8, 2);
    scene.add(groundL);

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    /* ═══════════════════════════════════════════════════════════
       SCROLL → valeur explosion 0..1
    ═══════════════════════════════════════════════════════════ */
    let targetExplode = 0, currentExplode = 0;
    window.addEventListener('scroll', () => {
      const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      targetExplode = window.scrollY / max;
    }, { passive: true });

    /* ═══════════════════════════════════════════════════════════
       CHARGEMENT MESH FUSION
    ═══════════════════════════════════════════════════════════ */
    fetch('CAO/parts_mesh.json')
      .then(r => r.json())
      .then(buildScene)
      .catch(e => console.warn('bg3d: mesh load failed', e));

    /* ─── Couleur acier par hauteur : gris moyen variant du foncé au clair ─── */
    function steelColor (y) {
      const t = Math.max(0, Math.min(1, (y + 1.75) / 3.5));
      // #787c7a (bas, acier foncé) → #d2d6d4 (haut, acier poli clair)
      const lo = { r: 0x78, g: 0x7c, b: 0x7a };
      const hi = { r: 0xd2, g: 0xd6, b: 0xd4 };
      const R = Math.round(lo.r + (hi.r - lo.r) * t);
      const G = Math.round(lo.g + (hi.g - lo.g) * t);
      const B = Math.round(lo.b + (hi.b - lo.b) * t);
      return (R << 16) | (G << 8) | B;
    }

    function buildScene (parts) {
      const objects = [];

      parts.forEach(part => {
        /* Géométrie réelle Fusion */
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position',
          new THREE.BufferAttribute(new Float32Array(part.verts), 3));
        geo.computeVertexNormals();

        const [cx, cy, cz] = part.centroid;

        /* ── Matériau PBR acier satiné (MeshStandardMaterial) ── */
        const mat = new THREE.MeshStandardMaterial({
          color:      steelColor(cy),
          metalness:  0.72,    // aspect métallique prononcé
          roughness:  0.38,    // poli satiné (pas miroir, pas mat)
          envMapIntensity: 1.0,
          // transparent géré dynamiquement
          transparent: true,
          opacity: 1.0,
          depthWrite: true,    // ← CRUCIAL : pièces solides, pas de transparence parasite
          side: THREE.FrontSide
        });

        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);

        /* Arêtes très fines, gris clair — donnent la définition industrielle */
        try {
          const eg = new THREE.EdgesGeometry(geo, 25);
          const em = new THREE.LineBasicMaterial({
            color: 0xe8eceb, transparent: true, opacity: 0.12
          });
          mesh.add(new THREE.LineSegments(eg, em));
        } catch(e) {}

        /* Direction d'explosion */
        const dl = Math.sqrt(cx*cx + cy*cy + cz*cz) || 1;
        const dir = { x: cx/dl, y: cy/dl, z: cz/dl };
        const mag = 0.85 + Math.abs(cy)*0.35 + Math.sqrt(cx*cx + cz*cz)*0.15;

        /* Vitesse de spin individuelle (aléatoire, faible) */
        const sv = {
          x: (Math.random() - 0.5) * 0.010,
          y: (Math.random() - 0.5) * 0.014,
          z: (Math.random() - 0.5) * 0.006
        };

        /* Rotation accumulée, clampée ±2π pour retour rapide */
        const rot = { x: 0, y: 0, z: 0 };

        objects.push({ mesh, dir, mag, sv, rot });
      });

      /* Fade-in propre */
      setTimeout(() => { cv.style.opacity = '0.96'; }, 300);

      /* ═══════════════════════════════════════════════════════
         BOUCLE DE RENDU
      ═══════════════════════════════════════════════════════ */
      function animate () {
        requestAnimationFrame(animate);

        currentExplode += (targetExplode - currentExplode) * 0.038;
        const expl   = Math.pow(currentExplode, 0.75);
        const snap   = currentExplode < SNAP_THRESH;

        for (const o of objects) {
          const { mesh, dir, mag, sv, rot } = o;

          if (snap) {
            /* ── Réassemblage PARFAIT : snap dur à zéro ── */
            mesh.position.set(0, 0, 0);
            mesh.rotation.set(0, 0, 0);
            rot.x = 0; rot.y = 0; rot.z = 0;
            mesh.material.opacity = 1.0;
            mesh.material.depthWrite = true;
            if (mesh.children[0]) mesh.children[0].material.opacity = 0.12;
          } else {
            /* ── Position ── */
            let tx = dir.x * expl * SPREAD * mag;
            let ty = dir.y * expl * SPREAD * mag;
            let tz = dir.z * expl * SPREAD * mag;
            const dl2 = Math.sqrt(tx*tx + ty*ty + tz*tz);
            if (dl2 > MAX_DISPLACE) {
              const s = MAX_DISPLACE / dl2;
              tx *= s; ty *= s; tz *= s;
            }
            mesh.position.x += (tx - mesh.position.x) * POS_LERP;
            mesh.position.y += (ty - mesh.position.y) * POS_LERP;
            mesh.position.z += (tz - mesh.position.z) * POS_LERP;

            /* ── Rotation individuelle ──
               Chaque pièce spin proportionnellement à expl.
               rot * expl → revient naturellement à 0 quand expl→0. */
            rot.x = clamp(rot.x + sv.x * expl, -Math.PI*2, Math.PI*2);
            rot.y = clamp(rot.y + sv.y * expl, -Math.PI*2, Math.PI*2);
            rot.z = clamp(rot.z + sv.z * expl, -Math.PI*2, Math.PI*2);

            mesh.rotation.x += (rot.x * expl - mesh.rotation.x) * ROT_LERP;
            mesh.rotation.y += (rot.y * expl - mesh.rotation.y) * ROT_LERP;
            mesh.rotation.z += (rot.z * expl - mesh.rotation.z) * ROT_LERP;

            /* ── Opacité : plein quand assemblé, léger fade à l'explosion ── */
            const tOp = 1.0 - expl * 0.22;
            mesh.material.opacity  += (tOp - mesh.material.opacity)  * 0.05;
            mesh.material.depthWrite = mesh.material.opacity > 0.95;
            if (mesh.children[0])
              mesh.children[0].material.opacity = tOp * 0.14;
          }
        }

        /* Rotation lente scène entière (s'arrête à l'explosion) */
        scene.rotation.y += 0.00080 * (1 - currentExplode * 0.90);

        renderer.render(scene, camera);
      }

      animate();
    }

    function clamp (v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  }); /* waitThree */
})();
