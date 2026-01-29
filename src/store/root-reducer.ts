import { connectRouter } from 'connected-react-router';
import { createHashHistory } from 'history';
import { combineReducers } from 'redux';

import { config } from '@common/config';
import { errorsReducer } from '@common/features/errors';
import { loadingReducer } from '@common/features/loading';

export const history = createHashHistory();

const rootReducer = combineReducers({
  [config.modules.errors]: errorsReducer,
  [config.modules.loading]: loadingReducer,
  [config.modules.router]: connectRouter(history),
});

export default rootReducer;
