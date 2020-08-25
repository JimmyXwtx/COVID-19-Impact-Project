//

import { FETCH_GALLERY, CLEAR_GALLERY } from '../actions/types';

export default (state = { items: [] }, action) => {
  switch (action.type) {
    case FETCH_GALLERY:
      return { ...state, items: action.payload };
    case CLEAR_GALLERY:
      return { items: [] };
    default:
      return state;
  }
};
