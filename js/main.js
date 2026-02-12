/* ==========================================================================
   main.js — DOM interactions, nav, cursor, loading, theme toggle
   ========================================================================== */


/* ==========================================================================
   Theme Toggle — Dark/Light mode
   ========================================================================== */

(function () {
  // Apply saved theme immediately (before DOMContentLoaded to prevent flash)
  var saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();


/* ==========================================================================
   Loading Screen & Hero Reveal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.loader');
  const heroElements = document.querySelectorAll('.hero [data-animate]');

  // After a brief loading animation, hide loader and reveal hero
  if (loader) {
    setTimeout(() => {
      loader.classList.add('loaded');

      heroElements.forEach((el) => {
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => {
          el.classList.add('revealed');
        }, 300 + delay * 1000);
      });
    }, 1000);

    loader.addEventListener('transitionend', () => {
      loader.style.display = 'none';
    });
  }


  /* ========================================================================
     Site Nav — Scroll direction detection, compact/expand
     ======================================================================== */

  const siteNav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.site-nav__link:not(.site-nav__link--cta)');

  if (siteNav) {
    let lastScrollY = 0;
    let ticking = false;

    function updateNav() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        siteNav.classList.add('site-nav--compact');
      } else {
        siteNav.classList.remove('site-nav--compact');
      }

      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        // Scrolling down — hide
        siteNav.classList.add('site-nav--hidden');
      } else {
        // Scrolling up — show
        siteNav.classList.remove('site-nav--hidden');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    });
  }

  // Smooth scroll on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  /* ========================================================================
     Theme Toggle
     ======================================================================== */

  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  });


  /* ========================================================================
     Custom Cursor (Desktop Only)
     ======================================================================== */

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    document.body.classList.add('has-custom-cursor');

    const cursor = document.querySelector('.cursor');
    const dot = document.querySelector('.cursor__dot');
    const ring = document.querySelector('.cursor__ring');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactives = document.querySelectorAll('a, button, .theme-toggle');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('cursor--click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('cursor--click'));

    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
  }


  /* ========================================================================
     Video Autoplay Management
     ======================================================================== */

  const videos = document.querySelectorAll('video[autoplay]');
  if (videos.length) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {});
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.3 });

    videos.forEach(video => {
      video.pause();
      videoObserver.observe(video);
    });
  }
});
