/**
 * Počítačová chemie - PřF UPOL
 * Hlavní obslužný skript pro navigaci, záložky a motiv vzhledu
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Switcher (Dark / Light Mode)
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcon(false);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        updateThemeIcon(false);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon(true);
      }
    });
  }

  function updateThemeIcon(isDark) {
    if (!themeToggle) return;
    themeToggle.innerHTML = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('title', isDark ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim');
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

  // 5. Mini 3D Hero Canvas Demo (Floating Molecular Lattice)
  initHeroCanvas();
});

function initHeroCanvas() {
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

  // Molecular nodes for aesthetic background simulation
  const nodes = [];
  const numNodes = 26;
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 200 + 50,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      vz: (Math.random() - 0.5) * 0.5,
      type: i % 4 === 0 ? 'O' : (i % 3 === 0 ? 'N' : (i % 5 === 0 ? 'H' : 'C')),
      radius: i % 4 === 0 ? 8 : (i % 3 === 0 ? 7 : (i % 5 === 0 ? 4 : 6))
    });
  }

  const colors = {
    'C': '#38bdf8',
    'O': '#ef4444',
    'N': '#3b82f6',
    'H': '#ffffff'
  };

  let angle = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Dark molecular grid background
    ctx.fillStyle = '#0b1329';
    ctx.fillRect(0, 0, width, height);

    angle += 0.003;

    // Update and draw bonds
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 95) {
          const alpha = 1 - (dist / 95);
          ctx.strokeStyle = `rgba(0, 180, 216, ${alpha * 0.45})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Update and draw atoms
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 10 || node.x > width - 10) node.vx *= -1;
      if (node.y < 10 || node.y > height - 10) node.vy *= -1;

      // Glow effect
      const grad = ctx.createRadialGradient(node.x, node.y, 1, node.x, node.y, node.radius * 2.2);
      grad.addColorStop(0, colors[node.type] || '#38bdf8');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = colors[node.type] || '#38bdf8';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
