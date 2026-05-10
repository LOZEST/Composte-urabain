/* ═══════════════════════════════════════════════════════════════════
   GreenLoop — bg3d.js
   Version aluminium propre

   Modélisation Fusion 360 réelle, pièces du composteur autonome.
   Scroll bas  → explosion en tourbillon, pièces restent à l'écran
   Scroll haut → réassemblage propre
   Rendu       → aluminium satiné, sans transparence parasite
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Attente Three.js ─────────────────────────────────────────────── */
  function ready(cb) {
    if (typeof THREE !== 'undefined') return cb();

    const t = setInterval(() => {
      if (typeof THREE !== 'undefined') {
        clearInterval(t);
        cb();
      }
    }, 60);
  }

  ready(function () {
    /* ════════════════════════════════════════════════════════════════
       PARAMÈTRES ANIMATION
    ════════════════════════════════════════════════════════════════ */
    const SPREAD = 2.4;
    const SWIRL = 1.6;
    const MAX_DISP = 2.8;
    const POS_LERP = 0.052;
    const ROT_LERP = 0.065;
    const SNAP = 0.005;

    /* ════════════════════════════════════════════════════════════════
       RENDERER
    ════════════════════════════════════════════════════════════════ */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const cv = renderer.domElement;

    Object.assign(cv.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '0',
      opacity: '0',
      transition: 'opacity 2.4s ease'
    });

    cv.id = 'bg3d-canvas';
    document.body.insertBefore(cv, document.body.firstChild);

    /* ════════════════════════════════════════════════════════════════
       SCÈNE & CAMÉRA
    ════════════════════════════════════════════════════════════════ */
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      44,
      window.innerWidth / window.innerHeight,
      0.01,
      300
    );

    camera.position.set(0.8, 0.5, 6.0);
    camera.lookAt(0, 0.1, 0);

    /* ════════════════════════════════════════════════════════════════
       ENVIRONNEMENT POUR REFLETS MÉTALLIQUES
    ════════════════════════════════════════════════════════════════ */
    const pmrem = new THREE.PMREMGenerator(renderer);

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x151515);

    const envTexture = pmrem.fromScene(envScene).texture;
    scene.environment = envTexture;

    /* ════════════════════════════════════════════════════════════════
       ÉCLAIRAGE ALUMINIUM
    ════════════════════════════════════════════════════════════════ */
    scene.add(new THREE.AmbientLight(0xffffff, 1.15));

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-3, 6, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xbfd8ff, 0.75);
    fill.position.set(4, 2, 3);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 1.35);
    rim.position.set(2, -4, -5);
    scene.add(rim);

    const greenAccent = new THREE.DirectionalLight(0x38d67a, 0.25);
    greenAccent.position.set(4, -2, -4);
    scene.add(greenAccent);

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    /* ════════════════════════════════════════════════════════════════
       SCROLL
    ════════════════════════════════════════════════════════════════ */
    let tgt = 0;
    let cur = 0;

    window.addEventListener(
      'scroll',
      () => {
        tgt =
          window.scrollY /
          Math.max(document.body.scrollHeight - window.innerHeight, 1);
      },
      { passive: true }
    );

    /* ════════════════════════════════════════════════════════════════
       CHARGEMENT MESH FUSION
    ════════════════════════════════════════════════════════════════ */
    fetch('CAO/parts_mesh.json')
      .then((r) => r.json())
      .then(build)
      .catch((e) => console.warn('[bg3d] Mesh load failed:', e));

    /* ════════════════════════════════════════════════════════════════
       CONSTRUCTION DE LA SCÈNE
    ════════════════════════════════════════════════════════════════ */
    function build(parts) {
      const objs = [];

      parts.forEach((part, idx) => {
        /* ── Géométrie ── */
        const geo = new THREE.BufferGeometry();

        geo.setAttribute(
          'position',
          new THREE.BufferAttribute(new Float32Array(part.verts), 3)
        );

        geo.computeVertexNormals();
        geo.computeBoundingBox();
        geo.computeBoundingSphere();

        const [cx, cy, cz] = part.centroid;

        /* ── Matériau aluminium satiné ── */
        const mat = new THREE.MeshStandardMaterial({
          color: 0xc8c8c8,
          metalness: 0.85,
          roughness: 0.28,

          emissive: 0x000000,
          emissiveIntensity: 0,

          transparent: false,
          opacity: 1,

          depthWrite: true,
          depthTest: true,

          side: THREE.FrontSide
        });

        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);

        /* ── Arêtes discrètes, propres, sans transparence ── */
        try {
          const eg = new THREE.EdgesGeometry(geo, 32);

          const em = new THREE.LineBasicMaterial({
            color: 0xe6e6e6,
            transparent: false,
            opacity: 1,
            depthWrite: true,
            depthTest: true
          });

          const edges = new THREE.LineSegments(eg, em);
          edges.renderOrder = 1;
          mesh.add(edges);
        } catch (_) {}

        /* ── Direction d'explosion ── */
        const dl = Math.sqrt(cx * cx + cy * cy + cz * cz) || 1;

        const dir = {
          x: cx / dl,
          y: cy / dl,
          z: cz / dl
        };

        const mag =
          0.9 +
          Math.abs(cy) * 0.38 +
          Math.sqrt(cx * cx + cz * cz) * 0.18;

        /* ── Vecteur tourbillon ── */
        const sign = idx % 2 === 0 ? 1 : -1;

        const sxRaw = -dir.z * sign;
        const szRaw = dir.x * sign;

        const sLen = Math.sqrt(sxRaw * sxRaw + szRaw * szRaw) || 1;

        const swirl = {
          x: sxRaw / sLen,
          y: 0.2 * sign,
          z: szRaw / sLen
        };

        /* ── Spin individuel ── */
        const sv = {
          x: (Math.random() - 0.5) * 0.012,
          y: (Math.random() - 0.5) * 0.016,
          z: (Math.random() - 0.5) * 0.007
        };

        const rot = {
          x: 0,
          y: 0,
          z: 0
        };

        objs.push({
          mesh,
          dir,
          mag,
          swirl,
          sv,
          rot
        });
      });

      /* Fade-in */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cv.style.opacity = '0.94';
        });
      });

      /* ════════════════════════════════════════════════════════════
         BOUCLE DE RENDU
      ════════════════════════════════════════════════════════════ */
      const T0 = Date.now();

      function tick() {
        requestAnimationFrame(tick);

        cur += (tgt - cur) * 0.038;

        const expl = Math.pow(cur, 0.72);
        const snapping = cur < SNAP;
        const t = (Date.now() - T0) * 0.001;

        for (const o of objs) {
          const { mesh, dir, mag, swirl, sv, rot } = o;

          if (snapping) {
            /* ── SNAP PROPRE ── */
            mesh.position.set(0, 0, 0);
            mesh.rotation.set(0, 0, 0);
            mesh.scale.setScalar(1.0);

            rot.x = 0;
            rot.y = 0;
            rot.z = 0;

            mesh.material.opacity = 1;
            mesh.material.transparent = false;
            mesh.material.depthWrite = true;
            mesh.material.depthTest = true;
            mesh.material.emissiveIntensity = 0;

            if (mesh.children[0]) {
              mesh.children[0].material.opacity = 1;
              mesh.children[0].material.transparent = false;
              mesh.children[0].material.depthWrite = true;
              mesh.children[0].material.depthTest = true;
            }
          } else {
            /* ── POSITION avec tourbillon ── */
            let tx = dir.x * expl * SPREAD * mag;
            let ty = dir.y * expl * SPREAD * mag;
            let tz = dir.z * expl * SPREAD * mag;

            const swirlAmt = Math.sin(expl * Math.PI) * SWIRL * mag;

            tx += swirl.x * swirlAmt;
            ty += swirl.y * swirlAmt;
            tz += swirl.z * swirlAmt;

            /* Clamp : rien ne sort trop de l'écran */
            const dl2 = Math.sqrt(tx * tx + ty * ty + tz * tz);

            if (dl2 > MAX_DISP) {
              const s = MAX_DISP / dl2;
              tx *= s;
              ty *= s;
              tz *= s;
            }

            mesh.position.x += (tx - mesh.position.x) * POS_LERP;
            mesh.position.y += (ty - mesh.position.y) * POS_LERP;
            mesh.position.z += (tz - mesh.position.z) * POS_LERP;

            /* ── ROTATION individuelle ── */
            rot.x = clamp(rot.x + sv.x * expl, -Math.PI * 2, Math.PI * 2);
            rot.y = clamp(rot.y + sv.y * expl, -Math.PI * 2, Math.PI * 2);
            rot.z = clamp(rot.z + sv.z * expl, -Math.PI * 2, Math.PI * 2);

            mesh.rotation.x += (rot.x * expl - mesh.rotation.x) * ROT_LERP;
            mesh.rotation.y += (rot.y * expl - mesh.rotation.y) * ROT_LERP;
            mesh.rotation.z += (rot.z * expl - mesh.rotation.z) * ROT_LERP;

            /* ── Légère expansion de la pièce ── */
            const tScale = 1.0 + expl * 0.06;

            mesh.scale.x += (tScale - mesh.scale.x) * 0.06;
            mesh.scale.y = mesh.scale.x;
            mesh.scale.z = mesh.scale.x;

            /* ── Aluminium opaque : pas de transparence animée ── */
            mesh.material.opacity = 1;
            mesh.material.transparent = false;
            mesh.material.depthWrite = true;
            mesh.material.depthTest = true;
            mesh.material.emissiveIntensity = 0;

            if (mesh.children[0]) {
              mesh.children[0].material.opacity = 1;
              mesh.children[0].material.transparent = false;
              mesh.children[0].material.depthWrite = true;
              mesh.children[0].material.depthTest = true;
            }
          }
        }

        /* Rotation douce de la scène entière quand assemblé */
        scene.rotation.y += 0.00075 * (1 - cur * 0.88);

        /* Léger balancement */
        scene.rotation.x = Math.sin(t * 0.28) * 0.018 * (1 - cur);

        renderer.render(scene, camera);
      }

      tick();
    }

    function clamp(v, lo, hi) {
      return v < lo ? lo : v > hi ? hi : v;
    }
  });
})();
