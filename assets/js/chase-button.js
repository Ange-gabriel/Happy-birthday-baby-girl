/* ==========================================================================
   THE GABRIEL'S DIARIES — chase-button.js
   Le bouton "Commencer" se fait vraiment traquer :
   - détection à grande distance (il réagit de loin)
   - vitesse et taille qui varient (feintes, ralentit puis fuit d'un coup)
   - disparaît/réapparaît ailleurs par intermittence
   - parfois se dédouble en leurres qui se dissolvent au toucher
   - ne devient attrapable qu'après un minimum de tentatives ET de temps
   ========================================================================== */

window.ChaseButton = (function(){

  const MIN_ATTEMPTS = 12;
  const MIN_TIME_MS = 14000;
  const DETECTION_RADIUS = 190;

  const CAPTIONS = [
    'On y va 😆→',
    'Non non non. 🤣',
    'Trop lente, tortue ninja. 😂',
    'Presque… raté !',
    'oups...',
    'Alors là, respect pour l\'effort. 🤣',
    'Et tu te dis ghost spider ? 🙄',
    'Oulaaa j\'ai failli avoir peur.',
    'Nope try again.',
    'Tu abandonnes déjà ?',
    'Okaaaaaay çq vaaaaaa, je commence à fatiguer aussi. 😭',
    'Allez, une dernière fois. Promis. 😁',
    'Here we gooooooooooooooo ! 🙈'
  ];

  let els = {};
  let attempts = 0;
  let startTime = 0;
  let caught = false;
  let busy = false;
  let decoys = [];

  function cacheEls(){
    els = {
      stageContinue: document.getElementById('stage-continue'),
      continueCaption: document.getElementById('continue-caption'),
      btn: document.getElementById('btn-continue')
    };
  }

  function randomPos(w, h){
    const margin = 20;
    const maxX = window.innerWidth - w - margin;
    const maxY = window.innerHeight - h - margin;
    return {
      x: Math.max(margin, Math.random() * maxX),
      y: Math.max(margin, Math.random() * maxY)
    };
  }

  function placeAt(el, pos){
    el.style.left = pos.x + 'px';
    el.style.top = pos.y + 'px';
  }

  function canBeCaught(){
    return attempts >= MIN_ATTEMPTS && (Date.now() - startTime) >= MIN_TIME_MS;
  }

  function updateCaptionFor(n){
    els.continueCaption.textContent = CAPTIONS[Math.min(n, CAPTIONS.length - 1)];
  }

  function applySizeStage(n){
    els.btn.classList.remove('size-1', 'size-2', 'size-3');
    if(n >= 4 && n < 7) els.btn.classList.add('size-1');
    else if(n >= 7 && n < 10) els.btn.classList.add('size-2');
    else if(n >= 10) els.btn.classList.add('size-3');
  }

  function spawnDecoy(){
    const decoy = document.createElement('button');
    decoy.type = 'button';
    decoy.className = 'btn-decoy';
    decoy.textContent = 'Commencer →';
    const pos = randomPos(180, 56);
    placeAt(decoy, pos);
    document.body.appendChild(decoy);
    decoy.addEventListener('click', () => {
      decoy.style.opacity = '0';
      setTimeout(() => decoy.remove(), 200);
      DiaryAudio.play('whoosh', { volume: .3 });
      updateCaptionFor(Math.min(attempts, CAPTIONS.length - 1));
    });
    decoys.push(decoy);
    setTimeout(() => {
      decoy.style.opacity = '0';
      setTimeout(() => { decoy.remove(); decoys = decoys.filter(d => d !== decoy); }, 200);
    }, 1800);
  }

  function flee(){
    if(caught || busy) return;
    attempts++;
    updateCaptionFor(Math.min(attempts - 1, CAPTIONS.length - 1));
    applySizeStage(attempts);

    if(Date.now() % 2 < 1) DiaryAudio.play('whoosh', { volume: .3 });

    // Comportement varié selon le nombre de tentatives, pour que ça ne
    // devienne jamais mécanique/prévisible.
    const roll = Math.random();

    if(attempts > 6 && roll < 0.25){
      // feinte : disparaît un court instant puis réapparaît ailleurs
      busy = true;
      els.btn.classList.add('is-ghosting');
      setTimeout(() => {
        placeAt(els.btn, randomPos(els.btn.offsetWidth, els.btn.offsetHeight));
        els.btn.classList.remove('is-ghosting');
        busy = false;
        if(canBeCaught()) makeCatchable();
      }, 300 + Math.random() * 250);
    } else if(attempts > 8 && roll < 0.45){
      // leurre : un faux bouton apparaît ailleurs pendant que le vrai reste proche un instant
      spawnDecoy();
      placeAt(els.btn, randomPos(els.btn.offsetWidth, els.btn.offsetHeight));
      if(canBeCaught()) makeCatchable();
    } else {
      placeAt(els.btn, randomPos(els.btn.offsetWidth, els.btn.offsetHeight));
      if(canBeCaught()) makeCatchable();
    }
  }

  function makeCatchable(){
    caught = true;
    els.btn.classList.remove('size-1', 'size-2', 'size-3', 'is-ghosting');
    els.btn.classList.add('is-catchable');
    els.continueCaption.textContent = 'Ça vaaaaaa ! Je me suis bien amusé. 🤣';
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('touchstart', onTouchStart);
    decoys.forEach(d => d.remove());
    decoys = [];
  }

  function onPointerMove(e){
    if(caught) return;
    const rect = els.btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    if(dist < DETECTION_RADIUS) flee();
  }

  function onTouchStart(e){
    if(caught) return;
    const t = e.touches[0];
    if(!t) return;
    const rect = els.btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(t.clientX - cx, t.clientY - cy);
    if(dist < DETECTION_RADIUS + 40) flee();
  }

  function onPointerDown(e){
    if(!caught){
      e.preventDefault();
      flee();
    }
  }

  function onClick(){
    if(!caught) return;
    proceedToBook();
  }

  function proceedToBook(){
    DiaryAudio.play('whoosh', { volume: .5 });
    const sceneIntro = document.getElementById('scene-intro');
    sceneIntro.classList.remove('is-active');
    setTimeout(() => {
      sceneIntro.hidden = true;
      const sceneBook = document.getElementById('scene-book');
      sceneBook.hidden = false;
      requestAnimationFrame(() => sceneBook.classList.add('is-active'));
      if(window.BookFlow) window.BookFlow.start();
    }, 500);
  }

  function start(){
    cacheEls();
    attempts = 0;
    startTime = Date.now();
    caught = false;
    busy = false;

    els.stageContinue.hidden = false;
    els.btn.hidden = false;
    els.btn.className = 'btn-continue';
    els.btn.textContent = 'Commencer →';
    placeAt(els.btn, randomPos(160, 56));
    updateCaptionFor(0);

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    els.btn.addEventListener('pointerdown', onPointerDown);
    els.btn.addEventListener('click', onClick);
  }

  return { start };
})();