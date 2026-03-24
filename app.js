const STORAGE_KEY = "nova_tasks_v5";
const MAX_LEVEL = 99;
const XP_PER_LEVEL_BASE = 175; // ~30% faster than 250
const GEM_GLOBAL_BONUS = 1.2; // +20% gem gains
const IMPORTANCE = { 1: "Faible", 2: "Moyenne", 3: "Élevée" };
const STATE_ORDER = { inprogress: 0, failed: 1, completed: 2 };
const mailboxNames = { global: "Toutes", inprogress: "En cours", completed: "Terminées", failed: "Échouées" };
const STATE_LABELS = { inprogress: "En cours", completed: "Terminé", failed: "Échoué" };


/** 10 dégradés « purs » + 10 dégradés + motif */
const SKIN_SOLID_GRADIENTS = [
  "linear-gradient(135deg,hsl(210 55% 22%) 0%,hsl(228 42% 12%) 100%)",
  "linear-gradient(135deg,hsl(24 52% 20%) 0%,hsl(12 46% 11%) 100%)",
  "linear-gradient(135deg,hsl(198 50% 20%) 0%,hsl(215 40% 11%) 100%)",
  "linear-gradient(135deg,hsl(292 48% 20%) 0%,hsl(310 38% 11%) 100%)",
  "linear-gradient(135deg,hsl(42 50% 20%) 0%,hsl(32 44% 11%) 100%)",
  "linear-gradient(135deg,hsl(218 45% 18%) 0%,hsl(235 38% 10%) 100%)",
  "linear-gradient(135deg,hsl(338 48% 20%) 0%,hsl(350 40% 11%) 100%)",
  "linear-gradient(135deg,hsl(165 46% 19%) 0%,hsl(178 38% 10%) 100%)",
  "linear-gradient(135deg,hsl(248 50% 21%) 0%,hsl(265 42% 11%) 100%)",
  "linear-gradient(135deg,hsl(32 48% 19%) 0%,hsl(22 42% 10%) 100%)"
];

const SKIN_SOLID_HUES = [212, 22, 200, 300, 38, 225, 345, 170, 255, 28];


/** 3 thèmes animés (dégradé + animation de fond) */
const THEME_MOTION_DATA = [
  [
    `linear-gradient(155deg, hsl(312 44% 12%) 0%, hsl(268 40% 10%) 40%, hsl(328 38% 9%) 90%),
     repeating-linear-gradient(60deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 10px)`,
    302
  ],
  [
    `linear-gradient(178deg, hsl(198 50% 10%) 0%, hsl(218 46% 14%) 35%, hsl(178 42% 8%) 85%),
     radial-gradient(circle at 30% 30%, rgba(255,255,255,0.04) 0%, transparent 70%),
     radial-gradient(circle at 70% 70%, rgba(255,255,255,0.03) 0%, transparent 60%)`,
    206
  ],
  [
    `linear-gradient(148deg, hsl(26 50% 11%) 0%, hsl(8 46% 13%) 45%, hsl(18 48% 9%) 95%),
     repeating-conic-gradient(from 0deg, rgba(255,255,255,0.03) 0deg 12deg, transparent 12deg 24deg)`,
    22
  ]
];
const THEME_SOLID_DATA = [
  ["linear-gradient(148deg, #0a1628 0%, #0d2038 48%, #050a12 100%)", 218],
  ["linear-gradient(158deg, hsl(152 38% 9%) 0%, hsl(172 34% 16%) 50%, hsl(135 30% 7%) 100%)", 160],
  ["linear-gradient(135deg, hsl(228 48% 9%) 0%, hsl(258 42% 16%) 100%)", 242],
  ["linear-gradient(168deg, hsl(168 36% 10%) 0%, hsl(195 32% 15%) 100%)", 180],
  ["linear-gradient(145deg, hsl(348 44% 10%) 0%, hsl(318 40% 14%) 100%)", 338],
  ["linear-gradient(152deg, hsl(40 46% 10%) 0%, hsl(52 40% 14%) 100%)", 44],
  ["linear-gradient(162deg, hsl(288 40% 11%) 0%, hsl(308 36% 15%) 100%)", 298],
  ["linear-gradient(150deg, hsl(30 48% 10%) 0%, hsl(18 42% 13%) 100%)", 28],
  ["linear-gradient(175deg, hsl(202 42% 9%) 0%, hsl(218 38% 15%) 100%)", 210],
  ["linear-gradient(156deg, hsl(212 38% 8%) 0%, hsl(232 34% 17%) 100%)", 222],
  ["linear-gradient(154deg, hsl(8 50% 11%) 0%, hsl(358 44% 9%) 100%)", 8],
  ["linear-gradient(170deg, hsl(98 36% 10%) 0%, hsl(118 32% 14%) 100%)", 108],
  ["linear-gradient(140deg, hsl(206 32% 10%) 0%, hsl(220 28% 16%) 100%)", 212],
  ["linear-gradient(160deg, hsl(302 38% 11%) 0%, hsl(282 36% 14%) 100%)", 292],
  ["linear-gradient(155deg, hsl(268 36% 11%) 0%, hsl(248 34% 15%) 100%)", 262]
];

/** 5 thèmes avec calque motif (pat-0 … pat-4) */
const THEME_PATTERN_DATA = [
  ["linear-gradient(165deg, hsl(258 42% 11%) 0%, hsl(228 40% 17%) 100%)", 248],
  ["linear-gradient(175deg, hsl(36 46% 10%) 0%, hsl(22 42% 14%) 100%)", 30],
  ["linear-gradient(178deg, hsl(198 46% 9%) 0%, hsl(212 40% 15%) 100%)", 204],
  ["linear-gradient(150deg, hsl(10 50% 11%) 0%, hsl(352 44% 14%) 100%)", 4],
  ["linear-gradient(162deg, hsl(92 36% 10%) 0%, hsl(112 32% 14%) 100%)", 100]
];

/** 10 calques « motif » pour skins (10–19) — visibles au-dessus du dégradé */
const SKIN_PATTERN_OVERLAYS = [
  "repeating-linear-gradient(0deg, rgba(255,255,255,0.11) 0, rgba(255,255,255,0.11) 1px, transparent 1px, 14px)",
  "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1.5px, transparent 1.6px)",
  "repeating-linear-gradient(60deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 1px, 16px)",
  "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.09) 0deg 5deg, transparent 5deg 10deg)",
  "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0, rgba(255,255,255,0.07) 1px, transparent 1px, 12px), repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, 12px)",
  "linear-gradient(135deg, rgba(255,255,255,0.06) 25%, transparent 25% 50%, rgba(255,255,255,0.06) 50% 75%, transparent 75%)",
  "repeating-linear-gradient(120deg, rgba(255,200,120,0.12) 0, rgba(255,200,120,0.12) 1px, transparent 1px, 18px)",
  "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.1) 0, transparent 55%)",
  "repeating-linear-gradient(45deg, rgba(180,220,255,0.1) 0, rgba(180,220,255,0.1) 2px, transparent 2px, 14px)",
  "repeating-linear-gradient(270deg, rgba(120,255,200,0.09) 0, rgba(120,255,200,0.09) 1px, transparent 1px, 11px)"
];

/** 15 dégradés + 5 à motif + 3 animés = 23 thèmes */
const THEME_NAMES = [
  "Aube Glacée","Feuille Sombre","Rivage Indigo","Céladon Doux","Poudre Cerise",
  "Sable Caramel","Mauve Veille","Épice Safran","Pin Boréal","Ardoise Minuit",
  "Corail Profond","Olive Sereine","Graphite Brume","Prune Velours","Brise Lavande",
  "Trame Lumière","Grille Quartz","Pluie Étoilée","Rayon Zébré","Éventail",
  "Aurore Flux","Nébuleuse V","Marée V"
];

/** 10 skins dégradés + 10 skins à motif = 20 */
const SKIN_NAMES = [
  "Brume Polaire","Forge Cuivre","Verre Fjord","Velours Prune","Ambre Doux",
  "Nuit Pétrole","Rose Granit","Émeraude Brume","Saphir Nuit","Cannelle Miel",
  "Carreaux Nuit","Points Ciel","Maille Cuivre","Éventail","Grille Indigo",
  "Vagues","Étoiles","Rayures","Hexagones","Trame Verte"
];

const AVATAR_CIRCLE_NAMES = [
  "Aurora Halo","Ember Orbit","Jade Circuit","Solar Flare","Prism Ring","Obsidian Rim","Neon Pulse","Violet Storm","Midnight Orbit","Mint Glow",
  "Neon Magenta","Neon Gold","Neon Azure","Neon Coral","Neon Lime"
];

const SIDEBAR_TIPS = [
  "Découpe les gros objectifs en mini étapes — le mouvement bat la perfection.",
  "Règle des 2 minutes : si ça prend moins de 2 min, fais-le direct.",
  "Regroupe les tâches similaires — changer de contexte te coûte cher.",
  "Estime ton temps puis ×1,3 — on est toujours trop optimistes.",
  "Ton futur toi te remerciera pour des prochaines étapes claires.",
  "Termine ce que tu commences — moins de charge mentale.",
  "Gérer ton énergie > gérer ton temps.",
  "Célèbre tes progrès — les petites victoires comptent.",
  "Si c’est pas planifié, ça n’existe pas.",
  "Fais un bilan chaque semaine — garde l’utile, supprime le reste.",
  "Note un truc positif avant de dormir — ça change ton mindset.",
  "Protège ton sommeil comme un rendez-vous important.",
  "Fais un petit progrès aujourd’hui — la régularité gagne.",
  "Explique ce que tu apprends — tu vois direct tes failles.",
  "Bloque du temps de focus dans ton agenda.",
  "Un bon système vaut mieux que 5 apps inutilisées.",
  "Marche après un effort — ton cerveau bosse en fond.",
  "Dis non aux distractions pour dire oui à l’essentiel.",
  "Les erreurs sont des données, pas des échecs.",
  "Les derniers 10% font souvent toute la différence.",

  "Commence par la tâche la plus dure — effet libérateur.",
  "3 priorités par jour max — le reste est bonus.",
  "Écris tes tâches en mode action, pas vague.",
  "Fixe des deadlines artificielles pour avancer.",
  "Prépare ta journée la veille.",
  "Travaille en sessions de 25 min si t’as du mal à te lancer.",
  "Supprime 1 tâche inutile par jour.",
  "Aie toujours une version facile de ta tâche.",
  "Note tout — ne fais pas confiance à ta mémoire.",
  "Optimise ton planning comme un jeu.",

  "Fais une seule chose à la fois — le multitâche est un piège.",
  "Utilise ton pic d’énergie pour les tâches importantes.",
  "La motivation vient après l’action.",
  "Commence par 5 minutes — souvent ça suffit.",
  "Coupe les notifications pendant le travail.",
  "Un environnement calme = meilleur focus.",
  "Change de lieu si t’es bloqué.",
  "Protège ton attention comme une ressource rare.",
  "Simplifie au maximum tes tâches.",
  "Accepte l’ennui — il booste la réflexion.",

  "Tu ne peux pas tout faire — choisis l’essentiel.",
  "La discipline bat la motivation.",
  "Agir imparfaitement vaut mieux que ne rien faire.",
  "Chaque jour est une nouvelle tentative.",
  "Ton environnement influence ton comportement.",
  "Rends les bonnes habitudes faciles à faire.",
  "Rends les mauvaises habitudes difficiles.",
  "Compare-toi à toi d’hier, pas aux autres.",
  "Les résultats viennent avec le temps.",
  "Fais confiance au processus, pas aux émotions.",
  "You are the player. Wake up."
  
];

const THEMES = makeThemes();
const SKINS = makeSkins();
const AVATAR_CIRCLES = makeAvatarCircles();
const state = loadState();
const ui = {
  section: "tasks",
  mailbox: "global",
  sortBy: "deadline",
  taskSearch: "",
  expandedTasks: {},
  expandedSteps: {},
  carouselIndex: 0,
  carouselTimer: null,
  tipIndex: 0,
  tipTimer: null,
  exportFilter: "",
  exportTagFilter: new Set(),
  /** { y, m } month shown in sidebar calendar (m = 0–11) */
  calendarMonth: null
};



function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s) {
  return String(s).replace(/"/g, "&quot;");
}

/** Variables UI (boutons / barre) cohérentes avec la teinte du thème */
function themeVarsFromHue(hue) {
  const h2 = (hue + 52) % 360;
  return {
    "--btn-bg": `hsla(${hue} 40% 29% / 0.92)`,
    "--btn-bg-hover": `hsla(${(hue + 16) % 360} 46% 37% / 0.96)`,
    "--progress-fill": `linear-gradient(90deg,hsl(${hue} 82% 66%), hsl(${h2} 72% 56%))`
  };
}







function makeThemes() {
  const out = [];
  let i = 0;
  THEME_SOLID_DATA.forEach(([bg, hue]) => {
    out.push({
      id: `theme-${i + 1}`,
      name: THEME_NAMES[i],
      kind: "solid",
      themeFx: "",
      preview: bg,
      cost: 160 + i * 26,
      levelReq: 1 + Math.floor(i / 3),
      vars: { "--bg-main": bg, ...themeVarsFromHue(hue) }
    });
    i++;
  });
  THEME_PATTERN_DATA.forEach(([bg, hue], j) => {
    out.push({
      id: `theme-${i + 1}`,
      name: THEME_NAMES[i],
      kind: "pattern",
      themeFx: `pat-${j}`,
      preview: bg,
      cost: 160 + i * 26,
      levelReq: 1 + Math.floor(i / 3),
      vars: { "--bg-main": bg, ...themeVarsFromHue(hue) }
    });
    i++;
  });
  THEME_MOTION_DATA.forEach(([bg, hue], j) => {
    out.push({
      id: `theme-${i + 1}`,
      name: THEME_NAMES[i],
      kind: "motion",
      themeFx: `anim-${j}`,
      preview: bg,
      cost: 160 + i * 26,
      levelReq: 1 + Math.floor(i / 3),
      vars: { "--bg-main": bg, ...themeVarsFromHue(hue) }
    });
    i++;
  });
  return out;
}



function makeSkins() {
  const out = [];
  for (let i = 0; i < 10; i++) {
    const h = SKIN_SOLID_HUES[i];
    const h2 = (h + 58) % 360;
    const grad = SKIN_SOLID_GRADIENTS[i];
    out.push({
      id: `skin-${i + 1}`,
      name: SKIN_NAMES[i],
      skinKind: "solid",
      className: "",
      css: grad,
      canvasHue1: h,
      canvasHue2: h2,
      canvasL1: 22,
      canvasL2: 12,
      cost: 280 + i * 48,
      levelReq: 1 + Math.floor(i / 4)
    });
  }
  const patHues = [225, 200, 32, 280, 210, 300, 40, 175, 250, 110];
  for (let i = 0; i < 10; i++) {
    const idx = 10 + i;
    const h = patHues[i];
    const h2 = (h + 68) % 360;
    const grad = `linear-gradient(135deg,hsl(${h} 58% 23%) 0%,hsl(${h2} 48% 11%) 100%)`;
    const css = `${SKIN_PATTERN_OVERLAYS[i]}, ${grad}`;
    out.push({
      id: `skin-${idx + 1}`,
      name: SKIN_NAMES[idx],
      skinKind: "pattern",
      className: "skin-fx-pat",
      css,
      canvasHue1: h,
      canvasHue2: h2,
      canvasL1: 23,
      canvasL2: 11,
      cost: 560 + i * 72,
      levelReq: 1 + Math.floor(idx / 4)
    });
  }
  return out;
}

function makeAvatarCircles() {
  return Array.from({ length: 15 }, (_, i) => ({
    id: `circle-${i + 1}`,
    name: AVATAR_CIRCLE_NAMES[i],
    className: `circle-${i + 1}`,
    cost: 400 + i * 110,
    levelReq: 2 + Math.floor(i / 2)
  }));
}

function initialState() {
  return {
    gems: 0,
    totalGemsEarned: 0,
    level: 1,
    xp: 0,
    tasks: [],
    tags: [],
    viewed: {},
    mailboxUnread: { global: false, failed: false },
    themeOwned: ["theme-1"],
    skinOwned: ["skin-1"],
    avatarCircleOwned: ["circle-1"],
    activeTheme: "theme-1",
    activeAvatarCircle: "circle-1",
    shopPromo: null,
    profile: { name: "Player", avatar: "", weeklyDone: 0, totalDone: 0, shareCardSkinId: "skin-1" },
    settings: { sidebarTips: true, compactLists: false, proMode: false, uiTheme: "dark" }
  };
}

function normalizeTag(t) {
  if (!t || !t.id) return null;
  return { id: t.id, name: t.name || "Tag", color: t.color || "#7aa2ff", description: t.description || "" };
}

function normalizeTask(task) {
  if (task.deadline && !task.deadlineTs) task.deadlineTs = new Date(task.deadline).getTime();
  if (!task.createdAt) task.createdAt = Date.now();
  task.steps = (task.steps || []).map((s) => {
    const children = (s.children || s.substeps || []).map((c) => ({
      id: c.id || uid(),
      title: c.title || "Sub-step",
      description: c.description || "",
      importance: c.importance || 1,
      completed: !!c.completed
    }));
    let completed = !!s.completed;
    if (children.length && children.every((c) => c.completed)) completed = true;
    return {
      id: s.id || uid(),
      title: s.title || "Step",
      description: s.description || "",
      importance: s.importance || 1,
      completed,
      children
    };
  });
  task.tags = (task.tags || []).filter(Boolean);
  if (!task.skinId) task.skinId = "skin-1";
  return task;
}

function normalizeCatalogIds(merged) {
  const validT = new Set(THEMES.map((t) => t.id));
  if (!validT.has(merged.activeTheme)) merged.activeTheme = "theme-1";
  merged.themeOwned = [...new Set((merged.themeOwned || []).filter((id) => validT.has(id)))];
  if (!merged.themeOwned.includes("theme-1")) merged.themeOwned.unshift("theme-1");

  const validS = new Set(SKINS.map((s) => s.id));
  merged.skinOwned = [...new Set((merged.skinOwned || []).filter((id) => validS.has(id)))];
  if (!merged.skinOwned.includes("skin-1")) merged.skinOwned.unshift("skin-1");
  (merged.tasks || []).forEach((t) => {
    if (!validS.has(t.skinId)) t.skinId = "skin-1";
  });
  if (!SKINS.find((x) => x.id === merged.profile?.shareCardSkinId)) {
    merged.profile.shareCardSkinId = merged.skinOwned[0] || "skin-1";
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : initialState();
    const merged = { ...initialState(), ...parsed };
    merged.profile = { ...initialState().profile, ...(merged.profile || {}) };
    merged.tags = (merged.tags || []).map(normalizeTag).filter(Boolean);
    merged.tasks = (merged.tasks || []).map(normalizeTask);
    if (!merged.avatarCircleOwned) merged.avatarCircleOwned = ["circle-1"];
    if (!merged.activeAvatarCircle) merged.activeAvatarCircle = "circle-1";
    if (!merged.settings) merged.settings = { ...initialState().settings };
    merged.settings = { ...initialState().settings, ...merged.settings };
    if (!merged.profile.shareCardSkinId || !(merged.skinOwned || []).includes(merged.profile.shareCardSkinId)) {
      merged.profile.shareCardSkinId = (merged.skinOwned || []).includes("skin-1") ? "skin-1" : (merged.skinOwned || [])[0] || "skin-1";
    }
    delete merged.activeRing;
    delete merged.prestigeOwned;
    normalizeCatalogIds(merged);
    return merged;
  } catch {
    return initialState();
  }
}

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return Math.abs(h);
}

function getDayKey() {
  return new Date().toISOString().slice(0, 10);
}

function ensureShopPromo() {
  const dk = getDayKey();
  let p = state.shopPromo;
  if (!p || p.dayKey !== dk) {
    const h = hashString(dk + "nova-shop-promo");
    const ti = h % THEMES.length;
    const si = (h >> 6) % SKINS.length;
    const ci = (h >> 12) % 15;
    p = {
      dayKey: dk,
      discount: 10 + (h % 31),
      themeId: `theme-${ti + 1}`,
      skinId: `skin-${si + 1}`,
      circleId: `circle-${ci + 1}`
    };
    state.shopPromo = p;
    save();
  }
  return p;
}

function promoPrice(base, itemId, kind, promo) {
  if (!promo) return base;
  const match = (kind === "theme" && promo.themeId === itemId) || (kind === "skin" && promo.skinId === itemId) || (kind === "circle" && promo.circleId === itemId);
  if (!match) return base;
  return Math.max(1, Math.floor(base * (1 - promo.discount / 100)));
}

function toDayString(ts) {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day} ${h}:${min}`;
}

function daysLeft(ts) { return Math.ceil((ts - Date.now()) / 86400000); }

/** Date locale pour <input type="date"> (évite le décalage UTC de toISOString). */
function toDateInputValue(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Nombre de jours calendaires entre aujourd’hui (local) et l’échéance (local). */
function daysFromTodayToDeadline(ts) {
  const now = new Date();
  const target = new Date(ts);
  const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const t1 = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  return Math.round((t1 - t0) / 86400000);
}

function flattenTaskItems(task) {
  const out = [];
  task.steps.forEach((s) => {
    out.push(s);
    s.children.forEach((c) => out.push(c));
  });
  return out;
}

function computeProgress(task) {
  const all = flattenTaskItems(task);
  if (!all.length) return task.completed ? 100 : 0;
  return Math.round((all.filter((x) => x.completed).length / all.length) * 100);
}

/** Toutes les étapes sont cochées — active le bouton Compléter */
function taskAllItemsDone(task) {
  if (!task.steps || !task.steps.length) return true;
  return task.steps.every((s) => s.completed);
}

function getTaskSkin(task) {
  const id = task.skinId || "skin-1";
  return SKINS.find((s) => s.id === id) || SKINS[0];
}

/** Base gem before speed & global bonus */
function awardBase(kind, importance) {
  const base = kind === "task" ? 30 : kind === "step" ? 10 : 5;
  return Math.round(base * [0, 1, 1.4, 1.8][importance]);
}

/** Faster completion within [created → deadline] window => higher multiplier */
function getSpeedMultiplier(task) {
  const created = task.createdAt || Date.now();
  const windowMs = Math.max(60_000, task.deadlineTs - created);
  const elapsed = Math.max(0, Date.now() - created);
  const ratio = Math.min(1, elapsed / windowMs);
  return 1 + 0.45 * (1 - ratio);
}

function grantGems(task, baseAmount) {
  const amt = Math.round(baseAmount * getSpeedMultiplier(task) * GEM_GLOBAL_BONUS);
  state.gems += amt;
  state.totalGemsEarned += amt;
  state.xp += amt;
  while (state.xp >= state.level * XP_PER_LEVEL_BASE && state.level < MAX_LEVEL) {
    state.xp -= state.level * XP_PER_LEVEL_BASE;
    state.level += 1;
    toast(`🎉 Niveau ${state.level}`);
  }
  showTopGem(amt);
}

function penalizeFailure(task) {
  const penalty = Math.max(10, Math.round((task.expectedReward || 40) * 0.3));
  state.gems = Math.max(0, state.gems - penalty);
  if (state.level > 1) state.level -= 1;
  toast(`❌ Échec : −${penalty} gemmes et −1 niveau`);
}

function evaluateState() {
  let hasFailed = false;
  state.tasks.forEach((task) => {
    const wasFailed = task.state === "failed";
    if (task.state !== "completed" && Date.now() > task.deadlineTs) {
      task.state = "failed";
      if (!task.failedAt) task.failedAt = Date.now();
    }
    if (!wasFailed && task.state === "failed") {
      hasFailed = true;
      penalizeFailure(task);
    }
  });
  if (hasFailed) state.mailboxUnread.failed = true;
}

function filteredTasks() {
  let list = [...state.tasks];
  if (ui.mailbox !== "global") list = list.filter((t) => t.state === ui.mailbox);
  const q = (ui.taskSearch || "").trim().toLowerCase();
  if (q) {
    list = list.filter((t) => {
      if ((t.title || "").toLowerCase().includes(q)) return true;
      if ((t.description || "").toLowerCase().includes(q)) return true;
      return (t.tags || []).some((tid) => {
        const tag = state.tags.find((x) => x.id === tid);
        return tag && (tag.name || "").toLowerCase().includes(q);
      });
    });
  }
  list.sort((a, b) => {
    if (a.state !== b.state) return STATE_ORDER[a.state] - STATE_ORDER[b.state];
    if (ui.sortBy === "deadline") return a.deadlineTs - b.deadlineTs;
    if (ui.sortBy === "importance") return b.importance - a.importance;
    if (ui.sortBy === "progress") return computeProgress(b) - computeProgress(a);
    if (ui.sortBy === "tags") return (b.tags?.length || 0) - (a.tags?.length || 0);
    return 0;
  });
  return list;
}

function tagPillsHtml(tagIds) {
  return (tagIds || []).map((id) => {
    const t = state.tags.find((x) => x.id === id);
    if (!t) return "";
    const tip = escapeAttr(t.description || "");
    return `<span class="tag-pill" style="background:${t.color}22;border-color:${t.color}55;color:#f0f4ff" title="${tip}">${escapeHtml(t.name)}</span>`;
  }).join("");
}

function estimateReward(task) {
  const all = flattenTaskItems(task);
  if (!all.length) return awardBase("task", task.importance);
  if (!task.steps.some((s) => s.children.length)) return task.steps.reduce((sum, s) => sum + awardBase("step", s.importance), 0);
  return task.steps.reduce((sum, s) => sum + s.children.reduce((s2, c) => s2 + awardBase("sub", c.importance), 0), 0);
}

function mount() {
  bindGlobalEvents();
  bindDialogBackdropClose();
  bindSidebarToggle();
  renderAll();
  startClock();
  startSidebarTips();
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.ctrlKey && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      state.gems += 5000;
      state.level = MAX_LEVEL;
      state.xp = 0;
      toast("🔓 Debug: +5000 gems, max level");
      renderAll();
      return;
    }
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    const inField = tag === "input" || tag === "textarea" || tag === "select" || e.target?.isContentEditable;
    const openDialog = document.querySelector("dialog.dialog[open]");
    if (!inField && !openDialog) {
      if (e.altKey && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        openTaskDialog();
        return;
      }
      if (e.key === "/" || (e.ctrlKey && e.key === "k")) {
        e.preventDefault();
        const search = document.getElementById("taskSearch");
        search?.focus();
        search?.select?.();
        return;
      }
    }
    if (openDialog && (e.ctrlKey || e.metaKey) && e.key === "Enter") {
      const saveBtn = openDialog.querySelector("#saveTaskBtn, #tagSave");
      if (saveBtn && typeof saveBtn.click === "function") {
        e.preventDefault();
        saveBtn.click();
      }
    }
  });
}

function bindDialogBackdropClose() {
  document.querySelectorAll("dialog.dialog").forEach((dlg) => {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
  });
}

function bindSidebarToggle() {
  const btn = document.getElementById("sidebarToggle");
  const overlay = document.getElementById("sidebarOverlay");
  const closeSidebar = () => document.body.classList.remove("sidebar-open");
  if (btn) btn.addEventListener("click", () => document.body.classList.toggle("sidebar-open"));
  if (overlay) overlay.addEventListener("click", closeSidebar);
  // Close sidebar when a menu item or filter is clicked on mobile
  document.querySelectorAll(".menu-btn").forEach((b) => b.addEventListener("click", () => {
    if (window.innerWidth <= 768) closeSidebar();
  }));
  document.getElementById("mailboxFilters")?.addEventListener("click", () => {
    if (window.innerWidth <= 768) closeSidebar();
  });
}

function bindGlobalEvents() {
  document.querySelectorAll(".menu-btn").forEach((btn) => btn.addEventListener("click", () => {
    ui.section = btn.dataset.section;
    document.querySelectorAll(".menu-btn").forEach((x) => x.classList.remove("active"));
    btn.classList.add("active");
    animateSection();
    renderSections();
  }));
  document.getElementById("addTaskBtn").addEventListener("click", () => openTaskDialog());
  document.getElementById("addTagBtnToolbar").addEventListener("click", () => openTagDialog());
  document.getElementById("sortBy").addEventListener("change", (e) => { ui.sortBy = e.target.value; renderTasks(); });
  const searchEl = document.getElementById("taskSearch");
  if (searchEl) {
    const syncSearch = () => {
      ui.taskSearch = searchEl.value;
      renderTasks();
    };
    searchEl.addEventListener("input", syncSearch);
    searchEl.addEventListener("search", syncSearch);
  }
  document.getElementById("exportBtn").addEventListener("click", exportJsonDialog);
  document.getElementById("importInput").addEventListener("change", importJson);
}

function animateSection() {
  document.querySelectorAll(".section-view").forEach((el) => {
    el.classList.remove("fade-slide");
    void el.offsetWidth;
    el.classList.add("fade-slide");
  });
}

function startClock() {
  const el = document.getElementById("clockWidget");
  if (!el) return;
  const tick = () => {
    const now = new Date();
    const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const date = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    el.innerHTML = `<div class="clock-time">${time}</div><div class="clock-date">${date}</div>`;
  };
  tick();
  setInterval(tick, 1000);
}

function startSidebarTips() {
  const el = document.getElementById("sidebarTipBanner");
  let textEl = el.querySelector(".sidebar-tip-text");
  if (!textEl) {
    el.innerHTML = "<span class=\"sidebar-tip-text\"></span>";
    textEl = el.querySelector(".sidebar-tip-text");
  }
  clearInterval(ui.tipTimer);
  ui.tipTimer = null;
  if (!state.settings?.sidebarTips) {
    if (textEl) textEl.textContent = "";
    el.classList.add("sidebar-tip-off");
    return;
  }
  el.classList.remove("sidebar-tip-off");
  if (!textEl) return;
  const fadeMs = 480;
  const applyTipText = () => {
    let line = SIDEBAR_TIPS[ui.tipIndex];
    if (line.includes("Review weekly")) {
      const est = estimateWeeklySavedMinutes();
      if (est > 0) line += ` ~${est} min saved/week (est.).`;
    }
    textEl.textContent = line;
  };
  const advance = () => {
    textEl.classList.add("sidebar-tip-fade-out");
    setTimeout(() => {
      ui.tipIndex = (ui.tipIndex + 1) % SIDEBAR_TIPS.length;
      applyTipText();
      textEl.classList.remove("sidebar-tip-fade-out");
      textEl.classList.add("sidebar-tip-fade-in");
      requestAnimationFrame(() => {
        textEl.classList.remove("sidebar-tip-fade-in");
      });
    }, fadeMs);
  };
  ui.tipIndex = 0;
  applyTipText();
  ui.tipTimer = setInterval(advance, 10_000);
}

function estimateWeeklySavedMinutes() {
  const done = state.tasks.filter((t) => t.state === "completed").length;
  return Math.round(done * 12 * 0.7);
}

function applyBodySettings() {
  document.body.classList.toggle("compact-lists", !!state.settings?.compactLists);
  document.body.classList.toggle("pro-mode", !!state.settings?.proMode);
  const theme = state.settings?.uiTheme || "dark";
  if (theme === "dark") {
    document.documentElement.removeAttribute("data-ui-theme");
  } else {
    document.documentElement.dataset.uiTheme = theme;
  }
}

function renderAll() {
  evaluateState();
  ensureShopPromo();
  applyTheme();
  applyBodySettings();
  renderMailbox();
  renderNewsFeed();
  renderMiniCalendar();
  renderSections();
  renderTopbarStats();
  save();
}

function renderTopbarStats() {
  document.getElementById("gemCount").textContent = state.gems;
  document.getElementById("levelCount").textContent = state.level;
  document.getElementById("topDoneCount").textContent = state.tasks.filter((t) => t.state === "completed").length;
  document.getElementById("topInProgressCount").textContent = state.tasks.filter((t) => t.state === "inprogress").length;
}

function renderMailbox() {
  const root = document.getElementById("mailboxFilters");
  root.innerHTML = "";
  Object.keys(mailboxNames).forEach((key) => {
    const ico = key === "global" ? "bi-collection" : key === "inprogress" ? "bi-lightning-charge" : key === "completed" ? "bi-check2-circle" : "bi-x-octagon";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = ui.mailbox === key ? "mailbox-btn-active" : "";
    btn.setAttribute("aria-pressed", ui.mailbox === key ? "true" : "false");
    btn.innerHTML = `<i class="bi ${ico}" aria-hidden="true"></i> ${mailboxNames[key]} ${state.mailboxUnread[key] ? "<span class='dot' aria-label='nouveau'></span>" : ""}`;
    btn.onclick = () => { ui.mailbox = key; state.mailboxUnread[key] = false; renderTasks(); renderMailbox(); save(); };
    root.appendChild(btn);
  });
}

function renderOneMiniMonth(now, y, m, showTitle = true) {
  const first = new Date(y, m, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const labels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const deadlines = new Set();
  state.tasks.forEach((t) => {
    if (t.state === "completed") return;
    const d = new Date(t.deadlineTs);
    if (d.getFullYear() === y && d.getMonth() === m) deadlines.add(d.getDate());
  });
  let cells = labels.map((l) => `<span class="muted mini-cal-wd">${l}</span>`).join("");
  for (let i = 0; i < startWeekday; i++) cells += `<div class="mini-cal-day"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = now.getDate() === d && now.getMonth() === m && now.getFullYear() === y;
    const cls = ["mini-cal-day", "cal-clickable", deadlines.has(d) ? "has-task" : "", isToday ? "today" : ""].filter(Boolean).join(" ");
    cells += `<div class="${cls}" data-cal-y="${y}" data-cal-m="${m}" data-cal-d="${d}">${d}</div>`;
  }
  const title = new Date(y, m, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
  const head = showTitle
    ? `<div class="mini-cal-head"><strong>${title}</strong></div>`
    : "";
  return `<div class="mini-cal-block">
    ${head}
    <div class="mini-cal-grid">${cells}</div>
  </div>`;
}

function renderMiniCalendar() {
  const root = document.getElementById("miniCalendar");
  const now = new Date();
  if (!ui.calendarMonth) ui.calendarMonth = { y: now.getFullYear(), m: now.getMonth() };
  const y = ui.calendarMonth.y;
  const m = ui.calendarMonth.m;
  const active = state.tasks.filter((t) => t.state !== "completed").length;
  const monthTitle = new Date(y, m, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
  root.innerHTML = `<div class="mini-cal-head mini-cal-head-top"><span class="muted">${active} active</span></div>
    <div class="mini-cal-nav">
      <button type="button" class="mini-cal-nav-btn" id="miniCalPrev" aria-label="Mois précédent"><i class="bi bi-chevron-left"></i></button>
      <span class="mini-cal-nav-title">${monthTitle}</span>
      <button type="button" class="mini-cal-nav-btn" id="miniCalNext" aria-label="Mois suivant"><i class="bi bi-chevron-right"></i></button>
    </div>
    ${renderOneMiniMonth(now, y, m, false)}`;
  const stepMonth = (delta) => {
    let ny = y;
    let nm = m + delta;
    while (nm < 0) { nm += 12; ny -= 1; }
    while (nm > 11) { nm -= 12; ny += 1; }
    ui.calendarMonth = { y: ny, m: nm };
    renderMiniCalendar();
  };
  root.querySelector("#miniCalPrev").onclick = () => stepMonth(-1);
  root.querySelector("#miniCalNext").onclick = () => stepMonth(1);
  root.querySelectorAll("[data-cal-d]").forEach((el) => {
    el.onclick = () => openCalendarDayDialog(Number(el.dataset.calY), Number(el.dataset.calM), Number(el.dataset.calD));
  });
}

function openCalendarDayDialog(y, mo, d) {
  const dlg = document.getElementById("calendarDayDialog");
  const tasks = state.tasks.filter((t) => {
    const dt = new Date(t.deadlineTs);
    return dt.getFullYear() === y && dt.getMonth() === mo && dt.getDate() === d;
  });
  const dateStr = new Date(y, mo, d).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  dlg.innerHTML = `<form method="dialog" class="dialog-content">
    <h3><i class="bi bi-calendar3"></i> ${dateStr}</h3>
    <p class="muted">Objectifs dont la deadline tombe ce jour :</p>
    <div class="calendar-day-list">${tasks.length ? tasks.map((t) => `<div class="calendar-day-row"><strong>${escapeHtml(t.title)}</strong><br><small class="muted">${toDayString(t.deadlineTs)} · ${IMPORTANCE[t.importance]} · ${STATE_LABELS[t.state] || t.state}</small></div>`).join("") : "<p class='muted'>Aucune échéance ce jour.</p>"}</div>
    <div class="d-flex justify-content-end"><button type="submit" value="cancel" class="primary">Fermer</button></div>
  </form>`;
  dlg.showModal();
}

function renderSections() {
  // Redirect to profile if shop is requested in pro mode
  if (ui.section === "shop" && state.settings?.proMode) {
    ui.section = "profile";
    document.querySelectorAll(".menu-btn").forEach((x) => x.classList.remove("active"));
    document.querySelector('[data-section="profile"]')?.classList.add("active");
  }
  const hint = document.getElementById("toolbarHint");
  if (hint) hint.hidden = ui.section !== "tasks";
  ["tasks", "stats", "profile", "shop"].forEach((k) => document.getElementById(`${k}Section`).classList.toggle("hidden", ui.section !== k));
  if (ui.section === "tasks") renderTasks();
  if (ui.section === "stats") renderStats();
  if (ui.section === "profile") renderProfile();
  if (ui.section === "shop") renderShop();
}

function deleteSelectedTasks() {
  const ids = state.tasks.filter((t) => t.selected).map((t) => t.id);
  if (!ids.length) return;
  if (!confirm(`Supprimer ${ids.length} objectif(s) sélectionné(s) ?`)) return;
  state.tasks = state.tasks.filter((t) => !t.selected);
  toast("Objectifs supprimés");
  renderAll();
}

function clearTaskSelection() {
  state.tasks.forEach((t) => { t.selected = false; });
  save();
  renderTasks();
}

function renderTasks() {
  const root = document.getElementById("tasksSection");
  document.getElementById("taskDetailSection").classList.add("hidden");
  const list = filteredTasks();
  const selectedCount = state.tasks.filter((t) => t.selected).length;
  const q = (ui.taskSearch || "").trim();
  const emptyMsg = !state.tasks.length
    ? "Crée ta première tâche pour commencer à gagner des gemmes et de l’XP."
    : q
      ? `Aucun résultat pour « ${escapeHtml(q)} ». Essaie un autre mot ou réinitialise la recherche.`
      : "Aucune tâche dans ce filtre pour l’instant.";
  if (!list.length) {
    root.innerHTML = `<div class="empty-state card">
      <div class="empty-state-inner">
        <span class="empty-state-icon" aria-hidden="true"><i class="bi bi-inbox"></i></span>
        <p class="empty-state-title">Rien à afficher ici</p>
        <p class="muted empty-state-text">${emptyMsg}</p>
        <div class="empty-state-actions">
          ${q ? `<button type="button" class="primary" id="emptyClearSearch">Effacer la recherche</button>` : ""}
          <button type="button" class="${q ? "" : "primary"}" id="emptyAddTask">Nouvelle tâche</button>
        </div>
      </div>
    </div>`;
    const addBtn = root.querySelector("#emptyAddTask");
    if (addBtn) addBtn.onclick = () => openTaskDialog();
    const clearBtn = root.querySelector("#emptyClearSearch");
    if (clearBtn) {
      clearBtn.onclick = () => {
        const el = document.getElementById("taskSearch");
        if (el) el.value = "";
        ui.taskSearch = "";
        renderTasks();
      };
    }
    return;
  }
  const bulkBar = selectedCount > 0
    ? `<div class="bulk-bar card" role="region" aria-label="Sélection">
      <span class="bulk-bar-count"><strong>${selectedCount}</strong> sélectionné(s)</span>
      <div class="bulk-bar-actions">
        <button type="button" id="bulkClearSelection" class="btn-ghost">Tout désélectionner</button>
        <button type="button" id="bulkDeleteSelected" class="btn-delete-task"><i class="bi bi-trash" aria-hidden="true"></i> Supprimer</button>
      </div>
    </div>`
    : "";
  root.innerHTML = bulkBar + list.map((task) => {
    const p = computeProgress(task);
    const dLeft = daysLeft(task.deadlineTs);
    const expanded = !!ui.expandedTasks[task.id];
    const skin = getTaskSkin(task);
    const canComplete = taskAllItemsDone(task) && task.state === "inprogress";
    const completeDisabled = task.completed || task.state !== "inprogress" || !canComplete;
    return `<article class="task-card ${task.state}" data-task-id="${task.id}">
      <div class="task-skin-layer ${skin.className}"></div>
      <div class="task-card-inner">
      <div class="task-row" role="button" tabindex="0" data-task-row-toggle="${task.id}" aria-expanded="${expanded}" aria-label="Déplier ou replier ${escapeAttr(task.title)}">
        <span class="task-row-title"><input class="form-check-input custom-check me-1" type="checkbox" data-select="${task.id}" ${task.selected ? "checked" : ""} aria-label="Sélectionner ${escapeAttr(task.title)}"> <button type="button" class="tree-toggle" data-toggle-task="${task.id}" aria-hidden="true" tabindex="-1"><i class="bi ${expanded ? "bi-caret-down-fill" : "bi-caret-right-fill"}"></i></button> <span class="task-title-text">${escapeHtml(task.title)}</span></span>
        <span>${p}%</span>
        <span><span class="badge priority-${task.importance}">${IMPORTANCE[task.importance]}</span></span>
        <span>${toDayString(task.deadlineTs)}</span>
        <span class="badge">${dLeft >= 0 ? `${dLeft}d` : `-${Math.abs(dLeft)}d`}</span>
      </div>
      <div class="task-tags-row">${tagPillsHtml(task.tags)}</div>
      <div class="progress mt-2"><div style="width:${p}%"></div></div>
      <div class="task-expanded ${expanded ? "" : "collapsed"}">
        <p class="muted">${(task.description || "").trim() ? escapeHtml(task.description.trim()) : "Aucune description."}</p>
        <div class="tree">${task.steps.map((s) => renderStep(task, s)).join("")}</div>
        <div class="task-actions d-flex gap-2 mt-2 flex-wrap">
          <button type="button" data-edit-task="${task.id}"><i class="bi bi-pencil" aria-hidden="true"></i> Modifier</button>
          <button type="button" class="btn-delete-task" data-delete-task="${task.id}"><i class="bi bi-trash" aria-hidden="true"></i> Supprimer</button>
          <button type="button" data-complete-task="${task.id}" ${completeDisabled ? "disabled" : ""} title="${!canComplete && task.state === "inprogress" ? "Coche toutes les étapes pour valider." : ""}"><i class="bi bi-check2-circle" aria-hidden="true"></i> Terminer</button>
        </div>
      </div>
      </div>
    </article>`;
  }).join("");
  root.querySelector("#bulkDeleteSelected")?.addEventListener("click", deleteSelectedTasks);
  root.querySelector("#bulkClearSelection")?.addEventListener("click", clearTaskSelection);
  bindTaskEvents(root);
}

function renderStep(task, step) {
  const exp = !!ui.expandedSteps[`${task.id}:${step.id}`];
  return `<div class="tree-node">
    <div class="tree-line">
      <input class="form-check-input custom-check" type="checkbox" data-mark-step="${task.id}|${step.id}" ${step.completed ? "checked disabled" : task.state !== "inprogress" ? "disabled" : ""}>
      <button type="button" class="tree-toggle" data-toggle-step="${task.id}|${step.id}" aria-label="Déplier les sous-étapes"><i class="bi ${exp ? "bi-caret-down-fill" : "bi-caret-right-fill"}"></i></button>
      <span>${escapeHtml(step.title)} <span class="badge priority-${step.importance}">${IMPORTANCE[step.importance]}</span></span>
    </div>
    ${step.description ? `<p class="muted small ms-4">${escapeHtml(step.description)}</p>` : ""}
    <div class="tree ${exp ? "" : "collapsed"}">
      ${(step.children || []).map((sub) => `<div class="tree-line">
        <input class="form-check-input custom-check" type="checkbox" data-mark-sub="${task.id}|${step.id}|${sub.id}" ${sub.completed ? "checked disabled" : task.state !== "inprogress" ? "disabled" : ""}>
        <span>${escapeHtml(sub.title)} <span class="badge priority-${sub.importance}">${IMPORTANCE[sub.importance]}</span></span>
      </div>${sub.description ? `<p class="muted small ms-4">${escapeHtml(sub.description)}</p>` : ""}`).join("")}
    </div>
  </div>`;
}

function bindTaskEvents(root) {
  root.querySelectorAll("[data-select]").forEach((el) => el.onchange = () => {
    const task = state.tasks.find((t) => t.id === el.dataset.select);
    task.selected = el.checked; save(); renderTasks();
  });
  const toggleExpand = (id) => {
    ui.expandedTasks[id] = !ui.expandedTasks[id];
    renderTasks();
  };
  root.querySelectorAll("[data-toggle-task]").forEach((el) => el.onclick = (e) => {
    e.stopPropagation();
    toggleExpand(el.dataset.toggleTask);
  });
  root.querySelectorAll("[data-task-row-toggle]").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("input") || e.target.closest("button")) return;
      toggleExpand(row.dataset.taskRowToggle);
    });
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (e.target.closest("input") || e.target.closest("button")) return;
        toggleExpand(row.dataset.taskRowToggle);
      }
    });
  });
  root.querySelectorAll("[data-toggle-step]").forEach((el) => el.onclick = () => {
    const key = el.dataset.toggleStep.replace("|", ":");
    ui.expandedSteps[key] = !ui.expandedSteps[key];
    renderTasks();
  });
  root.querySelectorAll("[data-edit-task]").forEach((el) => el.onclick = () => openTaskDialog(el.dataset.editTask));
  root.querySelectorAll("[data-delete-task]").forEach((el) => el.onclick = () => {
    state.tasks = state.tasks.filter((t) => t.id !== el.dataset.deleteTask);
    toast("🗑️ Objectif supprimé");
    renderAll();
  });
  root.querySelectorAll("[data-mark-sub]").forEach((el) => el.onchange = () => markSub(...el.dataset.markSub.split("|")));
  root.querySelectorAll("[data-mark-step]").forEach((el) => el.onchange = () => markStep(...el.dataset.markStep.split("|")));
  root.querySelectorAll("[data-complete-task]").forEach((el) => el.onclick = () => completeTask(el.dataset.completeTask));
  root.querySelectorAll(".task-card[data-task-id]").forEach((article) => {
    const task = state.tasks.find((t) => t.id === article.dataset.taskId);
    if (!task) return;
    const layer = article.querySelector(".task-skin-layer");
    if (layer) layer.style.setProperty("--task-skin-bg", getTaskSkin(task).css);
  });
}

function deleteTag(tagId) {
  state.tags = state.tags.filter((t) => t.id !== tagId);
  state.tasks.forEach((task) => {
    task.tags = (task.tags || []).filter((id) => id !== tagId);
  });
  toast("Tag supprimé");
  save();
  renderAll();
}

function openTagDialog() {
  const dlg = document.getElementById("tagDialog");
  const listHtml = state.tags.length
    ? state.tags.map((tg) => `<div class="tag-manage-row">
        <span class="tag-pill" style="background:${tg.color}22;border-color:${tg.color}55;color:#f0f4ff">${escapeHtml(tg.name)}</span>
        <button type="button" class="btn-delete-task" data-del-tag="${tg.id}" aria-label="Supprimer"><i class="bi bi-trash"></i></button>
      </div>`).join("")
    : "<p class=\"muted small mb-0\">Aucune étiquette pour l’instant.</p>";
  dlg.innerHTML = `<form method="dialog" class="dialog-content">
    <h3><i class="bi bi-tag"></i> Étiquettes</h3>
    <div class="tag-manage-list mb-3">${listHtml}</div>
    <hr class="border-secondary opacity-25" />
    <h4 class="h6 mt-2">Nouvelle étiquette</h4>
    <label>Nom<input id="tagName" placeholder="Travail" /></label>
    <label>Couleur<input id="tagColor" type="color" value="#7aa2ff" /></label>
    <label>Description<textarea id="tagDesc" rows="2" placeholder="Visible au survol de l’étiquette"></textarea></label>
    <div class="d-flex gap-2 justify-content-end"><button value="cancel">Fermer</button><button type="button" id="tagSave" class="primary">Créer</button></div>
  </form>`;
  dlg.querySelectorAll("[data-del-tag]").forEach((btn) => {
    btn.onclick = () => {
      if (!confirm("Supprimer l’étiquette ? Elle sera retirée de tous les objectifs.")) return;
      deleteTag(btn.dataset.delTag);
      dlg.close();
    };
  });
  dlg.querySelector("#tagSave").onclick = () => {
    const name = dlg.querySelector("#tagName").value.trim();
    if (!name) return toast("Nom d’étiquette requis");
    const tag = { id: uid(), name, color: dlg.querySelector("#tagColor").value, description: dlg.querySelector("#tagDesc").value.trim() };
    state.tags.push(tag);
    dlg.close();
    toast("Étiquette créée");
    renderAll();
  };
  dlg.showModal();
}

function openTaskDialog(taskId = null) {
  const task = taskId ? state.tasks.find((t) => t.id === taskId) : null;
  if (task?.state === "completed") return toast("Un objectif terminé ne peut pas être modifié.");
  const dlg = document.getElementById("taskDialog");
  const draft = task ? JSON.parse(JSON.stringify(task)) : { title: "", description: "", importance: 1, deadlineTs: Date.now() + 7 * 86400000, tags: [], skinId: "skin-1", steps: [] };
  if (!draft.tags) draft.tags = [];

  /** État UI échéance (hors modèle sauvegardé) : évite reset au re-render du formulaire */
  let deadlineUiMode = task ? "date" : "days";
  let deadlineDaysInput = task ? daysFromTodayToDeadline(draft.deadlineTs) : 7;

  const stepDraftRow = (s, i) => `
    <div class="step-draft-block card p-3">
      <div class="d-flex flex-wrap gap-2 align-items-start">
        <input class="flex-grow-1" data-step-title="${i}" value="${escapeAttr(s.title || "")}" placeholder="Titre de l’étape">
        <select data-step-imp="${i}">${[1, 2, 3].map((x) => `<option value="${x}" ${s.importance === x ? "selected" : ""}>${IMPORTANCE[x]}</option>`).join("")}</select>
        <button type="button" class="btn btn-sm" data-del-step="${i}">Retirer l’étape</button>
      </div>
      <label class="mt-2 d-block">Description de l’étape<textarea data-step-desc="${i}" rows="2" placeholder="Détails optionnels">${escapeHtml(s.description || "")}</textarea></label>
      ${(s.children || []).map((c, j) => `
        <div class="sub-step-row">
          <input data-sub-title="${i}-${j}" value="${escapeAttr(c.title || "")}" placeholder="Sous-étape">
          <select data-sub-imp="${i}-${j}">${[1, 2, 3].map((x) => `<option value="${x}" ${c.importance === x ? "selected" : ""}>${IMPORTANCE[x]}</option>`).join("")}</select>
          <label class="small">Description<textarea data-sub-desc="${i}-${j}" rows="2" placeholder="Optionnel">${escapeHtml(c.description || "")}</textarea></label>
          <button type="button" data-del-sub="${i}-${j}">Retirer la sous-étape</button>
        </div>`).join("")}
      <div class="step-draft-actions">
        <button type="button" class="btn btn-outline-light btn-sm" data-add-sub="${i}"><i class="bi bi-plus-lg"></i> Ajouter une sous-étape</button>
      </div>
    </div>`;

  const draw = () => {
    const d = new Date(draft.deadlineTs);
    const timeStr = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    const dateStr = toDateInputValue(draft.deadlineTs);
    dlg.innerHTML = `<form method="dialog" class="dialog-content">
      <h3>${task ? "Modifier l’objectif" : "Nouvel objectif"}</h3>
      <p class="muted small mb-0 dialog-hint"><kbd>Ctrl</kbd>+<kbd>Entrée</kbd> pour enregistrer</p>
      <label>Titre<input id="taskTitle" value="${escapeAttr(draft.title)}" placeholder="Ex. Préparer la présentation" /></label>
      <label>Description<textarea id="taskDesc" placeholder="Contexte, liens utiles…">${escapeHtml(draft.description || "")}</textarea></label>
      <div class="grid-2">
        <label>Importance<select id="taskImp">${[1, 2, 3].map((i) => `<option value="${i}" ${draft.importance === i ? "selected" : ""}>${IMPORTANCE[i]}</option>`).join("")}</select></label>
        <label class="task-skin-field">Apparence (skin)<select id="taskSkin">${SKINS.map((s) => `<option value="${s.id}" ${draft.skinId === s.id ? "selected" : ""}>${s.name}${state.skinOwned.includes(s.id) ? "" : " (verrouillé)"}</option>`).join("")}</select></label>
      </div>
      <div class="tag-dropdown-wrap">
        <label class="d-block mb-1">Étiquettes</label>
        <button type="button" class="tag-dropdown-btn" id="taskTagsToggle"><span class="tag-dropdown-btn-label"><i class="bi bi-tags"></i> ${(draft.tags || []).length ? `Étiquettes (${draft.tags.length})` : "Choisir des étiquettes…"}</span><i class="bi bi-chevron-down tag-dropdown-chevron" aria-hidden="true"></i></button>
        <div class="tag-dropdown-panel" id="taskTagsPanel">
          ${state.tags.length ? state.tags.map((tg) => `<label class="tag-checkbox-row"><input type="checkbox" class="form-check-input custom-check" data-task-tag="${tg.id}" ${(draft.tags || []).includes(tg.id) ? "checked" : ""}><span>${escapeHtml(tg.name)}</span></label>`).join("") : "<p class='muted small mb-0'>Aucune étiquette — crée-en une depuis la barre d’outils.</p>"}
        </div>
      </div>
      <div class="grid-2">
        <label>Mode échéance<select id="deadlineMode" class="deadline-select"><option value="days" ${deadlineUiMode === "days" ? "selected" : ""}>Dans X jours</option><option value="date" ${deadlineUiMode === "date" ? "selected" : ""}>Date précise</option></select></label>
        <label>Heure<input id="deadlineTime" type="time" value="${timeStr}"></label>
      </div>
      <div class="grid-2"><label id="daysWrap">Nombre de jours<input id="deadlineDays" type="number" min="0" value="${deadlineDaysInput}"></label><label id="dateWrap">Date<input id="deadlineDate" type="date" value="${dateStr}"></label></div>
      <h4 class="mt-3">Étapes et sous-étapes</h4>
      <div id="stepsDraft">${draft.steps.map((s, i) => stepDraftRow(s, i)).join("")}</div>
      <div class="d-flex gap-2 flex-wrap my-2">
        <button type="button" id="addStepBtn" class="primary"><i class="bi bi-node-plus"></i> Ajouter une étape</button>
      </div>
      <div class="d-flex gap-2 justify-content-end"><button value="cancel">Annuler</button><button type="button" id="saveTaskBtn" class="primary">Enregistrer</button></div>
    </form>`;
    attachDraftEvents();
  };

  const syncDraft = () => {
    const titleEl = dlg.querySelector("#taskTitle");
    if (!titleEl) return;
    draft.title = titleEl.value;
    draft.description = dlg.querySelector("#taskDesc")?.value ?? "";
    draft.importance = Number(dlg.querySelector("#taskImp")?.value || 1);
    draft.skinId = dlg.querySelector("#taskSkin")?.value || draft.skinId;
    draft.tags = [...dlg.querySelectorAll("[data-task-tag]:checked")].map((cb) => cb.dataset.taskTag);
    draft.steps.forEach((s, i) => {
      s.title = dlg.querySelector(`[data-step-title="${i}"]`)?.value ?? s.title;
      s.description = dlg.querySelector(`[data-step-desc="${i}"]`)?.value ?? s.description;
      s.importance = Number(dlg.querySelector(`[data-step-imp="${i}"]`)?.value || 1);
      s.children.forEach((c, j) => {
        c.title = dlg.querySelector(`[data-sub-title="${i}-${j}"]`)?.value ?? c.title;
        c.description = dlg.querySelector(`[data-sub-desc="${i}-${j}"]`)?.value ?? c.description;
        c.importance = Number(dlg.querySelector(`[data-sub-imp="${i}-${j}"]`)?.value || 1);
      });
    });
    const modeEl = dlg.querySelector("#deadlineMode");
    const timeEl = dlg.querySelector("#deadlineTime");
    if (modeEl && timeEl) {
      deadlineUiMode = modeEl.value;
      const time = timeEl.value || "18:00";
      const [hh, mm] = time.split(":").map(Number);
      if (deadlineUiMode === "days") {
        const n = Number(dlg.querySelector("#deadlineDays")?.value);
        deadlineDaysInput = Number.isFinite(n) ? n : deadlineDaysInput;
        const dt = new Date();
        dt.setDate(dt.getDate() + deadlineDaysInput);
        dt.setHours(hh || 18, mm || 0, 0, 0);
        draft.deadlineTs = dt.getTime();
      } else {
        const date = dlg.querySelector("#deadlineDate")?.value;
        if (date) draft.deadlineTs = new Date(`${date}T${time}:00`).getTime();
      }
    }
  };

  const attachDraftEvents = () => {
    const mode = dlg.querySelector("#deadlineMode");
    const daysWrap = dlg.querySelector("#daysWrap");
    const dateWrap = dlg.querySelector("#dateWrap");
    const modeFn = () => {
      const isDays = mode.value === "days";
      daysWrap.style.display = isDays ? "block" : "none";
      dateWrap.style.display = isDays ? "none" : "block";
    };
    modeFn();
    mode.onchange = () => {
      const oldMode = deadlineUiMode;
      const newMode = mode.value;
      if (newMode === "days" && oldMode === "date") {
        const time = dlg.querySelector("#deadlineTime")?.value || "18:00";
        const date = dlg.querySelector("#deadlineDate")?.value;
        if (date) draft.deadlineTs = new Date(`${date}T${time}:00`).getTime();
        deadlineDaysInput = daysFromTodayToDeadline(draft.deadlineTs);
      } else {
        syncDraft();
      }
      deadlineUiMode = newMode;
      draw();
    };

    const tagToggle = dlg.querySelector("#taskTagsToggle");
    const tagPanel = dlg.querySelector("#taskTagsPanel");
    if (tagToggle && tagPanel) {
      tagToggle.onclick = (e) => {
        e.preventDefault();
        tagPanel.classList.toggle("tag-dropdown-open");
      };
      dlg.querySelectorAll("[data-task-tag]").forEach((cb) => {
        cb.addEventListener("change", () => {
          const n = dlg.querySelectorAll("[data-task-tag]:checked").length;
          tagToggle.innerHTML = n
            ? `<span class="tag-dropdown-btn-label"><i class="bi bi-tags"></i> Étiquettes (${n})</span><i class="bi bi-chevron-down tag-dropdown-chevron" aria-hidden="true"></i>`
            : `<span class="tag-dropdown-btn-label"><i class="bi bi-tags"></i> Choisir des étiquettes…</span><i class="bi bi-chevron-down tag-dropdown-chevron" aria-hidden="true"></i>`;
        });
      });
    }

    dlg.querySelector("#addStepBtn").onclick = () => {
      syncDraft();
      draft.steps.push({ id: uid(), title: "Nouvelle étape", description: "", importance: 1, completed: false, children: [] });
      draw();
    };
    dlg.querySelectorAll("[data-add-sub]").forEach((el) => {
      el.onclick = () => {
        syncDraft();
        draft.steps[Number(el.dataset.addSub)].children.push({ id: uid(), title: "Sous-étape", description: "", importance: 1, completed: false });
        draw();
      };
    });
    dlg.querySelectorAll("[data-del-step]").forEach((el) => {
      el.onclick = () => {
        syncDraft();
        draft.steps.splice(Number(el.dataset.delStep), 1);
        draw();
      };
    });
    dlg.querySelectorAll("[data-del-sub]").forEach((el) => {
      el.onclick = () => {
        syncDraft();
        const [i, j] = el.dataset.delSub.split("-").map(Number);
        draft.steps[i].children.splice(j, 1);
        draw();
      };
    });
    dlg.querySelector("#saveTaskBtn").onclick = () => {
      syncDraft();
      if (deadlineUiMode === "date" && !dlg.querySelector("#deadlineDate")?.value) return toast("Indique une date d’échéance.");
      if (!draft.title.trim()) return toast("Le titre est obligatoire.");
      draft.steps.forEach((s) => {
        s.children = s.children || [];
      });
      if (task) {
        Object.assign(task, { ...draft, updatedAt: Date.now(), expectedReward: estimateReward({ ...task, ...draft }) });
        if (task.state === "failed" && Date.now() <= task.deadlineTs) task.state = "inprogress";
      } else {
        state.tasks.push({
          ...draft,
          id: uid(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          completed: false,
          state: "inprogress",
          viewCount: 0,
          expectedReward: estimateReward({ ...draft, createdAt: Date.now() })
        });
        state.mailboxUnread.global = true;
      }
      dlg.close();
      toast("✅ Enregistré");
      renderAll();
    };
  };

  draw();
  dlg.showModal();
}

function markSub(taskId, stepId, subId) {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task || task.state !== "inprogress") return;
  const step = task.steps.find((s) => s.id === stepId);
  const sub = step?.children.find((x) => x.id === subId);
  if (!sub || sub.completed) return;
  sub.completed = true;
  grantGems(task, awardBase("sub", sub.importance));
  if (step.children.length && step.children.every((c) => c.completed) && !step.completed) {
    step.completed = true;
    grantGems(task, awardBase("step", step.importance));
  }
  task.updatedAt = Date.now();
  renderAll();
}

function markStep(taskId, stepId) {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task || task.state !== "inprogress") return;
  const step = task.steps.find((s) => s.id === stepId);
  if (!step || step.completed) return;
  if (step.children.length) {
    const un = step.children.find((c) => !c.completed);
    if (un) return toast(`Termine d’abord la sous-étape : ${un.title}`);
  }
  step.completed = true;
  grantGems(task, awardBase("step", step.importance));
  task.updatedAt = Date.now();
  renderAll();
}

function completeTask(taskId) {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task || task.completed || task.state !== "inprogress") return;
  const firstUnstep = task.steps.find((s) => !s.completed);
  if (firstUnstep) return toast(`Étape incomplète : ${firstUnstep.title}`);
  task.completed = true;
  task.state = "completed";
  task.completedAt = Date.now();
  if (!task.steps.length) grantGems(task, awardBase("task", task.importance));
  state.profile.totalDone += 1;
  state.profile.weeklyDone += 1;
  confettiByDifficulty(task.importance, true);
  toast(`🏆 Terminé : ${task.title}`);
  renderAll();
}

function exportJsonDialog() {
  const dlg = document.getElementById("bulkDialog");
  ui.exportFilter = "";
  ui.exportTagFilter = new Set();

  const renderList = () => {
    const q = (ui.exportFilter || "").toLowerCase();
    const tagSet = ui.exportTagFilter;
    const filtered = state.tasks.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q)) return false;
      if (tagSet.size && !(t.tags || []).some((id) => tagSet.has(id))) return false;
      return true;
    });
    return filtered.map((t) => `<label class="export-task-item"><input class="form-check-input custom-check" type="checkbox" data-exp="${t.id}" checked> <span><strong>${escapeHtml(t.title)}</strong><br><small class="muted">${toDayString(t.deadlineTs)} · ${IMPORTANCE[t.importance]}</small></span></label>`).join("");
  };

  const refreshList = () => {
    const listEl = dlg.querySelector("#expList");
    if (listEl) listEl.innerHTML = renderList();
  };

  dlg.innerHTML = `<form method="dialog" class="dialog-content">
    <h3>Exporter des objectifs</h3>
    <div class="export-filters">
      <input type="search" id="expSearch" placeholder="Filtrer par titre…" value="">
      <div><strong>Filtrer par étiquettes</strong> <span class="muted">(optionnel)</span></div>
      <div class="d-flex flex-wrap gap-2">${state.tags.map((tg) => `<label class="tag-pill" style="cursor:pointer;background:${tg.color}33"><input type="checkbox" class="form-check-input custom-check" data-tag-filter="${tg.id}"> ${escapeHtml(tg.name)}</label>`).join("") || "<span class='muted'>Aucune étiquette</span>"}</div>
      <div class="d-flex gap-2 flex-wrap"><button type="button" id="expAll">Tout sélectionner (liste)</button><button type="button" id="expNone">Tout désélectionner (liste)</button></div>
    </div>
    <div class="export-task-list" id="expList"></div>
    <div class="d-flex gap-2 justify-content-end mt-2"><button type="submit" value="cancel">Fermer</button><button type="button" id="doExport" class="primary">Exporter en JSON</button></div>
  </form>`;
  refreshList();
  dlg.querySelector("#expSearch").oninput = (e) => { ui.exportFilter = e.target.value; refreshList(); };
  dlg.querySelectorAll("[data-tag-filter]").forEach((cb) => {
    cb.onchange = () => {
      if (cb.checked) ui.exportTagFilter.add(cb.dataset.tagFilter);
      else ui.exportTagFilter.delete(cb.dataset.tagFilter);
      refreshList();
    };
  });
  dlg.querySelector("#expAll").onclick = () => { dlg.querySelectorAll("[data-exp]").forEach((x) => { x.checked = true; }); };
  dlg.querySelector("#expNone").onclick = () => { dlg.querySelectorAll("[data-exp]").forEach((x) => { x.checked = false; }); };
  dlg.querySelector("#doExport").onclick = () => {
    const ids = [...dlg.querySelectorAll("[data-exp]:checked")].map((x) => x.dataset.exp);
    if (!ids.length) return toast("Sélectionne au moins un objectif.");
    const payload = { ...state, tasks: state.tasks.filter((t) => ids.includes(t.id)) };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nova-export.json";
    a.click();
    URL.revokeObjectURL(a.href);
    dlg.close();
    toast("Export terminé");
  };
  dlg.showModal();
}

function importJson(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const incoming = JSON.parse(reader.result);
      Object.assign(state, { ...state, ...incoming });
      state.profile = { ...initialState().profile, ...(state.profile || {}) };
      state.settings = { ...initialState().settings, ...(state.settings || {}) };
      state.tags = (state.tags || []).map(normalizeTag).filter(Boolean);
      state.tasks = (state.tasks || []).map(normalizeTask);
      if (!state.profile.shareCardSkinId || !(state.skinOwned || []).includes(state.profile.shareCardSkinId)) {
        state.profile.shareCardSkinId = (state.skinOwned || []).includes("skin-1") ? "skin-1" : (state.skinOwned || [])[0] || "skin-1";
      }
      renderAll();
      toast("Import réussi");
    } catch {
      toast("Fichier JSON invalide");
    }
  };
  reader.readAsText(file);
}

function weekAgoTs() { return Date.now() - 7 * 86400000; }

function buildBanners() {
  const out = [];
  const proMode = !!state.settings?.proMode;
  const promo = ensureShopPromo();
  const pt = THEMES.find((x) => x.id === promo.themeId);
  const ps = SKINS.find((x) => x.id === promo.skinId);
  const pc = AVATAR_CIRCLES.find((x) => x.id === promo.circleId);
  if (!proMode) {
    out.push({
      title: "🛍️ Promo boutique",
      body: `${pt?.name || "?"} · ${ps?.name || "?"} · ${pc?.name || "?"} — −${promo.discount}% cette semaine`,
      taskId: "",
      meta: "Boutique",
      bannerKind: "shop"
    });
  }
  const inprog = state.tasks.filter((t) => t.state === "inprogress");
  const failedWeek = state.tasks.filter((t) => t.state === "failed" && (t.failedAt || 0) >= weekAgoTs());
  const urgent = [...inprog].sort((a, b) => a.deadlineTs - b.deadlineTs)[0];
  const soon = [...inprog].filter((t) => t.deadlineTs - Date.now() < 48 * 3600000 && t.deadlineTs > Date.now()).sort((a, b) => a.deadlineTs - b.deadlineTs)[0];
  const least = [...state.tasks].sort((a, b) => (a.viewCount || 0) - (b.viewCount || 0))[0];

  if (urgent) out.push({ title: proMode ? "📌 Échéance la plus proche" : "⏰ Échéance la plus proche", body: urgent.title, taskId: urgent.id, meta: "Fin " + toDayString(urgent.deadlineTs) });
  if (soon) out.push({ title: proMode ? "🕐 Urgent (< 48 h)" : "🕐 Moins de 48 h", body: soon.title, taskId: soon.id, meta: "À traiter vite" });
  failedWeek.slice(0, 3).forEach((f) => out.push({ title: "❌ Échec (7 jours)", body: f.title, taskId: f.id, meta: "Corriger ou supprimer" }));
  if (least) out.push({ title: proMode ? "👁 Peu consulté" : "👀 Peu consulté", body: least.title, taskId: least.id, meta: "Jeter un œil" });
  out.push({ title: proMode ? "📅 Cette semaine" : "📊 Cette semaine", body: `${state.profile.weeklyDone} objectif(s) terminé(s)`, meta: "Continue comme ça", taskId: "" });
  if (!proMode) {
    out.push({ title: "💎 Gemmes & niveau", body: `${state.gems} gemmes · Niv. ${state.level}`, meta: "Profil", taskId: "" });
  }
  out.push({ title: proMode ? "📋 En cours" : "🎯 En cours", body: `${inprog.length} tâche(s) active(s)`, meta: "Mode focus", taskId: "" });
  return out.filter((x, i, a) => a.findIndex((y) => y.title === x.title && y.body === x.body) === i);
}

function renderNewsFeed() {
  const root = document.getElementById("newsFeed");
  const items = buildBanners();
  if (!items.length) {
    root.innerHTML = `<div class="carousel-wrap glass-panel carousel-outer">
      <div class="carousel-main d-flex align-items-center"><p class="p-3 muted mb-0">Aucune annonce pour l’instant — ajoute des tâches pour voir des rappels ici.</p></div>
    </div>`;
    return;
  }
  ui.carouselIndex %= items.length;
  const track = items.map((it) => `<div class="banner-slide"><article class="banner-single glass-panel" data-banner-task="${it.taskId || ""}" data-banner-kind="${it.bannerKind || ""}">
    <h4>${it.title}</h4><p>${it.body}</p><div class="banner-meta">${it.meta || ""}</div>
  </article></div>`).join("");
  root.innerHTML = `<div class="carousel-wrap glass-panel carousel-outer">
    <div class="carousel-main">
      <div class="banner-track" style="transform:translateX(-${ui.carouselIndex * 100}%)">${track}</div>
      <div class="carousel-controls d-flex justify-content-between align-items-center gap-3 px-2 py-2">
        <button type="button" class="btn btn-sm" data-carousel-prev aria-label="Annonce précédente"><i class="bi bi-chevron-left"></i></button>
        <small class="muted mb-0 carousel-counter">${ui.carouselIndex + 1} / ${items.length}</small>
        <button type="button" class="btn btn-sm" data-carousel-next aria-label="Annonce suivante"><i class="bi bi-chevron-right"></i></button>
      </div>
    </div>
  </div>`;
  root.querySelector("[data-carousel-next]").onclick = () => { ui.carouselIndex = (ui.carouselIndex + 1) % items.length; renderNewsFeed(); };
  root.querySelector("[data-carousel-prev]").onclick = () => { ui.carouselIndex = (ui.carouselIndex - 1 + items.length) % items.length; renderNewsFeed(); };
  root.querySelectorAll(".banner-single").forEach((el) => {
    el.onclick = () => {
      if (el.dataset.bannerKind === "shop") {
        ui.section = "shop";
        document.querySelectorAll(".menu-btn").forEach((x) => x.classList.remove("active"));
        document.querySelector('[data-section="shop"]').classList.add("active");
        renderSections();
        return;
      }
      const id = el.dataset.bannerTask;
      if (!id) return;
      ui.mailbox = "global";
      ui.expandedTasks[id] = true;
      ui.section = "tasks";
      document.querySelectorAll(".menu-btn").forEach((x) => x.classList.remove("active"));
      document.querySelector('[data-section="tasks"]').classList.add("active");
      renderSections();
    };
  });
  clearInterval(ui.carouselTimer);
  ui.carouselTimer = setInterval(() => { ui.carouselIndex = (ui.carouselIndex + 1) % items.length; renderNewsFeed(); }, 5000);
}

const WEEKDAY_LONG_FR = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const WEEKDAY_SHORT_FR = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];

function computeStatsInsights() {
  const tasks = state.tasks;
  const completed = tasks.filter((t) => t.state === "completed");
  const failed = tasks.filter((t) => t.state === "failed");
  const inprog = tasks.filter((t) => t.state === "inprogress");
  const n = tasks.length;
  const finished = completed.length + failed.length;
  const successPct = finished ? Math.round((completed.length / finished) * 100) : 0;
  const imp = { 1: 0, 2: 0, 3: 0 };
  tasks.forEach((t) => {
    const k = t.importance || 1;
    imp[k] = (imp[k] || 0) + 1;
  });
  const impSum = imp[1] + imp[2] + imp[3];
  const impMax = Math.max(1, impSum);
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
  completed.forEach((t) => {
    if (t.completedAt) weekdayCounts[new Date(t.completedAt).getDay()]++;
  });
  let bestDayIdx = 0;
  weekdayCounts.forEach((c, i) => { if (c > weekdayCounts[bestDayIdx]) bestDayIdx = i; });
  const hasWeekday = weekdayCounts.some((c) => c > 0);
  let sumDays = 0;
  let countWithTime = 0;
  completed.forEach((t) => {
    if (t.completedAt && t.createdAt) {
      const d = (t.completedAt - t.createdAt) / 86400000;
      if (d >= 0 && d < 5000) {
        sumDays += d;
        countWithTime++;
      }
    }
  });
  const avgDays = countWithTime ? sumDays / countWithTime : null;
  let totalSubSteps = 0;
  let doneSubSteps = 0;
  let maxSteps = 0;
  tasks.forEach((t) => {
    const flat = flattenTaskItems(t);
    totalSubSteps += flat.length;
    flat.forEach((x) => { if (x.completed) doneSubSteps++; });
    maxSteps = Math.max(maxSteps, flat.length);
  });
  const progressPct = totalSubSteps ? Math.round((doneSubSteps / totalSubSteps) * 100) : 0;
  const gpc = state.profile.totalDone > 0 ? Math.round(state.totalGemsEarned / state.profile.totalDone) : 0;
  const keys7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    keys7.push(d.toISOString().slice(0, 10));
  }
  const counts7 = keys7.map(() => 0);
  completed.forEach((t) => {
    if (!t.completedAt) return;
    const dk = new Date(t.completedAt).toISOString().slice(0, 10);
    const idx = keys7.indexOf(dk);
    if (idx >= 0) counts7[idx]++;
  });
  const max7 = Math.max(1, ...counts7);
  const urgentSoon = inprog.filter((t) => t.deadlineTs - Date.now() < 48 * 3600000 && t.deadlineTs > Date.now()).length;
  const overdue = inprog.filter((t) => t.deadlineTs < Date.now()).length;
  return {
    n,
    completedLen: completed.length,
    failedLen: failed.length,
    inprogLen: inprog.length,
    finished,
    successPct,
    imp,
    impMax,
    bestDayLabel: hasWeekday ? WEEKDAY_LONG_FR[bestDayIdx] : null,
    bestDayShort: hasWeekday ? WEEKDAY_SHORT_FR[bestDayIdx] : null,
    avgDays,
    totalSubSteps,
    doneSubSteps,
    maxSteps,
    progressPct,
    gpc,
    counts7,
    max7,
    urgentSoon,
    overdue,
    totalGems: state.totalGemsEarned,
    level: state.level,
    weeklyDone: state.profile.weeklyDone
  };
}

function renderStats() {
  const root = document.getElementById("statsSection");
  const s = computeStatsInsights();
  const maxState = Math.max(1, s.inprogLen, s.completedLen, s.failedLen);
  const pct = (x) => Math.round((x / maxState) * 100);
  const donutPct = s.finished ? s.successPct : (s.completedLen > 0 && !s.failedLen ? 100 : 0);
  const sparkLabels = s.counts7.map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return WEEKDAY_SHORT_FR[d.getDay()];
  });
  root.innerHTML = `<div class="stats-page glass-panel">
    <header class="stats-page-head">
      <h2 class="stats-page-title"><i class="bi bi-graph-up-arrow" aria-hidden="true"></i> Statistiques</h2>
      <p class="muted stats-page-sub">Vue d’ensemble, graphiques et quelques surprises sur ton activité.</p>
    </header>

    <div class="stats-kpi-grid">
      <div class="stats-kpi card glass-chip">
        <span class="stats-kpi-icon" style="color:#6cd7ff"><i class="bi bi-list-task" aria-hidden="true"></i></span>
        <span class="stats-kpi-value">${s.n}</span>
        <span class="stats-kpi-label">Objectifs au total</span>
      </div>
      <div class="stats-kpi card glass-chip">
        <span class="stats-kpi-icon" style="color:#56e6a8"><i class="bi bi-check2-circle" aria-hidden="true"></i></span>
        <span class="stats-kpi-value">${s.completedLen}</span>
        <span class="stats-kpi-label">Terminés</span>
      </div>
      <div class="stats-kpi card glass-chip">
        <span class="stats-kpi-icon" style="color:#ffc45f"><i class="bi bi-lightning-charge" aria-hidden="true"></i></span>
        <span class="stats-kpi-value">${s.inprogLen}</span>
        <span class="stats-kpi-label">En cours</span>
      </div>
      <div class="stats-kpi card glass-chip">
        <span class="stats-kpi-icon" style="color:#ff6281"><i class="bi bi-x-octagon" aria-hidden="true"></i></span>
        <span class="stats-kpi-value">${s.failedLen}</span>
        <span class="stats-kpi-label">Échoués</span>
      </div>
    </div>

    <div class="stats-panels">
      <section class="stats-panel card glass-chip">
        <h3 class="stats-panel-title"><i class="bi bi-bar-chart-steps" aria-hidden="true"></i> Répartition des états</h3>
        <div class="stats-bar-list">
          <div class="stats-bar-row">
            <span class="stats-bar-name">En cours</span>
            <div class="stats-bar-track"><div class="stats-bar-fill stats-bar-fill--prog" style="width:${pct(s.inprogLen)}%"></div></div>
            <span class="stats-bar-num">${s.inprogLen}</span>
          </div>
          <div class="stats-bar-row">
            <span class="stats-bar-name">Terminés</span>
            <div class="stats-bar-track"><div class="stats-bar-fill stats-bar-fill--ok" style="width:${pct(s.completedLen)}%"></div></div>
            <span class="stats-bar-num">${s.completedLen}</span>
          </div>
          <div class="stats-bar-row">
            <span class="stats-bar-name">Échoués</span>
            <div class="stats-bar-track"><div class="stats-bar-fill stats-bar-fill--bad" style="width:${pct(s.failedLen)}%"></div></div>
            <span class="stats-bar-num">${s.failedLen}</span>
          </div>
        </div>
      </section>

      <section class="stats-panel stats-panel--donut card glass-chip">
        <h3 class="stats-panel-title"><i class="bi bi-bullseye" aria-hidden="true"></i> Taux de réussite</h3>
        <p class="muted small stats-panel-hint">Parmi les objectifs terminés ou échoués (hors en cours).</p>
        <div class="stats-donut-wrap">
          <div class="stats-donut" style="--pct:${donutPct}" role="img" aria-label="Taux de réussite ${donutPct} pour cent"></div>
          <div class="stats-donut-center">
            <strong class="stats-donut-pct">${s.finished ? `${donutPct}%` : "—"}</strong>
            <span class="muted small">${s.finished ? "réussites" : "pas assez de données"}</span>
          </div>
        </div>
      </section>
    </div>

    <div class="stats-panels stats-panels--2">
      <section class="stats-panel card glass-chip">
        <h3 class="stats-panel-title"><i class="bi bi-funnel" aria-hidden="true"></i> Importance des objectifs</h3>
        <div class="stats-imp-bars">
          <div class="stats-imp-row"><span class="stats-imp-label">Faible</span><div class="stats-imp-track"><div class="stats-imp-fill stats-imp-fill--1" style="width:${Math.round((s.imp[1] / s.impMax) * 100)}%"></div></div><span class="stats-imp-n">${s.imp[1]}</span></div>
          <div class="stats-imp-row"><span class="stats-imp-label">Moyenne</span><div class="stats-imp-track"><div class="stats-imp-fill stats-imp-fill--2" style="width:${Math.round((s.imp[2] / s.impMax) * 100)}%"></div></div><span class="stats-imp-n">${s.imp[2]}</span></div>
          <div class="stats-imp-row"><span class="stats-imp-label">Élevée</span><div class="stats-imp-track"><div class="stats-imp-fill stats-imp-fill--3" style="width:${Math.round((s.imp[3] / s.impMax) * 100)}%"></div></div><span class="stats-imp-n">${s.imp[3]}</span></div>
        </div>
      </section>

      <section class="stats-panel card glass-chip">
        <h3 class="stats-panel-title"><i class="bi bi-calendar-week" aria-hidden="true"></i> Complétions sur 7 jours</h3>
        <div class="stats-spark" role="img" aria-label="Histogramme sur 7 jours">
          ${s.counts7.map((c, i) => `<div class="stats-spark-col"><div class="stats-spark-bar" style="height:${Math.max(10, Math.round((c / s.max7) * 72))}px"></div><span class="stats-spark-lbl">${sparkLabels[i]}</span></div>`).join("")}
        </div>
      </section>
    </div>

    <section class="stats-insights card glass-chip">
      <h3 class="stats-panel-title"><i class="bi bi-stars" aria-hidden="true"></i> Stats &amp; fun facts</h3>
      <div class="stats-insights-grid">
        <div class="stats-insight">
          <span class="stats-insight-ico"><i class="bi bi-gem" aria-hidden="true"></i></span>
          <div><strong>${s.totalGems.toLocaleString("fr-FR")}</strong><span class="muted small"> gemmes gagnées (total)</span></div>
        </div>
        <div class="stats-insight">
          <span class="stats-insight-ico"><i class="bi bi-calculator" aria-hidden="true"></i></span>
          <div><strong>~${s.gpc || "—"}</strong><span class="muted small"> gemmes / objectif complété (ordre de grandeur)</span></div>
        </div>
        <div class="stats-insight">
          <span class="stats-insight-ico"><i class="bi bi-calendar-heart" aria-hidden="true"></i></span>
          <div><strong>${s.bestDayLabel || "—"}</strong><span class="muted small"> jour le plus productif (complétions)</span></div>
        </div>
        <div class="stats-insight">
          <span class="stats-insight-ico"><i class="bi bi-hourglass-split" aria-hidden="true"></i></span>
          <div><strong>${s.avgDays != null ? `${s.avgDays.toFixed(1)} j` : "—"}</strong><span class="muted small"> délai moyen avant complétion</span></div>
        </div>
        <div class="stats-insight">
          <span class="stats-insight-ico"><i class="bi bi-diagram-3" aria-hidden="true"></i></span>
          <div><strong>${s.maxSteps}</strong><span class="muted small"> max. d’étapes sur un objectif</span></div>
        </div>
        <div class="stats-insight">
          <span class="stats-insight-ico"><i class="bi bi-pie-chart" aria-hidden="true"></i></span>
          <div><strong>${s.progressPct}%</strong><span class="muted small"> étapes cochées (tous objectifs)</span></div>
        </div>
        <div class="stats-insight">
          <span class="stats-insight-ico"><i class="bi bi-emoji-smile" aria-hidden="true"></i></span>
          <div><strong>${s.weeklyDone}</strong><span class="muted small"> complétions cette semaine (compteur profil)</span></div>
        </div>
        <div class="stats-insight">
          <span class="stats-insight-ico"><i class="bi bi-alarm" aria-hidden="true"></i></span>
          <div><strong>${s.urgentSoon}</strong><span class="muted small"> objectifs en cours &lt; 48 h</span></div>
        </div>
        <div class="stats-insight${s.overdue ? " stats-insight--warn" : ""}">
          <span class="stats-insight-ico"><i class="bi bi-exclamation-triangle" aria-hidden="true"></i></span>
          <div><strong>${s.overdue}</strong><span class="muted small"> en cours avec échéance dépassée</span></div>
        </div>
      </div>
    </section>
  </div>`;
}

function renderProfile() {
  const root = document.getElementById("profileSection");
  const circle = AVATAR_CIRCLES.find((c) => c.id === state.activeAvatarCircle) || AVATAR_CIRCLES[0];
  const avatar = state.profile.avatar || "";
  const shareSkin = state.profile.shareCardSkinId || "skin-1";
  const previewSkin = SKINS.find((x) => x.id === shareSkin) || SKINS[0];
  const tipsOn = !!state.settings?.sidebarTips;
  const compactOn = !!state.settings?.compactLists;
  const proModeOn = !!state.settings?.proMode;
  const currentTheme = state.settings?.uiTheme || "dark";
  const doneCount = state.tasks.filter((t) => t.state === "completed").length;
  const skinOptions = state.skinOwned.map((id) => {
    const s = SKINS.find((x) => x.id === id);
    return s ? `<option value="${s.id}" ${shareSkin === s.id ? "selected" : ""}>${escapeHtml(s.name)}</option>` : "";
  }).join("");
  const avatarBlock = avatar
    ? `<img class="avatar" src="${escapeAttr(avatar)}" alt="">`
    : `<div class="profile-avatar-fallback" aria-hidden="true"><i class="bi bi-person-fill"></i></div>`;
  const previewAvatarBlock = avatar
    ? `<img class="avatar" src="${escapeAttr(avatar)}" alt="">`
    : `<div class="avatar profile-avatar-fallback profile-avatar-fallback--sm" aria-hidden="true"><i class="bi bi-person-fill"></i></div>`;
  root.innerHTML = `<div class="profile-page glass-panel">
    <header class="profile-page-head">
      <h2 class="profile-page-title"><i class="bi bi-person-badge" aria-hidden="true"></i> Profil</h2>
      <p class="muted profile-page-sub">Identité, carte PNG à partager et préférences d’affichage.</p>
    </header>

    <section class="profile-hero card glass-chip" aria-label="Aperçu du profil">
      <div class="profile-hero-avatar">
        <div class="profile-hero-ring avatar-wrap ${circle.className}">${avatarBlock}</div>
      </div>
      <div class="profile-hero-main">
        <h3 class="profile-hero-name" id="profileHeroName">${escapeHtml(state.profile.name || "Player")}</h3>
        <div class="profile-stat-chips">
          <span class="profile-chip" title="Gemmes"><i class="bi bi-gem" aria-hidden="true"></i> ${state.gems}</span>
          <span class="profile-chip" title="Niveau"><i class="bi bi-trophy" aria-hidden="true"></i> ${state.level}</span>
          <span class="profile-chip" title="Terminés"><i class="bi bi-check2-circle" aria-hidden="true"></i> ${doneCount}</span>
          <span class="profile-chip" title="Total complétions"><i class="bi bi-stars" aria-hidden="true"></i> ${state.profile.totalDone}</span>
        </div>
      </div>
    </section>

    <div class="profile-layout">
      <section class="profile-panel profile-panel-identity card glass-chip">
        <h3 class="profile-block-title"><i class="bi bi-pencil-square" aria-hidden="true"></i> Identité</h3>
        <p class="muted small profile-block-desc">Nom affiché sur la carte et dans l’aperçu.</p>
        <label class="profile-field">Pseudo
          <input id="profileName" type="text" value="${escapeAttr(state.profile.name || "Player")}" placeholder="Ton pseudo" autocomplete="nickname" />
        </label>
        <label class="profile-field profile-file-field">Photo
          <span class="profile-file-wrap">
            <input id="profileAvatar" class="profile-file-input" type="file" accept="image/*" />
            <span class="profile-file-btn" role="button"><i class="bi bi-image" aria-hidden="true"></i> Choisir une image</span>
          </span>
        </label>
        <div class="profile-actions-row">
          <button type="button" id="saveProfileBtn" class="primary"><i class="bi bi-check2" aria-hidden="true"></i> Enregistrer le profil</button>
        </div>
      </section>

      <section class="profile-panel profile-panel-share card glass-chip">
        <h3 class="profile-block-title"><i class="bi bi-easel" aria-hidden="true"></i> Carte de partage (PNG)</h3>
        <p class="muted small profile-block-desc">Style d’arrière-plan pour l’export (même rendu qu’en jeu).</p>
        <label class="profile-field">Skin de la carte
          <select id="shareCardSkin" class="form-select form-select-sm">${skinOptions}</select>
        </label>
        <div id="profileSharePreview" class="profile-share-preview">
          <div id="profileSharePreviewSkin" class="profile-preview-skin-layer ${previewSkin.className}"></div>
          <div class="profile-preview-inner">
            <div class="profile-preview-row">
              <div class="profile-preview-avatar-wrap avatar-wrap ${circle.className}">${previewAvatarBlock}</div>
              <div class="profile-preview-copy">
                <span class="profile-preview-brand">NOVA TASKS</span>
                <strong class="profile-preview-name">${escapeHtml(state.profile.name || "Player")}</strong>
                <span class="profile-preview-line">Niveau ${state.level} · ${state.gems} gemmes</span>
                <span class="profile-preview-line profile-preview-stats">Objectifs complétés : ${state.profile.totalDone} · Cette semaine : ${state.profile.weeklyDone}</span>
                <span class="profile-preview-line profile-preview-stats">Gemmes gagnées (total) : ${state.totalGemsEarned}</span>
                <span class="profile-preview-skin-label">Skin : ${escapeHtml(previewSkin.name)}</span>
              </div>
            </div>
          </div>
        </div>
        <button type="button" id="shareProfileBtn" class="primary profile-download-btn"><i class="bi bi-download" aria-hidden="true"></i> Télécharger la carte PNG</button>
      </section>
    </div>

    <section class="profile-settings-panel card glass-chip">
      <h3 class="profile-block-title"><i class="bi bi-sliders" aria-hidden="true"></i> Paramètres</h3>

      <h4 class="settings-section-title"><i class="bi bi-palette" aria-hidden="true"></i> Thème d'interface</h4>
      <div class="theme-picker">
        ${[
          { id: "dark",   icon: "🌙", label: "Sombre" },
          { id: "light",  icon: "☀️",  label: "Clair" },
          { id: "aurora", icon: "✨", label: "Aurora" },
          { id: "ocean",  icon: "🌊", label: "Océan" },
          { id: "jade",   icon: "🌿", label: "Jade" }
        ].map(({ id, icon, label }) => `<label class="theme-option${currentTheme === id ? " theme-option--active" : ""}"><input type="radio" name="uiTheme" id="uiTheme-${id}" value="${id}" ${currentTheme === id ? "checked" : ""}><div class="theme-option-preview" data-theme="${id}">${icon}</div><span class="theme-option-name">${label}</span></label>`).join("")}
      </div>

      <h4 class="settings-section-title"><i class="bi bi-toggles" aria-hidden="true"></i> Affichage</h4>
      <div class="profile-settings-grid">
        <label class="profile-toggle profile-setting-row">
          <input type="checkbox" id="setSidebarTips" class="form-check-input custom-check" ${tipsOn ? "checked" : ""}>
          <span class="profile-toggle-text"><strong>Conseils</strong><span class="muted small d-block">Astuces rotatives dans la barre latérale</span></span>
        </label>
        <label class="profile-toggle profile-setting-row">
          <input type="checkbox" id="setCompactLists" class="form-check-input custom-check" ${compactOn ? "checked" : ""}>
          <span class="profile-toggle-text"><strong>Listes compactes</strong><span class="muted small d-block">Cartes d'objectifs plus serrées</span></span>
        </label>
        <label class="profile-toggle profile-setting-row">
          <input type="checkbox" id="setProMode" class="form-check-input custom-check" ${proModeOn ? "checked" : ""}>
          <span class="profile-toggle-text"><strong>Mode Pro</strong><span class="muted small d-block">Masque gemmes, niveaux, boutique et skins pour une interface épurée</span></span>
        </label>
      </div>
      <button type="button" id="saveSettingsBtn" class="profile-save-settings-btn">Enregistrer les paramètres</button>
      <div class="profile-danger-zone">
        <p class="small muted mb-2">Réinitialise tout le compte local (niveau, gemmes, objectifs, tags, déblocages…).</p>
        <button type="button" id="resetAccountBtn" class="btn-delete-task"><i class="bi bi-exclamation-octagon" aria-hidden="true"></i> Réinitialiser le compte</button>
      </div>
    </section>
  </div>`;
  root.querySelector("#profileSharePreviewSkin")?.style.setProperty("--task-skin-bg", previewSkin.css);
  const nameInput = root.querySelector("#profileName");
  if (nameInput) {
    nameInput.addEventListener("input", () => {
      const v = nameInput.value.trim() || "Player";
      const pn = root.querySelector(".profile-preview-name");
      const hn = root.querySelector("#profileHeroName");
      if (pn) pn.textContent = v;
      if (hn) hn.textContent = v;
    });
  }
  root.querySelector("#saveProfileBtn").onclick = () => {
    state.profile.name = root.querySelector("#profileName").value.trim() || "Player";
    const file = root.querySelector("#profileAvatar").files[0];
    if (file) {
      const fr = new FileReader();
      fr.onload = () => { state.profile.avatar = fr.result; renderAll(); };
      fr.readAsDataURL(file);
    } else {
      renderAll();
    }
  };
  root.querySelector("#shareProfileBtn").onclick = exportProfilePng;
  root.querySelector("#saveSettingsBtn").onclick = () => {
    state.settings.sidebarTips = root.querySelector("#setSidebarTips").checked;
    state.settings.compactLists = root.querySelector("#setCompactLists").checked;
    state.settings.proMode = root.querySelector("#setProMode").checked;
    const selectedTheme = root.querySelector("input[name='uiTheme']:checked");
    if (selectedTheme) state.settings.uiTheme = selectedTheme.value;
    state.profile.shareCardSkinId = root.querySelector("#shareCardSkin").value;
    save();
    applyBodySettings();
    clearInterval(ui.tipTimer);
    ui.tipTimer = null;
    startSidebarTips();
    toast("Paramètres enregistrés");
    renderAll();
  };
  // Live theme preview on radio change
  root.querySelectorAll("input[name='uiTheme']").forEach((radio) => {
    radio.addEventListener("change", () => {
      const t = radio.value;
      if (t === "dark") {
        document.documentElement.removeAttribute("data-ui-theme");
      } else {
        document.documentElement.dataset.uiTheme = t;
      }
      // Update active class on options
      root.querySelectorAll(".theme-option").forEach((opt) => {
        opt.classList.toggle("theme-option--active", opt.querySelector("input")?.value === t);
      });
    });
  });
  root.querySelector("#shareCardSkin").addEventListener("change", (e) => {
    state.profile.shareCardSkinId = e.target.value;
    save();
    const skin = SKINS.find((s) => s.id === e.target.value) || SKINS[0];
    const layer = root.querySelector("#profileSharePreviewSkin");
    const skinLbl = root.querySelector(".profile-preview-skin-label");
    if (layer) {
      layer.className = `profile-preview-skin-layer ${skin.className}`;
      layer.style.setProperty("--task-skin-bg", skin.css);
    }
    if (skinLbl) skinLbl.textContent = `Skin : ${skin.name}`;
  });
  root.querySelector("#resetAccountBtn").onclick = () => {
    if (!confirm("Supprimer toutes les données locales : niveau, gems, objectifs, tags, thèmes et skins débloqués ?")) return;
    if (!confirm("Confirmation finale : cette action est irréversible.")) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  };
}

function canvasRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }
}

function drawShareCardBackground(ctx, skin, w, h) {
  const h1 = skin.canvasHue1 ?? 200;
  const h2 = skin.canvasHue2 ?? 280;
  const l1 = skin.canvasL1 ?? 24;
  const l2 = skin.canvasL2 ?? 12;
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, `hsl(${h1} 58% ${l1}%)`);
  g.addColorStop(1, `hsl(${h2} 50% ${l2}%)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  for (let i = 0; i < 400; i++) {
    const px = (i * 193) % w;
    const py = (i * 311) % h;
    ctx.fillRect(px, py, 2, 2);
  }
  const vg = ctx.createRadialGradient(w * 0.5, h * 0.55, w * 0.12, w * 0.5, h * 0.55, w * 0.88);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
}

function canvasFillTextShadowed(cx, text, x, y, fillStyle, font, shadow = "rgba(0,0,0,0.75)") {
  cx.font = font;
  cx.shadowColor = shadow;
  cx.shadowBlur = 5;
  cx.shadowOffsetX = 0;
  cx.shadowOffsetY = 1;
  cx.fillStyle = fillStyle;
  cx.fillText(text, x, y);
  cx.shadowBlur = 0;
}

function exportProfilePng() {
  const skin = SKINS.find((s) => s.id === state.profile.shareCardSkinId) || SKINS[0];
  const W = 960;
  const H = 540;
  const inset = 32;
  const cw = W - inset * 2;
  const ch = H - inset * 2;
  const r = 22;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const cx = canvas.getContext("2d");
  cx.clearRect(0, 0, W, H);

  cx.save();
  canvasRoundRect(cx, inset, inset, cw, ch, r);
  cx.clip();
  drawShareCardBackground(cx, skin, W, H);
  cx.fillStyle = "rgba(6, 12, 28, 0.2)";
  cx.fillRect(0, 0, W, H);
  cx.restore();

  cx.save();
  canvasRoundRect(cx, inset, inset, cw, ch, r);
  cx.strokeStyle = "rgba(255,255,255,0.28)";
  cx.lineWidth = 2;
  cx.stroke();
  cx.restore();

  const avatarR = 72;
  const ax = inset + 48;
  const ay = H / 2;
  const textX = ax + avatarR + 36;
  cx.beginPath();
  cx.arc(ax, ay, avatarR + 6, 0, Math.PI * 2);
  const ringGrad = cx.createLinearGradient(ax - 80, ay - 80, ax + 80, ay + 80);
  ringGrad.addColorStop(0, "#6bd5ff");
  ringGrad.addColorStop(1, "#8f71ff");
  cx.strokeStyle = ringGrad;
  cx.lineWidth = 5;
  cx.stroke();
  cx.beginPath();
  cx.arc(ax, ay, avatarR, 0, Math.PI * 2);
  cx.fillStyle = "rgba(12, 18, 36, 0.92)";
  cx.fill();

  let ty = ay - 96;
  canvasFillTextShadowed(cx, "NOVA TASKS", textX, ty, "rgba(108, 215, 255, 0.98)", "600 12px Inter, system-ui, sans-serif");
  ty += 26;
  canvasFillTextShadowed(cx, state.profile.name || "Player", textX, ty, "#f0f4ff", "bold 32px Inter, system-ui, sans-serif");
  ty += 46;
  canvasFillTextShadowed(cx, `Niveau ${state.level} · ${state.gems} gemmes`, textX, ty, "rgba(210, 220, 255, 0.96)", "19px Inter, system-ui, sans-serif");
  ty += 34;
  canvasFillTextShadowed(cx, `Objectifs complétés : ${state.profile.totalDone} · Cette semaine : ${state.profile.weeklyDone}`, textX, ty, "rgba(185, 198, 235, 0.95)", "15px Inter, system-ui, sans-serif");
  ty += 28;
  canvasFillTextShadowed(cx, `Gemmes gagnées (total) : ${state.totalGemsEarned}`, textX, ty, "rgba(185, 198, 235, 0.95)", "15px Inter, system-ui, sans-serif");
  ty += 30;
  canvasFillTextShadowed(cx, `Skin carte : ${skin.name}`, textX, ty, "rgba(120, 210, 255, 0.88)", "italic 12px Inter, system-ui, sans-serif");

  const finish = () => downloadCanvas(canvas, "nova-profile.png");
  if (state.profile.avatar) {
    const img = new Image();
    img.onload = () => {
      cx.save();
      cx.beginPath();
      cx.arc(ax, ay, avatarR, 0, Math.PI * 2);
      cx.clip();
      cx.drawImage(img, ax - avatarR, ay - avatarR, avatarR * 2, avatarR * 2);
      cx.restore();
      finish();
    };
    img.onerror = () => finish();
    img.src = state.profile.avatar;
  } else {
    finish();
  }
}

function downloadCanvas(canvas, name) {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = name;
  a.click();
}

function renderShop() {
  const root = document.getElementById("shopSection");
  const promo = ensureShopPromo();
  const pt = THEMES.find((x) => x.id === promo.themeId);
  const ps = SKINS.find((x) => x.id === promo.skinId);
  const pc = AVATAR_CIRCLES.find((x) => x.id === promo.circleId);
  const ptPrice = pt ? promoPrice(pt.cost, pt.id, "theme", promo) : 0;
  const psPrice = ps ? promoPrice(ps.cost, ps.id, "skin", promo) : 0;
  const pcPrice = pc ? promoPrice(pc.cost, pc.id, "circle", promo) : 0;
  const ownedT = state.themeOwned.length;
  const ownedS = state.skinOwned.length;
  const ownedC = state.avatarCircleOwned.length;

  root.innerHTML = `<div class="shop-page glass-panel">
    <header class="shop-page-head">
      <h2 class="shop-page-title"><i class="bi bi-shop" aria-hidden="true"></i> Boutique</h2>
      <p class="muted shop-page-sub">Thèmes d’interface, skins de cartes et cercles d’avatar — débloqués avec tes gemmes.</p>
    </header>

    <div class="shop-wallet card glass-chip">
      <div class="shop-wallet-item shop-wallet-gems" title="Gemmes disponibles">
        <i class="bi bi-gem" aria-hidden="true"></i>
        <span class="shop-wallet-val">${state.gems}</span>
        <span class="shop-wallet-lbl">gemmes</span>
      </div>
      <div class="shop-wallet-item" title="Niveau actuel">
        <i class="bi bi-trophy" aria-hidden="true"></i>
        <span class="shop-wallet-val">${state.level}</span>
        <span class="shop-wallet-lbl">niveau</span>
      </div>
      <div class="shop-wallet-item">
        <i class="bi bi-palette2" aria-hidden="true"></i>
        <span class="shop-wallet-val">${ownedT}/${THEMES.length}</span>
        <span class="shop-wallet-lbl">thèmes</span>
      </div>
      <div class="shop-wallet-item">
        <i class="bi bi-grid-1x2" aria-hidden="true"></i>
        <span class="shop-wallet-val">${ownedS}/${SKINS.length}</span>
        <span class="shop-wallet-lbl">skins</span>
      </div>
      <div class="shop-wallet-item">
        <i class="bi bi-person-bounding-box" aria-hidden="true"></i>
        <span class="shop-wallet-val">${ownedC}/${AVATAR_CIRCLES.length}</span>
        <span class="shop-wallet-lbl">cercles</span>
      </div>
    </div>

    <div class="shop-promo-strip">
      <p class="shop-promo-strip-title"><i class="bi bi-tag-fill" aria-hidden="true"></i> Offre du jour <span class="muted small">· ${promo.dayKey}</span></p>
      <div class="shop-hero">
        <div class="shop-promo-card shop-promo-card--theme glass-panel">
          <span class="promo-badge">−${promo.discount}%</span>
          <div class="shop-promo-icon"><i class="bi bi-palette2" aria-hidden="true"></i></div>
          <h4>Thème</h4>
          <p class="shop-promo-name"><strong>${escapeHtml(pt?.name || "")}</strong></p>
          <p class="shop-promo-price"><s class="muted">${pt?.cost}</s> <span class="shop-promo-arrow">→</span> <strong>${ptPrice}</strong> <span class="shop-promo-gem">💎</span></p>
          ${pt && !state.themeOwned.includes(pt.id) ? `<button type="button" class="primary shop-promo-btn" data-buy-promo-theme="${pt.id}">Acheter</button>` : pt ? `<button type="button" data-apply-theme="${pt.id}" class="shop-promo-btn">${state.activeTheme === pt.id ? "Actif" : "Équiper"}</button>` : ""}
        </div>
        <div class="shop-promo-card shop-promo-card--skin glass-panel">
          <span class="promo-badge">−${promo.discount}%</span>
          <div class="shop-promo-icon"><i class="bi bi-grid-1x2" aria-hidden="true"></i></div>
          <h4>Skin objectif</h4>
          <p class="shop-promo-name"><strong>${escapeHtml(ps?.name || "")}</strong></p>
          <p class="muted small shop-promo-hint">Pour les cartes d’objectifs</p>
          <p class="shop-promo-price"><s class="muted">${ps?.cost}</s> <span class="shop-promo-arrow">→</span> <strong>${psPrice}</strong> <span class="shop-promo-gem">💎</span></p>
          ${ps && !state.skinOwned.includes(ps.id) ? `<button type="button" class="primary shop-promo-btn" data-buy-promo-skin="${ps.id}">Acheter</button>` : ps ? `<span class="shop-promo-owned"><i class="bi bi-check-circle-fill" aria-hidden="true"></i> Déjà possédé</span>` : ""}
        </div>
        <div class="shop-promo-card shop-promo-card--circle glass-panel">
          <span class="promo-badge">−${promo.discount}%</span>
          <div class="shop-promo-icon"><i class="bi bi-person-bounding-box" aria-hidden="true"></i></div>
          <h4>Cercle profil</h4>
          <p class="shop-promo-name"><strong>${escapeHtml(pc?.name || "")}</strong></p>
          <p class="muted small shop-promo-hint">Anneau autour de l’avatar</p>
          <p class="shop-promo-price"><s class="muted">${pc?.cost}</s> <span class="shop-promo-arrow">→</span> <strong>${pcPrice}</strong> <span class="shop-promo-gem">💎</span></p>
          ${pc && !state.avatarCircleOwned.includes(pc.id) ? `<button type="button" class="primary shop-promo-btn" data-buy-promo-circle="${pc.id}">Acheter</button>` : pc ? `<button type="button" data-apply-avatar-circle="${pc.id}" class="shop-promo-btn">${state.activeAvatarCircle === pc.id ? "Actif" : "Équiper"}</button>` : ""}
        </div>
      </div>
    </div>

    <section class="shop-catalog card glass-chip">
      <div class="shop-catalog-section">
        <h3 class="shop-catalog-title"><i class="bi bi-droplet-half" aria-hidden="true"></i> Thèmes dégradés <span class="shop-catalog-meta">15 · interface</span></h3>
        <div class="shop-grid-wide">${THEMES.filter((t) => t.kind === "solid").map((t) => themeCard(t, promo)).join("")}</div>
      </div>
      <div class="shop-catalog-section">
        <h3 class="shop-catalog-title"><i class="bi bi-grid-3x3-gap" aria-hidden="true"></i> Thèmes à motifs <span class="shop-catalog-meta">5 · calque sur fond</span></h3>
        <div class="shop-grid-wide">${THEMES.filter((t) => t.kind === "pattern").map((t) => themeCard(t, promo)).join("")}</div>
      </div>
      <div class="shop-catalog-section">
        <h3 class="shop-catalog-title"><i class="bi bi-brightness-alt-high" aria-hidden="true"></i> Thèmes animés <span class="shop-catalog-meta">3 · fond vivant</span></h3>
        <div class="shop-grid-wide">${THEMES.filter((t) => t.kind === "motion").map((t) => themeCard(t, promo)).join("")}</div>
      </div>
      <div class="shop-catalog-section">
        <h3 class="shop-catalog-title"><i class="bi bi-paint-bucket" aria-hidden="true"></i> Skins dégradés <span class="shop-catalog-meta">10 · cartes</span></h3>
        <div class="shop-grid-wide">${SKINS.filter((s) => s.skinKind === "solid").map((s) => skinCard(s, promo)).join("")}</div>
      </div>
      <div class="shop-catalog-section">
        <h3 class="shop-catalog-title"><i class="bi bi-border-inner" aria-hidden="true"></i> Skins à motifs <span class="shop-catalog-meta">10 · texture</span></h3>
        <div class="shop-grid-wide">${SKINS.filter((s) => s.skinKind === "pattern").map((s) => skinCard(s, promo)).join("")}</div>
      </div>
      <div class="shop-catalog-section">
        <h3 class="shop-catalog-title"><i class="bi bi-record-circle" aria-hidden="true"></i> Cercles avatar <span class="shop-catalog-meta">${AVATAR_CIRCLES.length} styles · profil</span></h3>
        <div class="shop-grid-wide">${AVATAR_CIRCLES.map((c) => avatarCircleCard(c, promo)).join("")}</div>
      </div>
    </section>
  </div>`;
  root.querySelectorAll("[data-buy-theme]").forEach((b) => b.onclick = () => buyTheme(b.dataset.buyTheme));
  root.querySelectorAll("[data-apply-theme]").forEach((b) => b.onclick = () => applyThemeId(b.dataset.applyTheme));
  root.querySelectorAll("[data-buy-skin]").forEach((b) => b.onclick = () => buySkin(b.dataset.buySkin));
  root.querySelectorAll("[data-buy-avatar-circle]").forEach((b) => b.onclick = () => buyAvatarCircle(b.dataset.buyAvatarCircle));
  root.querySelectorAll("[data-apply-avatar-circle]").forEach((b) => b.onclick = () => applyAvatarCircle(b.dataset.applyAvatarCircle));
  root.querySelector("[data-buy-promo-theme]")?.addEventListener("click", (e) => buyTheme(e.currentTarget.dataset.buyPromoTheme, true));
  root.querySelector("[data-buy-promo-skin]")?.addEventListener("click", (e) => buySkin(e.currentTarget.dataset.buyPromoSkin, true));
  root.querySelector("[data-buy-promo-circle]")?.addEventListener("click", (e) => buyAvatarCircle(e.currentTarget.dataset.buyPromoCircle, true));
}

function themePreviewHtml(t) {
  if (t.kind === "motion" || (t.themeFx && t.themeFx.startsWith("anim"))) {
    let idx = 0;
    const m = (t.themeFx || "").match(/^anim-(\d)$/);
    if (m) idx = Math.min(2, Math.max(0, parseInt(m[1], 10)));
    return `<div class="theme-preview theme-preview-anim theme-preview-anim-${idx} mt-1" style="background:${t.preview}"></div>`;
  }
  if (t.kind === "pattern" || (t.themeFx && t.themeFx.startsWith("pat-"))) {
    const safe = (t.themeFx || "pat-0").replace(/[^a-z0-9-]/g, "");
    return `<div class="theme-preview theme-fx-${safe} mt-1" style="--theme-preview-base:${escapeAttr(t.preview)}"></div>`;
  }
  return `<div class="theme-preview mt-1" style="background:${t.preview}"></div>`;
}

function themeCard(t, promo) {
  const owned = state.themeOwned.includes(t.id);
  const active = state.activeTheme === t.id;
  const price = promoPrice(t.cost, t.id, "theme", promo);
  const isPromo = price < t.cost;
  const lock = state.level < t.levelReq ? `Lv.${t.levelReq}` : `${price} 💎${isPromo ? ` <span class="muted"><s>${t.cost}</s></span>` : ""}`;
  const tag = t.kind === "motion" ? "animé" : t.kind === "pattern" ? "motif" : "dégradé";
  return `<div class="shop-item-card shop-item-card--theme glass-chip"><strong class="shop-item-title">${escapeHtml(t.name)}</strong> <span class="badge shop-theme-kind">${tag}</span>${themePreviewHtml(t)}<small class="shop-item-meta d-block mt-1">${owned ? "Possédé" : lock}</small>${owned ? `<button type="button" class="shop-item-btn mt-2 w-100" data-apply-theme="${t.id}">${active ? "Actif" : "Équiper"}</button>` : `<button type="button" class="shop-item-btn mt-2 w-100 primary" data-buy-theme="${t.id}">Acheter</button>`}</div>`;
}

function skinCard(s, promo) {
  const owned = state.skinOwned.includes(s.id);
  const price = promoPrice(s.cost, s.id, "skin", promo);
  const isPromo = price < s.cost;
  const lock = state.level < s.levelReq ? `Lv.${s.levelReq}` : `${price} 💎${isPromo ? ` <s class="muted">${s.cost}</s>` : ""}`;
  const tag = s.skinKind === "pattern" ? "motif" : "dégradé";
  return `<div class="shop-item-card shop-item-card--skin ${s.className} glass-chip" style="background:${s.css};min-height:92px"><span class="badge shop-skin-kind">${tag}</span><strong class="shop-item-title">${escapeHtml(s.name)}</strong><br><small class="shop-item-meta">${owned ? "Possédé" : lock}</small><br>${owned ? `<span class="badge shop-item-badge-ok">OK</span>` : `<button type="button" data-buy-skin="${s.id}" class="shop-item-btn mt-1 w-100 primary">Acheter</button>`}</div>`;
}

function avatarCircleCard(c, promo) {
  const owned = state.avatarCircleOwned.includes(c.id);
  const active = state.activeAvatarCircle === c.id;
  const price = promoPrice(c.cost, c.id, "circle", promo);
  const isPromo = price < c.cost;
  const lock = state.level < c.levelReq ? `Lv.${c.levelReq}` : `${price} 💎${isPromo ? ` <s class="muted">${c.cost}</s>` : ""}`;
  return `<div class="shop-item-card shop-item-card--circle glass-chip"><div class="avatar-wrap ${c.className} mx-auto my-2 shop-item-avatar" style="width:72px;height:72px"><div class="avatar"></div></div><strong class="shop-item-title">${escapeHtml(c.name)}</strong><br><small class="shop-item-meta">${owned ? "Possédé" : lock}</small><br>${owned ? `<button type="button" data-apply-avatar-circle="${c.id}" class="shop-item-btn mt-1 w-100">${active ? "Actif" : "Équiper"}</button>` : `<button type="button" data-buy-avatar-circle="${c.id}" class="shop-item-btn mt-1 w-100 primary">Acheter</button>`}</div>`;
}

function canAfford(price, levelReq) { return state.level >= levelReq && state.gems >= price; }

function buyTheme(id, fromPromoHero = false) {
  const t = THEMES.find((x) => x.id === id);
  if (!t) return;
  const promo = ensureShopPromo();
  const pay = promoPrice(t.cost, t.id, "theme", promo);
  if (state.themeOwned.includes(id)) return;
  if (!canAfford(pay, t.levelReq)) return toast("Pas assez de gems ou niveau trop bas");
  state.gems -= pay;
  state.themeOwned.push(id);
  state.activeTheme = id;
  toast(fromPromoHero ? "Thème promo acheté !" : "Thème acheté");
  renderAll();
}

function applyThemeId(id) {
  if (state.themeOwned.includes(id)) { state.activeTheme = id; renderAll(); }
}

function buySkin(id, fromPromoHero = false) {
  const s = SKINS.find((x) => x.id === id);
  if (!s) return;
  const promo = ensureShopPromo();
  const pay = promoPrice(s.cost, s.id, "skin", promo);
  if (state.skinOwned.includes(id)) return;
  if (!canAfford(pay, s.levelReq)) return toast("Pas assez de gems ou niveau trop bas");
  state.gems -= pay;
  state.skinOwned.push(id);
  toast(fromPromoHero ? "Skin promo achetée !" : "Skin achetée");
  renderAll();
}

function buyAvatarCircle(id, fromPromoHero = false) {
  const c = AVATAR_CIRCLES.find((x) => x.id === id);
  if (!c) return;
  const promo = ensureShopPromo();
  const pay = promoPrice(c.cost, c.id, "circle", promo);
  if (state.avatarCircleOwned.includes(id)) return;
  if (!canAfford(pay, c.levelReq)) return toast("Pas assez de gems ou niveau trop bas");
  state.gems -= pay;
  state.avatarCircleOwned.push(id);
  state.activeAvatarCircle = id;
  toast(fromPromoHero ? "Cercle promo acheté !" : "Cercle acheté");
  renderAll();
}

function applyAvatarCircle(id) {
  if (state.avatarCircleOwned.includes(id)) { state.activeAvatarCircle = id; renderAll(); }
}

function applyTheme() {
  const t = THEMES.find((x) => x.id === state.activeTheme) || THEMES[0];
  Object.entries(t.vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  document.body.dataset.themeFx = t.themeFx || "";
}

function showTopGem(val) {
  const el = document.getElementById("topGemGain");
  if (!el) return;
  el.textContent = `+${val}`;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 900);
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

function confettiByDifficulty(importance, objectiveComplete = false) {
  if (!objectiveComplete) return;
  const layer = document.getElementById("confettiLayer");
  const base = importance === 3 ? 95 : importance === 2 ? 70 : 48;
  const count = base * 10;
  for (let i = 0; i < count; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = `${Math.random() * 100}vw`;
    c.style.top = `${-20 - Math.random() * 120}px`;
    c.style.background = `hsl(${Math.random() * 360} 90% 62%)`;
    c.style.animationDelay = `${Math.random() * 400}ms`;
    c.style.animationDuration = `${1.8 + Math.random() * 0.9}s`;
    layer.appendChild(c);
    setTimeout(() => c.remove(), 3200);
  }
}

setInterval(() => {
  const prev = JSON.stringify(state.tasks.map((t) => `${t.id}:${t.state}`));
  evaluateState();
  const next = JSON.stringify(state.tasks.map((t) => `${t.id}:${t.state}`));
  if (prev !== next) renderAll();
}, 10000);

document.addEventListener("DOMContentLoaded", mount);
