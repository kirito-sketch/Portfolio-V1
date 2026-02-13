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

      // Don't hide nav while mobile menu is open
      if (document.body.classList.contains('menu-open')) {
        siteNav.classList.remove('site-nav--hidden');
        lastScrollY = currentScrollY;
        ticking = false;
        return;
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
        closeMenu();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  /* ========================================================================
     Mobile Hamburger Menu
     ======================================================================== */

  const burger = document.querySelector('.site-nav__burger');
  const navMenu = document.querySelector('.site-nav__menu');
  const backdrop = document.querySelector('.site-nav__backdrop');

  function openMenu() {
    burger.classList.add('site-nav__burger--open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    navMenu.classList.add('site-nav__menu--open');
    backdrop.classList.add('site-nav__backdrop--visible');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    burger.classList.remove('site-nav__burger--open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    navMenu.classList.remove('site-nav__menu--open');
    backdrop.classList.remove('site-nav__backdrop--visible');
    document.body.classList.remove('menu-open');
  }

  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.contains('site-nav__burger--open');
      isOpen ? closeMenu() : openMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  // Escape key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
      burger.focus();
    }
  });

  // Close menu if window resizes past mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });


  /* ========================================================================
     Theme Toggle
     ======================================================================== */

  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      if (toggle.classList.contains('theme-toggle--flipping')) return;

      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';

      if (typeof gsap !== 'undefined') {
        toggle.classList.add('theme-toggle--flipping');
        gsap.to(toggle, {
          rotateY: 90,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            gsap.to(toggle, {
              rotateY: 0,
              duration: 0.2,
              ease: 'power2.out',
              onComplete: () => {
                toggle.classList.remove('theme-toggle--flipping');
              }
            });
          }
        });
      } else {
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      }
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

    const interactives = document.querySelectorAll('a, button, .theme-toggle');

    let mouseX = 0, mouseY = 0;
    let magnetX = 0, magnetY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Magnetic pull toward nearby interactive elements
      magnetX = mouseX;
      magnetY = mouseY;
      let closest = 80;
      interactives.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elCX = rect.left + rect.width / 2;
        const elCY = rect.top + rect.height / 2;
        const dist = Math.hypot(mouseX - elCX, mouseY - elCY);
        if (dist < closest) {
          const strength = 1 - dist / 80;
          magnetX = mouseX + (elCX - mouseX) * strength * 0.4;
          magnetY = mouseY + (elCY - mouseY) * strength * 0.4;
          closest = dist;
        }
      });

      dot.style.left = magnetX + 'px';
      dot.style.top = magnetY + 'px';
    });

    function animateRing() {
      ringX += (magnetX - ringX) * 0.15;
      ringY += (magnetY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
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
     Back to Top (case study page)
     ======================================================================== */

  const backToTopBtn = document.querySelector('.cs-footer__top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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


  /* ========================================================================
     Active Section Nav Indicator
     ======================================================================== */

  const workSection = document.getElementById('work');
  const aboutSection = document.getElementById('about');

  if (workSection && aboutSection && navLinks.length) {
    const sectionMap = {};
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#work') sectionMap['work'] = link;
      if (href === '#about') sectionMap['about'] = link;
    });

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('site-nav__link--active'));
          const id = entry.target.id;
          if (sectionMap[id]) sectionMap[id].classList.add('site-nav__link--active');
        }
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });

    sectionObserver.observe(workSection);
    sectionObserver.observe(aboutSection);
  }


  /* ========================================================================
     Retro Grid Speed-Up on Footer Scroll
     ======================================================================== */

  const siteFooter = document.querySelector('.site-footer');
  const gridLines = document.querySelector('.retro-grid__lines');

  if (siteFooter && gridLines) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        gridLines.classList.toggle('retro-grid__lines--fast', entry.isIntersecting);
      });
    }, { threshold: 0.1 });

    footerObserver.observe(siteFooter);
  }
});
