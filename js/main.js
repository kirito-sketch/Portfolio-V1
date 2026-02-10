/* ==========================================================================
   main.js — DOM interactions, nav, cursor, loading
   ========================================================================== */


/* ==========================================================================
   Loading Screen & Hero Reveal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.loader');
  const heroElements = document.querySelectorAll('.hero [data-animate]');

  // After a brief loading animation, hide loader and reveal hero
  setTimeout(() => {
    loader.classList.add('loaded');

    // Stagger reveal hero elements based on their data-delay attribute
    heroElements.forEach((el) => {
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('revealed');
      }, 300 + delay * 1000); // 300ms base delay after loader starts leaving
    });
  }, 1800); // Loader shows for 1.8 seconds

  // Remove loader from DOM after transition completes
  loader.addEventListener('transitionend', () => {
    loader.style.display = 'none';
  });


  /* ========================================================================
     Floating Nav — Scroll Tracking & Smooth Scroll
     ======================================================================== */

  const floatingNav = document.querySelector('.floating-nav');
  const navDots = document.querySelectorAll('.nav-dot');
  const sections = document.querySelectorAll('section[id]');

  // Show / hide nav based on hero section visibility
  const heroSection = document.getElementById('hero');

  if (floatingNav && heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          floatingNav.classList.remove('visible');
        } else {
          floatingNav.classList.add('visible');
        }
      });
    }, { threshold: 0.5 });

    heroObserver.observe(heroSection);
  }

  // Track active section and update nav dots
  if (sections.length && navDots.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navDots.forEach(dot => {
            dot.classList.toggle('active', dot.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Smooth scroll on dot click
  navDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(dot.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
