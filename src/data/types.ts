export type LocaleText = {
  FR: string;
  ENG: string;
};

export interface ProjectLink {
  label: LocaleText;
  url: string;
}

export interface ProjectData {
  id: string;
  category: 'film' | 'documentary' | 'experience';
  title: string;
  year: string;
  type: string;
  duration?: string | null;
  composition?: LocaleText | null;
  producer?: string; // optional "produced by" line
  videoUrl: string; // YouTube/Vimeo link, any external video page, or '#'
  role: LocaleText;
  description: LocaleText;
  images: string[]; // main gallery, first image used as cover (may be empty)
  behindTheScenes?: string[]; // optional BTS gallery
  documentationUrl?: string; // optional production folder PDF
  links?: ProjectLink[]; // optional extra links (other videos, press articles…)
}

export interface PhotoAlbumMeta {
  id: string; // must match the leaf folder name (or group folder name) under assets/photographies
  title: LocaleText;
  description?: LocaleText;
  places?: Record<string, LocaleText>; // theme albums: sub-folder -> label of its place / event (photo sub-filter)
  order?: string[]; // filenames in display order; use "subfolder/filename" for theme albums (portraits, paysages, events)
}
