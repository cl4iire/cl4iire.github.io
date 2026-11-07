import type { ProjectData } from '../../types';

const imagesModules = import.meta.glob(
  '../../../assets/projects/experiences/potAnnuelTvpi/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const images = Object.values(imagesModules).sort((a, b) => a.localeCompare(b));

const project: ProjectData = {
  id: 'tvpi-pot-annuel',
  category: 'experience',
  title: 'Pot annuel TVPI',
  year: '2026',
  type: 'Reportage TV - Stage TVPI, Bayonne',
  duration: "3'21",
  composition: null,
  producer: 'TVPI',
  videoUrl: '#',
  role: {
    FR: "Journaliste Reporter d'Images (JRI)",
    ENG: 'Video Journalist (JRI)',
  },
  description: {
    FR: 'Reportage sur le pot annuel organisé par TVPI avec ses différents partenaires, diffusé ensuite sur la chaîne.',
    ENG: 'Report on the annual reception hosted by TVPI with its partners, then broadcast on the channel.',
  },
  images,
  links: [
    {
      label: { FR: 'Voir la vidéo sur le site de Sud Ouest', ENG: 'Watch the video on the Sud Ouest website' },
      url: 'https://www.sudouest.fr/lachainetvpi/fetes-de-bayonne/videos/2026/07/17/3vzzuzz',
    },
  ],
};

export default project;
