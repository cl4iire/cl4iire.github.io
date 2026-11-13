// ---------- What the components use ----------

export type LocaleText = {
  FR: string;
  ENG: string;
};

export interface ProjectLink {
  label: LocaleText;
  url: string;
}

export interface ProjectData {
  id: string; // file name in content/projets/ (without .json)
  category: 'film' | 'documentary' | 'experience';
  title: string;
  year: string;
  type: LocaleText;
  duration?: string | null;
  composition?: LocaleText | null;
  producer?: string; // optional "Production" box
  videoUrl: string; // YouTube link, any external video page, or '#'
  role: LocaleText;
  description: LocaleText;
  images: string[]; // main gallery, first image used as cover and hover preview (may be empty)
  behindTheScenes?: string[]; // optional BTS gallery
  links?: ProjectLink[]; // optional extra links (other videos, press articles…)
}

// ---------- What is stored in content/*.json (edited with Pages CMS) ----------

/** Bilingual text: if `en` is empty, the site shows `fr`. */
export type Bilingual = { fr: string; en?: string };

export interface ProjectFile {
  titre: string;
  masquer?: boolean; // true = hidden from the site without deleting it
  ordre?: number; // position in the "Work" list (1 = first)
  categorie: 'film' | 'documentaire' | 'experience';
  annee: string;
  type?: Bilingual;
  duree?: string;
  production?: string;
  video?: string;
  roles: Bilingual;
  description: Bilingual;
  composition?: Bilingual;
  images?: string[];
  coulisses?: string[];
  liens?: { texte: Bilingual; url: string }[];
}

export interface AlbumFile {
  titre: Bilingual;
  description?: Bilingual;
  ordre?: number; // position of the tab (1 = first)
  format?: 'portrait' | 'carre'; // shape of the thumbnails
  filtre?: 'pays' | 'evenement'; // accessible name of the second filter
  photos: { image: string; lieu: string }[];
  article?: string[]; // article pages (button "Read the article")
}

export interface PlaceFile {
  nom: string; // French name (also the file name and the label in the CMS drop-down list)
  nom_en?: string; // English name (French used if empty)
}

export interface DocumentsFile {
  cv_fr: string;
  cv_en: string;
  projet_master: string;
}

export interface SettingsFile {
  seo: { titre: string; description: string };
  police: string;
  theme: string;
}
