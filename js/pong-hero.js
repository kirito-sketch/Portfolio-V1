/* ==========================================================================
   pong-hero.js — Pong breakout game with pixel text for hero section
   Adapted from animated-hero-section by uniquesonu (21st.dev)
   ========================================================================== */

(function () {
  'use strict';

  const LETTER_SPACING = 1;
  const WORD_SPACING = 3;

  const PIXEL_MAP = {
    A: [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
    B: [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,0,1],[1,1,1,0]],
    C: [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
    D: [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,0]],
    E: [[1,1,1,1],[1,0,0,0],[1,1,1,1],[1,0,0,0],[1,1,1,1]],
    F: [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0]],
    G: [[1,1,1,1,1],[1,0,0,0,0],[1,0,1,1,1],[1,0,0,0,1],[1,1,1,1,1]],
    H: [[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
    I: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
    J: [[0,0,0,1],[0,0,0,1],[0,0,0,1],[1,0,0,1],[1,1,1,1]],
    K: [[1,0,0,1],[1,0,1,0],[1,1,0,0],[1,0,1,0],[1,0,0,1]],
    L: [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
    M: [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],
    N: [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1]],
    O: [[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]],
    P: [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,0,0],[1,0,0,0]],
    Q: [[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,1,1],[1,1,1,1]],
    R: [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,1,0],[1,0,0,1]],
    S: [[1,1,1,1],[1,0,0,0],[1,1,1,1],[0,0,0,1],[1,1,1,1]],
    T: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
    U: [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]],
    V: [[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,1,0,1,0],[0,0,1,0,0]],
    W: [[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,0,0,1]],
    X: [[1,0,0,1],[0,1,1,0],[0,1,1,0],[0,1,1,0],[1,0,0,1]],
    Y: [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
    Z: [[1,1,1,1],[0,0,1,0],[0,1,0,0],[1,0,0,0],[1,1,1,1]],
  };

  function getThemeColors() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      background: isDark ? '#0a0a0a' : '#FAF7F2',
      color:      isDark ? '#FFFFFF' : '#1C1917',
      hitColor:   isDark ? '#1a1a1a' : '#E8E3DB',
      ballColor:  '#c9834e',
      paddleColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    };
  }

  function calculateLineWidth(text, pixelSize) {
    var totalWidth = 0;
    var words = text.split(' ');
    words.forEach(function (word, wordIdx) {
      if (wordIdx > 0) totalWidth += WORD_SPACING * pixelSize;
      word.split('').forEach(function (letter) {
        var map = PIXEL_MAP[letter];
        if (!map) return;
        totalWidth += map[0].length * pixelSize + LETTER_SPACING * pixelSize;
      });
      totalWidth -= LETTER_SPACING * pixelSize; // remove trailing letter spacing
    });
    return totalWidth;
  }

  function renderLine(text, pixelSize, startX, startY, pixels) {
    var x = startX;
    text.split(' ').forEach(function (word, wordIdx) {
      if (wordIdx > 0) x += WORD_SPACING * pixelSize;
      word.split('').forEach(function (letter) {
        var map = PIXEL_MAP[letter];
        if (!map) return;
        for (var i = 0; i < map.length; i++) {
          for (var j = 0; j < map[i].length; j++) {
            if (map[i][j]) {
              pixels.push({
                x: x + j * pixelSize,
                y: startY + i * pixelSize,
                size: pixelSize,
                hit: false
              });
            }
          }
        }
        x += (map[0].length + LETTER_SPACING) * pixelSize;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.querySelector('.hero__canvas');
    var heroSection = document.getElementById('hero');
    if (!canvas || !heroSection) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var pixels = [];
    var ball = { x: 0, y: 0, dx: 0, dy: 0, radius: 0 };
    var paddles = [];
    var scale = 1;
    var isVisible = true;
    var animFrameId;
    var resetting = false;
    var particles = [];
    var trail = [];
    var TRAIL_LENGTH = 8;

    function resizeCanvas() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
      scale = Math.min(canvas.width / 1000, canvas.height / 1000);
      initializeGame();
    }

    function initializeGame() {
      var LARGE_PIXEL_SIZE = 8 * scale;
      var SMALL_PIXEL_SIZE = 4 * scale;
      var BALL_SPEED = 5 * scale;

      pixels = [];
      particles = [];
      trail = [];
      resetting = false;

      var line1 = 'ARUN PERI';
      var line2 = 'SR DESIGNER';

      var widthLarge = calculateLineWidth(line1, LARGE_PIXEL_SIZE);
      var widthSmall = calculateLineWidth(line2, SMALL_PIXEL_SIZE);
      var maxWidth = Math.max(widthLarge, widthSmall);
      var fillRatio = canvas.width < 768 ? 0.92 : 0.75;
      var scaleFactor = (canvas.width * fillRatio) / maxWidth;

      var adjLarge = LARGE_PIXEL_SIZE * scaleFactor;
      var adjSmall = SMALL_PIXEL_SIZE * scaleFactor;

      var line1Height = 5 * adjLarge;
      var line2Height = 5 * adjSmall;
      var gap = 4 * adjLarge;
      var totalHeight = line1Height + gap + line2Height;

      var startY = (canvas.height - totalHeight) / 2;

      // Render line 1
      var w1 = calculateLineWidth(line1, adjLarge);
      var startX1 = (canvas.width - w1) / 2;
      renderLine(line1, adjLarge, startX1, startY, pixels);

      // Render line 2
      var y2 = startY + line1Height + gap;
      var w2 = calculateLineWidth(line2, adjSmall);
      var startX2 = (canvas.width - w2) / 2;
      renderLine(line2, adjSmall, startX2, y2, pixels);

      // Ball
      ball = {
        x: canvas.width * 0.85,
        y: canvas.height * 0.15,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: adjLarge / 2,
      };

      // Paddles (4 edges)
      var pw = adjLarge;
      var pl = 10 * adjLarge;

      paddles = [
        { x: 0, y: canvas.height / 2 - pl / 2, width: pw, height: pl, targetPos: canvas.height / 2 - pl / 2, isVertical: true },
        { x: canvas.width - pw, y: canvas.height / 2 - pl / 2, width: pw, height: pl, targetPos: canvas.height / 2 - pl / 2, isVertical: true },
        { x: canvas.width / 2 - pl / 2, y: 0, width: pl, height: pw, targetPos: canvas.width / 2 - pl / 2, isVertical: false },
        { x: canvas.width / 2 - pl / 2, y: canvas.height - pw, width: pl, height: pw, targetPos: canvas.width / 2 - pl / 2, isVertical: false },
      ];
    }

    function updateGame() {
      // Trail: record position before movement
      trail.push({ x: ball.x, y: ball.y });
      if (trail.length > TRAIL_LENGTH) trail.shift();

      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall bounces
      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) ball.dy = -ball.dy;
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.dx = -ball.dx;

      // Paddle collisions
      paddles.forEach(function (p) {
        if (p.isVertical) {
          if (ball.x - ball.radius < p.x + p.width && ball.x + ball.radius > p.x &&
              ball.y > p.y && ball.y < p.y + p.height) {
            ball.dx = -ball.dx;
          }
        } else {
          if (ball.y - ball.radius < p.y + p.height && ball.y + ball.radius > p.y &&
              ball.x > p.x && ball.x < p.x + p.width) {
            ball.dy = -ball.dy;
          }
        }
      });

      // Paddle AI tracking
      paddles.forEach(function (p) {
        if (p.isVertical) {
          p.targetPos = ball.y - p.height / 2;
          p.targetPos = Math.max(0, Math.min(canvas.height - p.height, p.targetPos));
          p.y += (p.targetPos - p.y) * 0.08;
        } else {
          p.targetPos = ball.x - p.width / 2;
          p.targetPos = Math.max(0, Math.min(canvas.width - p.width, p.targetPos));
          p.x += (p.targetPos - p.x) * 0.08;
        }
      });

      // Pixel collisions
      pixels.forEach(function (pixel) {
        if (!pixel.hit &&
            ball.x + ball.radius > pixel.x &&
            ball.x - ball.radius < pixel.x + pixel.size &&
            ball.y + ball.radius > pixel.y &&
            ball.y - ball.radius < pixel.y + pixel.size) {
          pixel.hit = true;
          // Spawn particles at impact
          var px = pixel.x + pixel.size / 2;
          var py = pixel.y + pixel.size / 2;
          var count = 3 + Math.floor(Math.random() * 3); // 3-5
          for (var p = 0; p < count; p++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 1 + Math.random() * 3;
            particles.push({
              x: px, y: py,
              vx: Math.cos(angle) * speed * scale,
              vy: Math.sin(angle) * speed * scale,
              alpha: 1,
              radius: (1.5 + Math.random() * 2) * scale
            });
          }
          var cx = pixel.x + pixel.size / 2;
          var cy = pixel.y + pixel.size / 2;
          if (Math.abs(ball.x - cx) > Math.abs(ball.y - cy)) {
            ball.dx = -ball.dx;
          } else {
            ball.dy = -ball.dy;
          }
        }
      });

      // Update particles
      for (var i = particles.length - 1; i >= 0; i--) {
        var pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.02;
        if (pt.alpha <= 0) particles.splice(i, 1);
      }

      // Reset pixels after all are hit
      var allHit = pixels.length > 0 && pixels.every(function (p) { return p.hit; });
      if (allHit && !resetting) {
        resetting = true;
        setTimeout(function () {
          pixels.forEach(function (p) { p.hit = false; });
          resetting = false;
        }, 3000);
      }
    }

    function drawGame() {
      var colors = getThemeColors();

      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pixels
      pixels.forEach(function (pixel) {
        ctx.fillStyle = pixel.hit ? colors.hitColor : colors.color;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
      });

      // Ball trail
      trail.forEach(function (pos, idx) {
        var progress = (idx + 1) / trail.length;
        ctx.globalAlpha = progress * 0.3;
        ctx.fillStyle = colors.ballColor;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, ball.radius * progress * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Ball
      ctx.fillStyle = colors.ballColor;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      // Paddles
      ctx.fillStyle = colors.paddleColor;
      paddles.forEach(function (p) {
        ctx.fillRect(p.x, p.y, p.width, p.height);
      });

      // Particles
      particles.forEach(function (pt) {
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = colors.ballColor;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function gameLoop() {
      if (isVisible) {
        updateGame();
        drawGame();
      }
      animFrameId = requestAnimationFrame(gameLoop);
    }

    // Visibility optimization
    var observer = new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(heroSection);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    gameLoop();
  });
})();
