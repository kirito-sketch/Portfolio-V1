/* ==========================================================================
   animations.js — GSAP/ScrollTrigger setup and scroll animations
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================================
     1. Scroll-Triggered Fade-Up Animations
     For all [data-animate] elements NOT inside .hero
     ======================================================================== */

  const animateElements = document.querySelectorAll('[data-animate]:not(.hero [data-animate])');

  animateElements.forEach(el => {
    const animationType = el.getAttribute('data-animate');
    const delay = parseFloat(el.dataset.delay || 0);

    // Determine starting properties based on animation type
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
      start: 'top 85%',
      toggleActions: 'play none none none',
    };

    gsap.fromTo(el, fromProps, toProps);
  });


  /* ========================================================================
     2. Parallax on Case Study Hero Images
     ======================================================================== */

  document.querySelectorAll('.cs-hero img').forEach(img => {
    gsap.to(img, {
      y: '15%',
      ease: 'none',
      scrollTrigger: {
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });
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
     4. Staggered Reveals — Research Cards
     ======================================================================== */

  const researchCards = document.querySelectorAll('.research-card');
  if (researchCards.length) {
    gsap.fromTo(researchCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cs-research__cards',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }


  /* ========================================================================
     5. Staggered Reveals — Iteration Steps
     ======================================================================== */

  const iterationSteps = document.querySelectorAll('.iteration-step');
  if (iterationSteps.length) {
    gsap.fromTo(iterationSteps,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cs-iteration__sequence',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }


  /* ========================================================================
     6. Staggered Reveals — Final Mockups
     ======================================================================== */

  const finalMockups = document.querySelectorAll('.cs-finals__mockup');
  if (finalMockups.length) {
    gsap.fromTo(finalMockups,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cs-finals__gallery',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }


  /* ========================================================================
     7. Staggered Reveals — Impact Metrics
     ======================================================================== */

  const impactMetrics = document.querySelectorAll('.impact-metric');
  if (impactMetrics.length) {
    gsap.fromTo(impactMetrics,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cs-impact__metrics',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }


  /* ========================================================================
     8. Staggered Reveals — Project Cards
     ======================================================================== */

  const projectCards = document.querySelectorAll('.project-card');
  if (projectCards.length) {
    gsap.fromTo(projectCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects-overview__grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }


  /* ========================================================================
     9. Interstitial Quote Animation
     Subtle scale + fade for cinematic feel
     ======================================================================== */

  document.querySelectorAll('.interstitial__quote').forEach(quote => {
    gsap.fromTo(quote,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: quote,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  });


  /* ========================================================================
     10. Feedback Quote Animation
     Staggered timeline: quotation mark, text, source
     ======================================================================== */

  document.querySelectorAll('.feedback-quote').forEach(quote => {
    const mark = quote.querySelector('.feedback-quote__mark');
    const text = quote.querySelector('.feedback-quote__text');
    const source = quote.querySelector('.feedback-quote__source');

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
        { opacity: 0.2, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
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

});
