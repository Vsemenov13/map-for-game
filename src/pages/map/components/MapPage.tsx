import { Space, Typography } from 'antd';
import React from 'react';

import { MAP_INTRO_TEXT, places, PlacesMap } from '@features/places';

const { Paragraph } = Typography;

/**
 * Страница карты мест.
 * @returns Компонент.
 */
const MapPage: React.FC = () => (
  <Space className="map-page" direction="vertical" size="large">
    <header className="map-page__header">
      {MAP_INTRO_TEXT.map((paragraph) => (
        <Paragraph key={paragraph} className="map-page__subtitle">
          {paragraph}
        </Paragraph>
      ))}
    </header>
    <PlacesMap places={places} />
  </Space>
);

export default MapPage;
