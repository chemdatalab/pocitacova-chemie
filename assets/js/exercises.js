/**
 * Počítačová chemie - Interaktivní cvičení a simulátory
 * Katedra fyzikální chemie PřF UPOL
 */

document.addEventListener('DOMContentLoaded', () => {
  initTriangleSimulator();
  initH2MorseSimulator();
  initVibrationalIRSimulator();
  initDockingSimulator();
  initAlphaFoldExplorer();
});

/* ==========================================================================
   1. TROJÚHELNÍK KOMPROMISŮ (TRADE-OFF TRIANGLE)
   ========================================================================== */
function initTriangleSimulator() {
  const canvas = document.getElementById('triangle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width = 440;
  const height = canvas.height = 360;

  // Triangle Vertices (Equilateral-like layout)
  const A = { x: 220, y: 50, label: 'Velikost systému', sub: 'Hrubozrnné & Mesoscale modely' };
  const B = { x: 60, y: 310, label: 'Vysoká přesnost', sub: 'Kvantová mechanika (QM / DFT)' };
  const C = { x: 380, y: 310, label: 'Nízká náročnost (Rychlost)', sub: 'Silová pole & Empirické metody' };

  // Current Target Point (Start at Bod D - center)
  let P = { x: 220, y: 220 };
  let isDragging = false;

  function getBarycentric(p, a, b, c) {
    const denom = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
    const wA = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / denom;
    const wB = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / denom;
    const wC = 1 - wA - wB;
    return { wA, wB, wC };
  }

  function updateInfo(bary) {
    const infoTitle = document.getElementById('tri-method-title');
    const infoDesc = document.getElementById('tri-method-desc');
    const infoScale = document.getElementById('tri-method-scale');
    const infoBadge = document.getElementById('tri-method-badge');

    if (!infoTitle) return;

    const { wA, wB, wC } = bary;

    if (wA > 0.45) {
      infoTitle.innerText = 'Hrubozrnné modely (Coarse-Grained / MARTINI)';
      infoBadge.innerText = 'Velké biologické systémy';
      infoBadge.style.background = '#8b5cf6';
      infoDesc.innerText = 'Několik atomů je sloučeno do jedné „kuličky“ (beadu). Umožňuje simulovat obrovské buněčné membrány, virové kapsidy a agregace proteinů po milisekundy.';
      infoScale.innerHTML = '<strong>Škála:</strong> 10 000 – 1 000 000+ atomů | Čas: mikrosekundy až milisekundy';
    } else if (wB > 0.45) {
      infoTitle.innerText = 'Kvantová chemie (QM / DFT / Ab Initio)';
      infoBadge.innerText = 'Vysoká elektronová přesnost';
      infoBadge.style.background = '#0284c7';
      infoDesc.innerText = 'Exaktní řešení Schrödingerovy rovnice a elektronových orbitalů. Nezbytné pro výpočet chemických reakcí, štěpení vazeb, UV/VIS spekter a excitovaných stavů.';
      infoScale.innerHTML = '<strong>Škála:</strong> 10 – 500 atomů | Čas: statické výpočty / pikosekundy';
    } else if (wC > 0.45) {
      infoTitle.innerText = 'Klasická molekulová dynamika (All-Atom MD)';
      infoBadge.innerText = 'Rychlé simulace atomů';
      infoBadge.style.background = '#10b981';
      infoDesc.innerText = 'Atomy jsou modelovány jako kuličky spojené pružinkami pomocí Newtonových zákonů pohybu. Ideální pro dokování léčiv, konformační změny proteinů a hydrataci.';
      infoScale.innerHTML = '<strong>Škála:</strong> 1 000 – 200 000 atomů | Čas: stovky nanosekund';
    } else {
      infoTitle.innerText = 'Bod D: Víceškálové metody (QM/MM) & Strojové učení (MLP)';
      infoBadge.innerText = 'Svatý grál výpočetní chemie';
      infoBadge.style.background = '#f59e0b';
      infoDesc.innerText = 'Kombinace metod (aktivní místo přesně pomocí QM, zbytek proteinu a rozpouštědlo pomocí MD/MM) nebo využití neuronových sítí k dosažení kvantové přesnosti za zlomek času.';
      infoScale.innerHTML = '<strong>Škála:</strong> Tisíce atomů s kvantovou přesností v reaktivním centru';
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw Triangle fill
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, 'rgba(0, 73, 144, 0.08)');
    grad.addColorStop(1, 'rgba(0, 180, 216, 0.12)');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.fill();

    // Triangle border
    ctx.strokeStyle = '#0077b6';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Dashed lines to center
    ctx.strokeStyle = 'rgba(0, 180, 216, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y); ctx.lineTo(P.x, P.y);
    ctx.moveTo(B.x, B.y); ctx.lineTo(P.x, P.y);
    ctx.moveTo(C.x, C.y); ctx.lineTo(P.x, P.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw vertices
    [A, B, C].forEach((v, idx) => {
      ctx.fillStyle = '#004990';
      ctx.beginPath();
      ctx.arc(v.x, v.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      if (idx === 0) {
        ctx.fillText(v.label, v.x, v.y - 14);
      } else if (idx === 1) {
        ctx.textAlign = 'left';
        ctx.fillText(v.label, v.x - 10, v.y + 24);
      } else {
        ctx.textAlign = 'right';
        ctx.fillText(v.label, v.x + 10, v.y + 24);
      }
    });

    // Draw Point P (Current Selection)
    const pGrad = ctx.createRadialGradient(P.x, P.y, 2, P.x, P.y, 14);
    pGrad.addColorStop(0, '#f77f00');
    pGrad.addColorStop(1, 'rgba(247, 127, 0, 0.2)');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.arc(P.x, P.y, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f77f00';
    ctx.beginPath();
    ctx.arc(P.x, P.y, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f77f00';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Zvolený model', P.x, P.y - 18);
  }

  function handleMove(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const bary = getBarycentric({ x, y }, A, B, C);
    // Keep inside or near triangle
    if (bary.wA >= -0.05 && bary.wB >= -0.05 && bary.wC >= -0.05) {
      P.x = x;
      P.y = y;
      draw();
      updateInfo(bary);
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleMove(e.clientX, e.clientY);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) handleMove(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  });

  window.addEventListener('touchend', () => { isDragging = false; });

  draw();
  updateInfo(getBarycentric(P, A, B, C));
}

/* ==========================================================================
   2. Kapitola 2: Potenciální křivka H2 (Morseův potenciál & LCAO)
   ========================================================================== */
function initH2MorseSimulator() {
  const slider = document.getElementById('h2-distance-slider');
  const distVal = document.getElementById('h2-distance-val');
  const energyVal = document.getElementById('h2-energy-val');
  const canvas = document.getElementById('h2-morse-canvas');

  if (!slider || !canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width = 620;
  const height = canvas.height = 320;

  // Morse potential parameters for H2
  const De = 4.75; // eV (disociační energie)
  const a = 1.94;  // Angstrom^-1 (parametr šířky potenciálu)
  const re = 0.74; // Angstrom (rovnovážná vazebná délka)

  function morseEnergy(r) {
    return De * Math.pow(1 - Math.exp(-a * (r - re)), 2) - De;
  }

  function draw(currentR) {
    ctx.clearRect(0, 0, width, height);

    // Coordinate system parameters (perfectly scaled for height 320px)
    const ox = 70;      // Origin X in px
    const oy = 95;      // E = 0 eV horizontal line in px
    const scaleX = 145; // px per Angstrom
    const scaleY = 32;  // px per eV (De=4.75 eV -> 152 px below oy -> y=247px)
    const bottomY = 280; // X axis position

    // Background chart gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#090f1d');
    bgGrad.addColorStop(1, '#050a14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 1. Grid & Reference Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Energy grid lines (-4, -3, -2, -1, +1, +2 eV)
    [-4, -3, -2, -1, 1, 2].forEach(eVal => {
      const gy = oy - eVal * scaleY;
      ctx.beginPath();
      ctx.moveTo(ox, gy);
      ctx.lineTo(width - 25, gy);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${eVal > 0 ? '+' : ''}${eVal}`, ox - 8, gy + 3);
    });

    // Distance grid lines (0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5 Å)
    [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5].forEach(rVal => {
      const gx = ox + rVal * scaleX;
      if (gx < width - 20) {
        ctx.beginPath();
        ctx.moveTo(gx, 25);
        ctx.lineTo(gx, bottomY);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${rVal.toFixed(1)}`, gx, bottomY + 16);
      }
    });

    // E = 0 eV (Dissociation asymptote H + H)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(width - 25, oy);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('0 eV (H + H)', width - 30, oy - 6);

    // 2. Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(ox, 20);
    ctx.lineTo(ox, bottomY);
    ctx.lineTo(width - 20, bottomY);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Mezijaderná vzdálenost R (Å)', ox + (width - ox - 20) / 2, height - 10);
    
    ctx.save();
    ctx.translate(20, (20 + bottomY) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Potenciální energie E (eV)', 0, 0);
    ctx.restore();

    // 3. Shaded Potential Well
    ctx.beginPath();
    let firstPoint = true;
    for (let px = 0.33; px <= 3.6; px += 0.02) {
      const e = morseEnergy(px);
      const cx = ox + px * scaleX;
      const cy = oy - e * scaleY;
      if (firstPoint) {
        ctx.moveTo(cx, cy);
        firstPoint = false;
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    const endX = ox + 3.6 * scaleX;
    ctx.lineTo(endX, oy);
    ctx.lineTo(ox + 0.33 * scaleX, oy);
    ctx.closePath();

    const wellGrad = ctx.createLinearGradient(0, oy, 0, oy + De * scaleY);
    wellGrad.addColorStop(0, 'rgba(0, 180, 216, 0.03)');
    wellGrad.addColorStop(1, 'rgba(0, 180, 216, 0.22)');
    ctx.fillStyle = wellGrad;
    ctx.fill();

    // 4. Plot Morse Potential Curve
    ctx.strokeStyle = '#00b4d8';
    ctx.lineWidth = 3;
    ctx.beginPath();

    firstPoint = true;
    for (let px = 0.33; px <= 3.6; px += 0.02) {
      const e = morseEnergy(px);
      const cx = ox + px * scaleX;
      const cy = Math.min(Math.max(oy - e * scaleY, 15), bottomY + 15);
      if (firstPoint) {
        ctx.moveTo(cx, cy);
        firstPoint = false;
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    ctx.stroke();

    // 5. Equilibrium marker (re = 0.74 A, -De = -4.75 eV)
    const eqX = ox + re * scaleX;
    const eqY = oy - (-De) * scaleY;
    
    // Vertical line to minimum
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(eqX, bottomY);
    ctx.lineTo(eqX, eqY);
    ctx.lineTo(ox, eqY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Green minimum dot
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(eqX, eqY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 10.5px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Minimum R_eq = 0.74 Å (-4.75 eV)', eqX + 50, eqY + 18);

    // 6. Current State Point (interactive amber indicator)
    const curE = morseEnergy(currentR);
    const curX = ox + currentR * scaleX;
    const curY = oy - curE * scaleY;

    // Projection dashed lines
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(curX, bottomY);
    ctx.lineTo(curX, curY);
    ctx.lineTo(ox, curY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glow pulse point
    const glowGrad = ctx.createRadialGradient(curX, curY, 2, curX, curY, 14);
    glowGrad.addColorStop(0, '#f59e0b');
    glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(curX, curY, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(curX, curY, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 7. Render 2D Overlapping Atomic Orbitals Representation in top right corner
    drawOrbitalOverlap(currentR);
  }

  function drawOrbitalOverlap(r) {
    const boxX = width - 175;
    const boxY = 22;
    const boxW = 155;
    const boxH = 92;

    ctx.fillStyle = 'rgba(11, 19, 41, 0.9)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(boxX, boxY, boxW, boxH, 8);
    } else {
      ctx.rect(boxX, boxY, boxW, boxH);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10.5px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Molekulový orbital σ_1s', boxX + boxW / 2, boxY + 18);

    const midX = boxX + boxW / 2;
    const midY = boxY + 54;
    const sep = Math.min(Math.max(r * 22, 14), 58);

    // Orbital clouds (LCAO electron density)
    const orbRadius = 19;
    const grad1 = ctx.createRadialGradient(midX - sep / 2, midY, 2, midX - sep / 2, midY, orbRadius);
    grad1.addColorStop(0, 'rgba(0, 180, 216, 0.85)');
    grad1.addColorStop(1, 'rgba(0, 180, 216, 0)');

    const grad2 = ctx.createRadialGradient(midX + sep / 2, midY, 2, midX + sep / 2, midY, orbRadius);
    grad2.addColorStop(0, 'rgba(0, 180, 216, 0.85)');
    grad2.addColorStop(1, 'rgba(0, 180, 216, 0)');

    ctx.fillStyle = grad1;
    ctx.beginPath();
    ctx.arc(midX - sep / 2, midY, orbRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = grad2;
    ctx.beginPath();
    ctx.arc(midX + sep / 2, midY, orbRadius, 0, Math.PI * 2);
    ctx.fill();

    // Atomic Nuclei (H+ Protons)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(midX - sep / 2, midY, 4, 0, Math.PI * 2);
    ctx.arc(midX + sep / 2, midY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px Inter, sans-serif';
    ctx.fillText(`Překryv: ${(Math.max(0, 1 - (r - 0.74) * 0.6) * 100).toFixed(0)} %`, boxX + boxW / 2, boxY + 84);
  }

  // Event listener on distance slider
  slider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    distVal.innerText = `${val.toFixed(2)} Å`;
    const energy = morseEnergy(val);
    energyVal.innerText = `${energy > 0 ? '+' : ''}${energy.toFixed(2)} eV`;
    if (energy < -4.5) {
      energyVal.style.color = '#10b981'; // Near minimum
    } else if (energy > 0) {
      energyVal.style.color = '#ef4444'; // Repulsive
    } else {
      energyVal.style.color = '#f59e0b';
    }
    draw(val);
  });

  // Initial draw
  draw(parseFloat(slider.value));
}

/* ==========================================================================
   3. KLASICKÁ MECHANIKA: VIBRAČNÍ POHYBY & IR SPEKTRA
   ========================================================================== */
function initVibrationalIRSimulator() {
  const canvas = document.getElementById('ir-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width = 540;
  const height = canvas.height = 320;

  let activeMode = 'h2o_bend'; // h2o_sym, h2o_asym, h2o_bend, co2_asym
  let animTime = 0;

  const modeButtons = document.querySelectorAll('.ir-mode-btn');
  const irDesc = document.getElementById('ir-mode-desc');
  const irFreq = document.getElementById('ir-mode-freq');

  const modesData = {
    'h2o_bend': {
      name: 'H₂O: Deformační kmit (nůžkový / scissoring)',
      freq: '1595 cm⁻¹ (6.27 µm)',
      desc: 'Mění se úhel vazby H-O-H. Atomy vodíku se synchronně přibližují a oddalují od sebe, zatímco atom kyslíku kmitá v protisměru.',
      peakWn: 1595
    },
    'h2o_sym': {
      name: 'H₂O: Symetrický valenční kmit (stretching)',
      freq: '3657 cm⁻¹ (2.73 µm)',
      desc: 'Obě vazby O-H se současně natahují a zkracují ve stejné fázi. Dochází k významné změně dipólového momentu.',
      peakWn: 3657
    },
    'h2o_asym': {
      name: 'H₂O: Asymetrický valenční kmit (asym. stretching)',
      freq: '3756 cm⁻¹ (2.66 µm)',
      desc: 'Zatímco jedna vazba O-H se natahuje, druhá se zkracuje. Velmi silný absorpční pás v infračervené oblasti.',
      peakWn: 3756
    },
    'co2_asym': {
      name: 'CO₂: Asymetrický valenční kmit (skleníkový plyn)',
      freq: '2349 cm⁻¹ (4.26 µm)',
      desc: 'Uhlík kmitá mezi dvěma kyslíky. Způsobuje silnou absorpci IR záření zemského povrchu – klíčový mechanismus skleníkového efektu!',
      peakWn: 2349
    }
  };

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMode = btn.getAttribute('data-mode');

      const data = modesData[activeMode];
      if (data) {
        if (irDesc) irDesc.innerText = data.desc;
        if (irFreq) irFreq.innerText = `${data.name} | Frekvence: ${data.freq}`;
      }
    });
  });

  function render() {
    ctx.clearRect(0, 0, width, height);
    animTime += 0.065;

    // Split Canvas: Left side = Animated Molecule, Right side = IR Spectrum
    const molWidth = 240;
    const specWidth = 280;

    // Draw Molecule background
    ctx.fillStyle = '#0a1128';
    ctx.beginPath();
    ctx.roundRect(10, 10, molWidth, height - 20, 10);
    ctx.fill();

    // Draw Spectrum background
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(molWidth + 20, 10, specWidth, height - 20, 10);
    ctx.fill();

    // 1. Draw Molecule Animation
    drawVibratingMolecule(ctx, molWidth / 2 + 10, height / 2 - 10, activeMode, animTime);

    // 2. Draw IR Spectrum
    drawIRSpectrum(ctx, molWidth + 30, 25, specWidth - 20, height - 50, activeMode);

    requestAnimationFrame(render);
  }

  function drawVibratingMolecule(ctx, cx, cy, mode, t) {
    const amp = Math.sin(t) * 12;

    if (mode.startsWith('h2o')) {
      let oxy = { x: cx, y: cy - 25 };
      let h1 = { x: cx - 45, y: cy + 30 };
      let h2 = { x: cx + 45, y: cy + 30 };

      if (mode === 'h2o_bend') {
        oxy.y -= amp * 0.4;
        h1.x += amp * 0.9;
        h2.x -= amp * 0.9;
      } else if (mode === 'h2o_sym') {
        oxy.y -= amp * 0.5;
        h1.x -= amp * 0.8; h1.y += amp * 0.8;
        h2.x += amp * 0.8; h2.y += amp * 0.8;
      } else if (mode === 'h2o_asym') {
        oxy.x += amp * 0.4;
        h1.x -= amp * 0.9; h1.y += amp * 0.9;
        h2.x -= amp * 0.9; h2.y -= amp * 0.9;
      }

      // Springs (Bonds)
      drawSpring(ctx, oxy.x, oxy.y, h1.x, h1.y);
      drawSpring(ctx, oxy.x, oxy.y, h2.x, h2.y);

      // Oxygen Atom
      drawAtom(ctx, oxy.x, oxy.y, 18, '#ef4444', 'O');
      // Hydrogen Atoms
      drawAtom(ctx, h1.x, h1.y, 11, '#ffffff', 'H');
      drawAtom(ctx, h2.x, h2.y, 11, '#ffffff', 'H');

    } else if (mode === 'co2_asym') {
      let c = { x: cx + amp * 0.9, y: cy };
      let o1 = { x: cx - 70 - amp * 0.5, y: cy };
      let o2 = { x: cx + 70 - amp * 0.5, y: cy };

      drawSpring(ctx, o1.x, o1.y, c.x, c.y);
      drawSpring(ctx, c.x, c.y, o2.x, o2.y);

      drawAtom(ctx, c.x, c.y, 15, '#38bdf8', 'C');
      drawAtom(ctx, o1.x, o1.y, 17, '#ef4444', 'O');
      drawAtom(ctx, o2.x, o2.y, 17, '#ef4444', 'O');
    }
  }

  function drawSpring(ctx, x1, y1, x2, y2) {
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function drawAtom(ctx, x, y, r, color, symbol) {
    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, color);
    grad.addColorStop(1, '#000000');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color === '#ffffff' ? '#0f172a' : '#ffffff';
    ctx.font = `bold ${Math.round(r * 0.9)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, x, y);
  }

  function drawIRSpectrum(ctx, sx, sy, sw, sh, mode) {
    // Axes: X = Wavenumber 4000 -> 500 cm^-1, Y = Transmittance %
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(sx + 30, sy + sh - 25);
    ctx.lineTo(sx + sw - 10, sy + sh - 25);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('4000', sx + 40, sy + sh - 10);
    ctx.fillText('2000', sx + sw / 2, sy + sh - 10);
    ctx.fillText('500 cm⁻¹', sx + sw - 25, sy + sh - 10);

    ctx.fillText('IR Absorpční spektrum', sx + sw / 2, sy + 12);

    // Synthetic IR Spectrum line with dips (Absorption peaks)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const peak = modesData[mode].peakWn;

    for (let x = 0; x < sw - 50; x += 2) {
      // Map x to wavenumber (4000 to 500)
      const wn = 4000 - (x / (sw - 50)) * 3500;
      let y = sy + 35; // 100% transmittance baseline

      // Peak 1: 3700 cm^-1 (H2O val)
      const d1 = Math.abs(wn - 3700);
      if (d1 < 180) y += Math.exp(-(d1 * d1) / 3000) * 140;

      // Peak 2: 2349 cm^-1 (CO2)
      const d2 = Math.abs(wn - 2349);
      if (d2 < 120) y += Math.exp(-(d2 * d2) / 1800) * 160;

      // Peak 3: 1595 cm^-1 (H2O bend)
      const d3 = Math.abs(wn - 1595);
      if (d3 < 140) y += Math.exp(-(d3 * d3) / 2200) * 130;

      if (x === 0) ctx.moveTo(sx + 35 + x, y);
      else ctx.lineTo(sx + 35 + x, y);
    }
    ctx.stroke();

    // Highlight active peak
    const activeX = sx + 35 + ((4000 - peak) / 3500) * (sw - 50);
    ctx.fillStyle = 'rgba(247, 127, 0, 0.85)';
    ctx.beginPath();
    ctx.arc(activeX, sy + sh - 55, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f77f00';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText(`${peak} cm⁻¹`, activeX, sy + sh - 65);
  }

  render();
}

/* ==========================================================================
   4. DOKOVÁNÍ LÉČIV (DRUG DOCKING SIMULATOR)
   ========================================================================== */
function initDockingSimulator() {
  const canvas = document.getElementById('docking-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width = 540;
  const height = canvas.height = 320;

  // Enzyme Pocket Center & Pharmacophore Features
  const pocket = {
    x: 270,
    y: 160,
    hBondSite1: { x: 230, y: 130, type: 'H-Acceptor' },
    hBondSite2: { x: 310, y: 130, type: 'H-Donor' },
    hydrophobicSite: { x: 270, y: 195, radius: 28 }
  };

  // Ligand (Drug Candidate) draggable state
  let ligand = {
    x: 120,
    y: 160,
    angle: 0,
    isDragging: false
  };

  const scoreEl = document.getElementById('docking-score');
  const statusEl = document.getElementById('docking-status');

  function calculateScore() {
    const dx = ligand.x - pocket.x;
    const dy = ligand.y - pocket.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Orientation score
    const targetAngle = 0;
    const angleDiff = Math.abs((ligand.angle % (Math.PI * 2)) - targetAngle);

    let affinity = -2.0; // Baseline non-specific interaction

    if (dist < 45) {
      affinity -= (45 - dist) * 0.16; // Binding in pocket
      if (angleDiff < 0.4 || angleDiff > Math.PI * 2 - 0.4) {
        affinity -= 3.8; // Perfect H-bond alignment!
      }
    }

    if (scoreEl) {
      scoreEl.innerText = `${affinity.toFixed(1)} kcal/mol`;
    }

    if (statusEl) {
      if (affinity < -7.5) {
        statusEl.innerText = '🔥 Perfektní vazba! Silný inhibitor enzymu.';
        statusEl.style.color = '#10b981';
      } else if (affinity < -4.5) {
        statusEl.innerText = '⚡ Částečná vazba. Zkuste ligand pootočit nebo lépe usadit.';
        statusEl.style.color = '#f59e0b';
      } else {
        statusEl.innerText = '❄️ Volný ligand mimo vazebnou kapsu.';
        statusEl.style.color = '#94a3b8';
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Enzyme Surface & Binding Pocket
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(180, 70, 180, 180, 24);
    ctx.fill();

    // Pocket Cavity
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(pocket.x, pocket.y, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pharmacophore Features inside pocket
    // H-Bond Acceptor (Red)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.beginPath();
    ctx.arc(pocket.hBondSite1.x, pocket.hBondSite1.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(pocket.hBondSite1.x, pocket.hBondSite1.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // H-Bond Donor (Blue)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.beginPath();
    ctx.arc(pocket.hBondSite2.x, pocket.hBondSite2.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(pocket.hBondSite2.x, pocket.hBondSite2.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Hydrophobic Pocket (Yellow/Green)
    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.beginPath();
    ctx.arc(pocket.hydrophobicSite.x, pocket.hydrophobicSite.y, pocket.hydrophobicSite.radius, 0, Math.PI * 2);
    ctx.fill();

    // Pocket Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Aktivní místo enzymu', pocket.x, 50);

    // 2. Draw Ligand (Molecule)
    ctx.save();
    ctx.translate(ligand.x, ligand.y);
    ctx.rotate(ligand.angle);

    // Ligand Backbone
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-25, -20);
    ctx.lineTo(0, 0);
    ctx.lineTo(25, -20);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 28);
    ctx.stroke();

    // Matching Pharmacophore points on Ligand
    // Donor atom
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(-25, -20, 7, 0, Math.PI * 2);
    ctx.fill();

    // Acceptor atom
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(25, -20, 7, 0, Math.PI * 2);
    ctx.fill();

    // Hydrophobic moiety (Benzene ring shape)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 28, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    calculateScore();
  }

  // Interactive controls
  const rotateBtn = document.getElementById('docking-rotate-btn');
  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
      ligand.angle += Math.PI / 4;
      draw();
    });
  }

  function handleLigandDrag(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    ligand.x = clientX - rect.left;
    ligand.y = clientY - rect.top;
    draw();
  }

  canvas.addEventListener('mousedown', (e) => {
    ligand.isDragging = true;
    handleLigandDrag(e.clientX, e.clientY);
  });

  window.addEventListener('mousemove', (e) => {
    if (ligand.isDragging) handleLigandDrag(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => { ligand.isDragging = false; });

  canvas.addEventListener('touchstart', (e) => {
    ligand.isDragging = true;
    const touch = e.touches[0];
    handleLigandDrag(touch.clientX, touch.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (ligand.isDragging) {
      const touch = e.touches[0];
      handleLigandDrag(touch.clientX, touch.clientY);
    }
  });

  window.addEventListener('touchend', () => { ligand.isDragging = false; });

  draw();
}

/* ==========================================================================
   5. ALPHAFOLD & ESMFOLD 3D PROTEIN EXPLORER
   ========================================================================== */
function initAlphaFoldExplorer() {
  const proteinSelect = document.getElementById('af-protein-select');
  const iframeViewer = document.getElementById('molstar-iframe');
  const plddtBar = document.getElementById('af-plddt-score');
  const descEl = document.getElementById('af-protein-desc');

  if (!proteinSelect || !iframeViewer) return;

  const proteinPresets = {
    '1CRN': {
      name: 'Crambin (PDB: 1CRN)',
      plddt: 96.4,
      desc: 'Malý rostlinný protein ze semen Crambe abyssinica. Legendární referenční struktura krystalizovaná s ultravysokým rozlišením 0.54 Å.',
      url: 'https://molstar.org/viewer/?pdb=1crn&hide-controls=1'
    },
    '4HHB': {
      name: 'Hemoglobin (PDB: 4HHB)',
      plddt: 93.8,
      desc: 'Kyslík přenášející tetramerní protein v lidských červených krvinkách. Skládá se ze dvou alfa a dvou beta podjednotek a hemu.',
      url: 'https://molstar.org/viewer/?pdb=4hhb&hide-controls=1'
    },
    'AF-P01308': {
      name: 'Lidský inzulín (AlphaFold DB: P01308)',
      plddt: 91.2,
      desc: 'Hormon regulující hladinu glukózy v krvi. Modelován pomocí umělé inteligence AlphaFold.',
      url: 'https://molstar.org/viewer/?afdb=P01308&hide-controls=1'
    },
    '6M0J': {
      name: 'SARS-CoV-2 Spike RBD / ACE2 komplex (PDB: 6M0J)',
      plddt: 88.6,
      desc: 'Vazba virového S-proteinu na lidský receptor ACE2. Zásadní struktura pro vývoj vakcín a antivirotik.',
      url: 'https://molstar.org/viewer/?pdb=6m0j&hide-controls=1'
    }
  };

  proteinSelect.addEventListener('change', (e) => {
    const key = e.target.value;
    const item = proteinPresets[key];
    if (item) {
      iframeViewer.src = item.url;
      if (plddtBar) plddtBar.style.width = `${item.plddt}%`;
      if (descEl) descEl.innerHTML = `<strong>${item.name}</strong> (pLDDT: ${item.plddt}%) — ${item.desc}`;
    }
  });
}
