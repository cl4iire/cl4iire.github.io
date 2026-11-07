import type { ProjectData } from '../../types';

const imagesModules = import.meta.glob(
  '../../../assets/projects/documentaries/portraitOfAWoman/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const btsModules = import.meta.glob(
  '../../../assets/projects/documentaries/portraitOfAWoman/portraitOfAWomanBehindScenes/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const images = Object.values(imagesModules).sort((a, b) => a.localeCompare(b));
const behindTheScenes = Object.values(btsModules).sort((a, b) => a.localeCompare(b));

const project: ProjectData = {
  id: 'portrait-of-a-woman',
  category: 'documentary',
  title: 'Portrait of a Woman',
  year: '2026',
  type: 'Documentaire',
  duration: "5'10",
  composition: null,
  videoUrl: 'https://www.youtube.com/watch?v=rXBQrhQ6GsE',
  role: {
    FR: 'Directrice de la photographie (DOP), Monteuse',
    ENG: 'Director of Photography (DOP), Editor',
  },
  description: {
    FR: "Documentaire consacré à Claire Farrell, membre fondatrice des Friends of Eon, le premier groupe de défense des droits des personnes transgenres en Irlande. Elle a notamment mis en place, depuis son bureau, la toute première ligne téléphonique destinée aux personnes transgenres dans le pays, afin de leur offrir un espace d'écoute et de soutien.",
    ENG: "Documentary about Claire Farrell, founding member of Friends of Eon, the first transgender rights group in Ireland. From her office, she set up the country's very first helpline for transgender people, offering them a space to be heard and supported.",
  },
  images,
  behindTheScenes,
};

export default project;
