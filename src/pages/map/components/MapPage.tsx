import { Button, Drawer, Space, Typography } from 'antd';
import React, { useCallback, useState } from 'react';

import { MAP_INTRO_TEXT, places, PlacesMap } from '@features/places';

const { Paragraph } = Typography;

/**
 * Страница карты мест.
 * @returns Компонент.
 */
const MapPage: React.FC = () => {
  const [descriptionVisible, setDescriptionVisible] = useState(false);

  const showDescription = useCallback(() => {
    setDescriptionVisible(true);
  }, []);

  const hideDescription = useCallback(() => {
    setDescriptionVisible(false);
  }, []);

  return (
    <Space className="map-page" direction="vertical" size="large">
      <div className="map-page__top-buttons">
        <Button
          type="primary"
          size="large"
          className="map-page__top-btn"
          onClick={showDescription}
        >
          Описание
        </Button>
      </div>
      <PlacesMap places={places} />
      <Drawer
        title="О посёлке"
        placement="right"
        onClose={hideDescription}
        open={descriptionVisible}
        className="map-page__description-drawer"
      >
        {MAP_INTRO_TEXT.map((paragraph) => (
          <Paragraph key={paragraph} className="map-page__description-text">
            {paragraph}
          </Paragraph>
        ))}
      </Drawer>
    </Space>
  );
};

export default MapPage;
