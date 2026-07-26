/* ==========================================================================
   THE GABRIEL'S DIARIES — epilogue.js
   Retour bref sur le journal ("Que serait..."), fermeture, "The end ? /
   Nope just the beginning...", disparition, phrase finale, sablier infini.
   Tout le texte est reproduit EXACTEMENT tel que fourni.
   ========================================================================== */

window.EpilogueFlow = (function(){

  const EPILOGUE_TEXT = window.DiaryContent ? window.DiaryContent.EPILOGUE_PAGE
    : "Que serait un anniversaire sans gâteau ? Que serait un gâteau sans cadeau ?";

  const FINAL_TEASE = "Le meilleur reste à venir baby giiiiiiiiiiiiiiiiiirl, just wait ! 😆";

  function start(){
    document.getElementById('scene-letter').classList.remove('is-active');
    setTimeout(() => {
      document.getElementById('scene-letter').hidden = true;
      showEpiloguePage();
    }, 600);
  }

  function showEpiloguePage(){
    const scene = document.getElementById('scene-epilogue');
    scene.innerHTML = `
      <div class="epilogue-scene">
        <div class="epilogue-page" id="epilogue-page">${EPILOGUE_TEXT}</div>
      </div>
    `;
    scene.hidden = false;
    requestAnimationFrame(() => scene.classList.add('is-active'));
    DiaryAudio.play('pageturn', { volume: .5 });

    const page = scene.querySelector('#epilogue-page');
    setTimeout(() => page.classList.add('is-visible'), 200);

    // quelques secondes de lecture, sans bouton, puis fermeture automatique
    setTimeout(() => {
      showClosingCover();
    }, 4200);
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
    DiaryAudio.play('whoosh', { volume: .4 });
    const cover = scene.querySelector('#epilogue-cover');
    requestAnimationFrame(() => cover.classList.add('is-visible'));

    setTimeout(() => {
      scene.querySelector('#line-end').classList.add('is-visible');
    }, 900);
    setTimeout(() => {
      scene.querySelector('#line-beginning').classList.add('is-visible');
    }, 2000);

    setTimeout(() => {
      cover.classList.add('is-fading');
      setTimeout(() => showFinalTease(), 1300);
    }, 4200);
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
        if(window.HourglassFlow) window.HourglassFlow.start();
      }, 700);
    }, 3600);
  }

  return { start };
})();

/* --------------------------------------------------------------------------
   Le sablier — fin ouverte, boucle infinie.
   -------------------------------------------------------------------------- */
window.HourglassFlow = (function(){
  function start(){
    const scene = document.getElementById('scene-hourglass');
    scene.innerHTML = `
      <div class="hourglass-scene">
        <div class="hourglass">
          <div class="frame"></div>
          <div class="sand-top"></div>
          <div class="stream"></div>
          <div class="sand-bottom"></div>
        </div>
        <p class="hourglass-caption">Tic tac...</p>
      </div>
    `;
    scene.hidden = false;
    requestAnimationFrame(() => scene.classList.add('is-active'));
  }
  return { start };
})();