import { MainLayout } from '@layouts';
import { Spin } from 'antd';
import React from 'react';
import { Route, Switch } from 'react-router';

import { MapPage, PlacePage } from '@pages';

/**
 * Компонент с роутами приложения
 * @returns - Компонент
 */
export function AppRoutes(): JSX.Element {
  return (
    <MainLayout>
      <React.Suspense fallback={<Spin />}>
        <Switch>
          <Route exact path="/" component={MapPage} />
          <Route exact path="/place/:placeId" component={PlacePage} />
        </Switch>
      </React.Suspense>
    </MainLayout>
  );
}
