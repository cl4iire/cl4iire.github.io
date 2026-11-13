/**
 * Checks the content edited with Pages CMS before the site is published.
 * Run: npm run check   (also run automatically by GitHub before each publication)
 * Errors stop the publication: the online site stays on the previous version.
 * Messages are in French because they are read by Claire in GitHub.
 */
import fs from 'fs';
import path from 'path';
import { FONTS, THEMES } from '../site-settings-plugin';

const ROOT = path.resolve(import.meta.dirname, '..');
const errors: string[] = [];
const warnings: string[] = [];

const rel = (p: string) => path.relative(ROOT, p).split(path.sep).join('/');
const readJson = (file: string): any => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${rel(file)} : fichier illisible (${(e as Error).message})`);
    return null;
  }
};
const listJson = (dir: string) =>
  fs.existsSync(path.join(ROOT, dir)) ? fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.json')).map((f) => path.join(ROOT, dir, f)) : [];

const isUrl = (s: unknown) => typeof s === 'string' && /^https?:\/\/\S+\.\S+/.test(s.trim());
const empty = (s: unknown) => typeof s !== 'string' || s.trim() === '';

/** "/media/..." must exist in public/ */
function checkMedia(where: string, p: unknown, kind: 'image' | 'pdf' = 'image') {
  if (empty(p)) return errors.push(`${where} : fichier manquant (champ vide)`);
  const file = path.join(ROOT, 'public', String(p).replace(/^\/+/, ''));
  if (!fs.existsSync(file)) return errors.push(`${where} : le fichier « ${p} » n'existe pas dans les médias`);
  const ext = path.extname(file).toLowerCase();
  if (kind === 'pdf' && ext !== '.pdf') errors.push(`${where} : « ${p} » doit être un PDF`);
  if (kind === 'image' && !['.webp', '.jpg', '.jpeg', '.png', '.avif', '.gif'].includes(ext)) errors.push(`${where} : « ${p} » n'est pas une image`);
}

/** Bilingual text: French required, English optional (falls back to French) */
function checkText(where: string, b: any, required = true) {
  if (!b || typeof b !== 'object') {
    if (required) errors.push(`${where} : texte manquant`);
    return;
  }
  if (required && empty(b.fr)) errors.push(`${where} : le texte français est vide`);
  if (required && !empty(b.fr) && empty(b.en)) warnings.push(`${where} : pas de traduction anglaise (le français sera affiché)`);
}

// ---------- Projects ----------
const CATEGORIES = ['film', 'documentaire', 'experience'];
const projects = listJson('content/projets');
if (projects.length === 0) errors.push('content/projets : aucun projet trouvé');
for (const file of projects) {
  const p = readJson(file);
  if (!p) continue;
  const name = `Projet « ${p.titre || path.basename(file, '.json')} »`;
  if (!/^[a-z0-9-]+\.json$/.test(path.basename(file))) warnings.push(`${rel(file)} : nom de fichier avec majuscules, espaces ou accents`);
  if (empty(p.titre)) errors.push(`${name} : le titre est vide`);
  if (!CATEGORIES.includes(p.categorie)) errors.push(`${name} : catégorie invalide (« ${p.categorie} »)`);
  if (empty(p.annee)) errors.push(`${name} : l'année est vide`);
  if (p.ordre !== undefined && p.ordre !== null && typeof p.ordre !== 'number') errors.push(`${name} : la position doit être un nombre`);
  if (p.masquer === true) warnings.push(`${name} : masqué (n'apparaît pas sur le site)`);
  checkText(`${name}, rôles`, p.roles);
  checkText(`${name}, description`, p.description);
  if (!empty(p.video) && !isUrl(p.video)) errors.push(`${name} : le lien vidéo « ${p.video} » n'est pas une adresse web (https://...)`);
  (p.images ?? []).forEach((img: string, i: number) => checkMedia(`${name}, image ${i + 1}`, img));
  (p.coulisses ?? []).forEach((img: string, i: number) => checkMedia(`${name}, coulisse ${i + 1}`, img));
  (p.liens ?? []).forEach((l: any, i: number) => {
    if (!isUrl(l?.url)) errors.push(`${name}, lien ${i + 1} : adresse invalide (« ${l?.url ?? ''} »)`);
    checkText(`${name}, lien ${i + 1}`, l?.texte);
  });
  if ((p.images ?? []).length === 0) warnings.push(`${name} : aucune image (pas de preview au survol)`);
}

// ---------- Places & albums ----------
const places = new Set(listJson('content/lieux').map((f) => path.basename(f, '.json')));
for (const file of listJson('content/lieux')) {
  const l = readJson(file);
  if (l) checkText(`Lieu « ${path.basename(file, '.json')} »`, { fr: l.nom, en: l.nom_en });
}
const albums = listJson('content/albums');
if (albums.length === 0) errors.push('content/albums : aucun album trouvé');
for (const file of albums) {
  const a = readJson(file);
  if (!a) continue;
  const name = `Album « ${a.titre?.fr || path.basename(file, '.json')} »`;
  checkText(`${name}, titre`, a.titre);
  if (a.format && !['portrait', 'carre'].includes(a.format)) errors.push(`${name} : format invalide (« ${a.format} »)`);
  if (a.filtre && !['pays', 'evenement'].includes(a.filtre)) errors.push(`${name} : type de filtre invalide (« ${a.filtre} »)`);
  const seen = new Set<string>();
  (a.photos ?? []).forEach((ph: any, i: number) => {
    const where = `${name}, photo ${i + 1}`;
    checkMedia(where, ph?.image);
    if (ph?.image && seen.has(ph.image)) warnings.push(`${where} : photo présente deux fois (« ${ph.image} »)`);
    seen.add(ph?.image);
    const placeId = String(ph?.lieu ?? '').split('/').pop()!.replace(/\.json$/, '');
    if (!placeId) errors.push(`${where} : aucun lieu choisi`);
    else if (!places.has(placeId)) errors.push(`${where} : le lieu « ${ph.lieu} » n'existe pas (à créer dans « Lieux et événements »)`);
  });
  (a.article ?? []).forEach((img: string, i: number) => checkMedia(`${name}, page d'article ${i + 1}`, img));
}

// ---------- Documents ----------
const docs = readJson(path.join(ROOT, 'content/documents.json'));
if (docs) {
  checkMedia('Documents, CV français', docs.cv_fr, 'pdf');
  checkMedia('Documents, CV anglais', docs.cv_en, 'pdf');
  checkMedia('Documents, projet de master', docs.projet_master, 'pdf');
}

// ---------- Site texts ----------
const textes = readJson(path.join(ROOT, 'content/textes.json'));
if (textes) {
  // Every {fr, en} text of the interface must have its French version
  const walk = (v: any, where: string) => {
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${where} ${i + 1}`));
    else if (v && typeof v === 'object') {
      const keys = Object.keys(v);
      if (keys.length && keys.every((k) => k === 'fr' || k === 'en')) {
        if (empty(v.fr)) errors.push(`Textes du site, ${where} : le texte français est vide`);
      } else keys.forEach((k) => walk(v[k], `${where} > ${k}`));
    }
  };
  Object.entries(textes).forEach(([group, v]) => walk(v, group));
  const c = textes.contact ?? {};
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email ?? '')) errors.push(`Textes du site, contact : adresse e-mail invalide (« ${c.email ?? ''} »)`);
  if (c.instagram?.url && !isUrl(c.instagram.url)) errors.push('Textes du site, contact : lien Instagram invalide');
  if (c.linkedin?.url && !isUrl(c.linkedin.url)) errors.push('Textes du site, contact : lien LinkedIn invalide');
  if (empty(textes.identite?.nom)) errors.push('Textes du site, identité : le nom est vide');
  checkMedia("Textes du site, accueil : photo de tournage", textes.accueil?.image_tournage);
  checkMedia("Textes du site, accueil : portrait", textes.accueil?.image_portrait);
}

// ---------- Settings ----------
const settings = readJson(path.join(ROOT, 'content/reglages.json'));
if (settings) {
  if (empty(settings.seo?.titre)) errors.push('Réglages : le titre Google est vide');
  if (empty(settings.seo?.description)) errors.push('Réglages : la description Google est vide');
  if (!FONTS[settings.police]) errors.push(`Réglages : police inconnue (« ${settings.police} »)`);
  if (!THEMES[settings.theme]) errors.push(`Réglages : thème inconnu (« ${settings.theme} »)`);
}

// ---------- Report ----------
for (const w of warnings) console.log(`⚠️  ${w}`);
if (errors.length) {
  console.error(`\n❌ ${errors.length} problème(s) à corriger avant publication :`);
  for (const e of errors) console.error(`   - ${e}`);
  console.error('\nLe site en ligne n’a pas été modifié. Corrigez dans Pages CMS puis enregistrez à nouveau.');
  process.exit(1);
}
console.log(`\n✅ Contenu valide : ${projects.length} projets, ${albums.length} albums, ${places.size} lieux.`);
