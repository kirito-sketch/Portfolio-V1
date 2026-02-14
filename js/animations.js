/* ==========================================================================
   animations.js — GSAP/ScrollTrigger setup and scroll animations
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================================
     1. Scroll-Triggered Fade-Up Animations
     For all [data-animate] elements NOT inside .hero or .cs-hero
     ======================================================================== */

  const animateElements = document.querySelectorAll('[data-animate]:not(.hero [data-animate]):not(.cs-hero [data-animate])');

  animateElements.forEach(el => {
    const animationType = el.getAttribute('data-animate');
    const delay = parseFloat(el.dataset.delay || 0);

    let fromProps = { opacity: 0 };
    let toProps = { opacity: 1, duration: 0.8, ease: 'power2.out' };

    switch (animationType) {
      case 'fade-up':
        fromProps.y = 40;
        toProps.y = 0;
        break;

      case 'fade-left':
        fromProps.x = 60;
        toProps.x = 0;
        break;

      case 'fade-right':
        fromProps.x = -60;
        toProps.x = 0;
        break;

      case 'scale-in':
        fromProps.scale = 1.1;
        toProps.scale = 1;
        break;

      default:
        fromProps.y = 40;
        toProps.y = 0;
        break;
    }

    toProps.delay = delay;
    toProps.scrollTrigger = {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
    };

    gsap.fromTo(el, fromProps, toProps);
  });


  /* ========================================================================
     2. CS Hero — Reveal animation + ContainerScroll 3D effect
     ======================================================================== */

  const csHero = document.querySelector('.cs-hero');
  if (csHero) {
    // Reveal hero elements with staggered delay
    const csHeroElements = csHero.querySelectorAll('[data-animate]');
    csHeroElements.forEach((el) => {
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('revealed');
      }, 300 + delay * 1000);
    });

    // ContainerScroll — 3D perspective tilt that flattens on scroll
    const phoneWrapper = csHero.querySelector('.cs-hero__phone-wrapper');
    const phone = csHero.querySelector('.cs-hero__phone');
    const heroContent = csHero.querySelector('.cs-hero__content');

    if (phone && phoneWrapper) {
      // Reveal phone after hero text (delayed entrance)
      gsap.to(phone, {
        opacity: 1,
        duration: 0.8,
        delay: 0.7,
        ease: 'power2.out',
      });

      // Scroll-linked: flatten the 3D tilt as user scrolls
      gsap.to(phone, {
        rotateX: 0,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: csHero,
          start: 'top top',
          end: '80% top',
          scrub: 0.5,
        }
      });

      // Float the title up as user scrolls
      if (heroContent) {
        gsap.to(heroContent, {
          y: -80,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: csHero,
            start: '20% top',
            end: '60% top',
            scrub: 0.5,
          }
        });
      }

      // Mouse parallax on phone wrapper (desktop only)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (!isTouchDevice && phoneWrapper) {
        const rotateYTo = gsap.quickTo(phoneWrapper, 'rotateY', { duration: 0.4, ease: 'power2.out' });
        const rotateXTo = gsap.quickTo(phoneWrapper, 'rotateX', { duration: 0.4, ease: 'power2.out' });

        csHero.addEventListener('mousemove', (e) => {
          const rect = csHero.getBoundingClientRect();
          const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;  // -1 to 1
          const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          rotateYTo(nx * 5);
          rotateXTo(-ny * 3);
        });

        csHero.addEventListener('mouseleave', () => {
          rotateYTo(0);
          rotateXTo(0);
        });
      }
    }
  }


  /* ========================================================================
     2b. Case Study Showcase Phones
     ======================================================================== */

  const showcaseFullPhones = document.querySelectorAll('.cs-showcase-full__phone');
  showcaseFullPhones.forEach((phone) => {
    gsap.fromTo(phone,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: phone,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });


  /* ========================================================================
     3. Number Counter Animation
     For elements with [data-target] attribute (big metric numbers)
     ======================================================================== */

  document.querySelectorAll('[data-target]').forEach(counter => {
    const target = parseFloat(counter.dataset.target);
    const isDecimal = target % 1 !== 0;

    gsap.fromTo(counter,
      { innerText: 0 },
      {
        innerText: target,
        duration: 2,
        ease: 'power1.out',
        snap: { innerText: isDecimal ? 0.1 : 1 },
        scrollTrigger: {
          trigger: counter,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        onUpdate: function() {
          if (isDecimal) {
            counter.textContent = parseFloat(counter.textContent).toFixed(1);
          }
        }
      }
    );
  });


  /* ========================================================================
     4. Quote Block Animation
     Staggered timeline: quotation mark, text, source
     ======================================================================== */

  document.querySelectorAll('.cs-quote-block').forEach(quote => {
    const mark = quote.querySelector('.cs-quote-block__mark');
    const text = quote.querySelector('.cs-quote-block__text');
    const source = quote.querySelector('.cs-quote-block__source');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: quote,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    if (mark) {
      tl.fromTo(mark,
        { opacity: 0, scale: 0.5 },
        { opacity: 0.12, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }

    if (text) {
      tl.fromTo(text,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        mark ? '-=0.3' : 0
      );
    }

    if (source) {
      tl.fromTo(source,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.3'
      );
    }
  });


  /* ========================================================================
     4b. CS2 Pie Chart Draw-In Animation
     ======================================================================== */

  const pieChart = document.querySelector('.cs2-pie-chart');
  if (pieChart) {
    const pieDonut = pieChart.querySelector('.cs2-pie-chart__donut');

    // Container fade-in stays play-once
    gsap.fromTo(pieChart,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: pieChart,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );

    // Donut fill is now scrub-driven
    if (pieDonut) {
      const pieProxy = { angle: 0 };
      gsap.to(pieProxy, {
        angle: 223.2,
        ease: 'none',
        onUpdate() {
          pieDonut.style.setProperty('--pie-angle', pieProxy.angle + 'deg');
        },
        scrollTrigger: {
          trigger: pieChart,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 0.5,
        }
      });
    }
  }


  /* ========================================================================
     4c. CS2 Staggered Group Reveals
     ======================================================================== */

  function staggerReveal(containerSelector, childSelector, staggerDelay) {
    document.querySelectorAll(containerSelector).forEach(container => {
      const children = container.querySelectorAll(childSelector);
      if (!children.length) return;

      gsap.fromTo(children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: staggerDelay,
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
  }

  staggerReveal('.cs2-methods', '.cs2-method', 0.15);
  staggerReveal('.cs2-findings__quotes', '.cs2-findings__quote', 0.12);
  staggerReveal('.cs2-findings__list', 'li', 0.1);
  staggerReveal('.cs2-pills', '.cs2-pill', 0.08);
  staggerReveal('.cs2-arch__flow', '.cs2-arch__node, .cs2-arch__connector', 0.15);
  staggerReveal('.cs2-principles', '.cs2-principle', 0.1);


  /* ========================================================================
     5. Reading Progress Bar (case study page)
     ======================================================================== */

  const progressBar = document.querySelector('.cs-progress__bar');
  const progressContainer = document.querySelector('.cs-progress');
  if (progressBar) {
    let progressTicking = false;
    window.addEventListener('scroll', () => {
      if (!progressTicking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.round((scrollTop / docHeight) * 100);
          progressBar.style.width = progress + '%';
          if (progressContainer) {
            progressContainer.setAttribute('aria-valuenow', progress);
          }
          progressTicking = false;
        });
        progressTicking = true;
      }
    });
  }


  /* ========================================================================
     6. Refresh ScrollTrigger after all images load
     ======================================================================== */

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();

    // Safety fallback: if any elements are still invisible after 4s, force-reveal them.
    // This handles edge cases where ScrollTrigger doesn't fire on mobile
    // (lazy loading delays, layout shifts, or viewport timing).
    setTimeout(() => {
      document.querySelectorAll('.cs-showcase-full__phone, .cs-quote-block__mark, .cs-quote-block__text, .cs-quote-block__source, .cs2-pie-chart, .cs2-method, .cs2-findings__quote, .cs2-findings__list li, .cs2-pill, .cs2-arch__node, .cs2-arch__connector, .cs2-principle').forEach(el => {
        if (getComputedStyle(el).opacity === '0') {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
      // Note: pie chart donut is scrub-driven, so no fallback needed —
      // it fills as the user scrolls through the section.
    }, 4000);
  });

});
