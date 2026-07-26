/* ==========================================================================
   THE GABRIEL'S DIARIES — diary-content.js
   Données brutes du journal. Le texte est reproduit EXACTEMENT tel que
   fourni par l'utilisateur : aucun mot ajouté, supprimé ou reformulé.
   Marqueurs [[elle]]/[[b]] : mise en valeur visuelle uniquement.
   ========================================================================== */

window.DiaryContent = (function(){

  function decorate(html){
    return html
      .replace(/\[\[elle\]\]/g, '<em class="elle">')
      .replace(/\[\[\/elle\]\]/g, '</em>')
      .replace(/\[\[b\]\]/g, '<strong class="emphasis">')
      .replace(/\[\[\/b\]\]/g, '</strong>');
  }

  const PAGE_1 = `
<p>Un hasard ? Je ne pense pas ! L'ensemble des évènements qui nous ont réuni est tellement improbable que je me dis que c'est [[b]]l'ouvre du scénariste là haut[[/b]] qui ne faisait qu'écrire notre histoire, une qui ne fait que commencer.</p>
<p>Je ne saurais expliquer comment tout ça a commencé, je sais juste ce que c'est devenu. Ce qu'[[elle]]elle[[/elle]] est devenue pour moi. Un repère, un refuge, une partie intégrante de moi, ma colocataire dans ma petite bulle la seule qui a jamais ait pu y entrer, d'ailleurs [[elle]]elle[[/elle]] ne paie pas le loyer.</p>`;

  const PAGE_2 = `
<p>Dans ma tête, dans mes pensées [[elle]]elle[[/elle]] est partout. C'est la première fois de ma vie que je raconte tout ce qui m'arrive à quelqu'un. La première fois que mon humeur toute entière dépende de comment [[elle]]elle[[/elle]] m'écrit, me sourit, la première fois que j'overthink pour un rien, la première fois que la voir avec quelqu'un d'autre me fait un si gros vide que la seule façon de le combler soit de m'éloigner, la première fois que certains de mes besoins deviennent secondaires.</p>
<p>Ce n'est pas une déclaration à la Roméo et Juliette, loin de là. L'amour que je ressens pour [[elle]]elle[[/elle]], c'est quelle chose de beaucoup plus symbolique. Quand je dis que je l'aime, ce n'est pas comme Ivan aime Angela, c'est comme Gabriel aime Johanne, quelque chose d'inédit jusqu'ici, que je ne comprends pas toujours mais qui j'espère grandira encore et encore et encore parce que même si Dr strange se mettait à chercher, il n'y aura pas une seule réalité ou j'aimerais la perdre.</p>
<p>[[b]]Je l'aime tellement cette fille.[[/b]]</p>`;

  const PAGE_6 = `
<p>Tu me prends sûrement pour un fou, mais que dire ? [[elle]]Elle[[/elle]] me fait délirer. Parlant de délire, j'ai créé ce que j'ai appelé une "[[b]]crise d'elle[[/b]]". C'est ce moment où devant l'une de ses photos ou vidéos je deviens comme hypnotisé, un sourire chelou se dessine sur mon visage et mes yeux sont comme figés sur mon écran.</p>
<p>À ce moment, je me rends compte d'à quel point [[elle]]elle[[/elle]] est belle, d'à quel point chaque centimètre de son corps mérite d'être exposé à un musée. Ah je sais, "J'exagère" mais aujourd'hui comme tous les jours, je ne fais qu'exprimer ce que mes sens essaient de me faire comprendre.</p>
<p>Alors oui, à force, [[elle]]elle[[/elle]] en devient gênée, j'essaie de comprendre mais je n'y peut rien. Je ne peux pas m'empêcher de l'apprécier ! Je ne peux pas m'empêcher de l'admirer. Si ça c'est un crime, qu'on me coupe la tête ! Tout ce que je pourrais lui dire c'est qu'[[elle]]elle[[/elle]] devra s'y faire parce que je ne peux tout simplement pas m'arrêter.</p>`;

  const PAGE_7 = `
<p>Tu sais journal, je te parlerai d'[[elle]]elle[[/elle]] encore et encore, même après mes 100 ans. Ah j'y pense la raison première pour laquelle je t'ai ouvert aujourd'hui c'est parce que c'est son anniversaire.</p>
<p>J'ai tellement attendu ce moment, je devais même agaçant à force de me plaindre de la lenteur du temps, et [[elle]]elle[[/elle]] était là à me dire "c'est un jour comme les autres". Aujourd'hui a certes 24h, mais tout ce qui la concerne à mes yeux méritent qu'on en fasse tout un film. Alors si pour [[elle]]elle[[/elle]] ce jour ne représente rien, pour moi c'est [[b]]Le Jour où nos histoires ont réellement commencées[[/b]].</p>
<p>Je lui écrirai un petit mot qui j'espère sera inoubliable pour lui souhaiter un merveilleux anniversaire, aussi merveilleux qu'[[elle]]elle[[/elle]]. Sans parler du cadeau ! J'ai essayé de ne pas <span class="rature">"en faire trop"</span></p>`;

  const PAGE_8 = `
<p>Chers journal, [[elle]]elle[[/elle]] par ci, [[elle]]elle[[/elle]] par là, tu devrais déjà être habitué à force je ne me lasserai jamais de te parler d'[[elle]]elle[[/elle]]. Notre histoire ne fait que commencer, et j'utiliserai tes pages pour l'écrire. Et si jamais [[elle]]elle[[/elle]] venait à te lire, pourvu que ça lui donne le sourire.</p>
<p class="final-line">I found her, the love of my life.</p>`;

  function loveWallHTML(count){
    let html = '<div class="love-wall">';
    for(let i = 0; i < count; i++) html += '<span>Je l\'aime !</span> ';
    html += '</div>';
    return html;
  }

  /* 7 feuilles recto/verso — la dernière face (verso de la 7e feuille)
     reste vide : le journal se tait juste avant la lettre. */
  const SHEETS = [
    { date: '27 / 07', recto: decorate(PAGE_1), verso: decorate(PAGE_2) },
    { date: '27 / 07', recto: loveWallHTML(70),  rectoLove: 1, verso: loveWallHTML(85),  versoLove: 2 },
    { date: '27 / 07', recto: loveWallHTML(100), rectoLove: 3, verso: loveWallHTML(115), versoLove: 4 },
    { date: '27 / 07', recto: loveWallHTML(130), rectoLove: 5, verso: loveWallHTML(145), versoLove: 6 },
    { date: '27 / 07', recto: loveWallHTML(160), rectoLove: 7, verso: loveWallHTML(175), versoLove: 8 },
    { date: '27 / 07', recto: decorate(PAGE_6), verso: decorate(PAGE_7) },
    { date: '27 / 07', recto: decorate(PAGE_8), verso: null, isLast: true }
  ];

  /* index de face linéaire : feuille i, recto = i*2, verso = i*2+1 */
  const AVATAR_MOMENTS = {
    2: { emoji: '🤣', text: 'Je crois qu\'il est fou ce type. Oui fou de toi.' },
    10: { emoji: '🙈', text: 'Une "crise d\'elle", il est malade.' },
    11: { emoji: '🥹', text: 'Celle-là, je l\'ai senti pleurer en l\'écrivant.' }
  };

  return { SHEETS, AVATAR_MOMENTS, decorate };
})();