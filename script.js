/* =============================================
   TIMEO MARKETING WEBSITE — SCRIPT.JS
   Smooth interactions & scroll animations
   ============================================= */

(function () {
  'use strict';

  // ─── NAVBAR: scroll state ───────────────────
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ─── MOBILE MENU ────────────────────────────
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('open', menuOpen);

      // Animate hamburger → X
      const spans = mobileMenuBtn.querySelectorAll('span');
      if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ─── SMOOTH SCROLL for anchor links ─────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── SCROLL REVEAL (IntersectionObserver) ───
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── HERO FADE-IN (stagger on load) ─────────
  // Already handled via CSS animation with nth-child delays.
  // Force a small delay so browser has painted.
  window.addEventListener('load', () => {
    document.querySelectorAll('.fade-in').forEach((el, i) => {
      el.style.animationDelay = `${0.05 + i * 0.1}s`;
    });
  });

  // ─── DASHBOARD MOCKUP: subtle parallax ───────
  const heroVisual = document.querySelector('.hero-visual');
  const dashboardMockup = document.querySelector('.dashboard-mockup');

  if (dashboardMockup) {
    let ticking = false;

    document.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          const dx = (e.clientX - cx) / cx;
          const dy = (e.clientY - cy) / cy;

          const rotateY = -4 + dx * 2;
          const rotateX = 2 - dy * 1.5;

          dashboardMockup.style.transform =
            `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;

          ticking = false;
        });
        ticking = true;
      }
    });

    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
      dashboardMockup.style.transform =
        'perspective(1200px) rotateY(-4deg) rotateX(2deg)';
    });
  }

  // ─── PRICING: highlight on hover ─────────────
  const pricingCards = document.querySelectorAll('.pricing-card:not(.pricing-featured)');

  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      pricingCards.forEach(c => {
        if (c !== card) c.style.opacity = '0.75';
      });
    });

    card.addEventListener('mouseleave', () => {
      pricingCards.forEach(c => c.style.opacity = '');
    });
  });

  // ─── ACTIVE NAV LINK on scroll ───────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(a => {
          a.style.color = '';
          a.style.fontWeight = '';
        });
        const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (activeLink) {
          activeLink.style.color = 'var(--gray-900)';
          activeLink.style.fontWeight = '600';
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ─── COUNTER ANIMATION for hero stats ────────
  function animateCounter(el, target, duration = 1400) {
    const isInfinity = el.textContent.trim() === '∞';
    if (isInfinity) return; // skip infinity symbol

    const start = 0;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + (target - start) * eased;

      el.textContent = isDecimal
        ? value.toFixed(1)
        : Math.floor(value) + (progress < 1 ? '' : '+');

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // Trigger counters when hero becomes visible
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statNumbers = heroStats.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(el => {
            const raw = el.textContent.trim();
            if (raw === '∞' || raw === '1') {
              // no animation needed
              if (raw === '1') {
                let count = 0;
                const interval = setInterval(() => {
                  count++;
                  if (count >= 1) {
                    el.textContent = '1';
                    clearInterval(interval);
                  }
                }, 50);
              }
            } else {
              const num = parseInt(raw.replace(/\D/g, ''), 10);
              if (!isNaN(num)) animateCounter(el, num);
            }
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(heroStats);
  }

  // ─── SCROLL PROGRESS indicator (subtle top bar) ──
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #0066FF, #00B4D8);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  // ─── FEATURE CARDS: ripple on click ──────────
  document.querySelectorAll('.feature-card, .industry-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 102, 255, 0.12);
        width: 10px;
        height: 10px;
        left: ${x - 5}px;
        top: ${y - 5}px;
        transform: scale(0);
        animation: ripple-expand 0.5s ease-out forwards;
        pointer-events: none;
      `;

      // Ensure card is positioned relatively
      if (getComputedStyle(card).position === 'static') {
        card.style.position = 'relative';
      }

      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-expand {
      to {
        transform: scale(40);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  console.log('%c timeo. ', 'background: #0066FF; color: white; font-size: 18px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
  console.log('%c One Platform. Every Business. ', 'color: #64748B; font-size: 12px;');

})();
