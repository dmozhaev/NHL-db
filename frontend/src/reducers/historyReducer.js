import { FETCH_HISTORY } from '../actions/types';

const initialState = {
  items: [],
  item: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_HISTORY:
      return {
        ...state,
        items: action.payload
      };
    default:
      return state;
  }
}
