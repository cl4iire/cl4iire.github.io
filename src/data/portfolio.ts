import type { ProjectData, PhotoAlbumMeta, LocaleText } from './types';
import friday from './projects/films/friday';
import indies from './projects/films/indies';
import progrey from './projects/films/progrey';
import sources from './projects/films/sources';
import aroundMe from './projects/documentaries/aroundMe';
import portraitOfAWoman from './projects/documentaries/portraitOfAWoman';
import confestayres from './projects/experiences/confestayres';
import potAnnuelTvpi from './projects/experiences/potAnnuelTvpi';
import sasane from './projects/experiences/sasane';

// Blues Magazine article pages, shown via the "See the article" button of the Events album
const motorArticleModules = import.meta.glob(
  '/src/assets/projects/photographies/events/motors_and_blues/article/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;
const motorArticleImages: string[] = Object.values(motorArticleModules);

function filenameToTitle(filePath: string) {
  const parts = filePath.split("/");
  const file = parts[parts.length - 1];
  const base = file.replace(/\.[^.]+$/, "");
  return base.replace(/[-_]+/g, " ");
}

export type Lang = 'FR' | 'ENG';

// Interface texts of the "Zine rose" design, in both languages
export const TRANSLATIONS = {
  FR: {
    nav: {
      films: "Films",
      documentaries: "Documentaires",
      experiences: "Expériences pro",
      photography: "Photographies",
      contact: "Contact",
    },
    sections: "Sections",
    navigation: "Navigation",
    subtitle: "Audiovisuel & Photographie",
    cvButton: "CV 2026",
    projectButton: "Projet documentaire, master",
    projectShort: "Projet de master",
    writeTo: "Écrire à Claire",
    language: "Langue",
    menu: "Menu",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    close: "Fermer",

    heroTitle: "Claire Buhaceanu Laborde, audiovisuel et photographie",
    heroCaption: "/ Claire Buhaceanu Laborde",
    heroAltFilming: "Claire en tournage, caméra sur stabilisateur",
    heroAltPortrait: "Portrait d’un sadhu, Népal",

    about: "À propos",
    aboutLead: "Diplômée d’un BUT Métiers du Multimédia et de l’Internet, avec une spécialisation en production cinéma et télévision en Irlande dans le cadre d’Erasmus.",
    aboutBody: "Passionnée par les voyages et les enjeux contemporains, je souhaite approfondir mes compétences techniques en audiovisuel afin d’intégrer un master en création documentaire.",
    education: [
      { years: "2026–2027", school: "Licence CIAN, Saint-Brieuc", diploma: "Licence d’un an en production son et image" },
      { years: "2025–2026", school: "DkIT, Dundalk (Irlande)", diploma: "BA in Film and Television Production, Erasmus" },
      { years: "2023–2026", school: "IUT de Tarbes", diploma: "BUT Métiers du Multimédia et de l’Internet, parcours Création numérique" },
    ],
    tools: "Outils",
    toolsText: "Premiere Pro, Lightroom, After Effects, suite Blackmagic Design, Avid Pro Tools, Figma, Canva. DaVinci Resolve en cours d’apprentissage.",
    languages: "Langues",
    languagesList: [
      { name: "Anglais :", level: "un an en Irlande, certification Cambridge C1 (2024)." },
      { name: "Espagnol :", level: "niveau scolaire." },
    ],
    skills: "Compétences",
    skillsList: ["Image", "Post-production", "Production documentaire", "Studio TV", "Écriture", "Réalisation", "Conception sonore"],

    works: "Travaux",
    categories: "Catégories",
    all: "Tout",
    catPlural: { film: "Films", documentary: "Documentaires", experience: "Expériences pro" },
    catSingular: { film: "Film", documentary: "Documentaire", experience: "Expérience pro" },
    roles: "Rôles",
    duration: "Durée",
    composition: "Composition",
    production: "Production",
    play: "Lecture",
    watchVideo: "Voir la vidéo",
    watchOnYoutube: "Voir sur YouTube",
    behindScenes: "Coulisses",
    photos: "photos",
    imageOf: "Image de",
    stillOf: "Image",

    photoTitleStart: "Photo",
    photoTitleEnd: "graphies",
    series: "Séries",
    byCountry: "Par pays",
    byEvent: "Par événement",
    readArticle: "Lire l’article · Blues Magazine",
    articleTitle: "Blues Magazine · octobre 2025",
    articleAlt: "Article Motors & Blues, Blues Magazine",

    contact: "Contact",
    phone: "Téléphone",
    base: "Base",
    baseValue: "France",
    seeCv: "Voir le CV",
    rights: "© 2026 Claire Buhaceanu Laborde",

    viewer: "Visionneuse",
    prev: "Précédente",
    next: "Suivante",
    cvTitle: "CV 2026 · Claire Buhaceanu Laborde",
    projectTitle: "Projet de film documentaire · « La mémoire dans la peau »",
  },
  ENG: {
    nav: {
      films: "Films",
      documentaries: "Documentaries",
      experiences: "Work experience",
      photography: "Photography",
      contact: "Contact",
    },
    sections: "Sections",
    navigation: "Navigation",
    subtitle: "Audiovisual & Photography",
    cvButton: "CV 2026",
    projectButton: "Documentary project, master",
    projectShort: "Master's project",
    writeTo: "Write to Claire",
    language: "Language",
    menu: "Menu",
    openMenu: "Open the menu",
    closeMenu: "Close the menu",
    close: "Close",

    heroTitle: "Claire Buhaceanu Laborde, audiovisual and photography",
    heroCaption: "/ Claire Buhaceanu Laborde",
    heroAltFilming: "Claire filming, camera on a gimbal",
    heroAltPortrait: "Portrait of a sadhu, Nepal",

    about: "About",
    aboutLead: "Graduate of a B.U.T. in Multimedia and Internet Professions, with a specialisation in film and television production completed in Ireland through Erasmus.",
    aboutBody: "Passionate about travel and contemporary issues, I want to deepen my technical audiovisual skills in order to join a master's degree in documentary filmmaking.",
    education: [
      { years: "2026–2027", school: "Licence CIAN, Saint-Brieuc", diploma: "One-year bachelor's degree in sound and image production" },
      { years: "2025–2026", school: "DkIT, Dundalk (Ireland)", diploma: "BA in Film and Television Production, Erasmus" },
      { years: "2023–2026", school: "IUT de Tarbes", diploma: "B.U.T. in Multimedia and Internet Professions, Digital Creation track" },
    ],
    tools: "Tools",
    toolsText: "Premiere Pro, Lightroom, After Effects, Blackmagic Design suite, Avid Pro Tools, Figma, Canva. Currently learning DaVinci Resolve.",
    languages: "Languages",
    languagesList: [
      { name: "English:", level: "one year in Ireland, Cambridge C1 certificate (2024)." },
      { name: "Spanish:", level: "school level." },
    ],
    skills: "Skills",
    skillsList: ["Cinematography", "Post-production", "Documentary production", "TV studio", "Writing", "Directing", "Sound design"],

    works: "Work",
    categories: "Categories",
    all: "All",
    catPlural: { film: "Films", documentary: "Documentaries", experience: "Work experience" },
    catSingular: { film: "Film", documentary: "Documentary", experience: "Work experience" },
    roles: "Roles",
    duration: "Duration",
    composition: "Composition",
    production: "Production",
    play: "Play",
    watchVideo: "Watch the video",
    watchOnYoutube: "Watch on YouTube",
    behindScenes: "Behind the scenes",
    photos: "photos",
    imageOf: "Image from",
    stillOf: "Image",

    photoTitleStart: "Photo",
    photoTitleEnd: "graphy",
    series: "Series",
    byCountry: "By country",
    byEvent: "By event",
    readArticle: "Read the article · Blues Magazine",
    articleTitle: "Blues Magazine · October 2025",
    articleAlt: "Motors & Blues article, Blues Magazine",

    contact: "Contact",
    phone: "Phone",
    base: "Based in",
    baseValue: "France",
    seeCv: "See the CV",
    rights: "© 2026 Claire Buhaceanu Laborde",

    viewer: "Viewer",
    prev: "Previous",
    next: "Next",
    cvTitle: "CV 2026 · Claire Buhaceanu Laborde",
    projectTitle: "Documentary film project · « La mémoire dans la peau »",
  },
};

export type Translations = typeof TRANSLATIONS.FR;

// Order of the "Work" list (as in the validated design)
export const PROJECTS: ProjectData[] = [
  friday,
  portraitOfAWoman,
  confestayres,
  sasane,
  progrey,
  aroundMe,
  potAnnuelTvpi,
  indies,
  sources,
];

// Auto-generate photography albums grouped by leaf folder under `photographies/`
export type PhotoItem = { title: string; desc: string; url: string; srcPath: string; group: string };
export type PhotoAlbum = {
  id: string;
  title: LocaleText;
  description?: LocaleText;
  items: PhotoItem[];
  places?: Record<string, LocaleText>; // sub-folder -> place / event label (second filter)
  articleImages?: string[];
};

// Theme folders: every sub-folder (one per place / event) is merged into a single album
const GROUPED_ALBUMS: Record<string, string> = {
  portraits: 'portraits',
  paysages: 'paysages',
  events: 'events',
};
const GROUPED_ALBUM_IDS = Object.values(GROUPED_ALBUMS);

// Display order of albums on the photography wall (albums not listed come after, alphabetically)
const ALBUM_ORDER = ['portraits', 'paysages', 'events'];

// Extract the order-array key from a photo's original source path
export function orderKey(albumId: string, srcPath: string): string {
  const parts = srcPath.split('/');
  return GROUPED_ALBUM_IDS.includes(albumId)
    ? parts.slice(-2).join('/')   // e.g. "bardenas2025/14.webp"
    : parts[parts.length - 1];   // e.g. "1.webp"
}

function applyOrder(albumId: string, items: PhotoItem[], order: string[] | undefined): PhotoItem[] {
  // Default: group by sub-folder, then natural order ("2.webp" < "10.webp", "DSC_0014" < "DSC_0123")
  const numericSort = (a: PhotoItem, b: PhotoItem) =>
    a.srcPath.localeCompare(b.srcPath, undefined, { numeric: true });
  if (!order?.length) return [...items].sort(numericSort);
  return [...items].sort((a, b) => {
    const ia = order.indexOf(orderKey(albumId, a.srcPath));
    const ib = order.indexOf(orderKey(albumId, b.srcPath));
    if (ia === -1 && ib === -1) return numericSort(a, b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

const allPhotoModules = import.meta.glob(
  '/src/assets/projects/photographies/**/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

// Load optional per-album metadata from data/projects/photographies/*.ts
const albumMetaModules = import.meta.glob('./projects/photographies/*.ts', { eager: true });
const META_BY_ID: Record<string, PhotoAlbumMeta> = {};
Object.values(albumMetaModules).forEach((mod: any) => {
  const m = (mod as any).default as PhotoAlbumMeta | undefined;
  if (m?.id) META_BY_ID[m.id] = m;
});

function prettifyFolderName(id: string) {
  return id
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

const albumMap = new Map<string, PhotoAlbum>();
Object.entries(allPhotoModules).forEach(([path, url]) => {
  if (path.includes('/article/')) return; // article images handled separately
  const parts = path.split('/');
  const leafFolder = parts[parts.length - 2] || 'photos';
  const parentFolder = parts[parts.length - 3] || '';

  // Merge sub-folders of theme folders (portraits, paysages, events) into a single album
  const albumId = GROUPED_ALBUMS[parentFolder] ?? leafFolder;
  const leafMeta = META_BY_ID[leafFolder];
  const albumMeta = META_BY_ID[albumId];

  const album = albumMap.get(albumId) || {
    id: albumId,
    title: albumMeta?.title ?? { FR: prettifyFolderName(albumId), ENG: prettifyFolderName(albumId) },
    description: albumMeta?.description,
    places: albumMeta?.places,
    items: [] as PhotoItem[]
  };
  album.items.push({
    title: filenameToTitle(path),
    desc: (leafMeta?.title?.FR ?? prettifyFolderName(leafFolder)),
    url,
    srcPath: path,
    group: leafFolder
  });
  albumMap.set(albumId, album);
});

export const PHOTOGRAPHY_ALBUMS: PhotoAlbum[] = Array.from(albumMap.values()).map(a => ({
  ...a,
  items: applyOrder(a.id, a.items, META_BY_ID[a.id]?.order),
  ...(a.id === 'events' && motorArticleImages.length ? { articleImages: motorArticleImages } : {})
})).sort((a, b) => {
  const rank = (id: string) => { const i = ALBUM_ORDER.indexOf(id); return i === -1 ? ALBUM_ORDER.length : i; };
  return rank(a.id) - rank(b.id) || a.title.FR.localeCompare(b.title.FR);
});
