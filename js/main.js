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
});
