/* ==========================================================================
   THE GABRIEL'S DIARIES — book.js
   Tourbillon entièrement réécrit pour être fiable à 100% : minutage
   calculé mathématiquement à l'avance (aucune dépendance à un état de
   rotation en cours), garantissant que le livre retombe TOUJOURS dans
   l'ordre exact des pages. Effet en vagues successives façon vrai
   feuilletage (plusieurs pages qui se soulèvent en cascade, pas une par
   une de façon mécanique).
   ========================================================================== */

window.BookFlow = (function(){

  const FILLER_SENTENCES = [
    "elle marchait dans la lumière du matin sans le savoir",
    "je repense encore à ce jour où elle a souri",
    "un mot, une lettre, un silence, et elle était là",
    "elle occupe chaque page sans même l'avoir demandé",
    "quelque chose dans sa voix, encore et encore, elle",
    "le temps passe mais elle reste, quoi qu'il arrive",
    "un carnet de plus, et elle, toujours au centre",
    "je n'écris presque que pour elle depuis le début",
    "elle ne sait pas à quel point elle compte ici",
    "dans chaque ligne, une trace d'elle qui persiste"
  ];
  const WHIRL_DATES = ['12 / 03', '02 / 09', '19 / 11', '05 / 01', '30 / 06', '14 / 02', '21 / 08', '27 / 07'];

  function fillerParagraph(){
    const count = 2 + Math.floor(Math.random() * 2);
    let html = '';
    for(let i = 0; i < count; i++){
      let s = FILLER_SENTENCES[Math.floor(Math.random() * FILLER_SENTENCES.length)];
      s = s.replace(/elle/g, '<span class="elle-word">elle</span>');
      html += `<p style="margin:0 0 .5em 0;">${s.charAt(0).toUpperCase() + s.slice(1)}.</p>`;
    }
    return html;
  }

  let root, sheets, leaves = [], currentFace = 0, totalFaces = 0;

  function cacheRoot(){ root = document.getElementById('book-root'); }

  function buildDOM(){
    sheets = window.DiaryContent.SHEETS;
    totalFaces = sheets.length * 2 - 1;

    root.innerHTML = `
      <div class="book-cover-wrap" id="book-cover-wrap">
        <div class="book-cover" id="book-cover" role="button" tabindex="0" aria-label="Ouvrir le journal">
          <div class="book-cover-frame">
            <p class="book-cover-eyebrow">— journal intime —</p>
            <h2 class="book-cover-title">The Gabriel's<br>Diaries</h2>
            <p class="book-cover-sub">clique sur la couverture...</p>
          </div>
          <div class="book-cover-footer" id="book-cover-footer">
            <p class="line" id="cover-line-end">The end ?</p>
            <p class="line beginning" id="cover-line-beginning">Nope just the beginning...</p>
          </div>
        </div>
      </div>
      <div class="book-viewport" id="book-viewport" style="display:none;">
        <div class="book-stage">
          <div class="book-spread" id="book-spread">
            <div class="page-base left"></div>
            <div class="page-base right"></div>
            <div class="whirl-title-card" id="whirl-title-card"><span>27 / 07</span></div>
          </div>
        </div>
        <div class="diary-nav" id="diary-nav">
          <button class="diary-nav-btn" id="diary-prev" type="button">← précédent</button>
          <button class="diary-nav-btn" id="diary-next" type="button">suivant →</button>
        </div>
      </div>
    `;
    buildLeaves();
  }

  function facePlateHTML(sheetIndex, faceType){
    const sheet = sheets[sheetIndex];
    const html = faceType === 'recto' ? sheet.recto : sheet.verso;
    const isLove = faceType === 'recto' ? sheet.rectoLove : sheet.versoLove;
    if(html === null) return `<div class="diary-page-date">${sheet.date}</div><div class="diary-page-text"></div>`;
    if(isLove) return `<div class="diary-page-date">${sheet.date}</div><div class="diary-page-text"><div class="love-wall">${html.replace(/^<div class="love-wall">|<\/div>$/g, '')}</div></div>`;
    return `<div class="diary-page-date">${sheet.date}</div><div class="diary-page-text">${html}</div>`;
  }

  function buildLeaves(){
    const spread = document.getElementById('book-spread');
    leaves = [];
    sheets.forEach((sheet, i) => {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.style.zIndex = sheets.length - i;
      leaf.style.transform = 'rotateY(0deg)';
      leaf.innerHTML = `
        <div class="leaf-face front" data-sheet="${i}" data-face="recto">${facePlateHTML(i, 'recto')}</div>
        <div class="leaf-face back" data-sheet="${i}" data-face="verso">${facePlateHTML(i, 'verso')}</div>
      `;
      spread.appendChild(leaf);
      leaves.push(leaf);
    });
  }

  /* ---------------------- Ouverture progressive de la couverture ---------------------- */

  function handleCoverOpen(){
    const cover = document.getElementById('book-cover');
    cover.style.pointerEvents = 'none';
    cover.classList.add('is-lifting');

    setTimeout(() => {
      DiaryAudio.play('bookopen', { volume: .65 });
      cover.classList.remove('is-lifting');
      cover.classList.add('is-opening');
    }, 350);

    setTimeout(() => {
      document.getElementById('book-cover-wrap').style.display = 'none';
      const viewport = document.getElementById('book-viewport');
      viewport.style.display = 'flex';
      const spread = document.getElementById('book-spread');
      requestAnimationFrame(() => spread.classList.add('is-visible'));
      setTimeout(runWhirl, 400);
    }, 350 + 1300);
  }

  /* ---------------------- Tourbillon : minutage garanti ---------------------- */

  function randomFaceContent(){
    const date = WHIRL_DATES[Math.floor(Math.random() * WHIRL_DATES.length)];
    return `<div class="whirl-fragment-date">${date}</div><div class="whirl-fragment-body">${fillerParagraph()}</div>`;
  }

  function swapToWhirlContent(){
    leaves.forEach(leaf => {
      leaf.querySelectorAll('.leaf-face').forEach(face => {
        if(face.dataset.savedHtml === undefined) face.dataset.savedHtml = face.innerHTML;
        face.innerHTML = randomFaceContent();
      });
    });
  }

  function restoreRealContent(){
    leaves.forEach(leaf => {
      leaf.querySelectorAll('.leaf-face').forEach(face => {
        if(face.dataset.savedHtml !== undefined){
          face.innerHTML = face.dataset.savedHtml;
          delete face.dataset.savedHtml;
        }
      });
    });
  }

  /* Programme un seul mouvement de page à un instant précis (delay),
     avec une durée précise (duration). Le minutage est calculé à
     l'avance et ne dépend d'aucun état "en cours" — impossible que deux
     mouvements se marchent dessus ou laissent une page à mi-course. */
  function scheduleFlip(leaf, toAngle, duration, delay){
    setTimeout(() => {
      leaf.style.setProperty('--flip-duration', duration + 'ms');
      leaf.classList.add('is-flipping');
      leaf.style.transition = `transform ${duration}ms cubic-bezier(.45,.05,.55,.95)`;
      requestAnimationFrame(() => {
        leaf.style.transform = `rotateY(${toAngle}deg)`;
      });
      DiaryAudio.play('pageturn', { volume: .16, overlap: true });
      leaf.querySelectorAll('.leaf-face').forEach(face => {
        face.innerHTML = randomFaceContent();
      });
      setTimeout(() => leaf.classList.remove('is-flipping'), duration);
    }, delay);
  }

  function runWhirl(){
    swapToWhirlContent();
    const L = leaves.length;

    // Chaque vague fait pivoter TOUTES les feuilles, en cascade (comme un
    // vrai feuilletage à la main). Vague 1 et 2 : rapides (aller-retour).
    // Vague 3 : encore un aller rapide. Vague 4 : LE RETOUR FINAL, plus
    // lent (ralentissement naturel) — cette dernière vague se termine
    // systématiquement avec toutes les feuilles à rotateY(0), donc dans
    // l'ordre exact d'origine, garanti par construction.
    const waves = [
      { toAngle: -180, duration: 230, stagger: 60 },
      { toAngle: 0,     duration: 230, stagger: 60 },
      { toAngle: -180, duration: 320, stagger: 85 },
      { toAngle: 0,     duration: 480, stagger: 110 }
    ];

    const gapBetweenWaves = 110;
    let t = 0;

    waves.forEach(wave => {
      for(let i = 0; i < L; i++){
        const delay = t + i * wave.stagger;
        scheduleFlip(leaves[i], wave.toAngle, wave.duration, delay);
      }
      const waveSpan = (L - 1) * wave.stagger + wave.duration;
      t += waveSpan + gapBetweenWaves;
    });

    // Le total "t" est connu à l'avance : on programme la suite exactement
    // à ce moment, sans jamais dépendre d'un événement de fin d'animation.
    setTimeout(settleWhirl, t + 150);
  }

  function settleWhirl(){
    // Sécurité supplémentaire : force explicitement l'état final correct,
    // même si un navigateur avait pris du retard sur une transition.
    leaves.forEach(leaf => {
      leaf.style.transition = 'none';
      leaf.style.transform = 'rotateY(0deg)';
      leaf.classList.remove('is-flipping');
    });

    const card = document.getElementById('whirl-title-card');
    setTimeout(() => {
      card.classList.add('is-visible');
      DiaryAudio.play('whoosh', { volume: .4 });
    }, 350);

    setTimeout(() => {
      card.classList.remove('is-visible');
      setTimeout(() => {
        restoreRealContent();
        leaves.forEach(leaf => { leaf.style.transition = ''; });
        DiaryAudio.playSong({ volume: .5 });
        startReading();
      }, 550);
    }, 2100);
  }

  /* ---------------------- Lecture recto/verso ---------------------- */

  let prevBtn, nextBtn;

  function goToFace(targetIndex){
    if(targetIndex < 0 || targetIndex > totalFaces - 1) return;
    const forward = targetIndex > currentFace;
    DiaryAudio.play('pageturn', { volume: .5, overlap: true });

    if(forward){
      const sheetToFlip = Math.floor(currentFace / 2);
      leaves[sheetToFlip].style.zIndex = 500 + sheetToFlip;
      leaves[sheetToFlip].style.transform = 'rotateY(-180deg)';
    } else {
      const sheetToUnflip = Math.floor(targetIndex / 2);
      leaves[sheetToUnflip].style.transform = 'rotateY(0deg)';
    }

    currentFace = targetIndex;
    updateNav();

    const moment = window.DiaryContent.AVATAR_MOMENTS[currentFace];
    if(moment) window.showDiaryAvatar(moment.emoji, moment.text);
  }

  function updateNav(){
    prevBtn.disabled = currentFace === 0;
    nextBtn.textContent = (currentFace === totalFaces - 1) ? 'la lettre →' : 'suivant →';
  }

  function handleNext(){
    if(currentFace === totalFaces - 1){
      closeBookThenGoToLetter();
      return;
    }
    goToFace(currentFace + 1);
  }

  function closeBookThenGoToLetter(){
    const viewport = document.getElementById('book-viewport');
    const spread = document.getElementById('book-spread');
    spread.classList.remove('is-visible');
    DiaryAudio.play('whoosh', { volume: .4 });

    setTimeout(() => {
      viewport.style.display = 'none';
      if(window.LetterFlow) window.LetterFlow.start();
    }, 700);
  }

  function startReading(){
    currentFace = 0;
    leaves.forEach(leaf => { leaf.style.transform = 'rotateY(0deg)'; });
    prevBtn = document.getElementById('diary-prev');
    nextBtn = document.getElementById('diary-next');

    prevBtn.addEventListener('click', () => goToFace(currentFace - 1));
    nextBtn.addEventListener('click', handleNext);

    const viewport = document.getElementById('book-viewport');
    let touchStartX = null;
    viewport.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
      if(touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if(Math.abs(dx) > 60){
        if(dx < 0) handleNext();
        else goToFace(currentFace - 1);
      }
      touchStartX = null;
    }, { passive: true });

    updateNav();
  }

  function start(){
    cacheRoot();
    buildDOM();
    const cover = document.getElementById('book-cover');
    cover.addEventListener('click', handleCoverOpen, { once: true });
    cover.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); handleCoverOpen(); }
    }, { once: true });
  }

  return { start };
})();

/* Bulle avatar dédiée à la lecture — zone fixe en bas */
window.showDiaryAvatar = function(emoji, text){
  let bar = document.getElementById('diary-avatar-bar');
  if(!bar){
    bar = document.createElement('div');
    bar.id = 'diary-avatar-bar';
    bar.style.cssText = 'position:fixed;left:50%;bottom:calc(70px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:45;pointer-events:none;';
    bar.innerHTML = `<div class="avatar-bubble" id="diary-avatar-bubble" style="opacity:0;transform:translateY(8px) scale(.96);"><span class="avatar-emoji"></span><span class="avatar-text"></span></div>`;
    document.body.appendChild(bar);
  }
  const bubble = bar.querySelector('#diary-avatar-bubble');
  bubble.querySelector('.avatar-emoji').textContent = emoji;
  bubble.querySelector('.avatar-text').textContent = text;
  bubble.style.transition = 'opacity .5s ease, transform .5s ease';
  bubble.style.opacity = '1';
  bubble.style.transform = 'translateY(0) scale(1)';
  clearTimeout(window.showDiaryAvatar._t);
  window.showDiaryAvatar._t = setTimeout(() => {
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(8px) scale(.96)';
  }, 3200);
};