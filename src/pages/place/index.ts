import * as React from 'react';

export const PlacePage = React.lazy(
  () => import(/* webpackChunkName: "place-page" */ './components/PlacePage'),
);
