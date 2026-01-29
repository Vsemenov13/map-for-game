import { Col, Row, Space, Typography } from 'antd';
import React from 'react';

import { places, PlacesMap } from '@features/places';

const { Title } = Typography;

/**
 * Страница карты мест.
 * @returns Компонент.
 */
const MapPage: React.FC = () => (
  <Space className="map-page" direction="vertical" size="large">
    <Row className="map-page__header" justify="center">
      <Col span={24}>
        <Title level={2} className="map-page__title">
          Карта мест
        </Title>
      </Col>
    </Row>
    <PlacesMap places={places} />
  </Space>
);

export default MapPage;
