export type PlaceImage = {
  id: string;
  src: string;
  alt: string;
};

export type Place = {
  id: string;
  title: string;
  description: string;
  pinClass: string;
  images: PlaceImage[];
};
