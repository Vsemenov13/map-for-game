import { MainLayout } from '@layouts';
import { Spin } from 'antd';
import React from 'react';
import { Route, Switch } from 'react-router';

import { MainPage } from '@pages';

/**
 * Компонент с роутами приложения
 * @returns - Компонент
 */
export function AppRoutes(): JSX.Element {
  return (
    <MainLayout>
      <React.Suspense fallback={<Spin />}>
        <Switch>
          <Route exact path="/" component={MainPage} />
        </Switch>
      </React.Suspense>
    </MainLayout>
  );
}
