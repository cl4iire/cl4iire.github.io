import type { ProjectData } from '../../types';

const imagesModules = import.meta.glob(
  '../../../assets/projects/experiences/sasane/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const images = Object.values(imagesModules).sort((a, b) => a.localeCompare(b));

const project: ProjectData = {
  id: 'sasane',
  category: 'experience',
  title: 'SASANE',
  year: '2026',
  type: 'Stage audiovisuel ONG - Népal',
  duration: null,
  composition: null,
  producer: 'SASANE Samrakshak Samuha Nepal',
  videoUrl: '#',
  role: {
    FR: "Création et développement du compte TikTok de l'association : captation, montage, publication",
    ENG: "Creating and growing the NGO's TikTok account: filming, editing, publishing",
  },
  description: {
    FR: "SASANE Samrakshak Samuha Nepal est une organisation qui œuvre contre la traite des êtres humains, les mariages forcés et ceux d'enfants, et les violences faites aux femmes. Ses objectifs sont de protéger les populations vulnérables et d'accompagner les survivantes dans leur reconstruction. La mission principale de mon stage consistait à créer et à développer le compte TikTok de l'association. Toutes les vidéos ont été l'occasion de mettre en valeur les expériences touristiques proposées par l'ONG, avec les paysages népalais en toile de fond, les itinéraires de trekking et l'aspect immersif des voyages.",
    ENG: "SASANE Samrakshak Samuha Nepal is an organisation fighting human trafficking, forced and child marriage, and violence against women. It aims to protect vulnerable people and support survivors as they rebuild their lives. The main mission of my internship was to create and grow the organisation's TikTok account. Every video showcased the travel experiences offered by the NGO, with Nepalese landscapes as a backdrop, trekking routes and the immersive side of the journeys.",
  },
  images,
  links: [
    {
      label: { FR: 'Visiter le compte TikTok @sasane_sisterhood', ENG: 'Visit the TikTok account @sasane_sisterhood' },
      url: 'https://www.tiktok.com/@sasane_sisterhood',
    },
  ],
};

export default project;
