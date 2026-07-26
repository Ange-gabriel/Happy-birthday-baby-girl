/* ==========================================================================
   THE GABRIEL'S DIARIES — intro.js
   Page lune (photo + lune cliquable + phrase) → prologue (photo en fond,
   dimmée) → glitch spectaculaire → mots de passe.
   ========================================================================== */

window.IntroFlow = (function(){

  const PROLOGUE_LINES = [
    { text: 'Quelque part…', hold: 1500, avatar: { emoji: '🙈', text: 'Hi, je suis Feruz.' } },
    { text: 'Sur mon bureau…', hold: 1400, avatar: { emoji: '😆', text: 'Le fidèle compagnon de Gabriel depuis sa naissance.' } },
    { text: 'Un journal est gardé secrètement, et à l\'interieur un petit mot.', hold: 2000, avatar: { emoji: '🥷', text: 'Le gardien de ses secrets, malgré moi d\'ailleurs.' } },
    { text: 'Personne n\'était censé le lire.', hold: 1600, avatar: { emoji: '🙊', text: 'Oups...sorry concentre-toi sur la lecture.' } },
    { text: 'Enfin…', hold: 1800, avatar: { emoji: '🤣', text: 'Actually, pas sorry du tout. Je suis un long trouble-fête. J\'ai bien dit long.' } },
    { text: 'Presque personne.', hold: 1700, avatar: { emoji: '😭', text: 'Il y a toujours cette fille dans sa tête.' } }
  ];

  /* Le glitch monte en intensité ligne après ligne (niveau 1 à 3) */
  const GLITCH_LINES = [
    { text: 'chargement…', system: true, level: 1 },
    { text: 'Mise à jour du système…', system: true, level: 1 },
    { text: 'ẞ//ACCÈS_REFUSÉ — intrusion détectée...', system: true, level: 3, avatar: { emoji: '👁️', text: 'Personne d\'autre qu\'elle n\'a le droit de lire ça.' } },
    { text: 'Minute papillon...', level: 2, avatar: { emoji: '🙄', text: 'Tu ne croyais tout de même pas passer aussi facilement.' } },
    { text: 'On reprend depuis le début.', level: 1, avatar: { emoji: '🤣', text: 'Son intro est un flop total.'} },
    { text: 'Salut ! Oui, toi. Devant ton écran.', level: 0, avatar: { emoji: '🙈', text: '14cm, ça te dit quelque chose ?' } },
    { text: 'Deux personnes sur cette terre peuvent avoir accès à mon journal...', level: 0, avatar: { emoji: '😍', text: 'Ouuuuuuuuuuuuuh...' } },
    { text: 'Elle et moi.', level: 1, avatar: { emoji: '🤣', text: 'Ashhhhhhhhhhhhhhhhhhhh...' } },
    { text: 'Et avant que tu avances, je dois m\'assurer...', level: 0, avatar: { emoji: '😮‍💨', text: 'Abrège, tu racontes trop ta vie.' } },
    { text: 'Que tu es bien ELLE.', level: 0, avatar: { emoji: '🙌', text: 'Même à moi il refuse souvent d\'en parler.' } },
    { text: 'Donc j\'ai posé trois petites portes. Rien de bien méchant.', level: 0, avatar: { emoji: '🤣', text: 'Bon courage pour la deuxième.' } },
    { text: 'Trois mots de passe que seules nous deux pouvons passer !', level: 0, avatar: { emoji: '🔐', text: 'En seras-tu capable ?.' } },
    { text: 'Ready ? (De toute façon t\'as pas trop le choix. 🤣)', level: 2, avatar: { emoji: '😎', text: 'Hasta la vista baby.' } }
  ];

  let els = {};

  function cacheEls(){
    els = {
      stageMoon: document.getElementById('stage-moon'),
      moonWrap: document.getElementById('moon-wrap'),
      moonLine: document.getElementById('moon-line'),
      stagePrologue: document.getElementById('stage-prologue'),
      prologueLine: document.getElementById('prologue-line'),
      avatarBubble: document.getElementById('avatar-bubble'),
      avatarEmoji: document.getElementById('avatar-emoji'),
      avatarText: document.getElementById('avatar-text'),
      stageGlitch: document.getElementById('stage-glitch'),
      glitchLine: document.getElementById('glitch-line'),
      avatarBubbleGlitch: document.getElementById('avatar-bubble-glitch'),
      avatarEmojiGlitch: document.getElementById('avatar-emoji-glitch'),
      avatarTextGlitch: document.getElementById('avatar-text-glitch'),
      scanlines: document.getElementById('scanlines-overlay'),
      flash: document.getElementById('flash-overlay'),
      body: document.body
    };
  }

  function showAvatarIn(bubbleEl, emojiEl, textEl, emoji, text){
    emojiEl.textContent = emoji;
    textEl.textContent = text;
    bubbleEl.classList.remove('is-visible');
    void bubbleEl.offsetWidth;
    requestAnimationFrame(() => bubbleEl.classList.add('is-visible'));
  }
  function hideAvatarIn(bubbleEl){ bubbleEl.classList.remove('is-visible'); }

  function revealWords(container, text, wordDelay){
    container.innerHTML = '';
    container.classList.remove('is-fading');
    const words = text.split(' ');
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = w;
      span.style.transitionDelay = (i * wordDelay) + 'ms';
      container.appendChild(span);
      container.appendChild(document.createTextNode(' '));
    });
    requestAnimationFrame(() => {
      container.querySelectorAll('.word').forEach(w => w.classList.add('is-visible'));
    });
    return words.length * wordDelay + 600;
  }

  function fadeOut(container, cb){
    container.classList.add('is-fading');
    setTimeout(cb, 900);
  }

  /* ---------------------- Page lune ---------------------- */

  function startMoonStage(){
    els.stageMoon.hidden = false;

    function handleMoonClick(){
      els.moonWrap.classList.add('is-clicked');
      DiaryAudio.play('whoosh', { volume: .35 });
      setTimeout(() => {
        els.moonLine.classList.add('is-visible');
      }, 500);

      setTimeout(() => {
        els.stageMoon.classList.add('is-fading-out');
        els.stageMoon.style.transition = 'opacity 1.4s ease';
        els.stageMoon.style.opacity = '0';
        setTimeout(() => {
          els.stageMoon.hidden = true;
          startPrologue();
        }, 1450);
      }, 3200);
    }

    els.moonWrap.addEventListener('click', handleMoonClick, { once: true });
    els.moonWrap.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); handleMoonClick(); }
    }, { once: true });
  }

  /* ---------------------- Prologue (photo en fond, dimmée) ---------------------- */

  let prologueIndex = 0;
  let prologueTimer = null;

  function playPrologueLine(){
    const line = PROLOGUE_LINES[prologueIndex];
    const revealTime = revealWords(els.prologueLine, line.text, 140);
    if(line.avatar){
      setTimeout(() => showAvatarIn(els.avatarBubble, els.avatarEmoji, els.avatarText, line.avatar.emoji, line.avatar.text), revealTime + 150);
    } else {
      hideAvatarIn(els.avatarBubble);
    }
    prologueTimer = setTimeout(() => {
      hideAvatarIn(els.avatarBubble);
      fadeOut(els.prologueLine, () => {
        prologueIndex++;
        if(prologueIndex >= PROLOGUE_LINES.length) startGlitchInterruption();
        else playPrologueLine();
      });
    }, revealTime + line.hold + 600);
  }

  function startPrologue(){
    els.stagePrologue.hidden = false;
    prologueIndex = 0;
    playPrologueLine();

    els.stagePrologue.addEventListener('click', () => {
      clearTimeout(prologueTimer);
      hideAvatarIn(els.avatarBubble);
      fadeOut(els.prologueLine, () => {
        prologueIndex++;
        if(prologueIndex >= PROLOGUE_LINES.length) startGlitchInterruption();
        else playPrologueLine();
      });
    });
  }

  function flashScreen(){
    els.flash.classList.remove('is-flashing');
    void els.flash.offsetWidth;
    els.flash.classList.add('is-flashing');
  }

  function startGlitchInterruption(){
    DiaryAudio.play('glitch', { volume: .55 });
    els.stagePrologue.classList.add('is-shaking');
    els.scanlines.classList.add('is-active');
    flashScreen();
    setTimeout(flashScreen, 140);
    setTimeout(flashScreen, 300);
    setTimeout(() => {
      els.stagePrologue.hidden = true;
      els.stagePrologue.classList.remove('is-shaking');
      startGlitchSequence();
    }, 650);
  }

  let glitchIndex = 0;
  let glitchTimer = null;

  function applyGlitchLevel(level){
    els.stageGlitch.classList.toggle('is-shaking', level >= 2);
    els.glitchLine.classList.toggle('is-glitching', level >= 1);
    els.scanlines.classList.toggle('is-active', level >= 2);
    if(level >= 3){
      flashScreen();
      setTimeout(flashScreen, 120);
    }
  }

  function playGlitchLine(){
    const line = GLITCH_LINES[glitchIndex];
    els.glitchLine.className = 'word-line' + (line.system ? ' is-system' : '');
    applyGlitchLevel(line.level);
    if(line.level >= 2) DiaryAudio.play('glitch', { volume: .35, overlap: true });
    const revealTime = revealWords(els.glitchLine, line.text, 90);
    if(line.avatar){
      setTimeout(() => showAvatarIn(els.avatarBubbleGlitch, els.avatarEmojiGlitch, els.avatarTextGlitch, line.avatar.emoji, line.avatar.text), revealTime + 150);
    } else {
      hideAvatarIn(els.avatarBubbleGlitch);
    }
    glitchTimer = setTimeout(() => {
      hideAvatarIn(els.avatarBubbleGlitch);
      fadeOut(els.glitchLine, () => {
        els.stageGlitch.classList.remove('is-shaking');
        els.scanlines.classList.remove('is-active');
        glitchIndex++;
        if(glitchIndex >= GLITCH_LINES.length) endGlitchSequence();
        else playGlitchLine();
      });
    }, revealTime + 1600);
  }

  function startGlitchSequence(){
    els.stageGlitch.hidden = false;
    glitchIndex = 0;
    playGlitchLine();
    els.stageGlitch.addEventListener('click', () => {
      clearTimeout(glitchTimer);
      hideAvatarIn(els.avatarBubbleGlitch);
      fadeOut(els.glitchLine, () => {
        els.stageGlitch.classList.remove('is-shaking');
        els.scanlines.classList.remove('is-active');
        glitchIndex++;
        if(glitchIndex >= GLITCH_LINES.length) endGlitchSequence();
        else playGlitchLine();
      });
    });
  }

  function endGlitchSequence(){
    els.stageGlitch.hidden = true;
    if(window.PasswordsFlow) window.PasswordsFlow.start();
  }

  function start(){
    cacheEls();
    DiaryAudio.startAmbient();
    startMoonStage();
  }

  return { start };
})();