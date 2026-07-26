/* ==========================================================================
   THE GABRIEL'S DIARIES — passwords.js
   Les 3 mots de passe. Confettis garantis à chaque réussite.
   ========================================================================== */

window.PasswordsFlow = (function(){

  const PASSWORDS = [
    { label: 'Mot de passe 1 / 3', target: '122516', groups: [6], hint: '(1...9) ~ Looooooove Youuuuuuu Partneeeeeeeeer ! 💛' },
    { label: 'Mot de passe 2 / 3', target: 'wanetehliathyatloml', groups: [19], hint: '(a...z) ~ S\'il fallait parler de toi en un seul mot, j\'utiliserai ce mot de 19 lettres btw. 😆' },
    { label: 'Mot de passe 3 / 3', target: 'Loveyou3000', groups: [4, 3, 4], hint: '(1...9...A...Z) ~ Je ne suis pas Iron Man mais…🙈' }
  ];

  const SUCCESS_REACTIONS = [
    { emoji: '🤩', text: 'No waaaaaaaaaaaaaaaaaaaaay !' },
    { emoji: '🥹', text: 'Est-ce bien toi ?' },
    { emoji: '🤣', text: 'Ne t\'enflamme pas trop vite.' }
  ];
  const ERROR_REACTIONS = [
    { emoji: '😒', text: 'Re-essaie.' },
    { emoji: '😭', text: 'Seriously ? Qui es-tu ?' },
    { emoji: '😆', text: 'Les réponses sont là, dans ton coeur.' }
  ];

  let els = {};
  let reduceMotion = false;
  let currentIndex = 0;
  let target = '';
  let filled = [];
  let lives = 5;
  let orbTimers = [];

  function cacheEls(){
    els = {
      stagePassword: document.getElementById('stage-password'),
      passwordLabel: document.getElementById('password-label'),
      passwordSlots: document.getElementById('password-slots'),
      orbitField: document.getElementById('orbit-field'),
      livesIndicator: document.getElementById('lives-indicator'),
      hintBtn: document.getElementById('hint-btn'),
      hintPanel: document.getElementById('hint-panel'),
      avatarBubble: document.getElementById('avatar-bubble-password'),
      avatarEmoji: document.getElementById('avatar-emoji-password'),
      avatarText: document.getElementById('avatar-text-password')
    };
  }

  function showAvatar(emoji, text, duration = 3200){
    els.avatarEmoji.textContent = emoji;
    els.avatarText.textContent = text;
    els.avatarBubble.classList.remove('is-visible');
    void els.avatarBubble.offsetWidth;
    requestAnimationFrame(() => els.avatarBubble.classList.add('is-visible'));
    clearTimeout(showAvatar._t);
    showAvatar._t = setTimeout(() => els.avatarBubble.classList.remove('is-visible'), duration);
  }

  function normalize(s){ return s.toLowerCase(); }

  function buildSlots(pw){
    els.passwordSlots.innerHTML = '';
    let cursor = 0;
    pw.groups.forEach(groupLen => {
      const group = document.createElement('div');
      group.className = 'slot-group';
      for(let i = 0; i < groupLen; i++){
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.index = cursor;
        group.appendChild(slot);
        cursor++;
      }
      els.passwordSlots.appendChild(group);
    });
  }

  function renderLives(){ els.livesIndicator.textContent = '🕯️'.repeat(Math.max(lives, 0)); }

  function randomChar(exclude){
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let c;
    do{ c = pool[Math.floor(Math.random() * pool.length)]; }
    while(c.toLowerCase() === exclude);
    return c;
  }

  function placeOrb(orb){
    const fieldW = els.orbitField.clientWidth;
    const fieldH = els.orbitField.clientHeight;
    const orbSize = 46;
    const maxLeft = Math.max(fieldW - orbSize, 10);
    const maxTop = Math.max(fieldH - orbSize, 10);
    orb.style.left = Math.random() * maxLeft + 'px';
    orb.style.top = Math.random() * maxTop + 'px';
  }

  function scheduleDrift(orb){
    if(reduceMotion) return;
    const t = setTimeout(() => {
      if(!orb.isConnected) return;
      placeOrb(orb);
      scheduleDrift(orb);
    }, 2200 + Math.random() * 1800);
    orbTimers.push(t);
  }

  function spawnOrbs(){
    els.orbitField.innerHTML = '';
    orbTimers.forEach(clearTimeout);
    orbTimers = [];
    const chars = target.split('');
    const decoyCount = Math.max(6, Math.round(target.length * 0.9));
    const all = chars.map(c => ({ c, real: true }));
    for(let i = 0; i < decoyCount; i++){
      all.push({ c: randomChar(normalize(chars[Math.floor(Math.random() * chars.length)])), real: false });
    }
    for(let i = all.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    all.forEach(item => {
      const orb = document.createElement('button');
      orb.type = 'button';
      orb.className = 'orb';
      orb.textContent = item.c;
      orb.dataset.letter = item.c;
      placeOrb(orb);
      orb.addEventListener('click', () => handleOrbTap(orb));
      els.orbitField.appendChild(orb);
      scheduleDrift(orb);
    });
  }

  function nextEmptyIndex(){ return filled.findIndex(f => f === null); }

  function handleOrbTap(orb){
    if(orb.classList.contains('is-consumed')) return;
    const idx = nextEmptyIndex();
    if(idx === -1) return;
    const required = target[idx];
    const tapped = orb.dataset.letter;

    if(normalize(tapped) === normalize(required)){
      filled[idx] = required;
      const slot = els.passwordSlots.querySelector(`.slot[data-index="${idx}"]`);
      slot.textContent = required;
      slot.classList.add('is-filled');
      orb.classList.add('is-consumed');
      DiaryAudio.play('type', { volume: .4 });
      if(nextEmptyIndex() === -1) handleSuccess();
    } else {
      orb.classList.add('is-wrong');
      setTimeout(() => orb.classList.remove('is-wrong'), 320);
      lives--;
      renderLives();
      if(lives <= 0) handleFail();
    }
  }

  function fireConfetti(){
    // essaie plusieurs fois : si canvas-confetti n'est pas encore chargé
    // (connexion lente), on retente au lieu de perdre l'effet en silence.
    let tries = 0;
    const attempt = () => {
      if(window.confetti){
        confetti({ particleCount: 90, spread: 75, origin: { y: .6 }, colors: ['#e8c574', '#c9a13b', '#ecdcb8'] });
        setTimeout(() => {
          confetti({ particleCount: 50, spread: 100, origin: { y: .5, x: .3 }, colors: ['#e8c574', '#8c2a2a'] });
        }, 200);
      } else if(tries < 20){
        tries++;
        setTimeout(attempt, 150);
      }
    };
    attempt();
  }

  function handleSuccess(){
    orbTimers.forEach(clearTimeout);
    DiaryAudio.play('success', { volume: .6 });
    fireConfetti();
    const r = SUCCESS_REACTIONS[Math.floor(Math.random() * SUCCESS_REACTIONS.length)];
    showAvatar(r.emoji, r.text, 2200);
    updateBodyStage();

    setTimeout(() => {
      currentIndex++;
      if(currentIndex >= PASSWORDS.length) endSequence();
      else startPassword(currentIndex);
    }, 1500);
  }

  function handleFail(){
    orbTimers.forEach(clearTimeout);
    DiaryAudio.play('error', { volume: .55 });
    const r = ERROR_REACTIONS[Math.floor(Math.random() * ERROR_REACTIONS.length)];
    showAvatar(r.emoji, r.text, 2400);
    setTimeout(() => startPassword(currentIndex), 1300);
  }

  function updateBodyStage(){
    const stages = ['void', 'warming', 'ember', 'parchment'];
    document.body.dataset.stage = stages[Math.min(currentIndex, stages.length - 1)];
  }

  function startPassword(index){
    const pw = PASSWORDS[index];
    target = pw.target;
    filled = new Array(target.length).fill(null);
    lives = 5;

    els.passwordLabel.textContent = pw.label;
    els.hintPanel.hidden = true;
    els.hintPanel.textContent = pw.hint;

    buildSlots(pw);
    renderLives();
    spawnOrbs();

    const freshHintBtn = els.hintBtn.cloneNode(true);
    els.hintBtn.replaceWith(freshHintBtn);
    els.hintBtn = freshHintBtn;
    els.hintBtn.addEventListener('click', () => {
      els.hintPanel.hidden = !els.hintPanel.hidden;
    });
  }

  function endSequence(){
    els.stagePassword.hidden = true;
    document.body.dataset.stage = 'parchment';
    if(window.ChaseButton) window.ChaseButton.start();
  }

  function start(){
    cacheEls();
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    els.stagePassword.hidden = false;
    currentIndex = 0;
    startPassword(0);
  }

  return { start };
})();