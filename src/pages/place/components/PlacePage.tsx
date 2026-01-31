import { Button, Col, Result, Row, Space, Typography } from 'antd';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Loader, selectors as loadingSelectors } from '@common/features/loading';

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

const { Title } = Typography;

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

  useEffect(() => {
    if (placeId) {
      getPlaceImages(placeId);
    }
  }, [getPlaceImages, placeId]);

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
            <Col span={24} className="place-page__header-action">
              <Link to="/">
                <Button type="default">На карту</Button>
              </Link>
            </Col>
          </Row>
          <PlaceGallery images={displayImages} loading={loading} />
        </Space>
      </div>
    </div>
  );
};

export default PlacePage;
