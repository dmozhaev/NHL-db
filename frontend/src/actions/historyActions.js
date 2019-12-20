import axios from 'axios';
import { FETCH_HISTORY } from './types';

export const fetchHistory = url => dispatch => {
  axios.get(url)
    .then(res =>
      dispatch({
        type: FETCH_HISTORY,
        payload: res.data
      })
    );
};
