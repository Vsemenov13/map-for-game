import { configureStore as confStore, EnhancedStore } from '@reduxjs/toolkit';
import { History } from 'history';
import createSagaMiddleware from 'redux-saga';

import { config } from '@common/config';
import { createReduxHistory, routerMiddleware } from '@common/features/router';

import rootReducer from './root-reducer';
import { rootSaga } from './root-saga';

const configureStore = (
  preloadedState: unknown = {},
): { store: EnhancedStore; history: History } => {
  const sagaMiddleware = createSagaMiddleware();

  const store = confStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat([
        sagaMiddleware,
        routerMiddleware,
      ]),
  });

  const history = createReduxHistory(store);

  // Включаем redux-saga middleware
  sagaMiddleware.run(rootSaga);

  if (config.environment !== 'production' && module.hot) {
    module.hot.accept('./root-reducer', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return { store, history };
};

export default configureStore;
export type RootState = ReturnType<typeof rootReducer>;
