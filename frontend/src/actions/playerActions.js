import axios from 'axios';
import { ConvertToFormData, KeyValueObjectArrayToString } from '../utils';
import { FETCH_PLAYERS, ADD_PLAYER, EDIT_PLAYER, DELETE_PLAYER } from './types';
import { message } from 'antd';

export const fetchPlayers = params => dispatch => {
  axios.get(`http://localhost:8080/api/players/`, {params: params} )
    .then(res =>
      dispatch({
        type: FETCH_PLAYERS,
        payload: res.data
      })
    );
};

export const createPlayer = playerData => dispatch => {
  axios.post(`http://localhost:8080/api/players/`, ConvertToFormData(playerData), {headers: {'content-type': 'multipart/form-data'}} )
    .then(res => {
      dispatch({
        type: ADD_PLAYER,
        payload: res.data
      });
      message.success('Player data added successfully');
    })
    .catch(error => {
      message.error(KeyValueObjectArrayToString(error.response.data));
    });
};

export const updatePlayer = playerData => dispatch => {
  axios.patch(`http://localhost:8080/api/players/${playerData.id}/`, ConvertToFormData(playerData), {headers: {'content-type': 'multipart/form-data'}} )
    .then(res => {
      dispatch({
        type: EDIT_PLAYER,
        payload: res.data
      });
      if (playerData.logo) {
        message.success('Player photo updated successfully');
      } else {
        message.success('Player data updated successfully');
      }
    })
    .catch(error => {
      message.error(KeyValueObjectArrayToString(error.response.data));
    });
};

export const deletePlayer = (id) => dispatch => {
  axios.delete(`http://localhost:8080/api/players/${id}`)
    .then(() => {
      dispatch({
        type: DELETE_PLAYER,
        payload: id
      });
      message.success('Player deleted successfully');
    })
    .catch(error => {
      message.error('Something went wrong! Please try again in a while');
    });
}
