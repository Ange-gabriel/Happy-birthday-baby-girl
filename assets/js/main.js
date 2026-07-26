/* ==========================================================================
   THE GABRIEL'S DIARIES — main.js — ÉTAPE 1
   Bootstrap général : bascule du son, déclenchement de l'intro.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  //const btnWake = document.getElementById('btn-wake');
  const muteToggle = document.getElementById('mute-toggle');

  /*btnWake.addEventListener('click', () => {
    IntroFlow.start();
  }, { once: true });*/

  let muted = false;
  muteToggle.addEventListener('click', () => {
    muted = !muted;
    DiaryAudio.setMuted(muted);
    muteToggle.textContent = muted ? '🔇' : '🔈';
    muteToggle.classList.toggle('is-muted', muted);
  });
  IntroFlow.start();
});