import axios from 'axios';
import { ConvertToFormData, KeyValueObjectArrayToString } from '../utils';
import { FETCH_TEAMS, ADD_TEAM, EDIT_TEAM, DELETE_TEAM } from './types';
import { message } from 'antd';

export const fetchTeams = () => dispatch => {
  axios.get(`http://localhost:8080/api/teams/`)
    .then(res =>
      dispatch({
        type: FETCH_TEAMS,
        payload: res.data
      })
    );
};

export const createTeam = teamData => dispatch => {
  axios.post(`http://localhost:8080/api/teams/`, ConvertToFormData(teamData), {headers: {'content-type': 'multipart/form-data'}} )
    .then(res => {
      dispatch({
        type: ADD_TEAM,
        payload: res.data
      });
      message.success('Team data added successfully');
    })
    .catch(error => {
      message.error(KeyValueObjectArrayToString(error.response.data));
    });
};

export const updateTeam = teamData => dispatch => {
  axios.patch(`http://localhost:8080/api/teams/${teamData.id}/`, ConvertToFormData(teamData), {headers: {'content-type': 'multipart/form-data'}} )
    .then(res => {
      dispatch({
        type: EDIT_TEAM,
        payload: res.data
      });
      if (teamData.logo) {
        message.success('Team logo updated successfully');
      } else {
        message.success('Team data updated successfully');
      }
    })
    .catch(error => {
      message.error(KeyValueObjectArrayToString(error.response.data));
    });
};

export const deleteTeam = (id) => dispatch => {
  axios.delete(`http://localhost:8080/api/teams/${id}`)
    .then(() => {
      dispatch({
        type: DELETE_TEAM,
        payload: id
      });
      message.success('Team deleted successfully');
    })
    .catch(error => {
      message.error('Something went wrong! Please try again in a while');
    });
}
