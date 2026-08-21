/**
 * Počítačová chemie - PřF UPOL
 * Hlavní obslužný skript pro navigaci, záložky, motiv vzhledu a simulaci vodního prostředí
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Preview Mode & Gatekeeper for Prep Team
  initPreviewGatekeeper();

  // 1. Theme Switcher (Dark / Light Mode)
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
    updateNavbarLogo(true);
  } else {
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcon(false);
    updateNavbarLogo(false);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        updateThemeIcon(false);
        updateNavbarLogo(false);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon(true);
        updateNavbarLogo(true);
      }
    });
  }

  function updateThemeIcon(isDark) {
    if (!themeToggle) return;
    themeToggle.innerHTML = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('title', isDark ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim');
  }

  function updateNavbarLogo(isDark) {
    const navLogos = document.querySelectorAll('.nav-logo');
    navLogos.forEach(logo => {
      if (isDark) {
        logo.src = 'assets/img/kfclogo_white_horizontal.png';
      } else {
        logo.src = 'assets/img/kfc_logo_color_horizontal.png';
      }
    });
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = navLinks.style.display === 'flex';
      navLinks.style.display = isExpanded ? 'none' : 'flex';
      if (!isExpanded) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '76px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--bg-glass)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid var(--border-color)';
        navLinks.style.backdropFilter = 'blur(12px)';
      }
    });
  }

  // 3. Tab Switching for Study Programs (Bc. vs. Mgr.)
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // 4. Smooth Anchor Scrolling & Active Navigation Link Update
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // 5. Grotthuss Explainer Popover Interactions
  const grotthussToggle = document.getElementById('grotthuss-toggle');
  const grotthussPopover = document.getElementById('grotthuss-popover');
  const grotthussClose = document.getElementById('grotthuss-close');

  if (grotthussToggle && grotthussPopover) {
    grotthussToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      grotthussPopover.classList.toggle('active');
    });

    if (grotthussClose) {
      grotthussClose.addEventListener('click', (e) => {
        e.stopPropagation();
        grotthussPopover.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (!grotthussPopover.contains(e.target) && e.target !== grotthussToggle) {
        grotthussPopover.classList.remove('active');
      }
    });
  }

  // 6. Water & Grotthuss Proton Transfer Simulation (H2O, H3O+, OH-)
  initWaterProtonTransferCanvas();
});

/**
 * Simulace vodního prostředí s autoprotolýzou a Grotthussovým mechanismem přenosu protonů
 * 2 H2O <===> H3O+ + OH-
 */
function initWaterProtonTransferCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.clientWidth;
  let height = canvas.height = canvas.parentElement.clientHeight;

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  });

  // Water Molecules definition
  // species: 'H2O' (neutral, 2 H), 'H3O+' (cation, 3 H), 'OH-' (anion, 1 H)
  const molecules = [];
  const numMolecules = 18;

  for (let i = 0; i < numMolecules; i++) {
    // Start with mostly H2O, one H3O+ and one OH-
    let species = 'H2O';
    if (i === 0) species = 'H3O+';
    if (i === 1) species = 'OH-';

    molecules.push({
      x: Math.random() * (width - 60) + 30,
      y: Math.random() * (height - 60) + 30,
      vx: (Math.random() - 0.5) * 1.1,
      vy: (Math.random() - 0.5) * 1.1,
      angle: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.03,
      species: species,
      flash: 0 // flash animation counter when proton is transferred
    });
  }

  // Proton hopping event effects
  const transferFlashes = [];

  // Mouse perturbation
  let mouse = { x: -1000, y: -1000, active: false };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  canvas.addEventListener('mouseleave', () => { mouse.active = false; });

  let lastHoppingTime = 0;
  let simTime = 0;

  function animate(timestamp) {
    simTime++;
    ctx.clearRect(0, 0, width, height);

    // Deep aquatic navy background
    const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, 20, width * 0.5, height * 0.5, Math.max(width, height));
    bgGrad.addColorStop(0, '#0c1b33');
    bgGrad.addColorStop(1, '#050c1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 1. Update Physics (Movement, Wall Collisions, Repulsion)
    for (let i = 0; i < molecules.length; i++) {
      const m = molecules[i];
      m.x += m.vx;
      m.y += m.vy;
      m.angle += m.vRot;

      if (m.flash > 0) m.flash -= 0.03;

      // Bounce off walls
      if (m.x < 25) { m.x = 25; m.vx = Math.abs(m.vx); }
      if (m.x > width - 25) { m.x = width - 25; m.vx = -Math.abs(m.vx); }
      if (m.y < 25) { m.y = 25; m.vy = Math.abs(m.vy); }
      if (m.y > height - 25) { m.y = height - 25; m.vy = -Math.abs(m.vy); }

      // Mouse influence
      if (mouse.active) {
        const dx = m.x - mouse.x;
        const dy = m.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 70 && d > 0) {
          m.vx += (dx / d) * 0.3;
          m.vy += (dy / d) * 0.3;
        }
      }

      // Inter-molecular soft repulsion
      for (let j = i + 1; j < molecules.length; j++) {
        const m2 = molecules[j];
        const dx = m2.x - m.x;
        const dy = m2.y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 42 && dist > 0) {
          const force = (42 - dist) * 0.02;
          m.vx -= (dx / dist) * force;
          m.vy -= (dy / dist) * force;
          m2.vx += (dx / dist) * force;
          m2.vy += (dy / dist) * force;
        }
      }

      // Max velocity limit
      const v = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
      if (v > 1.8) {
        m.vx = (m.vx / v) * 1.8;
        m.vy = (m.vy / v) * 1.8;
      }
    }

    // 2. Hydrogen Bonds & Grotthuss Proton Hopping Logic
    for (let i = 0; i < molecules.length; i++) {
      for (let j = i + 1; j < molecules.length; j++) {
        const m1 = molecules[i];
        const m2 = molecules[j];
        const dx = m2.x - m1.x;
        const dy = m2.y - m1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Hydrogen bond range: 45 to 85 px
        if (dist < 85) {
          const alpha = (1 - (dist / 85)) * 0.6;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 1.4;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(m1.x, m1.y);
          ctx.lineTo(m2.x, m2.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Grotthuss Proton Hop Condition (close proximity)
        if (dist < 52 && timestamp - lastHoppingTime > 450) {
          // Case A: H3O+ meets H2O -> transfers proton -> donor becomes H2O, acceptor becomes H3O+
          if (m1.species === 'H3O+' && m2.species === 'H2O') {
            m1.species = 'H2O';
            m2.species = 'H3O+';
            m1.flash = 1; m2.flash = 1;
            transferFlashes.push({ x: (m1.x + m2.x) / 2, y: (m1.y + m2.y) / 2, radius: 4, alpha: 1, type: 'H+' });
            lastHoppingTime = timestamp;
          } else if (m2.species === 'H3O+' && m1.species === 'H2O') {
            m2.species = 'H2O';
            m1.species = 'H3O+';
            m1.flash = 1; m2.flash = 1;
            transferFlashes.push({ x: (m1.x + m2.x) / 2, y: (m1.y + m2.y) / 2, radius: 4, alpha: 1, type: 'H+' });
            lastHoppingTime = timestamp;
          }
          // Case B: OH- meets H2O -> accepts proton from H2O -> m2 becomes OH-, m1 becomes H2O
          else if (m1.species === 'OH-' && m2.species === 'H2O') {
            m1.species = 'H2O';
            m2.species = 'OH-';
            m1.flash = 1; m2.flash = 1;
            transferFlashes.push({ x: (m1.x + m2.x) / 2, y: (m1.y + m2.y) / 2, radius: 4, alpha: 1, type: 'H+' });
            lastHoppingTime = timestamp;
          } else if (m2.species === 'OH-' && m1.species === 'H2O') {
            m2.species = 'H2O';
            m1.species = 'OH-';
            m1.flash = 1; m2.flash = 1;
            transferFlashes.push({ x: (m1.x + m2.x) / 2, y: (m1.y + m2.y) / 2, radius: 4, alpha: 1, type: 'H+' });
            lastHoppingTime = timestamp;
          }
          // Case C: H3O+ meets OH- -> Neutralization to 2 H2O
          else if ((m1.species === 'H3O+' && m2.species === 'OH-') || (m1.species === 'OH-' && m2.species === 'H3O+')) {
            m1.species = 'H2O';
            m2.species = 'H2O';
            m1.flash = 1.2; m2.flash = 1.2;
            transferFlashes.push({ x: (m1.x + m2.x) / 2, y: (m1.y + m2.y) / 2, radius: 6, alpha: 1, type: 'NEUT' });
            lastHoppingTime = timestamp;
          }
        }
      }
    }

    // Occasional spontaneous autodissociation if no ions exist: 2 H2O -> H3O+ + OH-
    const hasH3O = molecules.some(m => m.species === 'H3O+');
    const hasOH = molecules.some(m => m.species === 'OH-');
    if ((!hasH3O || !hasOH) && Math.random() < 0.015) {
      const idx1 = Math.floor(Math.random() * molecules.length);
      let idx2 = Math.floor(Math.random() * molecules.length);
      while (idx2 === idx1) idx2 = Math.floor(Math.random() * molecules.length);
      molecules[idx1].species = 'H3O+';
      molecules[idx2].species = 'OH-';
      molecules[idx1].flash = 1;
      molecules[idx2].flash = 1;
    }

    // 3. Render Transfer Flash Pulses
    for (let fIdx = transferFlashes.length - 1; fIdx >= 0; fIdx--) {
      const flash = transferFlashes[fIdx];
      flash.radius += 1.6;
      flash.alpha -= 0.045;

      ctx.strokeStyle = flash.type === 'NEUT' ? `rgba(16, 185, 129, ${flash.alpha})` : `rgba(247, 127, 0, ${flash.alpha})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Mini text badge for proton hop
      ctx.fillStyle = `rgba(255, 255, 255, ${flash.alpha})`;
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(flash.type === 'NEUT' ? 'H₃O⁺ + OH⁻ ➔ 2 H₂O' : 'H⁺ hop!', flash.x, flash.y - flash.radius - 2);

      if (flash.alpha <= 0) {
        transferFlashes.splice(fIdx, 1);
      }
    }

    // 4. Render All Water Molecules & Ions
    molecules.forEach(m => {
      drawWaterMolecule(ctx, m);
    });

    requestAnimationFrame(animate);
  }

  function drawWaterMolecule(ctx, m) {
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(m.angle);

    const bondLength = 14;
    const bondAngle = (104.5 * Math.PI) / 180; // Water bond angle

    // Hydrogen positions relative to oxygen (0,0)
    let hydrogens = [];
    if (m.species === 'H2O') {
      hydrogens = [
        { x: bondLength * Math.cos(-bondAngle / 2), y: bondLength * Math.sin(-bondAngle / 2) },
        { x: bondLength * Math.cos(bondAngle / 2), y: bondLength * Math.sin(bondAngle / 2) }
      ];
    } else if (m.species === 'H3O+') {
      // 3 Hydrogens arranged in pyramid-like trigon
      const a1 = 0, a2 = (115 * Math.PI) / 180, a3 = (-115 * Math.PI) / 180;
      hydrogens = [
        { x: bondLength * Math.cos(a1), y: bondLength * Math.sin(a1) },
        { x: bondLength * Math.cos(a2), y: bondLength * Math.sin(a2) },
        { x: bondLength * Math.cos(a3), y: bondLength * Math.sin(a3) }
      ];
    } else if (m.species === 'OH-') {
      // 1 Hydrogen
      hydrogens = [
        { x: bondLength, y: 0 }
      ];
    }

    // Draw Covalent Bonds (O-H)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    hydrogens.forEach(h => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(h.x, h.y);
      ctx.stroke();
    });

    // Special species glows
    if (m.species === 'H3O+') {
      // Cyan/Blue glow for positive hydronium
      const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
      glow.addColorStop(0, 'rgba(0, 180, 216, 0.8)');
      glow.addColorStop(1, 'rgba(0, 180, 216, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();
    } else if (m.species === 'OH-') {
      // Amber/Gold glow for negative hydroxide
      const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
      glow.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
      glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();
    }

    // Flash glow when hopping occurred
    if (m.flash > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${m.flash * 0.7})`;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Oxygen Atom (Red sphere with 3D gradient)
    const oRadius = 8.5;
    const oxyGrad = ctx.createRadialGradient(-2, -2, 1, 0, 0, oRadius);
    if (m.species === 'H3O+') {
      oxyGrad.addColorStop(0, '#7dd3fc');
      oxyGrad.addColorStop(0.4, '#0284c7');
      oxyGrad.addColorStop(1, '#034a75');
    } else if (m.species === 'OH-') {
      oxyGrad.addColorStop(0, '#fde68a');
      oxyGrad.addColorStop(0.4, '#d97706');
      oxyGrad.addColorStop(1, '#78350f');
    } else {
      oxyGrad.addColorStop(0, '#fca5a5');
      oxyGrad.addColorStop(0.35, '#ef4444');
      oxyGrad.addColorStop(1, '#7f1d1d');
    }

    ctx.fillStyle = oxyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, oRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Hydrogens (White spheres)
    const hRadius = 4.8;
    hydrogens.forEach(h => {
      const hGrad = ctx.createRadialGradient(h.x - 1, h.y - 1, 0.5, h.x, h.y, hRadius);
      hGrad.addColorStop(0, '#ffffff');
      hGrad.addColorStop(0.6, '#e2e8f0');
      hGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.arc(h.x, h.y, hRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Charge Badge (+ for H3O+, - for OH-)
    if (m.species === 'H3O+') {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+', 0, -12);
    } else if (m.species === 'OH-') {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('−', 0, -12);
    }

    ctx.restore();
  }

  requestAnimationFrame(animate);
}

/* ==========================================================================
   Preview Mode & Gatekeeper Authentication Logic
   ========================================================================== */
function initPreviewGatekeeper() {
  const gatekeeperEl = document.getElementById('preview-gatekeeper');
  const bannerEl = document.getElementById('preview-banner');
  const formEl = document.getElementById('gatekeeper-form');
  const passInput = document.getElementById('gatekeeper-pass-input');
  const errorEl = document.getElementById('gatekeeper-error');
  const lockBtn = document.getElementById('preview-lock-btn');

  if (!gatekeeperEl) return;

  // Accepted keys/passwords for team preview
  const VALID_KEYS = ['kfc2026', 'pocitacovachemie', 'kfc-preview', 'chemie2026'];
  const AUTH_KEY = 'pc_chem_preview_auth';

  // 1. Check URL parameters (?preview=kfc2026 or ?access=kfc2026)
  const urlParams = new URLSearchParams(window.location.search);
  const previewParam = (urlParams.get('preview') || urlParams.get('access') || '').trim().toLowerCase();

  if (previewParam && VALID_KEYS.includes(previewParam)) {
    localStorage.setItem(AUTH_KEY, 'granted');
    // Remove secret from URL bar for clean UX
    try {
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    } catch (e) {}
  }

  // 2. Check current authorization status
  const isAuthorized = localStorage.getItem(AUTH_KEY) === 'granted';

  if (isAuthorized) {
    // Unlock web
    gatekeeperEl.style.display = 'none';
    if (bannerEl) bannerEl.style.display = 'block';
    document.body.style.overflow = '';
  } else {
    // Lock web behind gatekeeper overlay
    gatekeeperEl.style.display = 'flex';
    if (bannerEl) bannerEl.style.display = 'none';
    document.body.style.overflow = 'hidden';
  }

  // 3. Form submission handler
  if (formEl && passInput) {
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPass = (passInput.value || '').trim().toLowerCase();

      if (VALID_KEYS.includes(enteredPass)) {
        localStorage.setItem(AUTH_KEY, 'granted');
        if (errorEl) errorEl.style.display = 'none';
        gatekeeperEl.style.display = 'none';
        if (bannerEl) bannerEl.style.display = 'block';
        document.body.style.overflow = '';
      } else {
        if (errorEl) {
          errorEl.style.display = 'block';
          passInput.focus();
          passInput.select();
        }
      }
    });
  }

  // 4. Lockout / Logout button
  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      localStorage.removeItem(AUTH_KEY);
      window.location.reload();
    });
  }
}
