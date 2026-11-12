import type { ProjectData } from '../../types';

const stillsModules = import.meta.glob(
  '../../../assets/projects/films/progrey/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const btsModules = import.meta.glob(
  '../../../assets/projects/films/progrey/progreyBehindScenes/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const images = Object.values(stillsModules).sort((a, b) => a.localeCompare(b));
const behindTheScenes = Object.values(btsModules).sort((a, b) => a.localeCompare(b));

const project: ProjectData = {
  id: 'progrey',
  category: 'film',
  title: 'Progrey',
  year: '2025',
  type: 'Court métrage',
  duration: "2'30",
  composition: null,
  producer: 'Claire Buhaceanu Laborde',
  videoUrl: 'https://youtu.be/VAf2H05Xocw?si=cwKHnsdAekn7aYZe',
  role: {
    FR: 'Scénariste, Directrice, Photographe, Co-éditrice [Première Pro]',
    ENG: 'Writing, Director, Photography, Editor',
  },
  description: {
    FR: "Ce court-métrage, réalisé en prises de vues réelles et en animation stop motion, s'inscrit dans le thème imposé, 'Dans l'œil du cyclone' pour le concours Logo Un'Animé. Dans un régime totalitaire où les femmes sont catégorisées et soumises, une jeune femme  découvre un jour, une curieuse boîte dans laquelle se trouvent les affaires personnelles d'une jeune fille d’un autre temps.",
    ENG: 'This short film, made in live-action and stop-motion animation, fits the theme "In the eye of the storm" for the Logo Un\'Anime competition. A woman subjected to a totalitarian regime discovers a curious box.',
  },
  images,
  behindTheScenes,
};

export default project;
