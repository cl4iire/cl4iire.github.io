import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

/**
 * SEO generated from the content edited with Pages CMS (nothing to maintain by hand):
 * - structured data (JSON-LD, schema.org) injected in index.html in place of <!--__JSON_LD__-->:
 *   WebSite, ProfilePage + Person (Claire), one Movie / CreativeWork per project, with its YouTube VideoObject
 * - sitemap.xml with every photo of the site (Google Images), generated at build time
 *   (also served by the dev server at /sitemap.xml to check it)
 */

// Public address of the site (GitHub user site, see vite.config.ts `base`)
export const SITE_URL = 'https://cl4iire.github.io/';

type Json = any;
const readJson = (file: string): Json => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null; // invalid file: reported by `npm run check`
  }
};
const readDir = (dir: string) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => ({ id: f.replace(/\.json$/, ''), data: readJson(path.join(dir, f)) })).filter((x) => x.data)
    : [];

const fr = (b: Json) => (typeof b === 'string' ? b : (b?.fr ?? '')).trim();
const abs = (p?: string) => (p ? (/^https?:\/\//.test(p) ? p : SITE_URL + encodeURI(p.replace(/^\/+/, ''))) : undefined);
const youtubeId = (url?: string) => url?.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/)?.[1];
const placeId = (ref: string) => String(ref ?? '').split('/').pop()!.replace(/\.json$/, '');
/** Removes empty values so the JSON-LD only states what is known */
const clean = <T>(v: T): T => {
  if (Array.isArray(v)) return v.map(clean).filter((x) => x !== undefined && x !== '' && !(Array.isArray(x) && !x.length)) as T;
  if (v && typeof v === 'object') {
    const o = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clean(x)]).filter(([, x]) => x !== undefined && x !== '' && !(Array.isArray(x) && !x.length)));
    return o as T;
  }
  return v;
};

function loadContent(root: string) {
  const c = path.join(root, 'content');
  return {
    textes: readJson(path.join(c, 'textes.json')) ?? {},
    reglages: readJson(path.join(c, 'reglages.json')) ?? {},
    projets: readDir(path.join(c, 'projets')).filter((p) => p.data.masquer !== true),
    albums: readDir(path.join(c, 'albums')).filter((a) => a.data.masquer !== true),
  };
}

// ---------- Education: current studies vs completed degrees ----------
/** Academic year of a date: from September, 2026 -> 2026-2027 is "2026" */
const academicYear = (d: Date) => (d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1);

/** "2025–2026" -> current if it covers the present academic year (computed at build time, so it updates by itself) */
export function splitEducation(education: Json[], now = new Date()) {
  const year = academicYear(now);
  const current: Json[] = [];
  const done: Json[] = [];
  for (const e of education ?? []) {
    const [start, end] = (String(e.years ?? '').match(/\d{4}/g) ?? []).map(Number);
    const isCurrent = start !== undefined && start <= year && (end ?? start + 1) > year;
    (isCurrent ? current : done).push(e);
  }
  return { current, done };
}

/** Other ways of writing the name ("Claire Buhaceanu Laborde" -> "Claire Laborde", "Claire Buhaceanu", "Claire B.L") */
function nameVariants(textes: Json): string[] {
  const full = String(textes.identite?.nom ?? '').trim();
  const words = full.split(/\s+/).filter(Boolean);
  const variants = words.length >= 3 ? [`${words[0]} ${words[words.length - 1]}`, `${words[0]} ${words[1]}`] : [];
  return [...new Set([...variants, String(textes.identite?.nom_court ?? '').trim()])].filter((v) => v && v !== full);
}

/** One sentence that says who she is today (student / graduate), built from the education list */
function situation(textes: Json): string {
  const { current, done } = splitEducation(textes.a_propos?.education ?? []);
  const parts = [
    ...current.map((e: Json) => `étudiante en ${fr(e.diploma)} (${fr(e.school)})`),
    done.length ? `diplômée : ${done.map((e: Json) => `${fr(e.diploma)} (${fr(e.school)})`).join(' ; ')}` : '',
  ].filter(Boolean);
  const s = parts.join(', ');
  return s ? s.charAt(0).toUpperCase() + s.slice(1) + '.' : '';
}

// ---------- Structured data ----------
export function buildJsonLd(root: string) {
  const { textes, reglages, projets } = loadContent(root);
  const id = (frag: string) => `${SITE_URL}#${frag}`;
  const contact = textes.contact ?? {};
  const shown = (flag: string) => contact[flag] !== false;
  const studies = splitEducation(textes.a_propos?.education ?? []);

  const person = {
    '@type': 'Person',
    '@id': id('claire'),
    name: textes.identite?.nom,
    alternateName: nameVariants(textes),
    url: SITE_URL,
    jobTitle: fr(textes.identite?.subtitle),
    description: fr(textes.a_propos?.aboutLead),
    disambiguatingDescription: situation(textes),
    image: abs(textes.accueil?.image_tournage),
    email: shown('afficher_email') && contact.email ? `mailto:${contact.email}` : undefined,
    sameAs: [shown('afficher_instagram') ? contact.instagram?.url : undefined, shown('afficher_linkedin') ? contact.linkedin?.url : undefined],
    homeLocation: shown('afficher_base') && fr(contact.baseValue) ? { '@type': 'Place', name: fr(contact.baseValue) } : undefined,
    // Student: current school(s) = affiliation; completed ones = alumniOf + the degrees obtained
    affiliation: studies.current.map((e: Json) => ({ '@type': 'EducationalOrganization', name: fr(e.school), description: fr(e.diploma) })),
    alumniOf: studies.done.map((e: Json) => ({ '@type': 'EducationalOrganization', name: fr(e.school) })),
    hasCredential: studies.done.map((e: Json) => ({
      '@type': 'EducationalOccupationalCredential',
      name: fr(e.diploma),
      credentialCategory: 'degree',
      recognizedBy: { '@type': 'EducationalOrganization', name: fr(e.school) },
    })),
    knowsAbout: (textes.a_propos?.skillsList ?? []).map(fr),
    knowsLanguage: ['Français', ...(textes.a_propos?.languagesList ?? []).map((l: Json) => fr(l.name).replace(/\s*:\s*$/, ''))],
  };

  const works = projets
    .sort((a, b) => (a.data.ordre ?? 999) - (b.data.ordre ?? 999))
    .map(({ id: pid, data: p }) => {
      const yt = youtubeId(p.video);
      const cover = abs(p.images?.[0]);
      return {
        '@type': p.categorie === 'experience' ? 'CreativeWork' : 'Movie',
        '@id': id(`w-${pid}`),
        url: id(`w-${pid}`),
        name: p.titre,
        description: fr(p.description),
        genre: fr(p.type),
        dateCreated: p.annee,
        image: cover,
        isPartOf: { '@id': id('page') },
        // Claire's role in the project
        contributor: fr(p.roles) ? { '@type': 'Role', roleName: fr(p.roles), contributor: { '@id': id('claire') } } : { '@id': id('claire') },
        // Google requires the upload date for a video: no date, no VideoObject (see "date_video" in the CMS)
        video:
          yt && p.date_video
            ? {
                '@type': 'VideoObject',
                name: p.titre,
                description: fr(p.description) || p.titre,
                thumbnailUrl: [cover, `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`],
                uploadDate: p.date_video,
                embedUrl: `https://www.youtube.com/embed/${yt}`,
                url: `https://www.youtube.com/watch?v=${yt}`,
              }
            : undefined,
        sameAs: (p.liens ?? []).map((l: Json) => l?.url).filter(Boolean),
      };
    });

  const graph = [
    { '@type': 'WebSite', '@id': id('site'), url: SITE_URL, name: `Portfolio ${textes.identite?.nom ?? ''}`.trim(), inLanguage: ['fr', 'en'], publisher: { '@id': id('claire') } },
    {
      '@type': 'ProfilePage',
      '@id': id('page'),
      url: SITE_URL,
      name: reglages.seo?.titre,
      description: reglages.seo?.description,
      inLanguage: 'fr',
      isPartOf: { '@id': id('site') },
      mainEntity: { '@id': id('claire') },
      primaryImageOfPage: abs('/og-image.jpg'),
      hasPart: works.map((w) => ({ '@id': w['@id'] })),
    },
    person,
    ...works,
  ];
  // "<" escaped so the JSON can never close the <script> tag
  return JSON.stringify(clean({ '@context': 'https://schema.org', '@graph': graph }), null, 2).replace(/</g, '\\u003c');
}

// ---------- llms.txt (plain-text summary for AI assistants: ChatGPT, Perplexity, Claude...) ----------
export function buildLlmsTxt(root: string) {
  const { textes, projets, albums } = loadContent(root);
  const c = textes.contact ?? {};
  const ab = textes.a_propos ?? {};
  const shown = (flag: string) => c[flag] !== false;
  const documents = readJson(path.join(root, 'content/documents.json')) ?? {};
  const places = Object.fromEntries(readDir(path.join(root, 'content/lieux')).map(({ id: pid, data }) => [pid, data.nom]));
  const CAT: Record<string, string> = { film: 'Film', documentaire: 'Documentaire', experience: 'Expérience professionnelle' };
  const { current } = splitEducation(ab.education ?? []);
  const nom = textes.identite?.nom ?? '';
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);

  push(`# ${nom}`, '', `> ${fr(textes.identite?.subtitle)}. ${situation(textes)} Portfolio : films, documentaires, expériences professionnelles et photographies.`, '');
  const variants = nameVariants(textes);
  if (variants.length) push(`Aussi appelée : ${variants.join(', ')}.`, '');
  push(`Site : ${SITE_URL}`, '');

  push('## À propos', '', fr(ab.aboutLead), '', fr(ab.aboutBody), '');
  push('## Formation', '', ...(ab.education ?? []).map((e: Json) => `- ${e.years} : ${fr(e.school)}, ${fr(e.diploma)}${current.includes(e) ? ' (en cours)' : ''}`), '');
  push('## Compétences', '', ...(ab.skillsList ?? []).map((s: Json) => `- ${fr(s)}`), '');
  push('## Outils', '', ...(ab.toolsList ?? []).map((s: Json) => `- ${fr(s)}`), '');
  push('## Langues', '', '- Français', ...(ab.languagesList ?? []).map((l: Json) => `- ${fr(l.name).replace(/\s*:\s*$/, '')} : ${fr(l.level)}`), '');

  push('## Travaux', '');
  projets
    .sort((a, b) => (a.data.ordre ?? 999) - (b.data.ordre ?? 999))
    .forEach(({ data: p }) => {
      push(`### ${p.titre} (${p.annee}${fr(p.type) ? `, ${fr(p.type)}` : ''})`, '');
      push(`- Catégorie : ${CAT[p.categorie] ?? p.categorie}`);
      if (fr(p.roles)) push(`- Rôle de ${nom.split(' ')[0]} : ${fr(p.roles)}`);
      if (p.duree) push(`- Durée : ${p.duree}`);
      if (p.production) push(`- Production : ${p.production}`);
      if (p.video) push(`- Vidéo : ${p.video}`);
      (p.liens ?? []).filter((l: Json) => l?.url).forEach((l: Json) => push(`- ${fr(l.texte) || 'Lien'} : ${l.url}`));
      push('', fr(p.description), '');
    });

  push('## Photographies', '');
  albums
    .sort((a, b) => (a.data.ordre ?? 999) - (b.data.ordre ?? 999))
    .forEach(({ data: a }) => {
      const where = [...new Set((a.photos ?? []).map((ph: Json) => places[placeId(ph?.lieu)]).filter(Boolean))];
      push(`- ${fr(a.titre)} (${(a.photos ?? []).length} photos${where.length ? ` : ${where.join(', ')}` : ''}) : ${fr(a.description)}`);
    });
  push('');

  push('## Contact', '', `- Site : ${SITE_URL}`);
  if (shown('afficher_email') && c.email) push(`- E-mail : ${c.email}`);
  if (shown('afficher_telephone') && c.telephone) push(`- Téléphone : ${c.telephone}`);
  if (shown('afficher_instagram') && c.instagram?.url) push(`- Instagram : ${c.instagram.url}`);
  if (shown('afficher_linkedin') && c.linkedin?.url) push(`- LinkedIn : ${c.linkedin.url}`);
  if (shown('afficher_base') && fr(c.baseValue)) push(`- Basée en : ${fr(c.baseValue)}`);
  if (documents.afficher_cv !== false) push(`- CV (français) : ${abs(documents.cv_fr)}`, `- CV (anglais) : ${abs(documents.cv_en)}`);
  push('');

  // Short English version
  const en = (b: Json) => (typeof b === 'object' && b?.en?.trim() ? b.en : fr(b));
  push('## In English', '', `${nom}: ${en(textes.identite?.subtitle)}. ${en(ab.aboutLead)} ${en(ab.aboutBody)}`, '');
  push(...projets.map(({ data: p }) => `- ${p.titre} (${p.annee}, ${en(p.type)})${p.video ? `: ${p.video}` : ''}`), '');

  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

// ---------- Sitemap (with images) ----------
const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function buildSitemap(root: string) {
  const { textes, projets, albums } = loadContent(root);
  const images = new Set<string>();
  const add = (p?: string) => {
    const u = abs(p);
    if (u) images.add(u);
  };
  add(textes.accueil?.image_tournage);
  add(textes.accueil?.image_portrait);
  projets.forEach(({ data: p }) => [...(p.images ?? []), ...(p.coulisses ?? [])].forEach(add));
  albums.forEach(({ data: a }) => (a.photos ?? []).forEach((ph: Json) => add(ph?.image)));

  const today = new Date().toISOString().slice(0, 10);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    '  <url>',
    `    <loc>${xml(SITE_URL)}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    ...[...images].slice(0, 1000).map((u) => `    <image:image><image:loc>${xml(u)}</image:loc></image:image>`),
    '  </url>',
    '</urlset>',
    '',
  ].join('\n');
}

export function seoPlugin(): Plugin {
  let root = process.cwd();
  return {
    name: 'seo',
    configResolved(config) {
      root = config.root;
    },
    configureServer(server) {
      server.middlewares.use('/sitemap.xml', (_req, res) => {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.end(buildSitemap(root));
      });
      server.middlewares.use('/llms.txt', (_req, res) => {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(buildLlmsTxt(root));
      });
    },
    transformIndexHtml(html) {
      return html.replace('<!--__JSON_LD__-->', `<script type="application/ld+json">\n${buildJsonLd(root)}\n    </script>`);
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(root) });
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: buildLlmsTxt(root) });
    },
  };
}
