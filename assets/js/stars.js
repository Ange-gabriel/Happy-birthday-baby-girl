/* ==========================================================================
   THE GABRIEL'S DIARIES — stars.js
   Champ d'étoiles discret, avec étoiles filantes occasionnelles.
   ========================================================================== */

(function(){
  const canvas = document.getElementById('stars-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, stars = [], shooting = null;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.max(40, Math.floor((w * h) / 9000));
    stars = [];
    for(let i = 0; i < count; i++){
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + .2,
        phase: Math.random() * Math.PI * 2,
        speed: .0015 + Math.random() * .003
      });
    }
  }
  window.addEventListener('resize', resize);
  resize();

  function maybeSpawnShooting(){
    if(!shooting && !reduceMotion && Math.random() < .0022){
      shooting = {
        x: Math.random() * w * .6,
        y: Math.random() * h * .25,
        vx: 6 + Math.random() * 4,
        vy: 3 + Math.random() * 2,
        life: 1
      };
    }
  }

  function tick(t){
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      const twinkle = reduceMotion ? .7 : (.5 + .5 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(236,220,184,${(.15 + .55 * twinkle).toFixed(3)})`;
      ctx.fill();
    });

    maybeSpawnShooting();
    if(shooting){
      ctx.strokeStyle = `rgba(243,201,105,${shooting.life.toFixed(3)})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(shooting.x, shooting.y);
      ctx.lineTo(shooting.x - shooting.vx * 8, shooting.y - shooting.vy * 8);
      ctx.stroke();
      shooting.x += shooting.vx;
      shooting.y += shooting.vy;
      shooting.life -= .018;
      if(shooting.life <= 0 || shooting.x > w || shooting.y > h) shooting = null;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();