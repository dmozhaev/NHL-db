import { FETCH_PLAYERS, ADD_PLAYER, EDIT_PLAYER, DELETE_PLAYER } from '../actions/types';

const initialState = {
  items: [],
  item: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYERS:
      return {
        ...state,
        items: action.payload
      };
    case ADD_PLAYER:
      return {
        ...state,
        item: action.payload
      };
    case EDIT_PLAYER:
      return {
        ...state,
        item: action.payload
      };
    case DELETE_PLAYER:
      return {
        ...state,
        items: [
          ...state.items.filter(element => element.id !== action.payload)
        ]
      };
    default:
      return state;
  }
}
