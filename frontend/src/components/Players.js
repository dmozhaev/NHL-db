import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPlayers, deletePlayer } from '../actions/playerActions';
import { GetTeamNameForId, GetLogoForTeam, GetTeamFilterForPlayerList, GetFlagImgForCountry } from '../utils';
import { TranslateEnumValue } from '../enumTranslation';

import { Table, Button, Popconfirm } from 'antd';

class Players extends Component {
  teams = this.props.teams;
  state = {
    pagination: { defaultPageSize: 20, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] },
    loading: false,
  };

  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    this.setState({ loading: true });
    this.props.fetchPlayers(params);
    
    // get total number of players from DB
    axios.get(`http://127.0.0.1:8080/api/players/count/`, {params: params}).then(res => {
      const pagination = { ...this.state.pagination };
      pagination.total = res.data.player_count;
      this.setState({
        loading: false,
        pagination: pagination,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newPlayer) {
      this.props.players.unshift(nextProps.newPlayer);
    }
  }

  onDelete(e, index){
    e.preventDefault();
    this.props.deletePlayer(index);
  }

  render() {
    const columns = [
      {
        title: 'Team',
        dataIndex: 'team',
        filters: GetTeamFilterForPlayerList(this.teams),
        render: (text, record) => {
          return <div align="center"><img src={GetLogoForTeam(record.team, this.teams)} className="teamLogoPlayerList" alt="team logo" width="36" height="32"/></div>
        },
        sorter: true
      },
      {
        title: 'First Name',
        dataIndex: 'firstname',
        sorter: true
      },
      {
        title: 'Last Name',
        dataIndex: 'lastname',
        sorter: true
      },
      {
        title: 'Country',
        dataIndex: 'country',
        filters: [
          {
            text: 'Austria',
            value: 'AUT',
          },
          {
            text: 'Canada',
            value: 'CAN',
          },
          {
            text: 'Czech Republic',
            value: 'CZE',
          },
          {
            text: 'Denmark',
            value: 'DEN',
          },
          {
            text: 'Finland',
            value: 'FIN',
          },
          {
            text: 'France',
            value: 'FRA',
          },
          {
            text: 'Great Britain',
            value: 'GBR',
          },
          {
            text: 'Germany',
            value: 'GER',
          },
          {
            text: 'Latvia',
            value: 'LAT',
          },
          {
            text: 'Netherlands',
            value: 'NED',
          },
          {
            text: 'Norway',
            value: 'NOR',
          },
          {
            text: 'Russia',
            value: 'RUS',
          },
          {
            text: 'Switzerland',
            value: 'SUI',
          },
          {
            text: 'Slovakia',
            value: 'SVK',
          },
          {
            text: 'Slovenia',
            value: 'SVN',
          },
          {
            text: 'Sweden',
            value: 'SWE',
          },
          {
            text: 'United States',
            value: 'USA',
          },
        ],
        render: (text, record) => {
          return <div align="center">{GetFlagImgForCountry(record.country, 32, 32)}</div>
        },
        sorter: true
      },
      {
        title: 'Position',
        dataIndex: 'ice_position',
        filters: [
          {
            text: 'Center',
            value: 'C',
          },
          {
            text: 'Defenseman',
            value: 'D',
          },
          {
            text: 'Goalie',
            value: 'G',
          },
          {
            text: 'Left Wing',
            value: 'LW',
          },
          {
            text: 'Right Wing',
            value: 'RW',
          },
        ],
        sorter: true
      },
      {
        title: 'Jersey',
        dataIndex: 'jersey',
        sorter: true
      },
      {
        title: 'Shoots',
        dataIndex: 'shoots',
        filters: [
          {
            text: 'Left',
            value: 'L',
          },
          {
            text: 'Right',
            value: 'R',
          },
        ],
        sorter: true
      },
      {
        title: 'Action',
        key: 'action',
        render: (record) => (
          <div>
            <Button type="primary">
              <Link to={`/players/edit/${record.key}`}>Edit</Link>
            </Button>
            <Popconfirm title="Are you sure to delete this player?" onConfirm={(e) => this.onDelete(e, record.key)}>
              <Button type="danger">Delete</Button>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const playerViewDtos = this.props.players.map(player => (
      {
        key: player.id,
        firstname: player.firstname,
        lastname: player.lastname,
        team: GetTeamNameForId(player.team, this.teams),
        country: player.country,
        ice_position: player.ice_position,
        shoots: TranslateEnumValue(player.shoots),
        jersey: player.jersey
      }
    ));

    return (
      <div>
        <h1>Player List</h1>
        <Table 
          columns={columns}
          dataSource={playerViewDtos}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

Players.propTypes = {
  fetchPlayers: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired,
  newPlayer: PropTypes.object
};

const mapStateToProps = state => ({
  players: state.players.items,
  newPlayer: state.players.item,
  teams: state.teams.items
});

export default connect(mapStateToProps, { fetchPlayers, deletePlayer })(Players);
