import { Space } from 'antd';
import React from 'react';

import { places, PlacesMap } from '@features/places';

/**
 * Страница карты мест.
 * @returns Компонент.
 */
const MapPage: React.FC = () => (
  <Space className="map-page" direction="vertical" size="large">
    <PlacesMap places={places} />
  </Space>
);

export default MapPage;
