import type { ProjectData } from '../../types';

// Auto-import all still images in the project folder (excluding BTS)
const stillsModules = import.meta.glob(
  '../../../assets/projects/films/friday/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

// Auto-import all BTS images (if any)
const btsModules = import.meta.glob(
  '../../../assets/projects/films/friday/fridayBehindScenes/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const images = Object.values(stillsModules).sort((a, b) => a.localeCompare(b));
const behindTheScenes = Object.values(btsModules).sort((a, b) => a.localeCompare(b));

const project: ProjectData = {
  id: 'done-by-friday',
  category: 'film',
  title: 'Done by Friday',
  year: '2025',
  type: 'Court métrage',
  duration: "2'30",
  composition: null,
  producer: 'Janine Hemker',
  videoUrl: 'https://youtu.be/zKjolkqnnho?si=ysaE6niS-IOdtrPw',
  role: {
    FR: '1ère assistante caméra [Blackmagic Cinema], Photographe, Editrice [Première Pro]',
    ENG: '1st Assistant Camera - Black Magic Pocket Cinema, Photographer, Editor - [Première Pro]',
  },
  description: {
    FR: "Une étudiante doit faire face aux fantômes de son passé et à sa culpabilité lors d'une session d'étude.",
    ENG: 'A student must face the ghosts of her past and her guilt during a study session.',
  },
  images: images,
  behindTheScenes: behindTheScenes,
};

export default project;
