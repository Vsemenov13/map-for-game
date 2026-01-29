import configureStore from '@store';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import 'antd/dist/antd.css';
import '@styles/main.css';

import { AppRoutes } from '@src/routes';

import { actions as initProcessActions } from '@processes/init';

const { store, history } = configureStore();
store.dispatch(initProcessActions.initApp());

export const render = (): void => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <AppRoutes />
      </Router>
    </Provider>,
    document.getElementById('app'),
  );
};

window.addEventListener('load', render);
