/* ==========================================================================
   THE GABRIEL'S DIARIES — letter.js
   Ajout de la photo en fond derrière la scène de la lettre. Le reste est
   inchangé : retours à la ligne respectés, surnoms lisibles, chanson déjà
   lancée par book.js et qui continue de jouer ici sans interruption.
   ========================================================================== */

window.LetterFlow = (function(){

  const LETTER_PARAGRAPHS = [
    [
      "Je m'étais promis de ne pas pleurer. 😭",
      "Mais je ne vais pas y arriver ! 😭😭",
      "Ma baby girl grandit si viiiiiiiiiiiiiite ! 😭",
      "Breeeeeef...😭"
    ],
    [
      "J'ai cherché une façon extraordinaire de te le souhaiter,",
      "Pour qu'à jamais il reste gravé,",
      "Pourquoi pas de la simplicité ?",
      "Mais je crois que je n'y suis pas arrivé,",
      "À moins que tu te mettes à pleurer."
    ]
  ];

  const NICKNAMES = [
    'Partner', 'Baby Girl', 'Infinite', 'Soul Friend', 'Soul Mate',
    'The Love of My Life', 'Vitamin U', 'Yellow Person', 'Gorgeous Blue'
  ];

  const FINAL_LINE = "Happy birthday baby giiiiiiiiiiirl ! 🥹🥹🥹🥹🥹🥹🥹🥹🥹😭😭😭😭😭😭💛💛💛💛💛💛💛💛💛❤️❤️❤️❤️❤️";

  let els = {};

  function buildDOM(){
    const scene = document.getElementById('scene-letter');
    scene.innerHTML = `
      <div class="letter-scene">
        <div class="photo-backdrop is-dimmed" aria-hidden="true"></div>
        <div class="envelope-wrap" id="envelope-wrap">
          <div class="envelope" id="envelope" role="button" tabindex="0" aria-label="Ouvrir l'enveloppe">
            <div class="envelope-flap"></div>
            <div class="envelope-seal">G</div>
            <p class="envelope-hint">touche l'enveloppe</p>
          </div>
        </div>
        <div class="letter-paper" id="letter-paper" hidden>
          <div id="letter-body"></div>
          <p class="letter-to-line" id="letter-to-line">To my</p>
          <div class="letter-names" id="letter-names"></div>
          <p class="letter-final-line" id="letter-final-line"></p>
        </div>
        <p class="letter-continue-hint" id="letter-continue-hint">(touche l'écran pour refermer le journal)</p>
      </div>
    `;
    els = {
      scene,
      envelopeWrap: scene.querySelector('#envelope-wrap'),
      envelope: scene.querySelector('#envelope'),
      paper: scene.querySelector('#letter-paper'),
      body: scene.querySelector('#letter-body'),
      toLine: scene.querySelector('#letter-to-line'),
      namesContainer: scene.querySelector('#letter-names'),
      finalLine: scene.querySelector('#letter-final-line'),
      continueHint: scene.querySelector('#letter-continue-hint')
    };
  }

  function revealLineWords(lineText, wordDelay){
    const p = document.createElement('p');
    p.className = 'letter-line';
    const words = lineText.split(' ');
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = w;
      span.style.transitionDelay = (i * wordDelay) + 'ms';
      p.appendChild(span);
      p.appendChild(document.createTextNode(' '));
    });
    els.body.appendChild(p);
    requestAnimationFrame(() => {
      p.querySelectorAll('.word').forEach(w => w.classList.add('is-visible'));
    });
    return words.length * wordDelay + 450;
  }

  function playLetterBody(onDone){
    const queue = [];
    LETTER_PARAGRAPHS.forEach((lines, pIndex) => {
      lines.forEach(line => queue.push({ type: 'line', text: line }));
      if(pIndex < LETTER_PARAGRAPHS.length - 1) queue.push({ type: 'gap' });
    });

    let cursor = 0;
    function next(){
      if(cursor >= queue.length){ onDone(); return; }
      const item = queue[cursor];
      if(item.type === 'gap'){
        const gap = document.createElement('div');
        gap.className = 'letter-paragraph-gap';
        els.body.appendChild(gap);
        cursor++;
        setTimeout(next, 350);
        return;
      }
      DiaryAudio.play('type', { volume: .22 });
      const time = revealLineWords(item.text, 85);
      cursor++;
      setTimeout(next, time + 260);
    }
    next();
  }

  function revealNamesSequentially(onDone){
    let i = 0;
    function next(){
      if(i >= NICKNAMES.length){ setTimeout(onDone, 900); return; }
      const span = document.createElement('span');
      span.className = 'letter-name';
      span.textContent = NICKNAMES[i];
      const scale = 1 + (i / (NICKNAMES.length - 1)) * 0.5;
      span.style.fontSize = scale.toFixed(2) + 'rem';
      if(i === 5) span.classList.add('is-emphasis');
      els.namesContainer.appendChild(span);
      requestAnimationFrame(() => span.classList.add('is-visible'));
      DiaryAudio.play('type', { volume: .3, overlap: true });
      i++;
      setTimeout(next, 800);
    }
    next();
  }

  function fireConfetti(){
    let tries = 0;
    const attempt = () => {
      if(window.confetti){
        confetti({ particleCount: 160, spread: 110, origin: { y: .5 }, colors: ['#e8c574', '#c9a13b', '#8c2a2a', '#ecdcb8'] });
        setTimeout(() => confetti({ particleCount: 100, spread: 130, origin: { y: .35 }, colors: ['#e8c574', '#8c2a2a'] }), 450);
      } else if(tries < 20){
        tries++;
        setTimeout(attempt, 150);
      }
    };
    attempt();
  }

  function showFinalLine(){
    els.finalLine.textContent = FINAL_LINE;
    requestAnimationFrame(() => els.finalLine.classList.add('is-visible'));
    fireConfetti();
    DiaryAudio.play('finalchime', { volume: .7 });
    setTimeout(() => els.continueHint.classList.add('is-visible'), 1700);
    els.scene.addEventListener('click', proceedToEpilogue, { once: true });
  }

  function openEnvelope(){
    DiaryAudio.play('pageturn', { volume: .5 });
    els.envelope.classList.add('is-open');
    setTimeout(() => {
      els.envelopeWrap.style.transition = 'opacity .6s var(--ease), transform .6s var(--ease)';
      els.envelopeWrap.style.opacity = '0';
      els.envelopeWrap.style.transform = 'scale(.8) translateY(-24px)';
      setTimeout(() => {
        els.envelopeWrap.style.display = 'none';
        els.paper.hidden = false;
        requestAnimationFrame(() => els.paper.classList.add('is-visible'));
        setTimeout(() => {
          playLetterBody(() => {
            setTimeout(() => {
              els.toLine.classList.add('is-visible');
              setTimeout(() => {
                revealNamesSequentially(showFinalLine);
              }, 700);
            }, 500);
          });
        }, 900);
      }, 650);
    }, 750);
  }

  function proceedToEpilogue(){
    if(window.EpilogueFlow) window.EpilogueFlow.start();
  }

  function start(){
    document.getElementById('scene-book').classList.remove('is-active');
    setTimeout(() => {
      document.getElementById('scene-book').hidden = true;
      buildDOM();
      const sceneLetter = document.getElementById('scene-letter');
      sceneLetter.hidden = false;
      requestAnimationFrame(() => sceneLetter.classList.add('is-active'));

      DiaryAudio.play('whoosh', { volume: .4 });
      setTimeout(() => {
        els.envelope.classList.add('is-visible');
        setTimeout(() => els.envelope.classList.add('is-pulsing'), 1200);
      }, 400);

      els.envelope.addEventListener('click', openEnvelope, { once: true });
      els.envelope.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openEnvelope(); }
      }, { once: true });
    }, 600);
  }

  return { start };
})();