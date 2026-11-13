// Loads the site content from /content (JSON files edited with Pages CMS, see .pages.yml)
import type { AlbumFile, Bilingual, DocumentsFile, LocaleText, PlaceFile, ProjectData, ProjectFile } from './types';
import textes from '../../content/textes.json';
import documents from '../../content/documents.json';

export type Lang = 'FR' | 'ENG';

const projectFiles = import.meta.glob('/content/projets/*.json', { eager: true, import: 'default' }) as Record<string, ProjectFile>;
const albumFiles = import.meta.glob('/content/albums/*.json', { eager: true, import: 'default' }) as Record<string, AlbumFile>;
const placeFiles = import.meta.glob('/content/lieux/*.json', { eager: true, import: 'default' }) as Record<string, PlaceFile>;

const fileId = (path: string) => path.split('/').pop()!.replace(/\.json$/, '');

/** Public URL of a media file stored as "/media/..." (works whatever the Vite `base`) */
export const asset = (p: string) => (/^https?:\/\//.test(p) ? p : import.meta.env.BASE_URL + p.replace(/^\/+/, ''));

/** {fr, en} -> {FR, ENG}; an empty English text falls back to French */
const toLocale = (b?: Bilingual | null): LocaleText => ({ FR: b?.fr ?? '', ENG: b?.en?.trim() ? b.en : b?.fr ?? '' });
const isBilingual = (v: unknown): v is Bilingual =>
  !!v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 0 && Object.keys(v).every((k) => k === 'fr' || k === 'en');

/** Picks one language everywhere in a nested structure of {fr, en} texts */
function localize(value: unknown, lang: Lang): any {
  if (Array.isArray(value)) return value.map((v) => localize(v, lang));
  if (isBilingual(value)) return toLocale(value)[lang];
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localize(v, lang)]));
  return value;
}

// ---------- Interface texts (content/textes.json) ----------

type WorkCat = 'film' | 'documentary' | 'experience';
export interface Translations {
  // identity & home
  nom: string;
  nom_court: string;
  subtitle: string;
  image_tournage: string;
  image_portrait: string;
  heroTitle: string;
  heroCaption: string;
  heroAltFilming: string;
  heroAltPortrait: string;
  // navigation
  nav: { films: string; documentaries: string; experiences: string; photography: string; contact: string };
  sections: string;
  navigation: string;
  cvButton: string;
  projectButton: string;
  projectShort: string;
  language: string;
  menu: string;
  openMenu: string;
  closeMenu: string;
  close: string;
  // about
  about: string;
  aboutLead: string;
  aboutBody: string;
  education: { years: string; school: string; diploma: string }[];
  tools: string;
  toolsList: string[];
  languages: string;
  languagesList: { name: string; level: string }[];
  skills: string;
  skillsList: string[];
  // works
  works: string;
  categories: string;
  all: string;
  catPlural: Record<WorkCat, string>;
  catSingular: Record<WorkCat, string>;
  roles: string;
  duration: string;
  composition: string;
  production: string;
  play: string;
  watchVideo: string;
  watchOnYoutube: string;
  behindScenes: string;
  photos: string;
  imageOf: string;
  stillOf: string;
  // photography
  photoTitleStart: string;
  photoTitleEnd: string;
  series: string;
  byCountry: string;
  byEvent: string;
  readArticle: string;
  articleTitle: string;
  articleAlt: string;
  // contact
  contact: string;
  email: string;
  phone: string;
  telephone: string;
  instagram: { pseudo: string; url: string };
  linkedin: { texte: string; url: string };
  base: string;
  baseValue: string;
  seeCv: string;
  rights: string;
  // windows
  viewer: string;
  prev: string;
  next: string;
  cvTitle: string;
  projectTitle: string;
}

const buildTranslations = (lang: Lang): Translations => {
  const groups = Object.values(textes) as Record<string, unknown>[];
  const t = Object.assign({}, ...groups.map((g) => localize(g, lang))) as Translations;
  return { ...t, image_tournage: asset(t.image_tournage), image_portrait: asset(t.image_portrait) };
};

export const TRANSLATIONS: Record<Lang, Translations> = { FR: buildTranslations('FR'), ENG: buildTranslations('ENG') };

// ---------- Documents (content/documents.json) ----------

const docs = documents as DocumentsFile;
export const DOCUMENTS = {
  cvFr: asset(docs.cv_fr),
  cvEn: asset(docs.cv_en),
  project: asset(docs.projet_master),
};

// ---------- Projects (content/projets/*.json) ----------

const CATEGORY: Record<ProjectFile['categorie'], ProjectData['category']> = {
  film: 'film',
  documentaire: 'documentary',
  experience: 'experience',
};

const hasText = (b?: Bilingual) => !!b && !!(b.fr?.trim() || b.en?.trim());

// Order of the "Work" list: "ordre" (1 = first), then most recent year, then title
export const PROJECTS: ProjectData[] = Object.entries(projectFiles)
  .filter(([, p]) => p.masquer !== true)
  .map(([path, p]) => ({ path, p }))
  .sort(
    (a, b) =>
      (a.p.ordre ?? 999) - (b.p.ordre ?? 999) || (b.p.annee ?? '').localeCompare(a.p.annee ?? '') || a.p.titre.localeCompare(b.p.titre)
  )
  .map(({ path, p }) => ({
    id: fileId(path),
    category: CATEGORY[p.categorie] ?? 'film',
    title: p.titre,
    year: p.annee ?? '',
    type: toLocale(p.type),
    duration: p.duree || null,
    composition: hasText(p.composition) ? toLocale(p.composition) : null,
    producer: p.production || undefined,
    videoUrl: p.video?.trim() || '#',
    role: toLocale(p.roles),
    description: toLocale(p.description),
    images: (p.images ?? []).filter(Boolean).map(asset),
    behindTheScenes: (p.coulisses ?? []).filter(Boolean).map(asset),
    links: (p.liens ?? []).filter((l) => l?.url).map((l) => ({ label: toLocale(l.texte), url: l.url })),
  }));

// ---------- Photo albums (content/albums/*.json + content/lieux/*.json) ----------

/** A photo's place may be stored as "nepal", "nepal.json" or "content/lieux/nepal.json" (CMS reference) */
export const placeId = (ref: string) => (ref ?? '').split('/').pop()!.replace(/\.json$/, '');

const PLACES: Record<string, LocaleText> = Object.fromEntries(
  Object.entries(placeFiles).map(([path, place]) => [fileId(path), toLocale({ fr: place.nom, en: place.nom_en })])
);

export type PhotoItem = {
  url: string;
  srcPath: string; // image path as stored in the album file (key used by the order editor)
  group: string; // place / event id
  desc: string; // place label (French), fallback text
};
export type PhotoAlbum = {
  id: string;
  title: LocaleText;
  description?: LocaleText;
  format: 'portrait' | 'carre';
  filter: 'pays' | 'evenement';
  items: PhotoItem[];
  places: Record<string, LocaleText>; // place id -> label (second filter)
  articleImages?: string[];
};

export const PHOTOGRAPHY_ALBUMS: PhotoAlbum[] = Object.entries(albumFiles)
  .sort(([pa, a], [pb, b]) => (a.ordre ?? 999) - (b.ordre ?? 999) || fileId(pa).localeCompare(fileId(pb)))
  .map(([path, a]) => {
    const items = (a.photos ?? [])
      .filter((ph) => ph?.image)
      .map((ph) => {
        const group = placeId(ph.lieu);
        return { url: asset(ph.image), srcPath: ph.image, group, desc: PLACES[group]?.FR ?? group };
      });
    const places = Object.fromEntries(items.map((it) => [it.group, PLACES[it.group] ?? { FR: it.group, ENG: it.group }]));
    return {
      id: fileId(path),
      title: toLocale(a.titre),
      description: hasText(a.description) ? toLocale(a.description) : undefined,
      format: a.format === 'portrait' ? 'portrait' : 'carre',
      filter: a.filtre === 'evenement' ? 'evenement' : 'pays',
      items,
      places,
      articleImages: (a.article ?? []).filter(Boolean).map(asset),
    } satisfies PhotoAlbum;
  });

/** Key of a photo in the album's "photos" list (used by the order editor) */
export function orderKey(_albumId: string, srcPath: string): string {
  return srcPath;
}
