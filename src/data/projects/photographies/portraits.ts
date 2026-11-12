import type { PhotoAlbumMeta } from '../../types';

const meta: PhotoAlbumMeta = {
  id: 'portraits',
  title: { FR: 'Portraits', ENG: 'Portraits' },
  description: {
    FR: 'Visages et regards, Népal.',
    ENG: 'Faces and gazes, Nepal.',
  },
  // Sub-folder -> label (single place: no second filter is shown)
  places: {
    nepal: { FR: 'Népal', ENG: 'Nepal' },
  },
  order: [
    'nepal/DSC_0008-2.webp',
    'nepal/DSC_0059-2.webp',
    'nepal/DSC_0061.webp',
    'nepal/DSC_0063.webp',
    'nepal/DSC_0069-2.webp',
    'nepal/DSC_0088.webp',
    'nepal/DSC_0135-2.webp',
    'nepal/DSC_0135.webp',
    'nepal/DSC_0141-2.webp',
    'nepal/DSC_0150.webp',
    'nepal/DSC_0151.webp',
    'nepal/DSC_0233.webp',
    'nepal/DSC_0242-3.webp',
    'nepal/DSC00145.webp',
    'nepal/DSC00146.webp',
    'nepal/DSC00192.webp',
    'nepal/DSC00198.webp',
    'nepal/DSC00200.webp',
    'nepal/DSC00251.webp',
    'nepal/DSC_0007.webp',
    'nepal/DSC_0019.webp',
    'nepal/DSC_0129-2.webp',
    'nepal/DSC_0242.webp',
    'nepal/DSC_0116.webp',
  ],
};

export default meta;
