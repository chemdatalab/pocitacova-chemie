/**
 * Počítačová chemie - Interaktivní cvičení a simulátory
 * Katedra fyzikální chemie PřF UPOL
 */

document.addEventListener('DOMContentLoaded', () => {
  initTriangleSimulator();
  initH2MorseSimulator();
  initPESOptimizationSimulator();
  initVibrationalIRSimulator();
  initCoarseGrainedMolstarViewer();
  initChemoinformaticsLab();
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
   2B. Kapitola 2: Optimalizace geometrie na ploše PES
   ========================================================================== */
function initPESOptimizationSimulator() {
  const canvas = document.getElementById('pes-canvas');
  if (!canvas) return;

  const algoSelect = document.getElementById('opt-algo-select');
  const startBtn = document.getElementById('opt-start-btn');
  const stepBtn = document.getElementById('opt-step-btn');
  const resetBtn = document.getElementById('opt-reset-btn');
  const iterVal = document.getElementById('opt-iter-val');
  const energyVal = document.getElementById('opt-energy-val');
  const gradVal = document.getElementById('opt-grad-val');
  const statusBadge = document.getElementById('opt-status-badge');
  const algoDesc = document.getElementById('opt-algo-desc');

  const ctx = canvas.getContext('2d');
  const width = canvas.width = 460;
  const height = canvas.height = 340;

  // Domain bounding box on PES
  const xMin = -2.2, xMax = 2.4;
  const yMin = -1.2, yMax = 2.8;

  function toCanvas(x, y) {
    const cx = ((x - xMin) / (xMax - xMin)) * width;
    const cy = height - ((y - yMin) / (yMax - yMin)) * height;
    return { cx, cy };
  }

  function fromCanvas(cx, cy) {
    const x = xMin + (cx / width) * (xMax - xMin);
    const y = yMin + ((height - cy) / height) * (yMax - yMin);
    return { x, y };
  }

  // 2D Rosenbrock-like curved potential energy surface E(x, y)
  // Global Minimum at (0.7, 0.19) where E = 0 kcal/mol
  const minX = 0.7, minY = 0.19;

  function energy(x, y) {
    const term1 = 1.2 * Math.pow(x - minX, 2);
    const term2 = 3.2 * Math.pow(y - Math.pow(x, 2) + 0.3, 2);
    return term1 + term2;
  }

  function gradient(x, y) {
    const gx = 2.4 * (x - minX) - 12.8 * x * (y - Math.pow(x, 2) + 0.3);
    const gy = 6.4 * (y - Math.pow(x, 2) + 0.3);
    return { gx, gy, norm: Math.sqrt(gx * gx + gy * gy) };
  }

  function hessian(x, y) {
    const hxx = 2.4 - 12.8 * (y - Math.pow(x, 2) + 0.3) + 25.6 * x * x;
    const hyy = 6.4;
    const hxy = -12.8 * x;
    return { hxx, hyy, hxy };
  }

  // Optimization State
  let startPt = { x: -1.4, y: 2.3 };
  let currentPt = { ...startPt };
  let path = [];
  let isRunning = false;
  let animTimer = null;
  let cgDirection = null;
  let prevGrad = null;
  let velocity = { vx: 0, vy: 0 };
  let iteration = 0;

  // Algorithm explanations
  const algoExplanations = {
    'steepest': '<strong>Nejprudší spád (Steepest Descent):</strong> V každém kroku jde přímo proti gradientu (−∇<i>E</i>). V úzkých zakřivených údolích má tendenci prudce oscilovat (klikatit se) a konverguje pomalu.',
    'cg': '<strong>Sdružené gradienty (Conjugate Gradient):</strong> Pamatuje si předchozí směr sestupu a volí ortogonální směr. V zakřivených údolích neosciluje a dosáhne minima výrazně rychleji.',
    'bfgs': '<strong>Kvazi-Newton (BFGS):</strong> Využívá aproximaci druhé derivace (Hessiánu). Zná zakřivení terénu a přímo „skáče“ k minimu parabolickou extrapolací. Standard v kvantové chemii (ORCA, Gaussian).',
    'momentum': '<strong>Gradient s momentem (Heavy Ball):</strong> Využívá setrvačnost k překonání drobných lokálních překážek a zrychlení pohybu podél plochého dna údolí.'
  };

  function resetState(newStart) {
    if (isRunning) stopOptimization();
    if (newStart) startPt = { ...newStart };
    currentPt = { ...startPt };
    const e = energy(currentPt.x, currentPt.y);
    const g = gradient(currentPt.x, currentPt.y);
    path = [{ ...currentPt, e, grad: g.norm }];
    iteration = 0;
    cgDirection = null;
    prevGrad = null;
    velocity = { vx: 0, vy: 0 };
    updateDashboard(e, g.norm, '⚪ Připraveno ke spuštění');
    render();
  }

  function doStep() {
    const algo = algoSelect ? algoSelect.value : 'cg';
    const g = gradient(currentPt.x, currentPt.y);

    // Convergence criteria: RMS gradient < 0.08 or max iterations
    if (g.norm < 0.08 || iteration >= 60) {
      const e = energy(currentPt.x, currentPt.y);
      updateDashboard(e, g.norm, '🟢 Konvergováno: Minimum nalezeno!');
      stopOptimization();
      render();
      return false;
    }

    iteration++;
    let nextX = currentPt.x;
    let nextY = currentPt.y;

    if (algo === 'steepest') {
      const alpha = 0.035;
      nextX = currentPt.x - alpha * g.gx;
      nextY = currentPt.y - alpha * g.gy;
    } else if (algo === 'cg') {
      if (!cgDirection || !prevGrad) {
        cgDirection = { dx: -g.gx, dy: -g.gy };
      } else {
        const prevNormSq = Math.max(prevGrad.gx * prevGrad.gx + prevGrad.gy * prevGrad.gy, 1e-8);
        const yx = g.gx - prevGrad.gx;
        const yy = g.gy - prevGrad.gy;
        // Polak-Ribiere formula with restart
        let beta = (g.gx * yx + g.gy * yy) / prevNormSq;
        if (beta < 0) beta = 0;
        cgDirection = {
          dx: -g.gx + beta * cgDirection.dx,
          dy: -g.gy + beta * cgDirection.dy
        };
      }
      prevGrad = { gx: g.gx, gy: g.gy };
      const alpha = 0.032;
      nextX = currentPt.x + alpha * cgDirection.dx;
      nextY = currentPt.y + alpha * cgDirection.dy;
    } else if (algo === 'bfgs') {
      // Analytical Newton-Raphson / Damped Quasi-Newton step: Delta x = - H^-1 * g
      const H = hessian(currentPt.x, currentPt.y);
      const det = H.hxx * H.hyy - H.hxy * H.hxy;
      if (Math.abs(det) > 1e-5) {
        const invHxx = H.hyy / det;
        const invHyy = H.hxx / det;
        const invHxy = -H.hxy / det;
        const dx = -(invHxx * g.gx + invHxy * g.gy);
        const dy = -(invHxy * g.gx + invHyy * g.gy);
        const stepMax = 0.45;
        const stepNorm = Math.sqrt(dx * dx + dy * dy);
        const scale = stepNorm > stepMax ? stepMax / stepNorm : 1.0;
        nextX = currentPt.x + dx * scale * 0.85;
        nextY = currentPt.y + dy * scale * 0.85;
      } else {
        nextX = currentPt.x - 0.04 * g.gx;
        nextY = currentPt.y - 0.04 * g.gy;
      }
    } else if (algo === 'momentum') {
      const momentumCoeff = 0.72;
      const alpha = 0.022;
      velocity.vx = momentumCoeff * velocity.vx - alpha * g.gx;
      velocity.vy = momentumCoeff * velocity.vy - alpha * g.gy;
      nextX = currentPt.x + velocity.vx;
      nextY = currentPt.y + velocity.vy;
    }

    currentPt = { x: nextX, y: nextY };
    const e = energy(currentPt.x, currentPt.y);
    const newG = gradient(currentPt.x, currentPt.y);
    path.push({ ...currentPt, e, grad: newG.norm });

    updateDashboard(e, newG.norm, '🟡 Optimalizace probíhá...');
    render();
    return true;
  }

  function startOptimization() {
    if (isRunning) return;
    isRunning = true;
    if (startBtn) startBtn.innerText = '⏸️ Pozastavit';
    animTimer = setInterval(() => {
      const cont = doStep();
      if (!cont) stopOptimization();
    }, 110);
  }

  function stopOptimization() {
    isRunning = false;
    if (animTimer) clearInterval(animTimer);
    animTimer = null;
    if (startBtn) startBtn.innerText = '▶️ Spustit optimalizaci';
  }

  function updateDashboard(e, gNorm, statusText) {
    if (iterVal) iterVal.innerText = `${iteration}`;
    if (energyVal) energyVal.innerText = `${e.toFixed(3)} kcal/mol`;
    if (gradVal) gradVal.innerText = `${gNorm.toFixed(3)}`;
    if (statusBadge) {
      statusBadge.innerText = statusText;
      if (statusText.includes('Konvergováno')) {
        statusBadge.style.background = 'rgba(16, 185, 129, 0.2)';
        statusBadge.style.color = '#10b981';
        statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      } else if (statusText.includes('probíhá')) {
        statusBadge.style.background = 'rgba(245, 158, 11, 0.2)';
        statusBadge.style.color = '#f59e0b';
        statusBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      } else {
        statusBadge.style.background = 'rgba(255, 255, 255, 0.08)';
        statusBadge.style.color = '#94a3b8';
        statusBadge.style.borderColor = 'var(--border-color)';
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw 2D PES Contour Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#060b17');
    bgGrad.addColorStop(1, '#02050b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Render isocontour lines
    const contourLevels = [0.2, 0.6, 1.2, 2.2, 3.8, 6.0, 9.5, 14.0, 20.0, 30.0];
    const gridRes = 35;
    const dx = width / gridRes;
    const dy = height / gridRes;

    // Draw subtle contour bands
    ctx.lineWidth = 1;
    contourLevels.forEach((level, idx) => {
      const alpha = 0.25 - idx * 0.018;
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.beginPath();

      for (let i = 0; i <= gridRes; i++) {
        for (let j = 0; j <= gridRes; j++) {
          const pt = fromCanvas(i * dx, j * dy);
          const e = energy(pt.x, pt.y);
          if (Math.abs(e - level) < 0.45) {
            ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.8})`;
            ctx.fillRect(i * dx - 1, j * dy - 1, 2.5, 2.5);
          }
        }
      }
      ctx.stroke();
    });

    // 2. Global Minimum Target (0.7, 0.19)
    const minCanvas = toCanvas(minX, minY);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(minCanvas.cx, minCanvas.cy, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Green minimum star/cross
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(minCanvas.cx, minCanvas.cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Minimum (0 kcal/mol)', minCanvas.cx + 54, minCanvas.cy + 4);

    // 3. Draw Optimization Path
    if (path.length > 1) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      const p0 = toCanvas(path[0].x, path[0].y);
      ctx.moveTo(p0.cx, p0.cy);

      for (let i = 1; i < path.length; i++) {
        const pt = toCanvas(path[i].x, path[i].y);
        ctx.lineTo(pt.cx, pt.cy);
      }
      ctx.stroke();

      // Path node markers
      path.forEach((p, idx) => {
        const pt = toCanvas(p.x, p.y);
        ctx.fillStyle = idx === 0 ? '#38bdf8' : (idx === path.length - 1 ? '#f59e0b' : 'rgba(245, 158, 11, 0.7)');
        ctx.beginPath();
        ctx.arc(pt.cx, pt.cy, idx === 0 || idx === path.length - 1 ? 5.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 4. Current Point Head & Pulse
    const curCanvas = toCanvas(currentPt.x, currentPt.y);
    const pulseGrad = ctx.createRadialGradient(curCanvas.cx, curCanvas.cy, 2, curCanvas.cx, curCanvas.cy, 16);
    pulseGrad.addColorStop(0, '#f59e0b');
    pulseGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = pulseGrad;
    ctx.beginPath();
    ctx.arc(curCanvas.cx, curCanvas.cy, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(curCanvas.cx, curCanvas.cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 5. Instruction banner in corner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(8, 8, 175, 22);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🖱️ Klikněte pro nový výchozí bod', 14, 22);
  }

  // Canvas click listener to place initial geometry
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const cy = (e.clientY - rect.top) * (canvas.height / rect.height);
    const pt = fromCanvas(cx, cy);
    resetState(pt);
  });

  // Algorithm change
  if (algoSelect) {
    algoSelect.addEventListener('change', () => {
      if (algoDesc && algoExplanations[algoSelect.value]) {
        algoDesc.innerHTML = algoExplanations[algoSelect.value];
      }
      resetState();
    });
  }

  // Button Listeners
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (isRunning) stopOptimization();
      else startOptimization();
    });
  }

  if (stepBtn) {
    stepBtn.addEventListener('click', () => {
      stopOptimization();
      doStep();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetState();
    });
  }

  // Initialize
  resetState();
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

/* ==========================================================================
   4. Kapitola 4: 3D Mesoscale & Hrubozrnný prohlížeč (Mol*)
   ========================================================================== */
function initCoarseGrainedMolstarViewer() {
  const modelSelect = document.getElementById('cg-model-select');
  const iframe = document.getElementById('cg-molstar-iframe');
  const descEl = document.getElementById('cg-model-desc');
  const linkEl = document.getElementById('cg-molstar-link');

  if (!modelSelect || !iframe) return;

  const models = {
    'motor-hook': {
      title: 'Bakteriální bičíkový motor (Motor Hook):',
      desc: 'Molekulární kloub a univerzální převodovka rotujícího bakteriálního bičíku složená ze stovek proteinových podjednotek. V hrubozrnném zobrazení vidíme dynamické uspořádání celého molekulárního stroje.',
      iframeUrl: 'https://molstar.org/viewer/?snapshot-url=https%3A%2F%2Fmolstar.org%2Fdemos%2Fstates%2Fmotor-hook.molx&snapshot-url-type=molx&hide-controls=1',
      directUrl: 'https://molstar.org/viewer/?snapshot-url=https%3A%2F%2Fmolstar.org%2Fdemos%2Fstates%2Fmotor-hook.molx&snapshot-url-type=molx'
    },
    'cellpack-mg': {
      title: 'Mesoscale model buňky (Mycoplasma genitalium – CellPack):',
      desc: 'První ucelený 3D model celé živé bakteriální buňky v mezoměřítku. Zobrazuje statisíce proteinů, enzymů, ribozomů, DNA nukleoidu a membránových transporterů v realistické buněčné hustotě (macromolecular crowding).',
      iframeUrl: 'https://molstar.org/me/viewer/?example=cellpack-mg-tour&hide-controls=1',
      directUrl: 'https://molstar.org/me/viewer/?example=cellpack-mg-tour'
    },
    'zika-capsid': {
      title: 'Virová kapsida viru Zika (PDB: 5IRE):',
      desc: 'Kompletní ikosaedrický proteinový obal viru Zika sestavený z milionů atomů. Příklad makromolekulárního komplexu, jehož dynamiku a interakci s protilátkami studujeme pomocí hrubozrnných simulací.',
      iframeUrl: 'https://molstar.org/viewer/?pdb=5ire&hide-controls=1',
      directUrl: 'https://molstar.org/viewer/?pdb=5ire'
    },
    'ribosome': {
      title: 'Bakteriální 70S ribozom (PDB: 4V6X):',
      desc: 'Buněčná továrna na proteiny složená z desítek proteinů a řetězců rRNA. Typický příklad pro studium víceškálového modelování (QM/MM pro syntézu peptidové vazby, hrubozrnné modely pro pohyb podjednotek).',
      iframeUrl: 'https://molstar.org/viewer/?pdb=4v6x&hide-controls=1',
      directUrl: 'https://molstar.org/viewer/?pdb=4v6x'
    }
  };

  modelSelect.addEventListener('change', (e) => {
    const key = e.target.value;
    const item = models[key];
    if (item) {
      iframe.src = item.iframeUrl;
      if (descEl) {
        descEl.innerHTML = `<strong>${item.title}</strong> ${item.desc}`;
      }
      if (linkEl) {
        linkEl.href = item.directUrl;
      }
    }
  });
}

/* ==========================================================================
   5. Kapitola 5: Interaktivní chemoinformatická laboratoř & kalkulátor deskriptorů
   ========================================================================== */
function initChemoinformaticsLab() {
  const canvas = document.getElementById('cheminf-canvas');
  const smilesInput = document.getElementById('cheminf-smiles-input');
  const calcBtn = document.getElementById('cheminf-calc-btn');
  const molNameEl = document.getElementById('cheminf-mol-name');
  const formulaEl = document.getElementById('cheminf-formula');
  const presetBtns = document.querySelectorAll('.cheminf-preset-btn');

  // Descriptor elements
  const descMw = document.getElementById('desc-mw');
  const descLogp = document.getElementById('desc-logp');
  const descLogs = document.getElementById('desc-logs');
  const descHbd = document.getElementById('desc-hbd');
  const descHba = document.getElementById('desc-hba');
  const descTpsa = document.getElementById('desc-tpsa');
  const descRotb = document.getElementById('desc-rotb');
  const descAroma = document.getElementById('desc-aroma');
  const descHeavy = document.getElementById('desc-heavy');
  const lipinskiCard = document.getElementById('lipinski-card');
  const lipinskiVerdict = document.getElementById('lipinski-verdict');
  const lipinskiDetails = document.getElementById('lipinski-details');

  if (!canvas || !smilesInput) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width = 240;
  const height = canvas.height = 200;

  // Preset Molecules Database
  const presets = {
    'CC(=O)Oc1ccccc1C(=O)O': {
      name: 'Kyselina acetylsalicylová (Aspirin)',
      formula: 'C₉H₈O₄',
      mw: 180.16,
      logp: 1.31,
      logs: -2.18,
      hbd: 1,
      hba: 4,
      tpsa: 63.6,
      rotb: 3,
      aroma: 1,
      heavy: 13,
      draw: (ctx) => drawAspirin(ctx)
    },
    'Cn1cnc2c1c(=O)n(c(=O)n2C)C': {
      name: 'Kofein (1,3,7-trimethylxanthin)',
      formula: 'C₈H₁₀N₄O₂',
      mw: 194.19,
      logp: -0.07,
      logs: -0.98,
      hbd: 0,
      hba: 6,
      tpsa: 58.4,
      rotb: 0,
      aroma: 2,
      heavy: 14,
      draw: (ctx) => drawCaffeine(ctx)
    },
    'CC(C)Cc1ccc(cc1)C(C)C(=O)O': {
      name: 'Ibuprofen',
      formula: 'C₁₃H₁₈O₂',
      mw: 206.28,
      logp: 3.50,
      logs: -3.85,
      hbd: 1,
      hba: 2,
      tpsa: 37.3,
      rotb: 4,
      aroma: 1,
      heavy: 15,
      draw: (ctx) => drawIbuprofen(ctx)
    },
    'CC(=O)Nc1ccc(O)cc1': {
      name: 'Paracetamol (Acetaminofen)',
      formula: 'C₈H₉NO₂',
      mw: 151.16,
      logp: 0.91,
      logs: -1.65,
      hbd: 2,
      hba: 2,
      tpsa: 49.3,
      rotb: 1,
      aroma: 1,
      heavy: 11,
      draw: (ctx) => drawParacetamol(ctx)
    },
    'CN1CCC23C4C1CC5=C2C(=C(C=C5)O)OC3C(C=C4)O': {
      name: 'Morfin',
      formula: 'C₁₇H₁₉NO₃',
      mw: 285.34,
      logp: 0.89,
      logs: -2.15,
      hbd: 2,
      hba: 4,
      tpsa: 49.8,
      rotb: 0,
      aroma: 1,
      heavy: 21,
      draw: (ctx) => drawMorphine(ctx)
    },
    'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O': {
      name: 'D-Glukóza',
      formula: 'C₆H₁₂O₆',
      mw: 180.16,
      logp: -3.24,
      logs: 0.35,
      hbd: 5,
      hba: 6,
      tpsa: 110.4,
      rotb: 1,
      aroma: 0,
      heavy: 12,
      draw: (ctx) => drawGlucose(ctx)
    }
  };

  function parseAndComputeSMILES(smiles) {
    // Check if preset exists
    const cleanSmiles = smiles.trim();
    if (presets[cleanSmiles]) {
      return presets[cleanSmiles];
    }

    // Heuristic SMILES descriptor parser
    let carbon = (smiles.match(/[C]/g) || []).length + (smiles.match(/[c]/g) || []).length;
    let nitrogen = (smiles.match(/[Nn]/g) || []).length;
    let oxygen = (smiles.match(/[Oo]/g) || []).length;
    let sulfur = (smiles.match(/[Ss]/g) || []).length;
    let fluorine = (smiles.match(/[F]/g) || []).length;
    let chlorine = (smiles.match(/Cl/g) || []).length;
    let bromine = (smiles.match(/Br/g) || []).length;

    // Approximate heavy atoms
    const heavy = carbon + nitrogen + oxygen + sulfur + fluorine + chlorine + bromine;
    
    // Approximate Hydrogen
    let hydrogen = Math.max(heavy * 2 + 2 - (smiles.match(/=/g) || []).length * 2 - (smiles.match(/#/g) || []).length * 4, 1);
    
    // Molecular weight
    const mw = carbon * 12.011 + hydrogen * 1.008 + nitrogen * 14.007 + oxygen * 15.999 + sulfur * 32.06 + fluorine * 18.998 + chlorine * 35.45 + bromine * 79.904;

    // H-bond donors (OH, NH) & Acceptors (O, N)
    const hbd = (smiles.match(/[O][H]|[N][H]|O(?=[A-Z0-9]|$)|N(?=[A-Z0-9]|$)/g) || []).length % (oxygen + nitrogen + 1);
    const hba = oxygen + nitrogen;

    // Aromatic rings
    const aroma = (smiles.match(/c1|n1/g) || []).length;

    // Rotatable bonds
    const rotb = Math.max(0, Math.floor(carbon / 3));

    // LogP approximation (Wildman-Crippen heuristic)
    const logp = carbon * 0.28 + chlorine * 0.55 + bromine * 0.70 + fluorine * 0.15 - oxygen * 0.45 - nitrogen * 0.55 + (aroma > 0 ? 0.65 : 0);

    // LogS (Delaney ESOL)
    const logs = 0.16 - 0.63 * logp - 0.0062 * mw + 0.066 * rotb - 0.74 * (aroma > 0 ? 1 : 0);

    // TPSA approximation
    const tpsa = oxygen * 17.07 + nitrogen * 12.05;

    // Chemical formula string
    let formula = '';
    if (carbon > 0) formula += `C${carbon > 1 ? carbon : ''}`;
    if (hydrogen > 0) formula += `H${hydrogen > 1 ? hydrogen : ''}`;
    if (nitrogen > 0) formula += `N${nitrogen > 1 ? nitrogen : ''}`;
    if (oxygen > 0) formula += `O${oxygen > 1 ? oxygen : ''}`;
    if (sulfur > 0) formula += `S${sulfur > 1 ? sulfur : ''}`;
    if (chlorine > 0) formula += `Cl${chlorine > 1 ? chlorine : ''}`;
    if (fluorine > 0) formula += `F${fluorine > 1 ? fluorine : ''}`;

    return {
      name: 'Vlastní molekula (ze SMILES)',
      formula: formula || 'Organická molekula',
      mw: Math.max(mw, 16.0),
      logp: logp,
      logs: logs,
      hbd: Math.min(hbd, 10),
      hba: hba,
      tpsa: tpsa,
      rotb: rotb,
      aroma: aroma,
      heavy: Math.max(heavy, 1),
      draw: (ctx) => drawGenericSMILES(ctx, smiles)
    };
  }

  function updateUI(mol) {
    if (molNameEl) molNameEl.innerText = mol.name;
    if (formulaEl) formulaEl.innerText = mol.formula;
    if (descMw) descMw.innerText = `${mol.mw.toFixed(2)} g/mol`;
    if (descLogp) descLogp.innerText = `${mol.logp.toFixed(2)}`;
    
    // LogS category
    let solText = `${mol.logs.toFixed(2)}`;
    if (mol.logs > -1) solText += ' (velmi vysoká)';
    else if (mol.logs > -3) solText += ' (dobrá)';
    else if (mol.logs > -5) solText += ' (střední)';
    else solText += ' (špatná)';
    if (descLogs) descLogs.innerText = solText;

    if (descHbd) descHbd.innerText = `${mol.hbd}`;
    if (descHba) descHba.innerText = `${mol.hba}`;
    if (descTpsa) descTpsa.innerText = `${mol.tpsa.toFixed(1)} Å²`;
    if (descRotb) descRotb.innerText = `${mol.rotb}`;
    if (descAroma) descAroma.innerText = `${mol.aroma}`;
    if (descHeavy) descHeavy.innerText = `${mol.heavy}`;

    // Lipinski Rule of 5 Evaluation
    let violations = 0;
    const vMW = mol.mw > 500;
    const vLogP = mol.logp > 5.0;
    const vHBD = mol.hbd > 5;
    const vHBA = mol.hba > 10;

    if (vMW) violations++;
    if (vLogP) violations++;
    if (vHBD) violations++;
    if (vHBA) violations++;

    if (lipinskiVerdict && lipinskiCard && lipinskiDetails) {
      if (violations === 0) {
        lipinskiVerdict.innerText = '✅ 0 porušení (vysoká lékovost / perorální dostupnost)';
        lipinskiVerdict.style.color = '#10b981';
        lipinskiCard.style.background = 'rgba(16, 185, 129, 0.12)';
        lipinskiCard.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      } else if (violations === 1) {
        lipinskiVerdict.innerText = '⚠️ 1 porušení (přijatelná léková dostupnost)';
        lipinskiVerdict.style.color = '#f59e0b';
        lipinskiCard.style.background = 'rgba(245, 158, 11, 0.12)';
        lipinskiCard.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      } else {
        lipinskiVerdict.innerText = `❌ ${violations} porušení (nízká perorální biodostupnost)`;
        lipinskiVerdict.style.color = '#ef4444';
        lipinskiCard.style.background = 'rgba(239, 68, 68, 0.12)';
        lipinskiCard.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      }

      lipinskiDetails.innerHTML = `
        <span style="color: ${vMW ? '#ef4444' : '#10b981'};">MW ≤ 500: ${vMW ? '❌' : '✅'} (${mol.mw.toFixed(1)})</span>
        <span style="color: ${vLogP ? '#ef4444' : '#10b981'};">logP ≤ 5: ${vLogP ? '❌' : '✅'} (${mol.logp.toFixed(2)})</span>
        <span style="color: ${vHBD ? '#ef4444' : '#10b981'};">HBD ≤ 5: ${vHBD ? '❌' : '✅'} (${mol.hbd})</span>
        <span style="color: ${vHBA ? '#ef4444' : '#10b981'};">HBA ≤ 10: ${vHBA ? '❌' : '✅'} (${mol.hba})</span>
      `;
    }

    // Draw 2D Structure
    ctx.clearRect(0, 0, width, height);
    if (mol.draw) {
      mol.draw(ctx);
    } else {
      drawGenericSMILES(ctx, smilesInput.value);
    }
  }

  // --- 2D Skeletal Structure Drawing Routines ---
  function drawAspirin(ctx) {
    ctx.save();
    ctx.translate(110, 105);
    ctx.scale(0.85, 0.85);

    // Benzene Ring
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = 36 * Math.cos(angle);
      const y = 36 * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Aromatic circle
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Ester branch (top right)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(36 * Math.cos(0), 36 * Math.sin(0)); // C1
    ctx.lineTo(55, -20); // O
    ctx.lineTo(78, -12); // C=O
    ctx.lineTo(100, -28); // CH3
    ctx.stroke();

    // Ester Carbonyl C=O
    ctx.beginPath();
    ctx.moveTo(78, -12);
    ctx.lineTo(82, 10);
    ctx.stroke();

    // Carboxylic acid branch (top left)
    ctx.beginPath();
    ctx.moveTo(36 * Math.cos(-Math.PI / 3), 36 * Math.sin(-Math.PI / 3)); // C2
    ctx.lineTo(20, -58); // C=O
    ctx.lineTo(-4, -72); // OH
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, -58);
    ctx.lineTo(40, -74); // =O
    ctx.stroke();

    // Heteroatom labels
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    // Ester Oxygen
    ctx.fillStyle = '#ef4444';
    ctx.fillText('O', 55, -24);
    ctx.fillText('O', 84, 22);

    // Acid Oxygens
    ctx.fillText('O', 44, -78);
    ctx.fillText('OH', -16, -75);

    ctx.restore();
  }

  function drawCaffeine(ctx) {
    ctx.save();
    ctx.translate(115, 100);
    ctx.scale(0.8, 0.8);

    // 6-ring
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-35, -30);
    ctx.lineTo(10, -30);
    ctx.lineTo(30, 0);
    ctx.lineTo(10, 30);
    ctx.lineTo(-35, 30);
    ctx.lineTo(-55, 0);
    ctx.closePath();
    ctx.stroke();

    // 5-ring fused
    ctx.beginPath();
    ctx.moveTo(10, -30);
    ctx.lineTo(45, -15);
    ctx.lineTo(45, 15);
    ctx.lineTo(10, 30);
    ctx.stroke();

    // Carbonyls
    ctx.beginPath();
    ctx.moveTo(-55, 0); ctx.lineTo(-75, 0);
    ctx.moveTo(10, 30); ctx.lineTo(10, 52);
    ctx.stroke();

    // Labels
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    ctx.fillStyle = '#38bdf8'; // Nitrogen
    ctx.fillText('N', -35, -34);
    ctx.fillText('N', 30, 4);
    ctx.fillText('N', 48, -18);
    ctx.fillText('N', -35, 34);

    ctx.fillStyle = '#ef4444'; // Oxygen
    ctx.fillText('O', -85, 4);
    ctx.fillText('O', 10, 64);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('CH₃', -35, -50);
    ctx.fillText('CH₃', -35, 52);
    ctx.fillText('CH₃', 70, -22);

    ctx.restore();
  }

  function drawIbuprofen(ctx) {
    ctx.save();
    ctx.translate(120, 100);
    ctx.scale(0.85, 0.85);

    // Benzene
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = 32 * Math.cos(angle);
      const y = 32 * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Isobutyl tail (left)
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(-32, 0);
    ctx.lineTo(-58, 0);
    ctx.lineTo(-78, -18);
    ctx.moveTo(-58, 0);
    ctx.lineTo(-78, 18);
    ctx.stroke();

    // Propionic acid (right)
    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.lineTo(56, 0);
    ctx.lineTo(72, -22);
    ctx.lineTo(92, -22);
    ctx.moveTo(72, -22);
    ctx.lineTo(66, -42);
    ctx.moveTo(56, 0);
    ctx.lineTo(66, 22);
    ctx.stroke();

    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('O', 66, -46);
    ctx.fillText('OH', 104, -18);

    ctx.restore();
  }

  function drawParacetamol(ctx) {
    ctx.save();
    ctx.translate(115, 100);
    ctx.scale(0.85, 0.85);

    // Benzene
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = 32 * Math.cos(angle);
      const y = 32 * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // -OH (left)
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(-32, 0);
    ctx.lineTo(-52, 0);
    ctx.stroke();

    // -NH-CO-CH3 (right)
    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.lineTo(54, 0);
    ctx.lineTo(74, 18);
    ctx.lineTo(96, 18);
    ctx.moveTo(74, 18);
    ctx.lineTo(74, 38);
    ctx.stroke();

    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('OH', -68, 4);
    ctx.fillText('O', 74, 52);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('NH', 54, -6);

    ctx.restore();
  }

  function drawMorphine(ctx) {
    ctx.save();
    ctx.translate(115, 95);
    ctx.scale(0.75, 0.75);

    // Polycyclic condensed rings
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.2;
    ctx.strokeRect(-40, -40, 50, 45);
    ctx.strokeRect(-15, -15, 55, 55);

    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('HO', -58, -38);
    ctx.fillText('OH', 55, 45);
    ctx.fillText('O', 8, 8);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('N-CH₃', 25, -25);

    ctx.restore();
  }

  function drawGlucose(ctx) {
    ctx.save();
    ctx.translate(115, 100);
    ctx.scale(0.8, 0.8);

    // Pyranose 6-membered ring
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = 36 * Math.cos(angle);
      const y = 36 * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('O', 36 * Math.cos(0), 36 * Math.sin(0) - 8);
    ctx.fillText('OH', -48, -30);
    ctx.fillText('OH', -48, 30);
    ctx.fillText('OH', 20, 52);
    ctx.fillText('CH₂OH', 10, -50);

    ctx.restore();
  }

  function drawGenericSMILES(ctx, smiles) {
    ctx.save();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('2D Molekulární struktura', width / 2, 40);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const numNodes = Math.min(Math.max(smiles.length, 3), 9);
    for (let i = 0; i < numNodes; i++) {
      const x = 40 + (i % 5) * 38;
      const y = 80 + Math.floor(i / 5) * 45 + (i % 2 === 0 ? -8 : 8);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(smiles.length > 25 ? smiles.substring(0, 24) + '...' : smiles, width / 2, height - 25);
    ctx.restore();
  }

  let activeTool = 'bond1'; // bond1, bond2, benzene, erase
  let activeAtom = 'C';
  let atoms = [];
  let bonds = [];
  let nextId = 1;

  // Ketcher Tool Buttons
  const toolBond1 = document.getElementById('ketcher-tool-bond1');
  const toolBond2 = document.getElementById('ketcher-tool-bond2');
  const toolBenzene = document.getElementById('ketcher-tool-benzene');
  const toolErase = document.getElementById('ketcher-tool-erase');
  const toolClear = document.getElementById('ketcher-tool-clear');
  const atomBtns = document.querySelectorAll('.ketcher-atom-btn');
  const toolBtns = document.querySelectorAll('.ketcher-tool-btn');

  function setTool(toolName) {
    activeTool = toolName;
    toolBtns.forEach(b => b.classList.remove('active'));
    if (toolName === 'bond1' && toolBond1) toolBond1.classList.add('active');
    if (toolName === 'bond2' && toolBond2) toolBond2.classList.add('active');
    if (toolName === 'benzene' && toolBenzene) toolBenzene.classList.add('active');
    if (toolName === 'erase' && toolErase) toolErase.classList.add('active');
  }

  if (toolBond1) toolBond1.addEventListener('click', () => setTool('bond1'));
  if (toolBond2) toolBond2.addEventListener('click', () => setTool('bond2'));
  if (toolBenzene) toolBenzene.addEventListener('click', () => setTool('benzene'));
  if (toolErase) toolErase.addEventListener('click', () => setTool('erase'));

  if (toolClear) {
    toolClear.addEventListener('click', () => {
      atoms = [];
      bonds = [];
      smilesInput.value = '';
      const mol = parseAndComputeSMILES('');
      updateUI(mol);
    });
  }

  atomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      atomBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAtom = btn.getAttribute('data-atom') || 'C';
      if (activeTool === 'erase') setTool('bond1');
    });
  });

  // Canvas Click: Interactive Chemical Sketcher
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const cy = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Find nearest atom within 18px
    let nearest = null;
    let minDist = 22;
    atoms.forEach(a => {
      const d = Math.hypot(a.x - cx, a.y - cy);
      if (d < minDist) {
        minDist = d;
        nearest = a;
      }
    });

    if (activeTool === 'erase') {
      if (nearest) {
        atoms = atoms.filter(a => a.id !== nearest.id);
        bonds = bonds.filter(b => b.from !== nearest.id && b.to !== nearest.id);
        recalcFromGraph();
      }
      return;
    }

    if (activeTool === 'benzene') {
      // Stamp 6-membered ring
      const r = 26;
      const baseId = nextId;
      const ringAtoms = [];
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        const ax = cx + r * Math.cos(ang);
        const ay = cy + r * Math.sin(ang);
        const atom = { id: nextId++, x: ax, y: ay, symbol: 'c' };
        atoms.push(atom);
        ringAtoms.push(atom);
      }
      for (let i = 0; i < 6; i++) {
        bonds.push({
          from: ringAtoms[i].id,
          to: ringAtoms[(i + 1) % 6].id,
          order: i % 2 === 0 ? 2 : 1
        });
      }
      if (nearest) {
        bonds.push({ from: nearest.id, to: ringAtoms[0].id, order: 1 });
      }
      recalcFromGraph();
      return;
    }

    if (nearest) {
      // Add a new branch atom from clicked atom
      const angle = (bonds.filter(b => b.from === nearest.id || b.to === nearest.id).length * 1.2) - 0.6;
      const nx = Math.min(Math.max(nearest.x + 28 * Math.cos(angle), 20), width - 20);
      const ny = Math.min(Math.max(nearest.y + 28 * Math.sin(angle), 20), height - 20);
      const newAtom = { id: nextId++, x: nx, y: ny, symbol: activeAtom };
      atoms.push(newAtom);
      bonds.push({ from: nearest.id, to: newAtom.id, order: activeTool === 'bond2' ? 2 : 1 });
    } else {
      // Create new disconnected atom
      const newAtom = { id: nextId++, x: cx, y: cy, symbol: activeAtom };
      atoms.push(newAtom);
    }

    recalcFromGraph();
  });

  function recalcFromGraph() {
    if (atoms.length === 0) {
      smilesInput.value = '';
      const mol = parseAndComputeSMILES('');
      updateUI(mol);
      return;
    }

    // Build simplified SMILES string from graph
    let builtSmiles = '';
    const hasArom = atoms.some(a => a.symbol === 'c');
    if (hasArom) builtSmiles += 'c1ccccc1';

    const hetero = atoms.filter(a => a.symbol !== 'c' && a.symbol !== 'C');
    hetero.forEach(h => {
      builtSmiles += (h.symbol === 'O' ? '(=O)O' : (h.symbol === 'N' ? 'N' : h.symbol));
    });

    const carbons = atoms.filter(a => a.symbol === 'C');
    if (!hasArom && carbons.length > 0) {
      builtSmiles = 'C'.repeat(carbons.length) + builtSmiles;
    }
    if (!builtSmiles) builtSmiles = 'C';

    smilesInput.value = builtSmiles;
    const mol = parseAndComputeSMILES(builtSmiles);
    mol.name = 'Uživatelem nakreslená molekula (Ketcher)';
    mol.draw = (ctx) => drawCustomGraph(ctx);
    updateUI(mol);
  }

  function drawCustomGraph(ctx) {
    ctx.clearRect(0, 0, width, height);

    // Draw Bonds
    bonds.forEach(b => {
      const a1 = atoms.find(a => a.id === b.from);
      const a2 = atoms.find(a => a.id === b.to);
      if (a1 && a2) {
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(a1.x, a1.y);
        ctx.lineTo(a2.x, a2.y);
        ctx.stroke();

        if (b.order === 2) {
          const dx = a2.x - a1.x;
          const dy = a2.y - a1.y;
          const len = Math.hypot(dx, dy) || 1;
          const ox = (-dy / len) * 3.5;
          const oy = (dx / len) * 3.5;
          ctx.beginPath();
          ctx.moveTo(a1.x + ox, a1.y + oy);
          ctx.lineTo(a2.x + ox, a2.y + oy);
          ctx.stroke();
        }
      }
    });

    // Draw Atoms
    atoms.forEach(a => {
      const colorMap = {
        'C': '#94a3b8', 'c': '#38bdf8', 'N': '#38bdf8', 'n': '#38bdf8',
        'O': '#ef4444', 'S': '#eab308', 'Cl': '#22c55e', 'F': '#06b6d4'
      };
      const col = colorMap[a.symbol] || '#f8fafc';

      ctx.fillStyle = '#060b17';
      ctx.beginPath();
      ctx.arc(a.x, a.y, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = col;
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(a.symbol.toUpperCase(), a.x, a.y);
    });
  }

  // --- Event Listeners ---
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const smiles = btn.getAttribute('data-smiles');
      smilesInput.value = smiles;
      const mol = parseAndComputeSMILES(smiles);
      updateUI(mol);
    });
  });

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      const smiles = smilesInput.value;
      const mol = parseAndComputeSMILES(smiles);
      updateUI(mol);
    });
  }

  smilesInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      calcBtn.click();
    }
  });

  // Initial Calculation (Aspirin)
  const initialMol = parseAndComputeSMILES(smilesInput.value);
  updateUI(initialMol);
}
