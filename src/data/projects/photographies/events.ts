import type { PhotoAlbumMeta } from '../../types';

const meta: PhotoAlbumMeta = {
  id: 'events',
  title: { FR: 'Événements', ENG: 'Events' },
  description: {
    FR: 'Festival Motors & Blues : photographe du festival et autrice d’un article pour le Blues Magazine d’octobre 2025. Fêtes et rituels au Népal, tournages.',
    ENG: 'Motors & Blues festival: festival photographer and author of an article for the October 2025 Blues Magazine. Festivals and rituals in Nepal, film shoots.',
  },
  // Sub-folder -> event filter
  places: {
    motors_and_blues: { FR: 'Motors & Blues', ENG: 'Motors & Blues' },
    nepal: { FR: 'Fêtes au Népal', ENG: 'Festivals in Nepal' },
    Irlande2025: { FR: 'Irlande', ENG: 'Ireland' },
    coulisses: { FR: 'Tournage en Irlande', ENG: 'Filming in Ireland' },
  },
  order: [
    'motors_and_blues/1.webp',
    'motors_and_blues/8.webp',
    'motors_and_blues/3.webp',
    'motors_and_blues/4.webp',
    'motors_and_blues/7.webp',
    'motors_and_blues/6.webp',
    'motors_and_blues/10.webp',
    'motors_and_blues/12.webp',
    'motors_and_blues/5.webp',
    'nepal/DSC_0012.webp',
    'nepal/DSC_0021.webp',
    'nepal/DSC_0033.webp',
    'nepal/DSC_0054.webp',
    'nepal/DSC_0119.webp',
    'nepal/DSC_0131.webp',
    'nepal/DSC_0144.webp',
    'nepal/DSC_0154.webp',
    'nepal/DSC00034.webp',
    'nepal/DSC00055.webp',
    'nepal/DSC00248.webp',
    'nepal/sans-titre.webp',
    'nepal/DSC_0072.webp',
    'nepal/DSC_0091.webp',
    'nepal/DSC_0100.webp',
    'nepal/DSC_0111.webp',
    'nepal/DSC_0117.webp',
    'nepal/DSC_0132.webp',
    'Irlande2025/5.webp',
    'coulisses/IMG_4972.webp',
    'coulisses/IMG_4976.webp',
    'coulisses/IMG_5003.webp',
  ],
};

export default meta;
