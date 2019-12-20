import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchTransferPlayers1, fetchTransferPlayers2 } from '../actions/transferActions';
import { TranslateEnumValue } from '../enumTranslation';
import { GetFlagImgForCountry } from '../utils';

import { Table, List, Button, Popconfirm, message } from 'antd';

class Transfers extends Component {
  teams = this.props.teams;

  constructor(props) {
    super(props);
    this.state = {
      pagination: { defaultPageSize: 100, hideOnSinglePage: true },
      team1: this.props.teams[0].id,
      team2: this.props.teams[1].id,
      selectedPlayerIdsTeam1: [],
      selectedPlayerIdsTeam2: [],
      selectedPlayersTeam1: [],
      selectedPlayersTeam2: [],
      loading: false,
    };

    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.onSelectChange1 = this.onSelectChange1.bind(this);
    this.onSelectChange2 = this.onSelectChange2.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchTransferPlayers1(this.state.team1);
    this.props.fetchTransferPlayers2(this.state.team2);
  }

  onDropdownChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'team1') {
      this.props.fetchTransferPlayers1(e.target.value);
      this.setState({
        selectedPlayerIdsTeam1: [],
        selectedPlayersTeam1: []
      });
    } else {
      this.props.fetchTransferPlayers2(e.target.value);
      this.setState({
        selectedPlayerIdsTeam2: [],
        selectedPlayersTeam2: []
      });
    }
  }

  onSelectChange1(selectedRowKeys) {
    this.setState({
      selectedPlayerIdsTeam1: selectedRowKeys,
      selectedPlayersTeam1: this.props.transferPlayers1
        .filter(player => selectedRowKeys.includes(player.id))
        .map(player => player.firstname.charAt(0) + '. ' + player.lastname)
    });
  };

  onSelectChange2(selectedRowKeys) {
    this.setState({
      selectedPlayerIdsTeam2: selectedRowKeys,
      selectedPlayersTeam2: this.props.transferPlayers2
        .filter(player => selectedRowKeys.includes(player.id))
        .map(player => player.firstname.charAt(0) + '. ' + player.lastname)
    });
  };

  onSubmit(e) {
    e.preventDefault();

    const transferDto = {
      team1Id: this.state.team1,
      playersTeam1Ids: this.state.selectedPlayerIdsTeam1,
      team2Id: this.state.team2,
      playersTeam2Ids: this.state.selectedPlayerIdsTeam2
    };

    axios.post(`http://localhost:8080/api/transfer/perform/`, JSON.stringify(transferDto), {headers: {'content-type': 'application/json'}} )
      .then(() => {
        message.success('Player transfer completed!');

        this.setState({
          selectedPlayerIdsTeam1: [],
          selectedPlayerIdsTeam2: [],
          selectedPlayersTeam1: [],
          selectedPlayersTeam2: []
        });
    
        this.props.fetchTransferPlayers1(this.state.team1);
        this.props.fetchTransferPlayers2(this.state.team2);
      })
      .catch(() => {
        message.error('Something went wrong! Please try again in a while');
      });
  }

  render() {
    const columns = [
      {
        title: 'First Name',
        dataIndex: 'firstname'
      },
      {
        title: 'Last Name',
        dataIndex: 'lastname'
      },
      {
        title: 'Country',
        dataIndex: 'country',
        render: (text, record) => {
          return <div>{GetFlagImgForCountry(record.country, 24, 24)}</div>
        }
      },
      {
        title: 'Position',
        dataIndex: 'ice_position'
      },
      {
        title: 'Jersey',
        dataIndex: 'jersey'
      },
      {
        title: 'Shoots',
        dataIndex: 'shoots'
      }
    ];

    const transferPlayer1Dtos = this.props.transferPlayers1.map(player => (
      {
        key: player.id,
        firstname: player.firstname,
        lastname: player.lastname,
        country: player.country,
        ice_position: player.ice_position,
        shoots: TranslateEnumValue(player.shoots),
        jersey: player.jersey
      }
    ));
    const transferPlayer2Dtos = this.props.transferPlayers2.map(player => (
      {
        key: player.id,
        firstname: player.firstname,
        lastname: player.lastname,
        country: player.country,
        ice_position: player.ice_position,
        shoots: TranslateEnumValue(player.shoots),
        jersey: player.jersey
      }
    ));
    const team1 = this.teams.find(team => team.id == this.state.team1);
    const team2 = this.teams.find(team => team.id == this.state.team2);

    // Checkbox -related data
    const rowSelection1 = {
      selectedRowKeys: this.state.selectedPlayerIdsTeam1,
      onChange: this.onSelectChange1,
    };
    const rowSelection2 = {
      selectedRowKeys: this.state.selectedPlayerIdsTeam2,
      onChange: this.onSelectChange2,
    };

    return (
      <div>
        <h1>Player Transfers</h1>
        <div className="transfersFormContainer">
          <div className="transfersFormTable1">
            <div>
              <label className="formLabel">Select team 1: </label>
              <select
                name="team1"
                onChange={this.onDropdownChange}
                value={this.state.team1}>
                {this.teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
            </div>
            <br/>
            <Table 
                columns={columns}
                dataSource={transferPlayer1Dtos}
                pagination={this.state.pagination}
                rowSelection={rowSelection1}
                loading={this.state.loading}
                size='small'
            />
          </div>

          <div className="transfersFormButton">
            {this.state.selectedPlayerIdsTeam1.length > 0 || this.state.selectedPlayerIdsTeam2.length > 0 ?
                <Popconfirm title="Are you sure to perform this transfer?" onConfirm={(e) => this.onSubmit(e)}>
                  <Button type="primary">Trade players</Button>
                </Popconfirm>
            : <span></span>}      
          </div>

          <div className="transfersFormTable2">
            <div>
                <label className="formLabel">Select team 2: </label>
                <select
                name="team2"
                onChange={this.onDropdownChange}
                value={this.state.team2}>
                {this.teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
                </select>
            </div>
            <br/>
            <Table
                columns={columns}
                dataSource={transferPlayer2Dtos}
                pagination={this.state.pagination}
                rowSelection={rowSelection2}
                loading={this.state.loading}
                size='small'
            />
          </div>

          <div className="transfersFormList1">
            <List
                size='small'
                header={<div>Team 1 players to trade</div>}
                bordered
                dataSource={this.state.selectedPlayersTeam1}
                renderItem={item => <List.Item>{item}</List.Item>}
            />
            <img className="transfersTeamLogo" src={team1.logo} alt="logo"/>
          </div>

          <div className="transfersFormList2">
            <List
                size='small'
                header={<div>Team 2 players to trade</div>}
                bordered
                dataSource={this.state.selectedPlayersTeam2}
                renderItem={item => <List.Item>{item}</List.Item>}
            />
            <img className="transfersTeamLogo" src={team2.logo} alt="logo"/>
          </div>
        </div>
      </div>
    );
  }
}

Transfers.propTypes = {
  fetchTransferPlayers1: PropTypes.func.isRequired,
  fetchTransferPlayers2: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  teams: state.teams.items,
  transferPlayers1: state.transferPlayers1.items,
  transferPlayers2: state.transferPlayers2.items,
});

export default connect(mapStateToProps, { fetchTransferPlayers1, fetchTransferPlayers2 })(Transfers);
