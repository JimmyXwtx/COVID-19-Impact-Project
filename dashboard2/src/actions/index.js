import server from '../apis/server';
import {
  BACKUP_DB,
  CLEAR_GALLERY,
  CLEAR_STATS,
  FETCH_GALLERY,
  FETCH_STATS,
  LOCKOUT_MESSAGE,
  RELOAD_DB,
  RESTORE_DB,
  SET_TRENDS,
  SIGN_IN,
  SIGN_OUT,
  SUBMIT_CONTACT,
  SUBMIT_FILE,
} from './types';

export const setTrends = (trends) => async (dispatch) => {
  let payload = {};
  payload.trends = trends;
  dispatch({ type: SET_TRENDS, payload });
};

export const setApp = (app) => async (dispatch) => {
  let payload = {};
  payload.app = app;
  dispatch({ type: SIGN_IN, payload });
};

function cred_query(getState) {
  const { app, email, utoken } = getState().auth;
  return `app=${app || ''}&email=${email || ''}&utoken=${utoken || ''}`;
}

export const fetchGallery = () => async (dispatch, getState) => {
  const credQ = cred_query(getState);

  const response = await server.get(`/gallery?${credQ}`);
  dispatch({ type: FETCH_GALLERY, payload: response.data });

  console.log('gallery response.data', response.data);

  return response.data;
};

// submitFile
export const submitFile = (files, values) => async (dispatch, getState) => {
  const credQ = cred_query(getState);
  console.log('submitFile files', files);
  console.log('submitFile values', values);
  var formData = new FormData();
  for (let file of files) {
    formData.append('photo', file);
  }
  for (const prop in values) {
    formData.append(prop, values[prop]);
  }
  const response = await server.post(`/upload?${credQ}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  dispatch({ type: SUBMIT_FILE, payload: response.data });
  return response.data;
};

// values={ email, contactName, message, created, token } or { uid }
export const submitContact = (values) => async (dispatch) => {
  // console.log('submitContact values', values);
  const response = await server.post(`/contact`, values);
  // console.log('submitContact response=' + response);
  dispatch({ type: SUBMIT_CONTACT, payload: response.data });
  return response.data;
};

export const lockout = (msg) => async (dispatch) => {
  const response = await server.get('/lockout?msg=' + encodeURIComponent(msg));
  dispatch({ type: LOCKOUT_MESSAGE, payload: response.data });
};

// Authentication
// export const signIn = (app, email, password) => {
//   return { type: SIGN_IN, payload: { app, email, password } };
// };
export const signIn = (email, password, loginFailed) => async (dispatch) => {
  const app = '';
  const str = `/users?app=${app}&email=${email}&password=${password}`;
  const response = await server.get(str);
  console.log('signIn loginFailed=' + loginFailed);
  console.log('signIn response.data=' + JSON.stringify(response.data, null, 2));
  let resp = {};
  if (response.data.length > 0) {
    resp = response.data[0];
    resp.isSignedIn = true;
    resp.loginFailed = 0;
  } else {
    resp.isSignedIn = false;
    resp.loginFailed = loginFailed + 1;
  }
  dispatch({ type: SIGN_IN, payload: resp });
};

export const signOut = () => (dispatch) => {
  // console.log('signOut dispatch', dispatch);
  dispatch({ type: SIGN_OUT });
  dispatch({ type: CLEAR_STATS });
  dispatch({ type: CLEAR_GALLERY });
};

export const reloadStore = () => async (dispatch, getState) => {
  const { app, email, utoken } = getState().auth;
  const action = 'store_reload';
  const url = `/action/${action}?app=${app}&email=${email}&utoken=${utoken}`;
  const response = await server.get(url);
  dispatch({ type: RELOAD_DB, payload: response.data });
};

export const backupStore = () => async (dispatch, getState) => {
  const { app, email, utoken } = getState().auth;
  const action = 'store_backup';
  const url = `/action/${action}?app=${app}&email=${email}&utoken=${utoken}`;
  const response = await server.get(url);
  dispatch({ type: BACKUP_DB, payload: response.data });
};

export const restoreStore = () => async (dispatch, getState) => {
  const { app, email, utoken } = getState().auth;
  const action = 'store_restore';
  const url = `/action/${action}?app=${app}&email=${email}&utoken=${utoken}`;
  const response = await server.get(url);
  dispatch({ type: RESTORE_DB, payload: response.data });
};

export const fetchStats = () => async (dispatch) => {
  const response = await server.get(`/stats`);
  dispatch({ type: FETCH_STATS, payload: response.data });
};
