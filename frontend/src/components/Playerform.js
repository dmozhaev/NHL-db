import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createPlayer, updatePlayer } from '../actions/playerActions';
import { Countries, IcePositions, Shoots } from '../enums';
import { PopulateJerseyDropdown } from '../utils';
import { Button, Upload, Icon, message } from 'antd';
import { Link } from 'react-router-dom';

class PlayerForm extends Component {
  teams = this.props.teams;

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      team: '',
      firstname: '',
      lastname: '',
      country: '',
      ice_position: '',
      shoots: '',
      jersey: 1,
      logo: null,
      loading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeLogo = this.onChangeLogo.bind(this);
  }

  componentDidMount() {
    const playerId = this.props.match.params.playerId;
    if (playerId) {
      return this.prefetchData(playerId);
    }
  }

  initState() {
    this.setState({
      id: null,
      team: '',
      firstname: '',
      lastname: '',
      country: '',
      ice_position: '',
      shoots: '',
      jersey: 1,
      logo: null,
      loading: false
    });
  }

  prefetchData(playerId) {
    axios.get(`http://127.0.0.1:8080/api/players/${playerId}`).then(res => {
      this.setState({
        id: res.data.id,
        team: res.data.team,
        firstname: res.data.firstname,
        lastname: res.data.lastname,
        country: res.data.country ? res.data.country : '',
        ice_position: res.data.ice_position ? res.data.ice_position : '',
        shoots: res.data.shoots ? res.data.shoots : '',
        jersey: res.data.jersey,
        logo: res.data.logo
      });
    });
  }

  onChange(e) {
    switch (e.target.type) { 
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

    const player = {
      id: this.state.id,
      team: this.state.team,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      country: this.state.country,
      ice_position: this.state.ice_position,
      shoots: this.state.shoots,
      jersey: this.state.jersey
    };

    if (player.id) {
      this.props.updatePlayer(player);
    } else {
      if (this.state.logo) {
        player.logo = this.state.logo;
      }
      this.props.createPlayer(player);

      this.setState({
        id: null,
        team: '',
        firstname: '',
        lastname: '',
        country: '',
        ice_position: '',
        shoots: '',
        jersey: 1,
        logo: null,
        loading: false
      });
    }
  }

  onChangeLogo(e) {
    e.preventDefault();

    const player = {
      id: this.state.id,
      logo: this.state.logo
    };

    this.props.updatePlayer(player);
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;

    return (
      <div className="playerFormContainer">
        <div className="playerFormLogo gridCellPadding">
          <h1>Photo</h1>
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
          {this.state.id && imageUrl ? <Button onClick={this.onChangeLogo}>Change photo</Button>: <span></span>}
        </div>

        <div className="playerFormData gridCellPadding">
          <h1>{this.state.id ? "Edit Player" : "Add Player"}</h1>
          <div>
            <label className="formLabel">Team: </label>
            <select
              name="team"
              onChange={this.onChange}
              value={this.state.team}>
              <option key="nullTeam" value="">-- No team selected --</option>
              {this.teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          </div>
          <br />
          <div>
            <label className="formLabel">Firstname: </label>
            <input
              type="text"
              name="firstname"
              onChange={this.onChange}
              value={this.state.firstname}
            />
          </div>
          <br />
          <div>
            <label className="formLabel">Lastname: </label>
            <input
              type="text"
              name="lastname"
              onChange={this.onChange}
              value={this.state.lastname}
            />
          </div>
          <br />
          <div>
            <label className="formLabel">Nationality: </label>
            <select
              name="country"
              onChange={this.onChange}
              value={this.state.country}>
              <option key="nullCountry" value="">-- No country selected --</option>
              {Countries.map((country) => <option key={country.key} value={country.key}>{country.display}</option>)}
            </select>
          </div>
          <br />
          <div>
            <label className="formLabel">Position: </label>
            <select
              name="ice_position"
              onChange={this.onChange}
              value={this.state.ice_position}>
              <option key="nullIcePosition" value="">-- No position selected --</option>
              {IcePositions.map((ice_position) => <option key={ice_position.key} value={ice_position.key}>{ice_position.display}</option>)}
            </select>
          </div>
          <br />
          <div>
            <label className="formLabel">Shoots / Glove: </label>
            <select
              name="shoots"
              onChange={this.onChange}
              value={this.state.shoots}>
              <option key="nullShoots" value="">-- No hand selected --</option>
              {Shoots.map((shoots) => <option key={shoots.key} value={shoots.key}>{shoots.display}</option>)}
            </select>
          </div>
          <br />
          <div>
            <label className="formLabel">Jersey: </label>
            <select
              name="jersey"
              onChange={this.onChange}
              value={this.state.jersey}>
              {PopulateJerseyDropdown()}
            </select>
          </div>
          <br />
          <div className="formButtons">
            <Button type="primary" onClick={this.onSubmit}>Submit text data</Button>
            <Button>
              <Link to={"/players/list"}>Back to List</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

PlayerForm.propTypes = {
  createPlayer: PropTypes.func.isRequired,
  updatePlayer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  teams: state.teams.items
});

export default connect(mapStateToProps, { createPlayer, updatePlayer })(PlayerForm);
