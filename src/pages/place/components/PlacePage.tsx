import React from 'react';
import { Button, Col, Result, Row, Space, Typography } from 'antd';
import { Link, useParams } from 'react-router-dom';

import { getPlaceById, PlaceGallery, places } from '@features/places';

/** Параметры маршрута. */
type RouteParams = {
  placeId: string;
};

const { Title, Paragraph } = Typography;

/**
 * Страница выбранного места.
 * @returns Компонент.
 */
const PlacePage: React.FC = () => {
  const { placeId } = useParams<RouteParams>();
  const place = getPlaceById(places, placeId);

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
      <Row className="place-page__header" align="middle" justify="space-between">
        <Col span={24}>
          <Title level={2} className="place-page__title">
            {place.title}
          </Title>
        </Col>
        <Col span={24}>
          <Paragraph className="place-page__subtitle">
            {place.description}
          </Paragraph>
        </Col>
        <Col span={24} className="place-page__header-action">
          <Link to="/">
            <Button type="default">На карту</Button>
          </Link>
        </Col>
      </Row>
      <PlaceGallery images={place.images} />
    </Space>
  );
};

export default PlacePage;
