import * as React from 'react';

export const MapPage = React.lazy(
  () => import(/* webpackChunkName: "map-page" */ './components/MapPage'),
);
