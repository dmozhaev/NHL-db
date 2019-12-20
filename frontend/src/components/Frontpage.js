import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchTeams } from '../actions/teamActions';
import { Link } from 'react-router-dom';

import frontpageImage from '../images/gretzky.jpg';

class Frontpage extends Component {
  componentDidMount() {
    this.props.fetchTeams();
  }

  render() {
    return (
      <div className="frontpageContainer">
        <div className="frontpageImage">
          <img src={frontpageImage} alt="Frontpage"/>
        </div>
        <div className="frontpageText"><span>Team</span></div>
        <div>            
          <button className="frontpageButton">
            <Link to={`/teams/list/`}>Team List</Link>
          </button>
        </div>
        <div>            
          <button className="frontpageButton">
            <Link to={`/teams/add/`}>Add Team</Link>
          </button>
        </div>
        <div>            
          <button className="frontpageButton">
            <Link to={`/teams/editlines/`}>Edit Lines</Link>
          </button>
        </div>
        <div className="frontpageText"><span>Player</span></div>
        <div>            
          <button className="frontpageButton">
            <Link to={`/players/list/`}>Player List</Link>
          </button>
        </div>
        <div>            
          <button className="frontpageButton">
            <Link to={`/players/add/`}>Add Player</Link>
          </button>
        </div>
        <div className="frontpageText"><span>Transfers</span></div>
        <div>            
          <button className="frontpageButton">
            <Link to={`/transfers/`}>Player Transfers</Link>
          </button>
        </div>
      </div>
    );
  }
}

Frontpage.propTypes = {
  fetchTeams: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  teams: state.teams.items
});

export default connect(mapStateToProps, { fetchTeams })(Frontpage);
