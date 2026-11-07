import type { ProjectData } from '../../types';

const imagesModules = import.meta.glob(
  '../../../assets/projects/experiences/confestayres/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const images = Object.values(imagesModules).sort((a, b) => a.localeCompare(b));

const project: ProjectData = {
  id: 'confestayres',
  category: 'experience',
  title: "Les Confes'tayres",
  year: '2026',
  type: 'Rubrique TV quotidienne - Stage TVPI, Bayonne',
  duration: null,
  composition: null,
  producer: 'TVPI',
  videoUrl: '#',
  role: {
    FR: "Production et montage, aux côtés d'une autre stagiaire",
    ENG: 'Production and editing, alongside another intern',
  },
  description: {
    FR: "À l'occasion des Fêtes de Bayonne, j'ai eu la chance de produire, aux côtés d'une autre stagiaire, une rubrique quotidienne imaginée pour les férias : les Confes'tayres. Le concept reposait sur l'installation d'une petite cabine au cœur des fêtes, à côté des Halles. Les festayres étaient invités à y entrer, seuls ou en groupe, afin de partager devant notre caméra un souvenir, une anecdote ou une confidence liée aux Fêtes de Bayonne.",
    ENG: "During the Fêtes de Bayonne, I had the chance to produce, alongside another intern, a daily segment created for the ferias: the Confes'tayres. The concept was a small booth set up in the heart of the festivities, next to Les Halles. Festival-goers were invited to step inside, alone or in groups, and share a memory, an anecdote or a confession about the Fêtes de Bayonne in front of our camera.",
  },
  images,
  links: [
    {
      label: { FR: "Voir l'article - Fêtes de Bayonne", ENG: 'View the article - Fêtes de Bayonne' },
      url: 'https://www.sudouest.fr/lachainetvpi/fetes-de-bayonne/videos/2026/07/15/3vzk3x3',
    },
    {
      label: { FR: "Voir l'article - Feria de Dax", ENG: 'View the article - Feria de Dax' },
      url: 'https://www.sudouest.fr/lachainetvpi/feria-de-dax/videos/2026/08/12/3vfmlsz',
    },
    {
      label: { FR: "Lire l'article de Sud Ouest", ENG: 'Read the Sud Ouest article' },
      url: 'https://www.sudouest.fr/culture/fetes-de-bayonne/fetes-de-bayonne-2026-je-promets-de-ne-boire-qu-un-seul-ricard-par-heure-les-perles-du-confess-tayres-ou-l-on-se-dit-tout-sans-absolution-29961038.php',
    },
  ],
};

export default project;
