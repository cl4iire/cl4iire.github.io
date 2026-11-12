import type { ProjectData } from '../../types';

const imagesModules = import.meta.glob(
  '../../../assets/projects/films/sources/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const images = Object.values(imagesModules).sort((a, b) => a.localeCompare(b));

const project: ProjectData = {
  id: 'sources',
  category: 'film',
  title: 'Sources',
  year: '2023',
  type: 'Film Pocket',
  duration: "2'30",
  composition: null,
  producer: 'Claire Buhaceanu Laborde',
  videoUrl: 'https://youtu.be/NeIuGn0oM4Q?si=1omCvAk2aSP6Y6HA',
  role: {
    FR: 'Scénariste, Directrice, Co-éditrice [Première Pro]',
    ENG: 'Writing, Director, Editor',
  },
  description: {
    FR: "Ce premier court métrage, nous permet de rencontrer Alice, jeune femme qui mène une vie confortable mais monotone dans une grande ville. Un jour, elle décide de relâcher son poisson rouge et se lance alors dans un périple à la fois littéral et métaphorique, de la ville à la campagne.",
    ENG: 'We meet Alice, a young woman living a comfortable but monotonous life in a big city. One day, she decides to release her goldfish and embarks on a journey both literal and metaphorical.',
  },
  images,
};

export default project;
