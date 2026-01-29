import { createBrowserHistory } from 'history';
import { createReduxHistoryContext } from 'redux-first-history';

const history = createBrowserHistory();

const {
  routerReducer: reducer,
  routerMiddleware: middleware,
  createReduxHistory: createHistory,
} = createReduxHistoryContext({
  history,
});

export const routerReducer = reducer;
export const routerMiddleware = middleware;
export const createReduxHistory = createHistory;
