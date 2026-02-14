/* ==========================================================================
   easter-eggs.js — Hidden interactions & surprises
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {


  /* ========================================================================
     1. Konami Code — up up down down left right left right B A
     ======================================================================== */

  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIndex = 0;
  let konamiTriggered = false;

  document.addEventListener('keydown', (e) => {
    if (konamiTriggered) return;

    const expected = KONAMI[konamiIndex];
    if (e.key === expected || e.key.toLowerCase() === expected) {
      konamiIndex++;
      if (konamiIndex === KONAMI.length) {
        konamiTriggered = true;
        triggerKonami();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function triggerKonami() {
    // Flash overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;background:#c9834e;opacity:0;transition:opacity 0.15s;';
    document.body.appendChild(overlay);

    // Message
    const msg = document.createElement('div');
    msg.textContent = '\u2191\u2191\u2193\u2193\u2190\u2192\u2190\u2192 B A — You found the secret level!';
    msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:100000;' +
      'font-family:monospace;font-size:clamp(1rem,3vw,1.5rem);color:#fff;text-align:center;' +
      'padding:1.5rem 2.5rem;background:rgba(0,0,0,0.85);border:2px solid #c9834e;border-radius:8px;' +
      'opacity:0;transition:opacity 0.3s;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(msg);

    // Animate: flash then show message
    requestAnimationFrame(() => {
      overlay.style.opacity = '0.3';
      setTimeout(() => {
        overlay.style.opacity = '0';
        msg.style.opacity = '1';
        setTimeout(() => {
          msg.style.opacity = '0';
          setTimeout(() => {
            overlay.remove();
            msg.remove();
            // Allow re-triggering after cooldown
            setTimeout(() => {
              konamiTriggered = false;
              konamiIndex = 0;
            }, 2000);
          }, 400);
        }, 2500);
      }, 200);
    });
  }


  /* ========================================================================
     2. Pong Hard Mode — Click the canvas to toggle
     ======================================================================== */

  const heroCanvas = document.querySelector('.hero__canvas');
  let clickCount = 0;
  let clickTimer = null;

  if (heroCanvas) {
    heroCanvas.style.cursor = 'pointer';

    // Show subtle tooltip after hovering for 5s
    let hoverTimer = null;
    heroCanvas.addEventListener('mouseenter', () => {
      hoverTimer = setTimeout(() => {
        heroCanvas.title = 'Try triple-clicking\u2026';
      }, 5000);
    });
    heroCanvas.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      heroCanvas.removeAttribute('title');
    });

    heroCanvas.addEventListener('click', () => {
      clickCount++;

      // Require a triple-click to toggle (avoids accidental activation)
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 500);

      if (clickCount >= 3) {
        clickCount = 0;
        toggleHardMode();
      }
    });
  }

  function toggleHardMode() {
    const isHard = document.body.classList.toggle('pong-hard-mode');

    // Reinit pong with new speed/paddle size
    if (typeof window.pongReinit === 'function') window.pongReinit();

    showToast(isHard ? 'HARD MODE \u2014 ON' : 'HARD MODE \u2014 OFF');
  }

  // Expose hard mode state for pong-hero.js to read
  window.isPongHardMode = () => document.body.classList.contains('pong-hard-mode');


  /* ========================================================================
     3. Drag-to-reveal on Coming Soon cards
     ======================================================================== */

  const soonCards = document.querySelectorAll('.work-card--soon');

  soonCards.forEach(card => {
    const image = card.querySelector('.work-card__image--soon');
    if (!image) return;

    // Create hidden message layer
    const reveal = document.createElement('div');
    reveal.className = 'work-card__reveal';
    reveal.innerHTML = '<span class="work-card__reveal-text">Still cooking\u2026 \u{1F373}</span>';
    image.style.position = 'relative';
    image.insertBefore(reveal, image.firstChild);

    // Reference to clock icon so we can hide it
    const clockIcon = card.querySelector('.work-card__soon-icon');

    // Create scratch overlay (covers the striped pattern)
    const scratch = document.createElement('canvas');
    scratch.className = 'work-card__scratch';
    scratch.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;cursor:crosshair;touch-action:none;';
    image.appendChild(scratch);

    let isScratching = false;
    let scratchCtx = null;
    let initialized = false;

    function initScratch() {
      if (initialized) return;
      initialized = true;
      const rect = image.getBoundingClientRect();
      scratch.width = rect.width;
      scratch.height = rect.height;
      scratchCtx = scratch.getContext('2d');

      // Fill with the card's stripe color so it looks like the original
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      scratchCtx.fillStyle = isDark ? '#141414' : '#F0EBE3';
      scratchCtx.fillRect(0, 0, scratch.width, scratch.height);

      // Draw stripes to match CSS
      scratchCtx.strokeStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
      scratchCtx.lineWidth = 1;
      for (let i = -scratch.height; i < scratch.width + scratch.height; i += 20) {
        scratchCtx.beginPath();
        scratchCtx.moveTo(i, 0);
        scratchCtx.lineTo(i + scratch.height, scratch.height);
        scratchCtx.stroke();
      }
    }

    function scratchAt(x, y) {
      if (!scratchCtx) return;
      scratchCtx.globalCompositeOperation = 'destination-out';
      scratchCtx.beginPath();
      scratchCtx.arc(x, y, 25, 0, Math.PI * 2);
      scratchCtx.fill();
    }

    function getPos(e) {
      const rect = scratch.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (scratch.width / rect.width),
        y: (clientY - rect.top) * (scratch.height / rect.height)
      };
    }

    function startScratch(e) {
      initScratch();
      isScratching = true;
      reveal.classList.add('work-card__reveal--visible');
      if (clockIcon) clockIcon.style.display = 'none';
      const p = getPos(e);
      scratchAt(p.x, p.y);
    }

    scratch.addEventListener('mousedown', startScratch);
    scratch.addEventListener('mousemove', (e) => { if (isScratching) { const p = getPos(e); scratchAt(p.x, p.y); } });
    scratch.addEventListener('mouseup', () => { isScratching = false; });
    scratch.addEventListener('mouseleave', () => { isScratching = false; });

    scratch.addEventListener('touchstart', startScratch, { passive: true });
    scratch.addEventListener('touchmove', (e) => { if (isScratching) { const p = getPos(e); scratchAt(p.x, p.y); } }, { passive: true });
    scratch.addEventListener('touchend', () => { isScratching = false; });
  });


  /* ========================================================================
     4. Console.log Portfolio
     ======================================================================== */

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const bg = isDark ? '#0a0a0a' : '#FAF7F2';
  const fg = isDark ? '#FFFFFF' : '#1C1917';

  console.log(
    '%c\n' +
    '    █████╗ ██████╗ \n' +
    '   ██╔══██╗██╔══██╗\n' +
    '   ███████║██████╔╝\n' +
    '   ██╔══██║██╔═══╝ \n' +
    '   ██║  ██║██║     \n' +
    '   ╚═╝  ╚═╝╚═╝     \n',
    'color: #c9834e; font-size: 12px; font-family: monospace;'
  );

  console.log(
    '%cCurious enough to check the console? We should talk.',
    'color: ' + fg + '; background: ' + bg + '; font-size: 14px; padding: 8px 12px; border-left: 3px solid #c9834e; font-family: Inter, sans-serif;'
  );

  console.log(
    '%carunperi.design@gmail.com',
    'color: #c9834e; font-size: 13px; padding: 4px 12px; font-family: Inter, sans-serif;'
  );

  console.log(
    '%cP.S. There are more secrets on this page. Try the classics.',
    'color: ' + fg + '; font-size: 11px; padding: 4px 12px; font-style: italic; opacity: 0.6; font-family: Inter, sans-serif;'
  );


  /* ========================================================================
     Shared: Toast notification
     ======================================================================== */

  function showToast(text) {
    const existing = document.querySelector('.easter-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'easter-toast';
    toast.textContent = text;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('easter-toast--visible');
      setTimeout(() => {
        toast.classList.remove('easter-toast--visible');
        setTimeout(() => toast.remove(), 400);
      }, 1800);
    });
  }

});
