import { LOCKOUT_MESSAGE, SIGN_IN, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
  admin: false,
  app: null,
  email: null,
  password: null,
  utoken: null,
  isSignedIn: false,
  loginFailed: 0,
  admin_lockout_message: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        ...action.payload,
      };
    case SIGN_OUT:
      return INITIAL_STATE;
    case LOCKOUT_MESSAGE:
      return {
        ...state,
        admin_lockout_message: action.payload,
      };
    default:
      return state;
  }
};
