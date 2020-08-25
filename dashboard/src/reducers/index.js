import { combineReducers } from 'redux';

import authenticationReducer from './authenticationReducer';
import statsReducer from './statsReducer';
import galleryReducer from './galleryReducer';

export default combineReducers({
  auth: authenticationReducer,
  stats: statsReducer,
  gallery: galleryReducer,
});
