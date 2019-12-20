import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createTeam, updateTeam } from '../actions/teamActions';
import { fetchHistory } from '../actions/historyActions';
import { Conferences, Divisions } from '../enums';
import { PopulateYearDropdown, GetTeamNameForId } from '../utils';
import { Button, Upload, Icon, Tabs, Table, message } from 'antd';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;

class TeamForm extends Component {
  teams = this.props.teams;
  seasons = ["2018-19", "2017-18", "2016-17", "2015-16", "2014-15", "2013-14", "2012-13", "2011-12", "2010-11", "2009-10"];

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: '',
      national_team: false,
      conference: '',
      division: '',
      founded: (new Date()).getFullYear(),
      arena: '-',
      wins: 0,
      logo: null,
      loading: false,
      activeTab: '2018-19'
    };

    this.onChange = this.onChange.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeLogo = this.onChangeLogo.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }

  componentDidMount() {
    const teamId = this.props.match.params.teamId;
    if (teamId) {
      return this.prefetchData(teamId);
    }
  }

  initState() {
    this.setState({
      id: null,
      name: '',
      national_team: false,
      conference: '',
      division: '',
      founded: (new Date()).getFullYear(),
      arena: '-',
      wins: 0,
      logo: null,
      loading: false,
      activeTab: '2018-19'
    });
  }

  prefetchData(teamId) {
    axios.get(`http://127.0.0.1:8080/api/teams/${teamId}`).then(res => {
      this.setState({
        id: res.data.id,
        name: res.data.name,
        national_team: res.data.national_team,
        conference: res.data.conference ? res.data.conference : '',
        division: res.data.division ? res.data.division : '',
        founded: res.data.founded,
        arena: res.data.arena,
        wins: res.data.wins,
        logo: res.data.logo
      });
      this.onTabChange('2018-19');
    });
  }

  onChange(e) {
    switch (e.target.type) {
      case "checkbox":
        this.setState({ [e.target.name]: e.target.value === 'false' });
        break;
      case "select-one":
        this.setState({ [e.target.name]: e.target.value ? e.target.value : '' });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  }

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  urlToImage(url) {
    var reader = new FileReader();
    reader.readAsDataURL(url);
    reader.onload =  function(e){
      return e.target.result;
    };
  }

  beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  }

  onImageChange(e) {
    if (e.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (e.file.status === 'done') {
      this.getBase64(e.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
          logo: e.file.originFileObj
        }),
      );
    }
  }

  dummyRequest({ file, onSuccess}) {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  }

  onSubmit(e) {
    e.preventDefault();

    const team = {
      id: this.state.id,
      name: this.state.name,
      national_team: this.state.national_team,
      conference: this.state.conference,
      division: this.state.division,
      founded: this.state.founded,
      arena: this.state.arena,
      wins: this.state.wins,
    };

    if (team.id) {
      this.props.updateTeam(team);
    } else {
      if (this.state.logo) {
        team.logo = this.state.logo;
      }
      this.props.createTeam(team);

      this.setState({
        id: null,
        name: '',
        national_team: false,
        conference: '',
        division: '',
        founded: (new Date()).getFullYear(),
        arena: '-',
        wins: 0,
        logo: null,
        loading: false,
        activeTab: '2018-19'
      });
    }
  }

  onChangeLogo(e) {
    e.preventDefault();

    const team = {
      id: this.state.id,
      logo: this.state.logo
    };

    this.props.updateTeam(team);
  }

  onTabChange(season) {
    this.setState({
      activeTab: season
    });

    let url = `http://127.0.0.1:8080/api/teams/${this.state.id}/players/`;
    if (season !== '2018-19') {
      url += `?season=${season}`;
    }

    this.props.fetchHistory(url);
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;

    // Historical tabs data
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
        title: 'Position',
        dataIndex: 'ice_position'
      },
      {
        title: 'Team',
        dataIndex: 'team'
      }
    ];
    const playerHistoricalDtos = this.props.history
      .sort((a, b) => (a.lastname > b.lastname) ? 1 : -1)
      .map(player => (
      {
        key: player.id,
        firstname: player.firstname,
        lastname: player.lastname,
        ice_position: player.ice_position,
        team: GetTeamNameForId(player.team, this.props.teams)
      }
    ));

    return (
      <div className="teamFormContainer">
        <div className="teamFormData gridCellPadding">
          <h1>{this.state.id ? "Edit Team" : "Add Team"}</h1>
          <div>
            <label className="formLabel">Name: </label>
            <input
              type="text"
              name="name"
              onChange={this.onChange}
              value={this.state.name}
            />
          </div>
          <br />
          <div>
            <label className="formLabel">National team? </label>
            <input
              type="checkbox"
              name="national_team"
              onChange={this.onChange}
              value={this.state.national_team}
              checked={this.state.national_team}
            />
          </div>
          <br />
          <div>
            <label className="formLabel">Conference: </label>
            <select
              name="conference"
              onChange={this.onChange}
              value={this.state.conference}>
              <option key="nullConference" value="">-- No conference selected --</option>
              {Conferences.map((conference) => <option key={conference.key} value={conference.key}>{conference.display}</option>)}
            </select>
          </div>
          <br />
          <div>
            <label className="formLabel">Division: </label>
            <select
              name="division"
              onChange={this.onChange}
              value={this.state.division}>
              <option key="nullDivision" value="">-- No division selected --</option>
              {Divisions.map((division) => <option key={division.key} value={division.key}>{division.display}</option>)}
            </select>
          </div>
          <br />
          <div>
            <label className="formLabel">Founded: </label>
            <select
              name="founded"
              onChange={this.onChange}
              value={this.state.founded}>
              {PopulateYearDropdown()}
            </select>
          </div>
          <br />
          <div>
            <label className="formLabel">Arena: </label>
            <input
              type="text"
              name="arena"
              onChange={this.onChange}
              value={this.state.arena}
            />
          </div>
          <br />
          <div>
            <label className="formLabel">Wins: </label>
            <input
              type="text"
              name="wins"
              onChange={this.onChange}
              value={this.state.wins}
            />
          </div>
          <br />
          <div className="formButtons">
            <Button type="primary" onClick={this.onSubmit}>Submit text data</Button>
            <Button>
              <Link to={"/teams/list"}>Back to List</Link>
            </Button>
          </div>
        </div>

        <div className="teamFormLogo gridCellPadding">
          <h1>Logo</h1>
          <Upload
            name="logo"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={this.dummyRequest}
            beforeUpload={this.beforeUpload}
            onChange={this.onImageChange}
          >
            {imageUrl ? <img className="teamLogo" src={imageUrl} alt="avatar" /> : (this.state.logo ? <img className="teamLogo" src={this.state.logo} alt="avatar" /> : uploadButton)}
          </Upload>
          {this.state.id && imageUrl ? <Button onClick={this.onChangeLogo}>Change logo</Button>: <span></span>}
        </div>

        {this.state.id ? 
        <div className="teamFormHistoricalData gridCellPadding">
          <h1>Historical roster data</h1>
          <Tabs defaultActiveKey="2018-19" activeKey={this.state.activeTab} onChange={this.onTabChange}>
            {this.seasons.map((season) =>
            <TabPane key={season} tab={season}>Season {season} roster:
              <Table 
                pagination= { {defaultPageSize: 100, hideOnSinglePage: true} }
                columns={columns}
                dataSource={playerHistoricalDtos}
                size='small'
              />
            </TabPane>)}
          </Tabs>
        </div> 
        : <span></span>}
      </div>
    );
  }
}

TeamForm.propTypes = {
  createTeam: PropTypes.func.isRequired,
  updateTeam: PropTypes.func.isRequired,
  fetchHistory: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  teams: state.teams.items,
  history: state.history.items
});

export default connect(mapStateToProps, { createTeam, updateTeam, fetchHistory })(TeamForm);
