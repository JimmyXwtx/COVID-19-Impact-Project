//

import { FETCH_STATS, CLEAR_STATS } from '../actions/types';

export default (state = { items: [] }, action) => {
  switch (action.type) {
    case FETCH_STATS:
      return { ...state, items: action.payload };
    case CLEAR_STATS:
      return { items: [] };
    default:
      return state;
  }
};
