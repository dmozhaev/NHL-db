import axios from 'axios';
import { FETCH_TRANSFER_PLAYERS_1, FETCH_TRANSFER_PLAYERS_2 } from './types';

export const fetchTransferPlayers1 = (id) => dispatch => {
  axios.get(`http://localhost:8080/api/teams/${id}/players`)
    .then(res =>
      dispatch({
        type: FETCH_TRANSFER_PLAYERS_1,
        payload: res.data
      })
    );
};

export const fetchTransferPlayers2 = (id) => dispatch => {
  axios.get(`http://localhost:8080/api/teams/${id}/players`)
    .then(res =>
      dispatch({
        type: FETCH_TRANSFER_PLAYERS_2,
        payload: res.data
      })
    );
};
