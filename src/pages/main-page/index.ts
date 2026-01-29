import * as React from 'react';

export const MainPage = React.lazy(
  () => import(/* webpackChunkName: "main-page" */ './MainPage'),
);
