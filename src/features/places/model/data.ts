import { Place } from './types';

/** Список мест с изображениями. */
export const places: Place[] = [
  {
    id: 'forest',
    title: 'Лесная долина',
    description: 'Место тихих троп и высоких сосен.',
    pinClass: 'map-page__pin--forest',
    images: [
      {
        id: 'forest-1',
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Forest_(126).jpg',
        alt: 'Лесная тропа в зелени',
      },
      {
        id: 'forest-2',
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Forest_scenery.JPG',
        alt: 'Лесной пейзаж',
      },
      {
        id: 'forest-3',
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/River_in_a_Forest.jpg',
        alt: 'Река в лесу',
      },
    ],
  },
  {
    id: 'mountains',
    title: 'Горный хребет',
    description: 'Скалистые вершины и прохладный ветер.',
    pinClass: 'map-page__pin--mountains',
    images: [
      {
        id: 'mountains-1',
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mountain_landscape_4432242.jpg',
        alt: 'Горный пейзаж',
      },
      {
        id: 'mountains-2',
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Landscape-mountains-nature-rocks_(24300703366).jpg',
        alt: 'Горные склоны и скалы',
      },
      {
        id: 'mountains-3',
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mountain_with_forest_in_foreground_-_Switzerland.jpeg',
        alt: 'Горы с лесом на переднем плане',
      },
    ],
  },
  {
    id: 'lake',
    title: 'Озеро тишины',
    description: 'Прозрачная вода и мягкий свет.',
    pinClass: 'map-page__pin--lake',
    images: [
      {
        id: 'lake-1',
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Landscape_of_lake_and_clouds.jpg',
        alt: 'Озеро и облака',
      },
      {
        id: 'lake-2',
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Beautiful_mountain_valley_and_lake_landscape.jpg',
        alt: 'Горная долина и озеро',
      },
      {
        id: 'lake-3',
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Forest_sky_mirror_lake.jpg',
        alt: 'Зеркальное озеро в лесу',
      },
    ],
  },
];
