//

import { SET_TRENDS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_TRENDS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
