import { Button, Drawer, Space, Spin, Typography } from 'antd';
import React, { useCallback, useState } from 'react';

import {
  Loader,
  selectors as loadingSelectors,
} from '@common/features/loading';

import { MAP_INTRO_TEXT, PlacesMap, placesSelectors } from '@features/places';

const { Paragraph } = Typography;

/**
 * Страница карты мест.
 * @returns Компонент.
 */
const MapPage: React.FC = () => {
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const places = placesSelectors.usePlaces();
  const loading = loadingSelectors.useLoading(Loader.GetPlacesConfig);

  const showDescription = useCallback(() => {
    setDescriptionVisible(true);
  }, []);

  const hideDescription = useCallback(() => {
    setDescriptionVisible(false);
  }, []);

  if (loading) {
    return (
      <div className="map-page map-page_loading">
        <Spin size="large" tip="Загрузка карты..." />
      </div>
    );
  }

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
