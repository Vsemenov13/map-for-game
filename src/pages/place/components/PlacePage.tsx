import { Button, Col, Drawer, Result, Row, Space, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  Loader,
  selectors as loadingSelectors,
} from '@common/features/loading';

import {
  getPlaceById,
  PlaceGallery,
  places,
  placesSelectors,
  usePlacesActions,
} from '@features/places';

/** Параметры маршрута. */
type RouteParams = {
  placeId: string;
};

const { Paragraph, Title } = Typography;

/**
 * Страница выбранного места.
 * При заходе автоматически загружаются изображения папки места с Яндекс.Диска.
 * @returns — компонент страницы места.
 */
const PlacePage: React.FC = () => {
  const { getPlaceImages } = usePlacesActions();
  const { placeId } = useParams<RouteParams>();
  const place = getPlaceById(places, placeId);
  const displayImages = placesSelectors.usePlaceImages(placeId, place);
  const loading = loadingSelectors.useLoading(Loader.GetPlaceImages);
  const [descriptionVisible, setDescriptionVisible] = useState(false);

  useEffect(() => {
    if (placeId) {
      getPlaceImages(placeId);
    }
  }, [getPlaceImages, placeId]);

  const showDescription = useCallback(() => {
    setDescriptionVisible(true);
  }, []);

  const hideDescription = useCallback(() => {
    setDescriptionVisible(false);
  }, []);

  if (!place) {
    return (
      <Result
        status="404"
        title="Место не найдено"
        subTitle="Проверьте адрес или вернитесь на карту."
        extra={
          <Link to="/">
            <Button type="primary">Вернуться на карту</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="place-page">
      <div className="place-page__top-buttons">
        <Link to="/" className="place-page__top-button">
          <Button type="primary" size="large" className="place-page__top-btn">
            ← На карту
          </Button>
        </Link>
        <Button
          type="primary"
          size="large"
          className="place-page__top-btn"
          onClick={showDescription}
        >
          Описание
        </Button>
      </div>
      <div className="place-page__content">
        <Space direction="vertical" size="large">
          <Row
            className="place-page__header"
            align="middle"
            justify="space-between"
          >
            <Col span={24}>
              <Title level={2} className="place-page__title">
                {place.title}
              </Title>
            </Col>
          </Row>
          <PlaceGallery images={displayImages} loading={loading} />
        </Space>
      </div>
      <Drawer
        title={place.title}
        placement="right"
        onClose={hideDescription}
        open={descriptionVisible}
        className="place-page__description-drawer"
      >
        {place.description ? (
          <Paragraph className="place-page__description-text">
            {place.description}
          </Paragraph>
        ) : (
          <Paragraph className="place-page__description-text" type="secondary">
            Описание отсутствует.
          </Paragraph>
        )}
      </Drawer>
    </div>
  );
};

export default PlacePage;
