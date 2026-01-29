import React from 'react';
import { Button, Card, Image } from 'antd';
import { Link } from 'react-router-dom';

import { Place } from '../model/types';

/** Ссылка на изображение карты. */
const mapImage =
  'https://upload.wikimedia.org/wikipedia/commons/b/bc/BlankMap-World-Compact.svg';

/** Пропсы компонента. */
type PlacesMapProps = {
  places: Place[];
};

/**
 * Карта с кликабельными местами.
 * @param props - Свойства компонента.
 * @returns Компонент.
 */
export const PlacesMap: React.FC<PlacesMapProps> = ({ places }) => (
  <Card className="map-page__card" bordered={false}>
    <div className="map-page__map">
      <Image
        className="map-page__image"
        src={mapImage}
        alt="Карта с местами"
        preview={false}
      />
      {places.map((place) => (
        <Link
          key={place.id}
          to={`/place/${place.id}`}
          className={`map-page__pin ${place.pinClass}`}
          aria-label={`Открыть ${place.title}`}
        >
          <Button size="small" className="map-page__pin-button">
            {place.title}
          </Button>
        </Link>
      ))}
    </div>
  </Card>
);
