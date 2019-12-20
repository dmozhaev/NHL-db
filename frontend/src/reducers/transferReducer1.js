import { FETCH_TRANSFER_PLAYERS_1 } from '../actions/types';

const initialState = {
  items: [],
  item: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_TRANSFER_PLAYERS_1:
      return {
        ...state,
        items: action.payload
      };
    default:
      return state;
  }
}
