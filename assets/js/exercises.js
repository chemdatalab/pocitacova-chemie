/**
 * Počítačová chemie - Interaktivní cvičení a simulátory
 * Katedra fyzikální chemie PřF UPOL
 */

document.addEventListener('DOMContentLoaded', () => {
  initTriangleSimulator();
  initH2MorseSimulator();
  initPESOptimizationSimulator();
  initWaterPhaseMDSimulator();
  initCoarseGrainedMolstarViewer();
  initChemoinformaticsLab();
  initDockingSimulator();
  initAlphaFoldExplorer();
  initReactionPathwayLab();
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
   3. KLASICKÁ MOLEKULOVÁ DYNAMIKA: FÁZOVÉ CHOVÁNÍ VODY (LED, VODA, PÁRA)
   ========================================================================== */
function initWaterPhaseMDSimulator() {
  const canvas = document.getElementById('water-md-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width = 540;
  const height = canvas.height = 340;

  // DOM Elements
  const tempSlider = document.getElementById('water-temp-slider');
  const pressSlider = document.getElementById('water-press-slider');
  const tempValEl = document.getElementById('water-temp-val');
  const pressValEl = document.getElementById('water-press-val');
  const phaseBadge = document.getElementById('water-phase-badge');
  const hbondsCountEl = document.getElementById('water-hbonds-count');
  const velocityValEl = document.getElementById('water-velocity-val');
  const boilPtValEl = document.getElementById('water-boil-pt-val');
  const playBtn = document.getElementById('water-play-btn');
  const resetBtn = document.getElementById('water-reset-btn');
  const hbondsToggle = document.getElementById('water-hbonds-toggle');
  const presetBtns = document.querySelectorAll('.water-preset-btn');

  // Simulation Parameters
  let T = parseFloat(tempSlider ? tempSlider.value : -15); // Temperature in Celsius (-40 to 200)
  let p = parseFloat(pressSlider ? pressSlider.value : 1.0); // Pressure in atm (0.1 to 5.0)
  let isRunning = true;
  let animId = null;
  let showHbonds = hbondsToggle ? hbondsToggle.checked : true;

  // 48 water molecules in 2D box
  const numCols = 8;
  const numRows = 6;
  const N = numCols * numRows; // 48 molecules

  const molecules = [];
  const O_RADIUS = 7.5;
  const H_RADIUS = 4.2;
  const OH_DIST = 11.5; // pixels
  const HOH_HALF_ANGLE = (104.5 / 2) * (Math.PI / 180);

  // Initialize Hexagonal Ice Lattice Coordinates (Resting on bottom floor of chamber)
  function initLattice() {
    molecules.length = 0;
    
    // Ice hexagonal lattice: tight cohesive packing with hexagonal channels resting on floor
    // Floor is at y ~ 320 px. Lattice sits at the bottom: y from ~188 to 308 px.
    const startX = 96;
    const startY = 188;
    const dx = 29.5;
    const dy = 24.0;

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const xOffset = (r % 2 === 1) ? dx * 0.5 : 0;
        const lx = startX + c * dx + xOffset;
        const ly = startY + r * dy;

        // Ice orientation: alternating tetrahedral network where H points to neighbor O
        const baseAng = ((r + c) % 2 === 0 ? 0.35 : Math.PI + 0.35);

        molecules.push({
          x: lx,
          y: ly,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          lx: lx, // Lattice anchor X
          ly: ly, // Lattice anchor Y
          angle: baseAng,
          targetAngle: baseAng,
          vRot: (Math.random() - 0.5) * 0.02,
          phase: 'ice', // 'ice', 'liquid', 'gas'
          hBondCount: 0
        });
      }
    }
  }

  initLattice();

  // Clausius-Clapeyron: Boiling point as function of pressure (p in atm)
  function getBoilingPoint(pressAtm) {
    return 100.0 + 31.5 * (Math.log(pressAtm) / Math.LN10);
  }

  // Calculate Phase Fractions with Smooth Coexistence at Transitions
  function getPhaseFractions(tempC, pressAtm) {
    const T_boil = getBoilingPoint(pressAtm);
    const T_melt = 0.0;

    let fIce = 0;
    let fGas = 0;
    let fLiq = 0;

    // Solid-Liquid Transition around 0 °C (Range: -10 °C to +10 °C)
    if (tempC <= -10) {
      fIce = 1.0;
    } else if (tempC < 10) {
      // Linear smooth transition: At 0 °C, exactly 50% Ice and 50% Liquid!
      fIce = 0.5 - (tempC - T_melt) / 20.0;
      fLiq = 1.0 - fIce;
    } else if (tempC < T_boil - 15) {
      fLiq = 1.0;
    } else if (tempC <= T_boil + 15) {
      // Liquid-Gas Transition around T_boil: At T_boil, exactly 50% Liquid and 50% Gas!
      fGas = 0.5 + (tempC - T_boil) / 30.0;
      fLiq = 1.0 - fGas;
    } else {
      fGas = 1.0;
    }

    fIce = Math.max(0, Math.min(1, fIce));
    fGas = Math.max(0, Math.min(1, fGas));
    fLiq = Math.max(0, Math.min(1, fLiq));

    return { fIce, fLiq, fGas, T_boil };
  }

  function updateStateLabels() {
    const T_Kelvin = Math.round(T + 273.15);
    const p_kPa = (p * 101.325).toFixed(1);
    const { fIce, fLiq, fGas, T_boil } = getPhaseFractions(T, p);

    if (tempValEl) tempValEl.innerText = `${T > 0 ? '+' : ''}${Math.round(T)} °C (${T_Kelvin} K)`;
    if (pressValEl) pressValEl.innerText = `${p.toFixed(2)} atm (${p_kPa} kPa)`;
    if (boilPtValEl) boilPtValEl.innerText = `${T_boil.toFixed(1)} °C`;

    // Phase identification badge
    if (phaseBadge) {
      if (fIce > 0.95) {
        phaseBadge.innerText = '🧊 Led (100% Krystalická mřížka)';
        phaseBadge.style.color = '#38bdf8';
      } else if (fIce > 0.05 && fLiq > 0.05) {
        const icePct = Math.round(fIce * 100);
        const liqPct = Math.round(fLiq * 100);
        phaseBadge.innerText = `🧊💧 Koexistence: Tání/Tuhnutí (${icePct}% Led + ${liqPct}% Voda)`;
        phaseBadge.style.color = '#00f5d4';
      } else if (fGas > 0.95) {
        phaseBadge.innerText = '♨️ Vodní pára (100% Plyn / Expanze)';
        phaseBadge.style.color = '#f59e0b';
      } else if (fGas > 0.05 && fLiq > 0.05) {
        const liqPct = Math.round(fLiq * 100);
        const gasPct = Math.round(fGas * 100);
        phaseBadge.innerText = `💧♨️ Koexistence: Var/Kondenzace (${liqPct}% Voda + ${gasPct}% Pára)`;
        phaseBadge.style.color = '#f59e0b';
      } else {
        phaseBadge.innerText = '💧 Kapalná voda (100% Kapalina / H-síť)';
        phaseBadge.style.color = '#10b981';
      }
    }

    // Average molecule velocity in m/s
    const avgV_ms = Math.round(Math.sqrt(T_Kelvin) * 28.5);
    if (velocityValEl) velocityValEl.innerText = `${avgV_ms} m/s`;
  }

  // Get coordinates of 2 Hydrogen atoms for molecule m
  function getHydrogenCoords(m) {
    return [
      {
        x: m.x + Math.cos(m.angle - HOH_HALF_ANGLE) * OH_DIST,
        y: m.y + Math.sin(m.angle - HOH_HALF_ANGLE) * OH_DIST,
        idx: 1
      },
      {
        x: m.x + Math.cos(m.angle + HOH_HALF_ANGLE) * OH_DIST,
        y: m.y + Math.sin(m.angle + HOH_HALF_ANGLE) * OH_DIST,
        idx: 2
      }
    ];
  }

  // List of active hydrogen bonds for rendering: array of { hx, hy, ox, oy, strength }
  const activeHBonds = [];

  // --- Physical Step & Force Integration ---
  function physicsStep() {
    const { fIce, fLiq, fGas, T_boil } = getPhaseFractions(T, p);
    const T_Kelvin = T + 273.15;
    const thermalSpeed = Math.sqrt(Math.max(10, T_Kelvin)) * 0.08;

    // Simulation chamber bounds (leave right 135px for p-T diagram)
    const boxLeft = 18;
    const boxRight = width - 145;
    const boxBottom = height - 18;
    const boxTop = 18 + (1 - Math.min(1, p / 3.5)) * 14;

    // Assign phases to molecules based on coexistence fractions
    const numIce = Math.round(N * fIce);
    const numGas = Math.round(N * fGas);
    const numLiq = N - numIce - numGas;

    for (let i = 0; i < N; i++) {
      if (i < numIce) molecules[i].phase = 'ice';
      else if (i >= N - numGas) molecules[i].phase = 'gas';
      else molecules[i].phase = 'liquid';
      molecules[i].hBondCount = 0;
    }

    activeHBonds.length = 0;

    // 1. Intermolecular Interactions (Repulsion + Electrostatic O-H...O Alignment)
    for (let i = 0; i < N; i++) {
      const mi = molecules[i];
      const h_i = getHydrogenCoords(mi);

      for (let j = i + 1; j < N; j++) {
        const mj = molecules[j];
        const h_j = getHydrogenCoords(mj);

        const dx = mj.x - mi.x;
        const dy = mj.y - mi.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq) || 0.001;

        // Lennard-Jones core repulsion (d < 22 px)
        if (dist < 22) {
          const overlap = 22 - dist;
          const nx = dx / dist;
          const ny = dy / dist;
          const repForce = overlap * (mi.phase === 'ice' && mj.phase === 'ice' ? 0.35 : 0.28);

          mi.vx -= nx * repForce;
          mi.vy -= ny * repForce;
          mj.vx += nx * repForce;
          mj.vy += ny * repForce;
        }

        // Hydrogen Bonding Interaction (d between 22 and 40 px)
        // Occurs in Ice and Liquid, but not between two Gas molecules
        const canHBond = !(mi.phase === 'gas' && mj.phase === 'gas');
        if (canHBond && dist >= 22 && dist < 40) {
          // Check H_i pointing to O_j
          let bestHi = null;
          let minD_Hi_Oj = 999;
          for (let k = 0; k < 2; k++) {
            const h = h_i[k];
            const dH = Math.hypot(mj.x - h.x, mj.y - h.y);
            if (dH < minD_Hi_Oj) {
              minD_Hi_Oj = dH;
              bestHi = h;
            }
          }

          // Check H_j pointing to O_i
          let bestHj = null;
          let minD_Hj_Oi = 999;
          for (let k = 0; k < 2; k++) {
            const h = h_j[k];
            const dH = Math.hypot(mi.x - h.x, mi.y - h.y);
            if (dH < minD_Hj_Oi) {
              minD_Hj_Oi = dH;
              bestHj = h;
            }
          }

          // Apply orientational torque so Hydrogen points to partner Oxygen!
          if (bestHi && minD_Hi_Oj < 28) {
            const angleToO = Math.atan2(mj.y - mi.y, mj.x - mi.x);
            const hAngle = Math.atan2(bestHi.y - mi.y, bestHi.x - mi.x);
            let diff = angleToO - hAngle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;

            const torque = diff * (mi.phase === 'ice' ? 0.12 : 0.06);
            mi.vRot += torque;

            // Register active H-bond from bestHi to mj (Oxygen)
            activeHBonds.push({
              hx: bestHi.x,
              hy: bestHi.y,
              ox: mj.x,
              oy: mj.y,
              phase: mi.phase
            });
            mi.hBondCount++;
            mj.hBondCount++;
          }

          if (bestHj && minD_Hj_Oi < 28) {
            const angleToO = Math.atan2(mi.y - mj.y, mi.x - mj.x);
            const hAngle = Math.atan2(bestHj.y - mj.y, bestHj.x - mj.x);
            let diff = angleToO - hAngle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;

            const torque = diff * (mj.phase === 'ice' ? 0.12 : 0.06);
            mj.vRot += torque;
          }

          // Intermolecular attraction
          const idealD = (mi.phase === 'ice' && mj.phase === 'ice') ? 29.5 : 27.5;
          const dDiff = dist - idealD;
          const nx = dx / dist;
          const ny = dy / dist;
          const strength = (mi.phase === 'ice' && mj.phase === 'ice') ? 0.045 : 0.025;

          mi.vx += nx * dDiff * strength;
          mi.vy += ny * dDiff * strength;
          mj.vx -= nx * dDiff * strength;
          mj.vy -= ny * dDiff * strength;
        }
      }

      // 2. Phase-Specific Mechanics
      if (mi.phase === 'ice') {
        // Crystalline ice: grounded at bottom, spring force towards hexagonal lattice anchor
        mi.vy += 0.025; // Solid weight / gravity

        const iceStiffness = Math.min(0.22, ((-T) + 12) * 0.009);
        const ldx = mi.lx - mi.x;
        const ldy = mi.ly - mi.y;

        mi.vx += ldx * iceStiffness;
        mi.vy += ldy * iceStiffness;

        // Damping / thermal vibration around crystal node
        mi.vx *= 0.86;
        mi.vy *= 0.86;
        mi.vx += (Math.random() - 0.5) * (thermalSpeed * 0.3);
        mi.vy += (Math.random() - 0.5) * (thermalSpeed * 0.3);

        const angDiff = mi.targetAngle - mi.angle;
        mi.vRot += angDiff * 0.1;
        mi.vRot *= 0.8;
        mi.angle += mi.vRot;

      } else if (mi.phase === 'liquid') {
        // Liquid: dense fluid falling to container bottom under gravity, fluid diffusion & tumbling
        mi.vy += 0.055; // Downward gravity

        const curSpeed = Math.hypot(mi.vx, mi.vy) || 0.001;
        const targetSpeed = thermalSpeed * 1.1;
        mi.vx = (mi.vx / curSpeed) * (curSpeed * 0.94 + targetSpeed * 0.06);
        mi.vy = (mi.vy / curSpeed) * (curSpeed * 0.94 + targetSpeed * 0.06);

        mi.vx += (Math.random() - 0.5) * 0.22;
        mi.vy += (Math.random() - 0.5) * 0.22;

        mi.vRot += (Math.random() - 0.5) * 0.035;
        mi.vRot *= 0.92;
        mi.angle += mi.vRot;

      } else {
        // Gas / Steam: Free dispersion filling entire container, high thermal speed overcoming gravity
        const curSpeed = Math.hypot(mi.vx, mi.vy) || 0.001;
        const targetSpeed = thermalSpeed * 1.9;
        mi.vx = (mi.vx / curSpeed) * (curSpeed * 0.9 + targetSpeed * 0.1);
        mi.vy = (mi.vy / curSpeed) * (curSpeed * 0.9 + targetSpeed * 0.1);

        mi.vRot += (Math.random() - 0.5) * 0.08;
        mi.vRot *= 0.98;
        mi.angle += mi.vRot;
      }

      // 3. Update Position
      mi.x += mi.vx;
      mi.y += mi.vy;

      // 4. Container Boundary Collisions with Damped Bounce on Floor
      const rBound = O_RADIUS + 4;
      if (mi.x < boxLeft + rBound) { mi.x = boxLeft + rBound; mi.vx = Math.abs(mi.vx) * 0.85; }
      if (mi.x > boxRight - rBound) { mi.x = boxRight - rBound; mi.vx = -Math.abs(mi.vx) * 0.85; }
      if (mi.y < boxTop + rBound) { mi.y = boxTop + rBound; mi.vy = Math.abs(mi.vy) * 0.85; }
      if (mi.y > boxBottom - rBound) {
        mi.y = boxBottom - rBound;
        // Gas bounces elastically, condensed liquid and ice settle at floor
        const bounceCoeff = mi.phase === 'gas' ? 0.85 : 0.4;
        mi.vy = -Math.abs(mi.vy) * bounceCoeff;
      }
    }

    // Update H-bonds per molecule metric
    if (hbondsCountEl) {
      if (numGas === N) {
        hbondsCountEl.innerText = `0.1 / molekulu`;
      } else {
        const avgHbonds = ((activeHBonds.length * 2) / Math.max(1, numIce + numLiq)).toFixed(1);
        hbondsCountEl.innerText = `${avgHbonds} / molekulu`;
      }
    }
  }

  // --- Rendering ---
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#060b17';
    ctx.fillRect(0, 0, width, height);

    // Chamber bounds
    const boxLeft = 18;
    const boxRight = width - 145;
    const boxBottom = height - 18;
    const boxTop = 18 + (1 - Math.min(1, p / 3.5)) * 14;

    // 1. Draw Simulation Chamber (Walls & Piston)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxLeft, boxTop, boxRight - boxLeft, boxBottom - boxTop);

    // Piston top plate (Pressure indicator)
    ctx.fillStyle = 'rgba(51, 65, 85, 0.85)';
    ctx.fillRect(boxLeft - 4, boxTop - 8, boxRight - boxLeft + 8, 8);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Píst: p = ${p.toFixed(2)} atm`, (boxLeft + boxRight) / 2, boxTop - 12);

    // 2. Draw Hydrogen Bonds (Dashed Cyan Lines from H directly to O: O-H...O)
    if (showHbonds) {
      ctx.lineWidth = 1.4;
      ctx.setLineDash([3, 3]);

      for (let k = 0; k < activeHBonds.length; k++) {
        const hb = activeHBonds[k];
        ctx.strokeStyle = hb.phase === 'ice' ? 'rgba(0, 245, 212, 0.75)' : 'rgba(56, 189, 248, 0.55)';
        ctx.beginPath();
        ctx.moveTo(hb.hx, hb.hy);
        ctx.lineTo(hb.ox, hb.oy);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // 3. Draw Water Molecules (H2O)
    for (let i = 0; i < N; i++) {
      const m = molecules[i];
      const [h1, h2] = getHydrogenCoords(m);

      // Covalent bonds (O-H)
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(h1.x, h1.y);
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(h2.x, h2.y);
      ctx.stroke();

      // Oxygen atom (Red sphere with specular gradient)
      const oGrad = ctx.createRadialGradient(m.x - 2, m.y - 2, 1, m.x, m.y, O_RADIUS);
      oGrad.addColorStop(0, '#fca5a5');
      oGrad.addColorStop(0.4, '#ef4444');
      oGrad.addColorStop(1, '#991b1b');

      ctx.fillStyle = oGrad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, O_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Oxygen symbol / delta negative indicator
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('O', m.x, m.y);

      // Hydrogen atoms (White spheres with specular gradient)
      [h1, h2].forEach(h => {
        const hGrad = ctx.createRadialGradient(h.x - 1, h.y - 1, 0.5, h.x, h.y, H_RADIUS);
        hGrad.addColorStop(0, '#ffffff');
        hGrad.addColorStop(0.6, '#e2e8f0');
        hGrad.addColorStop(1, '#64748b');

        ctx.fillStyle = hGrad;
        ctx.beginPath();
        ctx.arc(h.x, h.y, H_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 4. Draw Mini Phase Diagram (Right Side p-T Graph)
    drawMiniPhaseDiagram(ctx, width - 130, 20, 115, height - 40, T, p);

    if (isRunning) {
      physicsStep();
      animId = requestAnimationFrame(render);
    }
  }

  // Mini p-T Phase Diagram of Water
  function drawMiniPhaseDiagram(ctx, px, py, pw, ph, curT, curP) {
    // Card background
    ctx.fillStyle = '#0b1329';
    ctx.strokeStyle = 'rgba(0, 180, 216, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 8);
    ctx.fill();
    ctx.stroke();

    // Title
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Fázový p-T diagram', px + pw / 2, py + 15);

    // Axes
    const graphLeft = px + 22;
    const graphBottom = py + ph - 22;
    const graphW = pw - 30;
    const graphH = ph - 45;

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(graphLeft, py + 22);
    ctx.lineTo(graphLeft, graphBottom);
    ctx.lineTo(graphLeft + graphW, graphBottom);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '8px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('p', graphLeft - 4, py + 30);
    ctx.textAlign = 'center';
    ctx.fillText('T [°C]', graphLeft + graphW / 2, graphBottom + 14);

    // Coordinate scaling: T from -40 to 200, p from 0.1 to 5.0 (log scale for p)
    function scaleT(tVal) {
      const norm = (tVal - (-40)) / (200 - (-40));
      return graphLeft + norm * graphW;
    }
    function scaleP(pVal) {
      const logP = Math.log10(pVal);
      const logMin = Math.log10(0.1);
      const logMax = Math.log10(5.0);
      const norm = (logP - logMin) / (logMax - logMin);
      return graphBottom - norm * graphH;
    }

    // Phase Boundary Lines:
    // 1. Solid-Liquid (T_m ~ 0 °C line)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(scaleT(0), scaleP(0.1));
    ctx.lineTo(scaleT(-2), scaleP(5.0)); // Negative slope of water melting curve!
    ctx.stroke();

    // 2. Liquid-Gas (Boiling curve Clausius-Clapeyron)
    ctx.strokeStyle = '#f59e0b';
    ctx.beginPath();
    for (let step = 0; step <= 25; step++) {
      const pStep = 0.1 + (step / 25) * 4.9;
      const tBoilStep = getBoilingPoint(pStep);
      const gx = scaleT(tBoilStep);
      const gy = scaleP(pStep);
      if (step === 0) ctx.moveTo(gx, gy);
      else ctx.lineTo(gx, gy);
    }
    ctx.stroke();

    // Phase Region Labels
    ctx.font = 'bold 8px Inter, sans-serif';
    ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.fillText('LED', scaleT(-20), scaleP(2.5));

    ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
    ctx.fillText('VODA', scaleT(50), scaleP(2.5));

    ctx.fillStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.fillText('PÁRA', scaleT(160), scaleP(0.6));

    // Current State Dot
    const dotX = scaleT(Math.min(200, Math.max(-40, curT)));
    const dotY = scaleP(Math.min(5.0, Math.max(0.1, curP)));

    // Glowing ring
    ctx.fillStyle = 'rgba(6, 214, 160, 0.35)';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
    ctx.fill();

    // Dot
    ctx.fillStyle = '#06d6a0';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // --- Event Handlers ---
  if (tempSlider) {
    tempSlider.addEventListener('input', (e) => {
      T = parseFloat(e.target.value);
      presetBtns.forEach(b => b.classList.remove('active'));
      updateStateLabels();
    });
  }

  if (pressSlider) {
    pressSlider.addEventListener('input', (e) => {
      p = parseFloat(e.target.value);
      presetBtns.forEach(b => b.classList.remove('active'));
      updateStateLabels();
    });
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      T = parseFloat(btn.getAttribute('data-temp'));
      p = parseFloat(btn.getAttribute('data-press'));

      if (tempSlider) tempSlider.value = T;
      if (pressSlider) pressSlider.value = p;

      updateStateLabels();
    });
  });

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isRunning = !isRunning;
      playBtn.innerText = isRunning ? '⏸ Pozastavit' : '▶ Spustit';
      playBtn.classList.toggle('btn-primary', isRunning);
      playBtn.classList.toggle('btn-secondary', !isRunning);
      if (isRunning) render();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      initLattice();
      if (!isRunning) render();
    });
  }

  if (hbondsToggle) {
    hbondsToggle.addEventListener('change', (e) => {
      showHbonds = e.target.checked;
    });
  }

  updateStateLabels();
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
    hBondSite1: { x: 230, y: 130, type: 'Acceptor', color: '#ef4444', label: 'Akceptor (O/N)' },
    hBondSite2: { x: 310, y: 130, type: 'Donor', color: '#3b82f6', label: 'Donor (-NH/-OH)' },
    hydrophobicSite: { x: 270, y: 195, radius: 26, color: '#f59e0b', label: 'Hydrofobní kapsa' }
  };

  // Ligand (Drug Candidate) draggable state
  let ligand = {
    x: 100,
    y: 160,
    angle: 0,
    isDragging: false
  };

  const scoreEl = document.getElementById('docking-score');
  const kdEl = document.getElementById('docking-kd');
  const statusEl = document.getElementById('docking-status');

  // Convert Delta G (kcal/mol) to Kd (Dissociation constant) at T = 298.15 K
  // Delta G = RT * ln(Kd)  =>  Kd = exp(Delta G / RT)
  // RT = 1.9872 cal/(mol*K) * 298.15 K = 592.48 cal/mol = 0.5925 kcal/mol
  function computeKd(deltaG_kcal) {
    if (deltaG_kcal >= 0) {
      return { valM: 1.0, str: '> 1 M (bez vazby)', rawKd: 1.0 };
    }

    const RT = 0.5925; // kcal/mol
    const kd_M = Math.exp(deltaG_kcal / RT);

    let str = '';
    if (kd_M >= 1e-3) {
      str = `${(kd_M * 1e3).toFixed(1)} mM (velmi slabá)`;
    } else if (kd_M >= 1e-6) {
      str = `${(kd_M * 1e6).toFixed(1)} µM (mikromolární)`;
    } else if (kd_M >= 1e-9) {
      str = `${(kd_M * 1e9).toFixed(1)} nM (nanomolární)`;
    } else {
      str = `${(kd_M * 1e12).toFixed(1)} pM (pikomolární)`;
    }

    return { valM: kd_M, str: str, rawKd: kd_M };
  }

  // Active interaction vectors for visual rendering
  const activeInteractions = [];

  function calculateScore() {
    activeInteractions.length = 0;

    const dx = ligand.x - pocket.x;
    const dy = ligand.y - pocket.y;
    const distCenter = Math.hypot(dx, dy);

    // Compute global coordinates of Ligand pharmacophore points
    // Ligand geometry matched to pocket sites: Donor (-38, -28), Acceptor (+38, -28), Hydrophobic (0, +34)
    const cosA = Math.cos(ligand.angle);
    const sinA = Math.sin(ligand.angle);

    const ligDonor = {
      x: ligand.x + (-38 * cosA - (-28) * sinA),
      y: ligand.y + (-38 * sinA + (-28) * cosA)
    };

    const ligAcceptor = {
      x: ligand.x + (38 * cosA - (-28) * sinA),
      y: ligand.y + (38 * sinA + (-28) * cosA)
    };

    const ligHydro = {
      x: ligand.x + (0 * cosA - 34 * sinA),
      y: ligand.y + (0 * sinA + 34 * cosA)
    };

    let deltaG = 0.0;

    if (distCenter > 85) {
      // Free ligand in solution outside active site
      deltaG = 0.0;
    } else {
      // Ligand inside pocket: baseline cavity desolvation penalty (+1.5 kcal/mol)
      deltaG = 1.5;

      // 1. Shape & Cavity complementarity (bonus up to -1.2 kcal/mol)
      deltaG -= 1.2 * Math.exp(-(distCenter * distCenter) / 900);

      // 2. Hydrogen Bond 1: Ligand Donor -> Pocket Site 1 (Acceptor at 230, 130)
      const dD_S1 = Math.hypot(ligDonor.x - pocket.hBondSite1.x, ligDonor.y - pocket.hBondSite1.y);
      if (dD_S1 < 30) {
        const eHB1 = -4.2 * Math.exp(-(dD_S1 * dD_S1) / 160);
        deltaG += eHB1;
        activeInteractions.push({
          x1: ligDonor.x, y1: ligDonor.y,
          x2: pocket.hBondSite1.x, y2: pocket.hBondSite1.y,
          type: 'hbond', color: '#10b981'
        });
      }

      // 3. Hydrogen Bond 2: Ligand Acceptor -> Pocket Site 2 (Donor at 310, 130)
      const dA_S2 = Math.hypot(ligAcceptor.x - pocket.hBondSite2.x, ligAcceptor.y - pocket.hBondSite2.y);
      if (dA_S2 < 30) {
        const eHB2 = -4.2 * Math.exp(-(dA_S2 * dA_S2) / 160);
        deltaG += eHB2;
        activeInteractions.push({
          x1: ligAcceptor.x, y1: ligAcceptor.y,
          x2: pocket.hBondSite2.x, y2: pocket.hBondSite2.y,
          type: 'hbond', color: '#10b981'
        });
      }

      // 4. Hydrophobic Interaction: Ligand Hydrophobic Ring -> Pocket Hydrophobic Site (270, 195)
      const dH_SH = Math.hypot(ligHydro.x - pocket.hydrophobicSite.x, ligHydro.y - pocket.hydrophobicSite.y);
      if (dH_SH < 32) {
        const eHyd = -4.6 * Math.exp(-(dH_SH * dH_SH) / 200);
        deltaG += eHyd;
        activeInteractions.push({
          x1: ligHydro.x, y1: ligHydro.y,
          x2: pocket.hydrophobicSite.x, y2: pocket.hydrophobicSite.y,
          type: 'hydro', color: '#f59e0b'
        });
      }

      // 5. ELECTROSTATIC / PHARMACOPHORE CLASHES (When rotated or mismatched)
      // Clash A: Ligand Acceptor near Pocket Acceptor Site 1 (same negative charge repulsion)
      const dA_S1 = Math.hypot(ligAcceptor.x - pocket.hBondSite1.x, ligAcceptor.y - pocket.hBondSite1.y);
      if (dA_S1 < 30) {
        const eClash1 = 4.5 * Math.exp(-(dA_S1 * dA_S1) / 160);
        deltaG += eClash1;
        activeInteractions.push({
          x1: ligAcceptor.x, y1: ligAcceptor.y,
          x2: pocket.hBondSite1.x, y2: pocket.hBondSite1.y,
          type: 'clash', color: '#ef4444'
        });
      }

      // Clash B: Ligand Donor near Pocket Donor Site 2 (same positive charge repulsion)
      const dD_S2 = Math.hypot(ligDonor.x - pocket.hBondSite2.x, ligDonor.y - pocket.hBondSite2.y);
      if (dD_S2 < 30) {
        const eClash2 = 4.5 * Math.exp(-(dD_S2 * dD_S2) / 160);
        deltaG += eClash2;
        activeInteractions.push({
          x1: ligDonor.x, y1: ligDonor.y,
          x2: pocket.hBondSite2.x, y2: pocket.hBondSite2.y,
          type: 'clash', color: '#ef4444'
        });
      }

      // Clash C: Polar groups entering hydrophobic pocket
      const dD_SH = Math.hypot(ligDonor.x - pocket.hydrophobicSite.x, ligDonor.y - pocket.hydrophobicSite.y);
      const dA_SH = Math.hypot(ligAcceptor.x - pocket.hydrophobicSite.x, ligAcceptor.y - pocket.hydrophobicSite.y);
      if (dD_SH < 22 || dA_SH < 22) {
        deltaG += 3.0;
      }
    }

    // Clamp score
    deltaG = Math.max(-12.5, Math.min(6.0, deltaG));
    const kdInfo = computeKd(deltaG);

    // Update UI elements
    if (scoreEl) {
      scoreEl.innerText = `${deltaG > 0 ? '+' : ''}${deltaG.toFixed(1)} kcal/mol`;
      if (deltaG <= -10.0) scoreEl.style.color = '#10b981';
      else if (deltaG <= -5.0) scoreEl.style.color = '#00f5d4';
      else if (deltaG < 0) scoreEl.style.color = '#f59e0b';
      else scoreEl.style.color = '#ef4444';
    }

    if (kdEl) {
      kdEl.innerText = kdInfo.str;
      if (kdInfo.valM < 1e-7) kdEl.style.color = '#10b981';
      else if (kdInfo.valM < 1e-4) kdEl.style.color = '#00f5d4';
      else if (kdInfo.valM < 1e-2) kdEl.style.color = '#f59e0b';
      else kdEl.style.color = '#ef4444';
    }

    if (statusEl) {
      if (distCenter > 85) {
        statusEl.innerText = '❄️ Volný ligand v roztoku mimo vazebnou kapsu enzymu.';
        statusEl.style.color = '#94a3b8';
      } else if (deltaG <= -10.0) {
        statusEl.innerText = `🔥 Perfektní vazba! Silný specifický inhibitor enzymu (nanomolární afinita: Kd = ${kdInfo.str.split(' ')[0]}).`;
        statusEl.style.color = '#10b981';
      } else if (deltaG <= -5.0) {
        statusEl.innerText = `⚡ Částečná vazba (mikromolární hit: Kd = ${kdInfo.str.split(' ')[0]}). Zkuste ligand lépe natočit.`;
        statusEl.style.color = '#f59e0b';
      } else if (deltaG < 0) {
        statusEl.innerText = `⚠️ Slabá nespecifická vazba (Kd = ${kdInfo.str.split(' ')[0]}). Farmakofory přesně nelícují s aktivním místem.`;
        statusEl.style.color = '#f97316';
      } else {
        statusEl.innerText = '❌ Vazebný clash (odpuzování stejných nábojů a sterická srážka)! Otočte ligand správným směrem.';
        statusEl.style.color = '#ef4444';
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Enzyme Surface & Binding Pocket
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(175, 65, 190, 190, 24);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pocket Cavity
    ctx.fillStyle = '#0a1020';
    ctx.beginPath();
    ctx.arc(pocket.x, pocket.y, 68, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00f5d4';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Pharmacophore Features inside pocket
    // Site 1: H-Bond Acceptor (Red at 230, 130)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.beginPath();
    ctx.arc(pocket.hBondSite1.x, pocket.hBondSite1.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(pocket.hBondSite1.x, pocket.hBondSite1.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 8px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Akceptor', pocket.hBondSite1.x, pocket.hBondSite1.y - 10);

    // Site 2: H-Bond Donor (Blue at 310, 130)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
    ctx.beginPath();
    ctx.arc(pocket.hBondSite2.x, pocket.hBondSite2.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(pocket.hBondSite2.x, pocket.hBondSite2.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 8px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Donor', pocket.hBondSite2.x, pocket.hBondSite2.y - 10);

    // Hydrophobic Pocket Site (Yellow/Orange at 270, 195)
    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.beginPath();
    ctx.arc(pocket.hydrophobicSite.x, pocket.hydrophobicSite.y, pocket.hydrophobicSite.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(pocket.hydrophobicSite.x, pocket.hydrophobicSite.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 8px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Hydrofobní', pocket.hydrophobicSite.x, pocket.hydrophobicSite.y + 18);

    // Pocket Title
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Aktivní místo enzymu', pocket.x, 48);

    // 2. Draw Active Interactions Lines (H-bonds, Clashes, Hydrophobic)
    for (let i = 0; i < activeInteractions.length; i++) {
      const inter = activeInteractions[i];
      ctx.strokeStyle = inter.color;
      ctx.lineWidth = inter.type === 'clash' ? 2.5 : 2;
      ctx.setLineDash(inter.type === 'clash' ? [4, 2] : [3, 3]);
      ctx.beginPath();
      ctx.moveTo(inter.x1, inter.y1);
      ctx.lineTo(inter.x2, inter.y2);
      ctx.stroke();

      if (inter.type === 'clash') {
        // Draw Clash warning icon in middle
        const midX = (inter.x1 + inter.x2) / 2;
        const midY = (inter.y1 + inter.y2) / 2;
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡', midX, midY + 4);
      }
    }
    ctx.setLineDash([]);

    // 3. Draw Ligand (Molecule)
    ctx.save();
    ctx.translate(ligand.x, ligand.y);
    ctx.rotate(ligand.angle);

    // Ligand Backbone Skeleton matching pocket geometry (-38, -28), (+38, -28), (0, +34)
    ctx.strokeStyle = '#00f5d4';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-38, -28);
    ctx.lineTo(0, 0);
    ctx.lineTo(38, -28);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 34);
    ctx.stroke();

    // Central carbon node
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Donor group on Ligand (-NH2 / Blue, local -38, -28)
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(-38, -28, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('D', -38, -28);

    // Acceptor group on Ligand (=O / Red, local +38, -28)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(38, -28, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', 38, -28);

    // Hydrophobic moiety (Benzene ring shape, local 0, +34)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 34, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#060b17';
    ctx.font = 'bold 8px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⬡', 0, 34);

    ctx.restore();

    calculateScore();
  }

  // Interactive controls
  const rotateBtn = document.getElementById('docking-rotate-btn');
  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
      ligand.angle += Math.PI / 4;
      while (ligand.angle >= Math.PI * 2) ligand.angle -= Math.PI * 2;
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
   7. Kapitola 7: 3D Protein & AlphaFold DB Explorer (Mol*)
   ========================================================================== */
function initAlphaFoldExplorer() {
  const proteinSelect = document.getElementById('af-protein-select');
  const iframeViewer = document.getElementById('molstar-iframe');
  const plddtBar = document.getElementById('af-plddt-score');
  const descEl = document.getElementById('af-protein-desc');

  if (!proteinSelect || !iframeViewer) return;

  const proteinPresets = {
    'AF-CYP3A4': {
      name: 'Cytochrom P450 3A4 (AlphaFold DB: P08684)',
      plddt: 94.8,
      desc: 'Nejdůležitější lidský enzym zodpovědný za metabolickou přeměnu a odbourávání více než 50 % všech klinicky užívaných léčiv v játrech. Vypočtený model AlphaFold DB s barevným pLDDT skóre.',
      url: 'https://molstar.org/viewer/?afdb=P08684&hide-controls=1'
    },
    '1TQN': {
      name: 'Cytochrom P450 3A4 s hemem (PDB: 1TQN)',
      plddt: 98.0,
      desc: 'Experimentální rentgenová krystalová struktura lidského CYP3A4 s navázaným hemem v aktivním místě ve vysokém rozlišení 2.05 Å.',
      url: 'https://molstar.org/viewer/?pdb=1tqn&hide-controls=1'
    },
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
    '1EMA': {
      name: 'Zelený fluorescenční protein GFP (PDB: 1EMA)',
      plddt: 95.2,
      desc: 'Slavný protein s beta-barelovou strukturou obsahující vnitřní fluorofor, který emituje zelené světlo. Revoluční nástroj molekulární biologie (Nobelova cena 2008).',
      url: 'https://molstar.org/viewer/?pdb=1ema&hide-controls=1'
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
   5. Kapitola 5: JSME Molekulární editor & kalkulátor vlastností léčiv
   ========================================================================== */

// Global JSME loader callback
window.jsmeOnLoad = function() {
  if (typeof JSApplet !== 'undefined' && document.getElementById('jsme-container')) {
    try {
      window.jsmeApplet = new JSApplet.JSME("jsme-container", "100%", "300px", {
        "options": "oldlook,star"
      });

      // Event triggered whenever user draws/modifies structure in JSME
      window.jsmeApplet.setCallBack("AfterStructureModified", function(event) {
        if (window.jsmeApplet && typeof window.updateChemoinformaticsFromJSME === 'function') {
          const currentSmiles = window.jsmeApplet.smiles();
          window.updateChemoinformaticsFromJSME(currentSmiles);
        }
      });

      // Load initial default structure (Aspirin)
      const initialSmiles = document.getElementById('cheminf-smiles-input')?.value || "CC(=O)Oc1ccccc1C(=O)O";
      window.jsmeApplet.readGenericMolecularInput(initialSmiles);
    } catch (e) {
      console.warn("JSME Applet initialization error:", e);
    }
  }
};

function initChemoinformaticsLab() {
  const container = document.getElementById('jsme-container');
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

  if (!container || !smilesInput) return;

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
      heavy: 13
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
      heavy: 14
    },
    'CC(C)Cc1ccc(cc1)C(C)C(=O)O': {
      name: 'Ibuprofen (s aromatickým benzenovým jádrem)',
      formula: 'C₁₃H₁₈O₂',
      mw: 206.28,
      logp: 3.50,
      logs: -3.85,
      hbd: 1,
      hba: 2,
      tpsa: 37.3,
      rotb: 4,
      aroma: 1,
      heavy: 15
    },
    'CC(=O)Nc1ccc(O)cc1': {
      name: 'Paracetamol (Acetaminofen – fenolický kruh)',
      formula: 'C₈H₉NO₂',
      mw: 151.16,
      logp: 0.91,
      logs: -1.65,
      hbd: 2,
      hba: 2,
      tpsa: 49.3,
      rotb: 1,
      aroma: 1,
      heavy: 11
    },
    'CN1CCC23C4C1CC5=C2C(=C(C=C5)O)OC3C(C=C4)O': {
      name: 'Morfin (polycyklický alkaloid)',
      formula: 'C₁₇H₁₉NO₃',
      mw: 285.34,
      logp: 0.89,
      logs: -2.15,
      hbd: 2,
      hba: 4,
      tpsa: 49.8,
      rotb: 0,
      aroma: 1,
      heavy: 21
    },
    'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O': {
      name: 'D-Glukóza (pyranózový cyklus)',
      formula: 'C₆H₁₂O₆',
      mw: 180.16,
      logp: -3.24,
      logs: 0.35,
      hbd: 5,
      hba: 6,
      tpsa: 110.4,
      rotb: 1,
      aroma: 0,
      heavy: 12
    }
  };

  function parseAndComputeSMILES(smiles) {
    const cleanSmiles = (smiles || '').trim();
    if (presets[cleanSmiles]) {
      return { ...presets[cleanSmiles], smiles: cleanSmiles };
    }

    if (!cleanSmiles) {
      return {
        name: 'Prázdné plátno',
        formula: '—',
        mw: 0,
        logp: 0,
        logs: 0,
        hbd: 0,
        hba: 0,
        tpsa: 0,
        rotb: 0,
        aroma: 0,
        heavy: 0,
        smiles: ''
      };
    }

    // Heuristic SMILES descriptor parser (based on Wildman-Crippen, ESOL Delaney, and Ertl-Rohde TPSA)
    let carbon = (cleanSmiles.match(/[C]/g) || []).length + (cleanSmiles.match(/[c]/g) || []).length;
    let nitrogen = (cleanSmiles.match(/[Nn]/g) || []).length;
    let oxygen = (cleanSmiles.match(/[Oo]/g) || []).length;
    let sulfur = (cleanSmiles.match(/[Ss]/g) || []).length;
    let fluorine = (cleanSmiles.match(/[F]/g) || []).length;
    let chlorine = (cleanSmiles.match(/Cl/g) || []).length;
    let bromine = (cleanSmiles.match(/Br/g) || []).length;

    const heavy = carbon + nitrogen + oxygen + sulfur + fluorine + chlorine + bromine;
    let hydrogen = Math.max(heavy * 2 + 2 - (cleanSmiles.match(/=/g) || []).length * 2 - (cleanSmiles.match(/#/g) || []).length * 4, 1);
    
    // Molecular weight
    const mw = carbon * 12.011 + hydrogen * 1.008 + nitrogen * 14.007 + oxygen * 15.999 + sulfur * 32.06 + fluorine * 18.998 + chlorine * 35.45 + bromine * 79.904;

    // H-bond donors (OH, NH) & Acceptors (O, N)
    const hbd = (cleanSmiles.match(/[O][H]|[N][H]|O(?=[A-Z0-9]|$)|N(?=[A-Z0-9]|$)/g) || []).length % (oxygen + nitrogen + 1);
    const hba = oxygen + nitrogen;

    // Aromatic rings
    const aroma = (cleanSmiles.match(/c1|n1/g) || []).length || (cleanSmiles.includes('c') ? 1 : 0);

    // Rotatable bonds
    const rotb = Math.max(0, Math.floor(carbon / 3));

    // Wildman-Crippen SlogP heuristic
    const logp = carbon * 0.28 + chlorine * 0.55 + bromine * 0.70 + fluorine * 0.15 - oxygen * 0.45 - nitrogen * 0.55 + (aroma > 0 ? 0.65 : 0);

    // Delaney ESOL logS
    const logs = 0.16 - 0.63 * logp - 0.0062 * mw + 0.066 * rotb - 0.74 * (aroma > 0 ? 1 : 0);

    // Ertl-Rohde TPSA heuristic
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
      name: 'Vlastní molekula (SMILES)',
      formula: formula || 'Organická sloučenina',
      mw: Math.max(mw, 16.0),
      logp: logp,
      logs: logs,
      hbd: Math.min(hbd, 10),
      hba: hba,
      tpsa: tpsa,
      rotb: rotb,
      aroma: aroma,
      heavy: Math.max(heavy, 1),
      smiles: cleanSmiles
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
  }

  // Hook up callback from JSME editor
  window.updateChemoinformaticsFromJSME = function(smiles) {
    smilesInput.value = smiles;
    presetBtns.forEach(b => b.classList.remove('active'));
    const mol = parseAndComputeSMILES(smiles);
    updateUI(mol);
  };

  // Preset Buttons Click
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const smiles = btn.getAttribute('data-smiles');
      smilesInput.value = smiles;
      
      // Update JSME applet if initialized
      if (window.jsmeApplet && typeof window.jsmeApplet.readGenericMolecularInput === 'function') {
        try {
          window.jsmeApplet.readGenericMolecularInput(smiles);
        } catch (e) {
          console.warn("Could not pass smiles to JSME:", e);
        }
      }

      const mol = parseAndComputeSMILES(smiles);
      updateUI(mol);
    });
  });

  // Calculate / Load Button Click
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      const smiles = smilesInput.value;

      if (window.jsmeApplet && typeof window.jsmeApplet.readGenericMolecularInput === 'function') {
        try {
          window.jsmeApplet.readGenericMolecularInput(smiles);
        } catch (e) {
          console.warn("Could not pass smiles to JSME:", e);
        }
      }

      const mol = parseAndComputeSMILES(smiles);
      updateUI(mol);
    });
  }

  smilesInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      calcBtn.click();
    }
  });

  // Try initializing JSME if already available
  if (typeof JSApplet !== 'undefined' && !window.jsmeApplet) {
    window.jsmeOnLoad();
  }

  // Initial UI calculation with Aspirin
  const initialMol = parseAndComputeSMILES(smilesInput.value);
  updateUI(initialMol);
}

/* ==========================================================================
   8. Kapitola 8: Studium reakcí, reakční koordináta & katalýza
   ========================================================================== */
function initReactionPathwayLab() {
  const pesCanvas = document.getElementById('rxn-pes-canvas');
  const geomCanvas = document.getElementById('rxn-geom-canvas');
  const systemSelect = document.getElementById('rxn-system-select');
  const catToggle = document.getElementById('rxn-catalyst-toggle');
  const slider = document.getElementById('rxn-coord-slider');
  const playBtn = document.getElementById('rxn-play-btn');
  const tsBtn = document.getElementById('rxn-ts-btn');
  const resetBtn = document.getElementById('rxn-reset-btn');

  const energyEl = document.getElementById('rxn-current-energy');
  const coordValEl = document.getElementById('rxn-coord-val');
  const stateBadge = document.getElementById('rxn-state-badge');
  const eaValEl = document.getElementById('rxn-ea-val');
  const dhValEl = document.getElementById('rxn-dh-val');
  const rateValEl = document.getElementById('rxn-rate-val');

  if (!pesCanvas || !geomCanvas || !slider) return;

  const ctxPes = pesCanvas.getContext('2d');
  const ctxGeom = geomCanvas.getContext('2d');
  const wPes = pesCanvas.width = 340;
  const hPes = pesCanvas.height = 210;
  const wGeom = geomCanvas.width = 340;
  const hGeom = geomCanvas.height = 210;

  // Reaction systems database
  const systems = {
    sn2: {
      name: 'F⁻ + CH₃Cl → CH₃F + Cl⁻',
      type: 'Bimolekulární nukleofilní substituce (S_N2)',
      ea0: 42.0, // kJ/mol
      eacat: 18.0, // kJ/mol
      dh: -125.0, // kJ/mol (exothermic)
      catName: 'Polární aprotické prostředí / Fázový katalyzátor',
      drawGeom: (ctx, xi, isCat) => drawSn2Geometry(ctx, xi, isCat)
    },
    ester: {
      name: 'Hydrolýza peptidu/esteru',
      type: 'Nukleofilní adice na karbonylovou skupinu',
      ea0: 88.0,
      eacat: 24.0,
      dh: -22.0,
      catName: 'Enzymová proteáza (katalytická triáda Ser-His-Asp)',
      drawGeom: (ctx, xi, isCat) => drawEsterHydrolysisGeometry(ctx, xi, isCat)
    },
    hydrogenation: {
      name: 'H₂ + C₂H₄ → C₂H₆ (Hydrogenace ethenu)',
      type: 'Heterogenní katalýza na platinovém povrchu',
      ea0: 180.0,
      eacat: 45.0,
      dh: -137.0,
      catName: 'Platinový kovový katalyzátor (Pt nanopovrch)',
      drawGeom: (ctx, xi, isCat) => drawHydrogenationGeometry(ctx, xi, isCat)
    }
  };

  let currentSystem = 'sn2';
  let isCatalyzed = false;
  let animId = null;
  let isPlaying = false;

  function getEnergy(xi, ea, dh) {
    // xi: 0 .. 1
    // Smooth asymmetric reaction profile curve
    // Peak at xi = 0.5
    const t = xi * Math.PI;
    const barrier = ea * Math.pow(Math.sin(t), 2);
    const thermo = dh * (1 - Math.cos(xi * Math.PI)) / 2;
    return barrier + thermo;
  }

  function drawPES(xi) {
    ctxPes.clearRect(0, 0, wPes, hPes);

    const sys = systems[currentSystem];
    const ea = isCatalyzed ? sys.eacat : sys.ea0;
    const dh = sys.dh;

    // Background grid
    ctxPes.fillStyle = '#060b17';
    ctxPes.fillRect(0, 0, wPes, hPes);

    ctxPes.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctxPes.lineWidth = 1;
    for (let x = 30; x < wPes; x += 40) {
      ctxPes.beginPath(); ctxPes.moveTo(x, 15); ctxPes.lineTo(x, hPes - 25); ctxPes.stroke();
    }
    for (let y = 20; y < hPes - 20; y += 30) {
      ctxPes.beginPath(); ctxPes.moveTo(30, y); ctxPes.lineTo(wPes - 15, y); ctxPes.stroke();
    }

    // Axes
    ctxPes.strokeStyle = '#475569';
    ctxPes.lineWidth = 1.5;
    ctxPes.beginPath();
    ctxPes.moveTo(35, 15);
    ctxPes.lineTo(35, hPes - 25);
    ctxPes.lineTo(wPes - 15, hPes - 25);
    ctxPes.stroke();

    // Axis labels
    ctxPes.fillStyle = '#94a3b8';
    ctxPes.font = '9px Inter, sans-serif';
    ctxPes.fillText('E', 18, 25);
    ctxPes.fillText('Reakční koordináta (ξ)', wPes - 120, hPes - 8);
    ctxPes.fillText('R', 40, hPes - 10);
    ctxPes.fillText('TS ‡', wPes / 2 - 8, hPes - 10);
    ctxPes.fillText('P', wPes - 30, hPes - 10);

    // Energy scaling
    // Max E ~ ea0 + 10, Min E ~ dh - 10
    const maxE = Math.max(sys.ea0, sys.eacat) + 15;
    const minE = Math.min(dh, 0) - 20;
    const rangeE = maxE - minE;

    function scaleY(e) {
      const norm = (e - minE) / rangeE;
      return (hPes - 35) - norm * (hPes - 60);
    }
    function scaleX(xNorm) {
      return 40 + xNorm * (wPes - 65);
    }

    // Zero energy line (Reaktanty)
    const yZero = scaleY(0);
    ctxPes.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctxPes.setLineDash([4, 4]);
    ctxPes.beginPath();
    ctxPes.moveTo(35, yZero);
    ctxPes.lineTo(wPes - 20, yZero);
    ctxPes.stroke();
    ctxPes.setLineDash([]);

    // 1. Draw Uncatalyzed Curve (always or as comparison)
    ctxPes.strokeStyle = isCatalyzed ? 'rgba(239, 68, 68, 0.45)' : '#ef4444';
    ctxPes.lineWidth = isCatalyzed ? 1.8 : 2.5;
    ctxPes.beginPath();
    for (let step = 0; step <= 60; step++) {
      const xNorm = step / 60;
      const e = getEnergy(xNorm, sys.ea0, sys.dh);
      const px = scaleX(xNorm);
      const py = scaleY(e);
      if (step === 0) ctxPes.moveTo(px, py);
      else ctxPes.lineTo(px, py);
    }
    ctxPes.stroke();

    // 2. Draw Catalyzed Curve if active
    if (isCatalyzed) {
      ctxPes.strokeStyle = '#10b981';
      ctxPes.lineWidth = 2.8;
      ctxPes.beginPath();
      for (let step = 0; step <= 60; step++) {
        const xNorm = step / 60;
        const e = getEnergy(xNorm, sys.eacat, sys.dh);
        const px = scaleX(xNorm);
        const py = scaleY(e);
        if (step === 0) ctxPes.moveTo(px, py);
        else ctxPes.lineTo(px, py);
      }
      ctxPes.stroke();

      // Legend in PES
      ctxPes.font = 'bold 9px Inter, sans-serif';
      ctxPes.fillStyle = '#ef4444';
      ctxPes.fillText(`Bez kat. (Eₐ=${sys.ea0} kJ)`, 45, 30);
      ctxPes.fillStyle = '#10b981';
      ctxPes.fillText(`S kat. (Eₐ=${sys.eacat} kJ)`, 45, 44);
    } else {
      ctxPes.font = 'bold 9px Inter, sans-serif';
      ctxPes.fillStyle = '#ef4444';
      ctxPes.fillText(`Eₐ = ${sys.ea0} kJ/mol`, scaleX(0.5) - 25, scaleY(sys.ea0) - 8);
    }

    // 3. Current Position Marker
    const curE = getEnergy(xi, ea, dh);
    const curX = scaleX(xi);
    const curY = scaleY(curE);

    // Glow ring
    ctxPes.fillStyle = isCatalyzed ? 'rgba(16, 185, 129, 0.35)' : 'rgba(56, 189, 248, 0.35)';
    ctxPes.beginPath();
    ctxPes.arc(curX, curY, 9, 0, Math.PI * 2);
    ctxPes.fill();

    // Solid dot
    ctxPes.fillStyle = isCatalyzed ? '#10b981' : '#38bdf8';
    ctxPes.beginPath();
    ctxPes.arc(curX, curY, 4.5, 0, Math.PI * 2);
    ctxPes.fill();
    ctxPes.strokeStyle = '#ffffff';
    ctxPes.lineWidth = 1.2;
    ctxPes.stroke();

    return curE;
  }

  // --- Geometry Renderers ---
  function drawSn2Geometry(ctx, xi, isCat) {
    ctx.clearRect(0, 0, wGeom, hGeom);
    ctx.fillStyle = '#060b17';
    ctx.fillRect(0, 0, wGeom, hGeom);

    const cx = wGeom / 2;
    const cy = hGeom / 2 + 10;

    // Nucleophile F- flying in from left (x: 40 -> cx - 35)
    // Leaving group Cl- flying out to right (x: cx + 38 -> wGeom - 40)
    const fDist = 110 - xi * 75; // 110 at xi=0 down to 35 at xi=1
    const clDist = 38 + xi * 75; // 38 at xi=0 up to 113 at xi=1

    const fX = cx - fDist;
    const clX = cx + clDist;

    // Walden Inversion Angle for 3 Hydrogens:
    // xi = 0 -> theta = 125 deg (tilted back to the left)
    // xi = 0.5 (TS) -> theta = 90 deg (planar perpendicular trigonal disk!)
    // xi = 1 -> theta = 55 deg (tilted forward to the right - umbrella inverted!)
    const tiltAngle = (125 - xi * 70) * (Math.PI / 180);
    const hLen = 32;

    // Draw Bonds
    ctx.lineWidth = 2.2;

    // C-F bond (dashed if forming, solid when formed)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(fX, cy);
    ctx.strokeStyle = xi < 0.65 ? 'rgba(6, 182, 212, 0.6)' : '#06b6d4';
    if (xi < 0.8) ctx.setLineDash([4, 3]);
    else ctx.setLineDash([]);
    ctx.stroke();
    ctx.setLineDash([]);

    // C-Cl bond (solid when reactant, dashed when breaking)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(clX, cy);
    ctx.strokeStyle = xi > 0.35 ? 'rgba(34, 197, 94, 0.6)' : '#22c55e';
    if (xi > 0.2) ctx.setLineDash([4, 3]);
    else ctx.setLineDash([]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3 C-H Bonds with 3D projection
    const hConfigs = [
      { ang: 0, scaleY: 1.0, dy: -hLen },
      { ang: 2.1, scaleY: 0.7, dy: hLen * 0.8, dx: -10 },
      { ang: 4.2, scaleY: 0.7, dy: hLen * 0.8, dx: 10 }
    ];

    hConfigs.forEach((h, idx) => {
      const hx = cx - Math.cos(tiltAngle) * hLen + (h.dx || 0) * (1 - Math.abs(xi - 0.5));
      const hy = cy + h.dy;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(hx, hy);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // Hydrogen Atom Dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(hx, hy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 8px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('H', hx, hy);
    });

    // Central Carbon Atom
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(cx, cy, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('C', cx, cy);

    // Fluorine (Nucleophile)
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(fX, cy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText('F', fX, cy);

    // Chlorine (Leaving Group)
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(clX, cy, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText('Cl', clX, cy);

    // Delta charges (δ- / δ+)
    ctx.font = '9px JetBrains Mono, monospace';
    if (xi < 0.9) {
      ctx.fillStyle = '#06b6d4';
      ctx.fillText(`δ⁻ (${(1 - xi).toFixed(2)})`, fX, cy - 16);
    }
    if (xi > 0.1) {
      ctx.fillStyle = '#22c55e';
      ctx.fillText(`δ⁻ (${xi.toFixed(2)})`, clX, cy - 18);
    }

    // Catalyst visual (Stabilizing solvation / crown ether / ion pair)
    if (isCat) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(cx, cy - 35, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 8px Inter, sans-serif';
      ctx.fillText('Kat⁺', cx, cy - 35);
      ctx.font = '8px Inter, sans-serif';
      ctx.fillText('Elektrostatická stabilizace TS ‡', cx, cy - 54);
    }

    // State title
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    if (xi < 0.25) ctx.fillText('Výchozí stav: Nukleofilní atak F⁻ zezadu', cx, 22);
    else if (xi > 0.75) ctx.fillText('Konečný stav: CH₃F s invertovanou konfigurací + Cl⁻', cx, 22);
    else ctx.fillText('⚡ Přechodový stav [F···CH₃···Cl]‡ (planární CH₃ disk)', cx, 22);
  }

  function drawEsterHydrolysisGeometry(ctx, xi, isCat) {
    ctx.clearRect(0, 0, wGeom, hGeom);
    ctx.fillStyle = '#060b17';
    ctx.fillRect(0, 0, wGeom, hGeom);

    const cx = wGeom / 2;
    const cy = hGeom / 2 + 15;

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Hydrolýza: Nukleofilní adice vody / OH⁻ na karbonylový uhlík', cx, 20);

    // Carbonyl Carbon
    ctx.fillStyle = '#475569';
    ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px Inter, sans-serif'; ctx.fillText('C', cx, cy);

    // Oxygen =O (top)
    const oDist = 32;
    ctx.strokeStyle = xi > 0.4 ? 'rgba(239, 68, 68, 0.6)' : '#ef4444';
    ctx.lineWidth = xi > 0.4 ? 2.0 : 3.0;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - oDist); ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(cx, cy - oDist, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.fillText('O', cx, cy - oDist);

    // Nucleophile H2O / OH- approaching from bottom-left
    const nucDist = 80 - xi * 48;
    const nucX = cx - nucDist * 0.7;
    const nucY = cy + nucDist * 0.7;

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.0;
    if (xi < 0.8) ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nucX, nucY); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(nucX, nucY, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.fillText('OH', nucX, nucY);

    // Leaving group -OR' leaving to bottom-right
    const lgDist = 32 + xi * 48;
    const lgX = cx + lgDist * 0.7;
    const lgY = cy + lgDist * 0.7;

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.0;
    if (xi > 0.3) ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(lgX, lgY); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(lgX, lgY, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.fillText("OR'", lgX, lgY);

    // Enzyme Oxyanion Hole / Histidine catalysis
    if (isCat) {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.fillText('Ser-195 / His-57 enzymová triáda', cx, cy - 52);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.beginPath(); ctx.moveTo(cx - 20, cy - oDist - 12); ctx.lineTo(cx, cy - oDist); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 20, cy - oDist - 12); ctx.lineTo(cx, cy - oDist); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText('H-můstky v oxyaniontové kapse', cx, cy + 62);
    }
  }

  function drawHydrogenationGeometry(ctx, xi, isCat) {
    ctx.clearRect(0, 0, wGeom, hGeom);
    ctx.fillStyle = '#060b17';
    ctx.fillRect(0, 0, wGeom, hGeom);

    const cx = wGeom / 2;
    const cy = hGeom / 2;

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Hydrogenace ethenu: H₂ + C₂H₄ → C₂H₆', cx, 20);

    // Ethene / Ethane C-C core
    const c1X = cx - 24;
    const c2X = cx + 24;
    const cY = cy - (isCat ? 15 : 0);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = xi > 0.6 ? 2.5 : 4.0; // Double bond weakens to single
    ctx.beginPath(); ctx.moveTo(c1X, cY); ctx.lineTo(c2X, cY); ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.beginPath(); ctx.arc(c1X, cY, 11, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(c2X, cY, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText('C', c1X, cY);
    ctx.fillText('C', c2X, cY);

    // H atoms
    const hDist = 65 - xi * 40;
    const h1X = c1X - (isCat ? 0 : 15);
    const h1Y = cY + hDist;
    const h2X = c2X + (isCat ? 0 : 15);
    const h2Y = cY + hDist;

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.0;
    if (xi < 0.8) ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(c1X, cY); ctx.lineTo(h1X, h1Y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(c2X, cY); ctx.lineTo(h2X, h2Y); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(h1X, h1Y, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(h2X, h2Y, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 8px Inter, sans-serif';
    ctx.fillText('H', h1X, h1Y);
    ctx.fillText('H', h2X, h2Y);

    // Platinum Metal Surface
    if (isCat) {
      const slabY = cy + 42;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(30, slabY, wGeom - 60, 35);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(30, slabY); ctx.lineTo(wGeom - 30, slabY); ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.fillText('Pt (111) kovový povrch – chemisorpce a disociace H₂', cx, slabY + 22);
    }
  }

  function update() {
    const xi = parseFloat(slider.value) / 100;
    const sys = systems[currentSystem];
    const ea = isCatalyzed ? sys.eacat : sys.ea0;
    const dh = sys.dh;

    // Draw PES and Geometry
    const curE = drawPES(xi);
    sys.drawGeom(ctxGeom, xi, isCatalyzed);

    // Update Numerical Indicators
    if (energyEl) energyEl.innerText = `ΔE = ${curE > 0 ? '+' : ''}${curE.toFixed(1)} kJ/mol`;
    if (coordValEl) coordValEl.innerText = `ξ = ${Math.round(xi * 100)} %`;
    if (eaValEl) eaValEl.innerText = `${ea.toFixed(1)} kJ/mol`;
    if (dhValEl) dhValEl.innerText = `${dh.toFixed(1)} kJ/mol (${dh < 0 ? 'Exotermní' : 'Endotermní'})`;

    // Phase badge
    if (stateBadge) {
      if (xi < 0.15) {
        stateBadge.innerText = 'Reaktanty (Výchozí látky)';
        stateBadge.style.color = '#38bdf8';
      } else if (xi > 0.85) {
        stateBadge.innerText = 'Produkty (Konečný stav)';
        stateBadge.style.color = '#10b981';
      } else if (Math.abs(xi - 0.5) < 0.08) {
        stateBadge.innerText = '⚡ Přechodový stav TS (‡) – sedlový bod';
        stateBadge.style.color = '#ef4444';
      } else {
        stateBadge.innerText = 'Reakční dráha (překonávání bariéry)';
        stateBadge.style.color = '#f59e0b';
      }
    }

    // Rate Acceleration
    if (rateValEl) {
      if (!isCatalyzed) {
        rateValEl.innerText = '1× (bez katalýzy)';
        rateValEl.style.color = 'var(--text-muted)';
      } else {
        const deltaEa = (sys.ea0 - sys.eacat) * 1000; // J/mol
        const R = 8.314;
        const T = 298.15;
        const accel = Math.exp(deltaEa / (R * T));
        
        let accelStr = '';
        if (accel > 1e9) accelStr = `${(accel / 1e9).toFixed(1)} × 10⁹×`;
        else if (accel > 1e6) accelStr = `${(accel / 1e6).toFixed(1)} miliónů×`;
        else if (accel > 1e3) accelStr = `${Math.round(accel / 1000)} tisíc×`;
        else accelStr = `${Math.round(accel)}×`;

        rateValEl.innerText = `🚀 ${accelStr} rychlejší`;
        rateValEl.style.color = '#10b981';
      }
    }
  }

  // --- Event Listeners ---
  slider.addEventListener('input', () => {
    if (isPlaying) stopAnimation();
    update();
  });

  systemSelect.addEventListener('change', (e) => {
    currentSystem = e.target.value;
    if (isPlaying) stopAnimation();
    update();
  });

  catToggle.addEventListener('change', (e) => {
    isCatalyzed = e.target.checked;
    update();
  });

  tsBtn.addEventListener('click', () => {
    if (isPlaying) stopAnimation();
    slider.value = 50;
    update();
  });

  resetBtn.addEventListener('click', () => {
    if (isPlaying) stopAnimation();
    slider.value = 0;
    update();
  });

  function startAnimation() {
    isPlaying = true;
    playBtn.innerText = '⏸ Pozastavit';
    playBtn.classList.replace('btn-primary', 'btn-secondary');

    let forward = true;
    function loop() {
      let val = parseFloat(slider.value);
      if (forward) {
        val += 0.8;
        if (val >= 100) { val = 100; forward = false; }
      } else {
        val -= 0.8;
        if (val <= 0) { val = 0; forward = true; }
      }
      slider.value = val;
      update();
      if (isPlaying) animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);
  }

  function stopAnimation() {
    isPlaying = false;
    if (animId) cancelAnimationFrame(animId);
    playBtn.innerText = '▶ Přehrát reakci';
    playBtn.classList.replace('btn-secondary', 'btn-primary');
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) stopAnimation();
    else startAnimation();
  });

  // Initial draw
  update();
}
