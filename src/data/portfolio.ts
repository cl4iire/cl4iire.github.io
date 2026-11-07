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

export const TRANSLATIONS = {
  FR: {
    films: "Films",
    documentaries: "Documentaires",
    experiences: "Expériences pro",
    experiencesTitle: "Expériences professionnelles",
    photography: "Photographies",
    about: "À propos",
    contact: "Contact",
    cv: "CV",
    futurProjects: "Projet documentaire, Master",
    director: "Réalisatrice",
    editor: "Monteuse",
    cinematographer: "Directrice de la photographie",
    productionFolder: "Dossier de Production",
    playReel: "[ VOIR LA VIDÉO ]",
    visualArchives: "Archives Visuelles",
    photographyWall: "Mur de Photographies",
    theDirector: "La Réalisatrice",
    bio: "Diplômée d’un BUT Métiers du Multimédia et de l’Internet, avec une spécialisation en production cinéma et télévision en Irlande dans le cadre du programme Erasmus. Passionnée par les voyages et les enjeux contemporains, je souhaite approfondir mes compétences techniques en audiovisuel afin d’intégrer un master en création documentaire.",
    bioSub: "Se concentrant sur l'intersection de l'émotion humaine et des paysages cinématographiques. Chaque image est un mot dans un script plus large.",
    teachings: "Compétences",
    programs: "Programmes",
    seeMore: "Voir plus",
    seeLess: "Voir moins",
    theEnd: "Fin.",
    status: "STATUT : DISPONIBLE POUR COLLABORATION",
    location: "LIEU : FRANCE / MONDE",
    locationLine: "Basée en France / Ouverte aux déplacements",
    credits: "Crédits",
    designedWith: "Conçu avec passion pour Claire Buhaceanu Laborde",
    rights: "Tous droits réservés",
    producedBy: "produit par",
    roles: "Rôles",
    action: "Description",
    duration: "Durée",
    composition: "Composition",
    extScene: "EXT. SCÈNE",
    day: "JOUR",
    behindTheScenes: "Coulisses",
    seeArticle: "Voir l'article",
    teachingsList: [
      "Écriture pour le Cinéma et la TV",
      "Studio de production TV",
      "Cinéma Européen - Analyse filmique",
      "Questions juridiques et éthiques dans le cinéma et la télévision",
      "Cinématographie et post-production",
      "Production Documentaire : Théorie et Pratique",
      "Réalisation pour le cinéma et la télévision",
      "Conception sonore pour le cinéma et la télévision",
    ],
    programsLabels: {
      pr: "Première Pro",
      ae: "After Effects",
      avid: "Avid Suite",
      resolve: "Blackmagic Design",
      lr: "Lightroom",
    },
  },
  ENG: {
    films: "Films",
    documentaries: "Documentaries",
    experiences: "Experience",
    experiencesTitle: "Professional Experience",
    photography: "Photography",
    about: "About",
    contact: "Contact",
    cv: "CV",
    futurProjects: "Documentary Project, Master",
    director: "Director",
    editor: "Editor",
    cinematographer: "Cinematographer",
    productionFolder: "Production Folder",
    playReel: "[ WATCH VIDEO ]",
    visualArchives: "Visual Archives",
    photographyWall: "Photography Wall",
    theDirector: "The Director",
    bio: "Graduate of the French B.U.T. MMI (Multimedia & Internet Professions - a 3-year, 180-ECTS university bachelor’s degree), with a specialisation in Cinema and Television Production completed in Ireland at Dundalk Institute of Technology (DkIT) through the Erasmus programme. Passionate about travel and contemporary issues, I want to deepen my technical audiovisual skills in order to join a master’s programme in documentary filmmaking.",
    bioSub: "Focusing on the intersection of human emotion and cinematic landscapes. Every frame is a word in a larger script.",
    teachings: "Teachings",
    programs: "Programs",
    seeMore: "See more",
    seeLess: "See less",
    theEnd: "The End.",
    status: "STATUS: OPEN_FOR_COLLABORATION",
    location: "LOCATION: FRANCE_GLOBAL",
    locationLine: "Based in France / Open to Travel",
    credits: "Credits",
    designedWith: "Designed with passion for Claire Buhaceanu Laborde",
    rights: "All Rights Reserved",
    producedBy: "produced by",
    roles: "Roles",
    action: "Description",
    duration: "Duration",
    composition: "Composition",
    notes: "NOTES",
    classified: "CLASSIFIED CONTENT",
    extScene: "EXT. SCENE",
    day: "DAY",
    behindTheScenes: "Behind the Scenes",
    seeArticle: "See the article",
    teachingsList: [
      "Screenwriting for Film and TV",
      "TV Studio Production",
      "European Cinema",
      "Legal and Ethical Issues in Film and Television",
      "Cinematography and Post-Production",
      "Documentary Production: Theory and Practice",
      "Directing for Film and Television",
      "Sound Design for Film and Television",
    ],
    programsLabels: {
      pr: "Premiere Pro",
      ae: "After Effects",
      avid: "Avid Suite",
      resolve: "Blackmagic Design",
      lr: "Lightroom",
    },
  }
};

export const PROJECTS: ProjectData[] = [
  portraitOfAWoman,
  aroundMe,
  friday,
  indies,
  progrey,
  sources,
  confestayres,
  potAnnuelTvpi,
  sasane,
];

// Auto-generate photography albums grouped by leaf folder under `photographies/`
type PhotoItem = { title: string; desc: string; url: string; srcPath: string };
export type PhotoAlbum = { id: string; title: LocaleText; description?: LocaleText; items: PhotoItem[]; articleImages?: string[] };

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
    items: [] as PhotoItem[]
  };
  album.items.push({
    title: filenameToTitle(path),
    desc: (leafMeta?.title?.FR ?? prettifyFolderName(leafFolder)),
    url,
    srcPath: path
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
