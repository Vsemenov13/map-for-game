import { Button, Col, Result, Row, Space, Typography } from 'antd';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { getPlaceById, PlaceGallery, places, usePlacesManifest } from '@features/places';

/** Параметры маршрута. */
type RouteParams = {
  placeId: string;
};

const { Title } = Typography;

/**
 * Страница выбранного места.
 * @returns Компонент.
 */
const PlacePage: React.FC = () => {
  const { placeId } = useParams<RouteParams>();
  const manifest = usePlacesManifest();
  const place = getPlaceById(places, placeId);
  const images = (manifest && placeId && manifest[placeId]) ?? place?.images ?? [];

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
    <Space className="place-page" direction="vertical" size="large">
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
      <PlaceGallery images={images} />
    </Space>
  );
};

export default PlacePage;
