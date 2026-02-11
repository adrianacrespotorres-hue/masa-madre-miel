import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Hogaza de Masa Madre',
    description: 'Nuestra firma. 24h de fermentación lenta, harina orgánica y corteza crujiente.',
    price: 6.50,
    category: 'Panes',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=800&auto=format&fit=crop',
    nutritionInfo: 'Sin levaduras comerciales, bajo índice glucémico.'
  },
  {
    id: '2',
    name: 'Pan de Centeno y Semillas',
    description: 'Denso y nutritivo, cargado con semillas de calabaza, girasol y lino.',
    price: 7.20,
    category: 'Saludable',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    nutritionInfo: 'Alto en fibra y grasas saludables.'
  },
  {
    id: '3',
    name: 'Croissant de Mantequilla',
    description: 'Capas infinitas de hojaldre artesanal con mantequilla francesa DOP.',
    price: 3.50,
    category: 'Repostería',
    image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Tarta de Frambuesa Consciente',
    description: 'Base de avena, endulzada con miel de abeja local y frambuesas frescas.',
    price: 4.80,
    category: 'Repostería',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=800&auto=format&fit=crop',
    nutritionInfo: 'Sin azúcar refinada.'
  },
  {
    id: '5',
    name: 'Baguette Tradicional',
    description: 'Estilo parisino, miga aireada y aroma a cereal tostado.',
    price: 2.90,
    category: 'Panes',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddf13cf?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '6',
    name: 'Muffin de Arándanos y Kéfir',
    description: 'Esponjosos, hechos con kéfir artesano para una mejor digestión.',
    price: 3.20,
    category: 'Saludable',
    image: 'https://images.unsplash.com/photo-1601000230132-bc57c162601f?q=80&w=800&auto=format&fit=crop',
  }
];