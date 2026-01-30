import { combineReducers } from '@reduxjs/toolkit';

import { config } from '@common/config';
import { errorsReducer } from '@common/features/errors';
import { loadingReducer } from '@common/features/loading';
import { routerReducer } from '@common/features/router';

import { placesReducer } from '@features/places';

const rootReducer = combineReducers({
  [config.modules.errors]: errorsReducer,
  [config.modules.loading]: loadingReducer,
  [config.modules.router]: routerReducer,
  [config.modules.places]: placesReducer,
});

export default rootReducer;
