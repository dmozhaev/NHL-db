import { FETCH_TEAMS, ADD_TEAM, EDIT_TEAM, DELETE_TEAM } from '../actions/types';

const initialState = {
  items: [],
  item: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_TEAMS:
      return {
        ...state,
        items: action.payload
      };
    case ADD_TEAM:
      return {
        ...state,
        item: action.payload
      };
    case EDIT_TEAM:
      return {
        ...state,
        item: action.payload
      };
    case DELETE_TEAM:
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
