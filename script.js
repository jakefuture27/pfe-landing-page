// Profit For Everyone ($PFE) - High-End Minimal Experience with Raining Money

document.addEventListener('DOMContentLoaded', () => {
  initAudioSynth();
  init3DTilt();
  initRainingMoneyCanvas();
});

// 1. Web Audio API Chime Engine
let audioCtx = null;
let soundEnabled = true;

function initAudioSynth() {
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  window.playChaChing = function() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const freqs = [1046.5, 1567.98, 2093.0]; // C6, G6, C7
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.18 / (i + 1), now + i * 0.05 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.5);
      });
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  };

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundIconOn && soundIconOff) {
        if (soundEnabled) {
          soundIconOn.classList.remove('hidden');
          soundIconOff.classList.add('hidden');
          window.playChaChing();
        } else {
          soundIconOn.classList.add('hidden');
          soundIconOff.classList.remove('hidden');
        }
      }
    });
  }

  const twitterBtns = document.querySelectorAll('.sound-click');
  twitterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.playChaChing();
    });
  });
}

// 2. 3D Interactive Tilt & Glare
function init3DTilt() {
  const container = document.getElementById('tilt-container');
  const card = document.getElementById('tilt-card');
  const glare = document.getElementById('tilt-glare');

  if (!container || !card || !glare) return;

  const maxTilt = 10;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 2 - 1;
    const yPercent = (y / rect.height) * 2 - 1;

    const rotateX = -yPercent * maxTilt;
    const rotateY = xPercent * maxTilt;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    glare.style.opacity = '0.55';
    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 75%)`;
  });

  container.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    glare.style.opacity = '0';
  });
}

// 3. Raining Money Background Canvas (Profit For Everyone)
function initRainingMoneyCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mouseX = width / 2;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
  });

  const moneyItems = [];
  const totalItems = 45; // Clean, elegant density

  function createMoney(randomY = false) {
    const isBill = Math.random() > 0.32; // 68% bills, 32% gold coins
    const depth = Math.random(); // 0 (far) to 1 (near)
    const scale = 0.55 + depth * 0.55;

    return {
      type: isBill ? 'bill' : 'coin',
      baseX: Math.random() * width,
      x: 0,
      y: randomY ? Math.random() * (height + 100) - 50 : -60,
      width: isBill ? 52 * scale : 26 * scale,
      height: isBill ? 27 * scale : 26 * scale,
      speedY: 1.1 + depth * 1.6,
      swayTime: Math.random() * 100,
      swaySpeed: 0.02 + Math.random() * 0.015,
      swayDist: 20 + depth * 35,
      angle: (Math.random() - 0.5) * 0.8,
      spinSpeed: (Math.random() - 0.5) * 0.02,
      flipAngle: Math.random() * Math.PI * 2,
      flipSpeed: 0.025 + Math.random() * 0.035,
      opacity: 0.18 + depth * 0.55,
      depth: depth,
      text: Math.random() > 0.4 ? '$PFE' : '$100'
    };
  }

  for (let i = 0; i < totalItems; i++) {
    moneyItems.push(createMoney(true));
  }

  function roundRect(context, x, y, w, h, r) {
    if (context.roundRect) {
      context.roundRect(x, y, w, h, r);
    } else {
      context.beginPath();
      context.moveTo(x + r, y);
      context.lineTo(x + w - r, y);
      context.quadraticCurveTo(x + w, y, x + w, y + r);
      context.lineTo(x + w, y + h - r);
      context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      context.lineTo(x + r, y + h);
      context.quadraticCurveTo(x, y + h, x, y + h - r);
      context.lineTo(x, y + r);
      context.quadraticCurveTo(x, y, x + r, y);
      context.closePath();
    }
  }

  function drawBill(item) {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.angle);

    // 3D vertical fluttering flip
    const flipScale = Math.cos(item.flipAngle);
    ctx.scale(1, Math.abs(flipScale) < 0.12 ? 0.12 : flipScale);

    ctx.globalAlpha = item.opacity;

    const w = item.width;
    const h = item.height;

    // Banknote background
    ctx.beginPath();
    roundRect(ctx, -w / 2, -h / 2, w, h, 4);
    ctx.fillStyle = 'rgba(7, 26, 14, 0.88)';
    ctx.fill();

    // Outer neon green border
    ctx.strokeStyle = 'rgba(0, 200, 5, 0.75)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Inner subtle border
    ctx.beginPath();
    roundRect(ctx, -w / 2 + 3, -h / 2 + 3, w - 6, h - 6, 2);
    ctx.strokeStyle = 'rgba(0, 200, 5, 0.3)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Denomination text ($PFE or $100)
    ctx.fillStyle = '#00e806';
    ctx.font = `bold ${Math.round(h * 0.42)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 200, 5, 0.7)';
    ctx.shadowBlur = 8;
    ctx.fillText(item.text, 0, 1);

    ctx.restore();
  }

  function drawCoin(item) {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.angle);

    // 3D horizontal spinning flip
    const spinScale = Math.cos(item.flipAngle);
    ctx.scale(Math.abs(spinScale) < 0.12 ? 0.12 : spinScale, 1);

    ctx.globalAlpha = item.opacity;
    const r = item.width / 2;

    // Gold coin body
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(218, 165, 32, 0.9)';
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Inner rim
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 235, 120, 0.6)';
    ctx.lineWidth = 0.9;
    ctx.stroke();

    // "$" sign
    ctx.fillStyle = '#1c1500';
    ctx.font = `900 ${Math.round(r * 0.9)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 1);

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < moneyItems.length; i++) {
      const item = moneyItems[i];

      item.swayTime += item.swaySpeed;
      item.y += item.speedY;
      item.x = item.baseX + Math.sin(item.swayTime) * item.swayDist;
      item.angle += item.spinSpeed;
      item.flipAngle += item.flipSpeed;

      // Subtle breeze from mouse
      const dx = item.x - mouseX;
      if (Math.abs(dx) < 140) {
        item.baseX += (dx > 0 ? 0.6 : -0.6);
      }

      if (item.type === 'bill') {
        drawBill(item);
      } else {
        drawCoin(item);
      }

      // Reset when falling past screen bottom
      if (item.y > height + 60) {
        Object.assign(item, createMoney(false));
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}
