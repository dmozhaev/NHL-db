import { combineReducers } from 'redux';
import teamReducer from './teamReducer';
import playerReducer from './playerReducer';
import historyReducer from './historyReducer';
import transferReducer1 from './transferReducer1';
import transferReducer2 from './transferReducer2';

export default combineReducers({
  teams: teamReducer,
  players: playerReducer,
  history: historyReducer,
  transferPlayers1: transferReducer1,
  transferPlayers2: transferReducer2
});
