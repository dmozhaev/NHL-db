import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTeams, deleteTeam } from '../actions/teamActions';
import { CompareByAlph } from '../utils';
import { TranslateEnumValue } from '../enumTranslation';

import { Table, Button, Popconfirm } from 'antd';
import nhlLogo from '../images/leagues/nhl.jpg';
import iihfLogo from '../images/leagues/iihf.jpg';

class Teams extends Component {
  componentDidMount() {
    this.props.fetchTeams();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newTeam) {
      this.props.teams.unshift(nextProps.newTeam);
    }
  }

  onDelete(e, index){
    e.preventDefault();
    this.props.deleteTeam(index);
  }

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => CompareByAlph(a.name, b.name),
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend'
      },
      {
        title: 'Type',
        dataIndex: 'type',
        filters: [
          {
            text: 'National',
            value: 'National',
          },
          {
            text: 'NHL',
            value: 'NHL',
          },
        ],
        render: (text, record) => {
          if (record.type === 'NHL') {
            return <div align="center"><img src={nhlLogo} alt="NHL" width="30" height="33" /></div>
          } else {
            return <div align="center"><img src={iihfLogo} alt="National" width="20" height="36" /></div>
          }
        },
        onFilter: (value, record) => record.type.indexOf(value) === 0,
        sorter: (a, b) => CompareByAlph(a.type, b.type),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Conference',
        dataIndex: 'conference',
        filters: [
          {
            text: 'Eastern Conference',
            value: 'Eastern',
          },
          {
            text: 'Western Conference',
            value: 'Western',
          },
        ],
        onFilter: (value, record) => record.conference.indexOf(value) === 0,
        sorter: (a, b) => CompareByAlph(a.conference, b.conference),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Division',
        dataIndex: 'division',
        filters: [
          {
            text: 'Atlantic Division',
            value: 'Atlantic',
          },
          {
            text: 'Central Division',
            value: 'Central',
          },
          {
            text: 'Metropolitan Division',
            value: 'Metropolitan',
          },
          {
            text: 'Pacific Division',
            value: 'Pacific',
          },
        ],
        onFilter: (value, record) => record.division.indexOf(value) === 0,
        sorter: (a, b) => CompareByAlph(a.division, b.division),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Founded',
        dataIndex: 'founded',
        sorter: (a, b) => a.founded - b.founded,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Arena',
        dataIndex: 'arena',
        sorter: (a, b) => CompareByAlph(a.arena, b.arena),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Wins',
        dataIndex: 'wins',
        sorter: (a, b) => a.wins - b.wins,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Action',
        key: 'action',
        render: (record) => (
          <div>
            <Button type="primary">
              <Link to={`/teams/edit/${record.key}`}>Edit</Link>
            </Button>
            <Button>Edit lines</Button>
            <Popconfirm title="Are you sure to delete this team?" onConfirm={(e) => this.onDelete(e, record.key)}>
              <Button type="danger">Delete</Button>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const teamViewDtos = this.props.teams.map(team => (
      {
        key: team.id,
        name: team.name,
        type: team.national_team ? 'National' : 'NHL',
        conference: TranslateEnumValue(team.conference),
        division: TranslateEnumValue(team.division),
        founded: team.founded,
        arena: team.arena,
        wins: team.wins
      }
    ));

    return (
      <div>
        <h1>Team List</h1>
        <Table 
          pagination= { {defaultPageSize: 20} }
          columns={columns}
          dataSource={teamViewDtos}
        />
      </div>
    );
  }
}

Teams.propTypes = {
  fetchTeams: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
  newTeam: PropTypes.object
};

const mapStateToProps = state => ({
  teams: state.teams.items,
  newTeam: state.teams.item
});

export default connect(mapStateToProps, { fetchTeams, deleteTeam })(Teams);
