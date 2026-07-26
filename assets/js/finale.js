/* ==========================================================================
   THE GABRIEL'S DIARIES — finale.js
   La page "Que serait..." a été retirée. On va directement de la fin de
   la lettre vers "The end ? / Nope just the beginning..." (affiché en bas
   de la couverture du livre qui se referme), puis la bougie finale.
   ========================================================================== */

window.EpilogueFlow = (function(){

  const FINAL_TEASE = "Le meilleur reste à venir baby giiiiiiiiiiiiiirl, just wait ! 😆";

  function start(){
    document.getElementById('scene-letter').classList.remove('is-active');
    setTimeout(() => {
      document.getElementById('scene-letter').hidden = true;
      showClosingCover();
    }, 600);
  }

  function showClosingCover(){
    const scene = document.getElementById('scene-epilogue');
    scene.innerHTML = `
      <div class="epilogue-scene">
        <div class="epilogue-cover" id="epilogue-cover">
          <div class="epilogue-cover-lines" id="epilogue-cover-lines">
            <p class="line" id="line-end">The end ?</p>
            <p class="line beginning" id="line-beginning">Nope just the beginning...</p>
          </div>
        </div>
      </div>
    `;
    scene.hidden = false;
    requestAnimationFrame(() => scene.classList.add('is-active'));
    DiaryAudio.play('whoosh', { volume: .4 });
    const cover = scene.querySelector('#epilogue-cover');
    requestAnimationFrame(() => cover.classList.add('is-visible'));

    setTimeout(() => scene.querySelector('#line-end').classList.add('is-visible'), 900);
    setTimeout(() => scene.querySelector('#line-beginning').classList.add('is-visible'), 2100);

    setTimeout(() => {
      cover.classList.add('is-fading');
      setTimeout(() => showFinalTease(), 1400);
    }, 4400);
  }

  function showFinalTease(){
    const scene = document.getElementById('scene-epilogue');
    scene.innerHTML = `
      <div class="epilogue-scene">
        <p class="epilogue-final-line" id="epilogue-final-line">${FINAL_TEASE}</p>
      </div>
    `;
    const line = scene.querySelector('#epilogue-final-line');
    requestAnimationFrame(() => line.classList.add('is-visible'));
    DiaryAudio.play('finalchime', { volume: .5 });

    setTimeout(() => {
      scene.classList.remove('is-active');
      setTimeout(() => {
        scene.hidden = true;
        if(window.FinaleFlow) window.FinaleFlow.start();
      }, 700);
    }, 3800);
  }

  return { start };
})();

/* La bougie — brûle sans jamais s'éteindre (inchangé) */
window.FinaleFlow = (function(){
  function start(){
    const scene = document.getElementById('scene-finale');
    scene.innerHTML = `
      <div class="finale-scene">
        <div class="candle">
          <div class="candle-glow"></div>
          <div class="candle-smoke"></div>
          <div class="candle-smoke"></div>
          <div class="candle-smoke"></div>
          <div class="candle-flame"></div>
          <div class="candle-wick"></div>
          <div class="candle-drip"></div>
          <div class="candle-body"></div>
        </div>
        <p class="finale-caption">une bougie qui attend d'être soufflée...</p>
        <p class="finale-sub">elle brûlera jusqu'à ce que le moment soit venu.</p>
        <p class="finale-cation">Tic tac...</p>
      </div>
    `;
    scene.hidden = false;
    requestAnimationFrame(() => scene.classList.add('is-active'));
  }
  return { start };
})();