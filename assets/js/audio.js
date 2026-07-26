/* ==========================================================================
   THE GABRIEL'S DIARIES — audio.js
   Gestionnaire de sons. Ajout de la chanson du journal : elle coupe
   l'ambiance en fondu et joue jusqu'à la fin.
   ========================================================================== */

window.DiaryAudio = (function(){
  const KEYS = ['ambient','glitch','whoosh','type','success','error','pageturn','bookopen','finalchime','song'];
  const els = {};
  KEYS.forEach(k => { els[k] = document.getElementById('snd-' + k); });

  let muted = false;
  let ambientFadeInterval = null;
  let songFadeInterval = null;

  function play(name, opts = {}){
    const el = els[name];
    if(!el || muted) return;
    try{
      if(opts.overlap){
        const node = el.cloneNode(true);
        node.volume = opts.volume ?? 0.55;
        node.play().catch(() => {});
        node.addEventListener('ended', () => node.remove());
        return;
      }
      el.volume = opts.volume ?? 0.55;
      el.currentTime = 0;
      el.play().catch(() => {});
    }catch(e){ /* silencieux si le fichier son n'existe pas encore */ }
  }

  function startAmbient(){
    const el = els.ambient;
    if(!el) return;
    el.volume = 0.16;
    el.play().catch(() => {});
  }

  function stopAmbient(){ els.ambient && els.ambient.pause(); }

  function fadeOutAmbient(duration = 1800){
    const el = els.ambient;
    if(!el) return;
    clearInterval(ambientFadeInterval);
    const steps = 30;
    const stepTime = duration / steps;
    let vol = el.volume;
    const decrement = vol / steps;
    ambientFadeInterval = setInterval(() => {
      vol = Math.max(0, vol - decrement);
      el.volume = vol;
      if(vol <= 0){
        clearInterval(ambientFadeInterval);
        el.pause();
      }
    }, stepTime);
  }

  /* La chanson du journal : coupe l'ambiance en fondu, puis joue en
     boucle jusqu'à la fin de l'expérience (lettre, épilogue, bougie). */
  function playSong(opts = {}){
    if(muted) return;
    fadeOutAmbient(1600);
    const el = els.song;
    if(!el) return;
    el.loop = true;
    clearInterval(songFadeInterval);
    el.volume = 0;
    el.currentTime = 0;
    el.play().catch(() => {});
    const target = opts.volume ?? 0.5;
    const steps = 30;
    const duration = 2200;
    let vol = 0;
    const increment = target / steps;
    songFadeInterval = setInterval(() => {
      vol = Math.min(target, vol + increment);
      el.volume = vol;
      if(vol >= target) clearInterval(songFadeInterval);
    }, duration / steps);
  }

  function stopSong(){ els.song && els.song.pause(); }

  function setMuted(v){
    muted = v;
    Object.values(els).forEach(el => { if(el) el.muted = v; });
  }

  return { play, startAmbient, stopAmbient, fadeOutAmbient, playSong, stopSong, setMuted, get muted(){ return muted; } };
})();