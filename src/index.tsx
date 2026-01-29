import configureStore, { history } from '@store';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'antd/dist/antd.css';
import '@styles/main.css';

import { AppRoutes } from '@src/routes';

import { actions as initProcessActions } from '@processes/init';

const store = configureStore();
store.dispatch(initProcessActions.initApp());

export const render = (): void => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <AppRoutes />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app'),
  );
};

window.addEventListener('load', render);
