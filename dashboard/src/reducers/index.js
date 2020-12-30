import { combineReducers } from 'redux';
import authenticationReducer from './authenticationReducer';
import galleryReducer from './galleryReducer';
import statsReducer from './statsReducer';
import trendsReducer from './trendsReducer';

export default combineReducers({
  auth: authenticationReducer,
  stats: statsReducer,
  gallery: galleryReducer,
  trends: trendsReducer,
});
