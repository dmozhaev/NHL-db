import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fetchTransferPlayers1 } from '../actions/transferActions';
import { GetFlagImgForCountry } from '../utils';

import { Button, Popconfirm, message } from 'antd';

import noPhoto from '../images/nophoto.jpg';

class Editlines extends Component {
  teams = this.props.teams;

  constructor(props) {
    super(props);
    this.state = {
      team: this.props.teams[0].id,
      bench: [],
      line1: [],
      line2: [],
      line3: [],
      line4: [],
    };

    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.reorder = this.reorder.bind(this);
    this.move = this.move.bind(this);
    this.getList = this.getList.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  fetchPlayers(teamId) {
    axios.get(`http://localhost:8080/api/teams/${teamId}/players`).then(res => {
      this.setState({
        team: teamId,
        bench: res.data.filter(player => player.line === null),
        line1: res.data.filter(player => player.line === 1),
        line2: res.data.filter(player => player.line === 2),
        line3: res.data.filter(player => player.line === 3),
        line4: res.data.filter(player => player.line === 4)
      });
    });
  }

  componentDidMount() {
    this.fetchPlayers(this.state.team);
  }

  onDropdownChange(e) {
    this.fetchPlayers(e.target.value);
  }

  reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  move(source, destination, droppableSource, droppableDestination) {
    console.log(destination);

    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  }

  getList(id) {
    switch(id) {
      case "line1":
        return this.state.line1;
      case "line2":
        return this.state.line2;
      case "line3":
        return this.state.line3;
      case "line4":
        return this.state.line4;
      default:
        return this.state.bench;
    }
  }

  onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = this.reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      switch(source.droppableId) {
        case "line1":
          this.setState({ line1: items });
          break;
        case "line2":
          this.setState({ line2: items });
          break;
        case "line3":
          this.setState({ line3: items });
          break;
        case "line4":
          this.setState({ line4: items });
          break;
        default: // bench
          this.setState({ bench: items });
      }
    } else {
      const result = this.move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        bench: result.bench ? result.bench : this.state.bench,
        line1: result.line1 ? result.line1 : this.state.line1,
        line2: result.line2 ? result.line2 : this.state.line2,
        line3: result.line3 ? result.line3 : this.state.line3,
        line4: result.line4 ? result.line4 : this.state.line4,
      });
    }
  };

  onSubmit(e) {
    e.preventDefault();

    const dto = {
      line1: this.state.line1.map(x => x.id),
      line2: this.state.line2.map(x => x.id),
      line3: this.state.line3.map(x => x.id),
      line4: this.state.line4.map(x => x.id),
      bench: this.state.bench.map(x => x.id)
    };

    axios.post(`http://localhost:8080/api/editlines/save/`, JSON.stringify(dto), {headers: {'content-type': 'application/json'}} )
      .then(() => {
        message.success('Changes saved successfully');
      })
      .catch(() => {
        message.error('Something went wrong! Please try again in a while');
      });
  }

  render() {
    const team = this.teams.find(team => team.id == this.state.team);

    return (
      <div>
        <h1>Edit lines</h1>
        <div>
          <label className="formLabel">Select team: </label>
          <select
            name="team"
            onChange={this.onDropdownChange}
            value={this.state.team}>
            {this.teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
          <img className="editLinesTeamLogo" src={team.logo} alt="logo"/>
        </div>
        <div className="editLinesButton">
          <Popconfirm title="Are you sure to save the current lines?" onConfirm={(e) => this.onSubmit(e)}>
            <Button type="primary">Confirm changes</Button><br/>
          </Popconfirm>
        </div>
        <div className="editLinesContainer">
          <label>Line 1</label>
          <label>Line 2</label>
          <label>Line 3</label>
          <label>Line 4</label>
          <label>Bench</label>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="line1">
                {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className="editLinesSwimlane">
                    {this.state.line1 ? this.state.line1.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                            className="editLinesItemContainer editLinesItem">
                            <div className="editLinesPhoto">{item.logo ? <img className="editLinesLogo" src={item.logo} /> : <img className="editLinesLogo" src={noPhoto} />}</div>
                            <div className="editLinesName">{item.firstname.charAt(0)}. {item.lastname}</div>
                            <div className="editLinesCountry">{GetFlagImgForCountry(item.country, 30, 30)}</div>
                            <div className="editLinesPosition">{item.ice_position}</div>
                            <div className="editLinesJersey">#{item.jersey}</div>
                        </div>
                        )}
                    </Draggable>
                    )) : <span></span>}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
            <Droppable droppableId="line2">
                {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className="editLinesSwimlane">
                    {this.state.line2 ? this.state.line2.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                            className="editLinesItemContainer editLinesItem">
                            <div className="editLinesPhoto">{item.logo ? <img className="editLinesLogo" src={item.logo} /> : <img className="editLinesLogo" src={noPhoto} />}</div>
                            <div className="editLinesName">{item.firstname.charAt(0)}. {item.lastname}</div>
                            <div className="editLinesCountry">{GetFlagImgForCountry(item.country, 30, 30)}</div>
                            <div className="editLinesPosition">{item.ice_position}</div>
                            <div className="editLinesJersey">#{item.jersey}</div>
                        </div>
                        )}
                    </Draggable>
                    )) : <span></span>}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
            <Droppable droppableId="line3">
                {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className="editLinesSwimlane">
                    {this.state.line3 ? this.state.line3.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                            className="editLinesItemContainer editLinesItem">
                            <div className="editLinesPhoto">{item.logo ? <img className="editLinesLogo" src={item.logo} /> : <img className="editLinesLogo" src={noPhoto} />}</div>
                            <div className="editLinesName">{item.firstname.charAt(0)}. {item.lastname}</div>
                            <div className="editLinesCountry">{GetFlagImgForCountry(item.country, 30, 30)}</div>
                            <div className="editLinesPosition">{item.ice_position}</div>
                            <div className="editLinesJersey">#{item.jersey}</div>
                        </div>
                        )}
                    </Draggable>
                    )) : <span></span>}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
            <Droppable droppableId="line4">
                {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className="editLinesSwimlane">
                    {this.state.line4 ? this.state.line4.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                            className="editLinesItemContainer editLinesItem">
                            <div className="editLinesPhoto">{item.logo ? <img className="editLinesLogo" src={item.logo} /> : <img className="editLinesLogo" src={noPhoto} />}</div>
                            <div className="editLinesName">{item.firstname.charAt(0)}. {item.lastname}</div>
                            <div className="editLinesCountry">{GetFlagImgForCountry(item.country, 30, 30)}</div>
                            <div className="editLinesPosition">{item.ice_position}</div>
                            <div className="editLinesJersey">#{item.jersey}</div>
                        </div>
                        )}
                    </Draggable>
                    )) : <span></span>}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
            <Droppable droppableId="bench">
                {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className="editLinesSwimlane">
                    {this.state.bench ? this.state.bench.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                            className="editLinesItemContainer editLinesItem">
                            <div className="editLinesPhoto">{item.logo ? <img className="editLinesLogo" src={item.logo} /> : <img className="editLinesLogo" src={noPhoto} />}</div>
                            <div className="editLinesName">{item.firstname.charAt(0)}. {item.lastname}</div>
                            <div className="editLinesCountry">{GetFlagImgForCountry(item.country, 30, 30)}</div>
                            <div className="editLinesPosition">{item.ice_position}</div>
                            <div className="editLinesJersey">#{item.jersey}</div>
                        </div>
                        )}
                    </Draggable>
                    )) : <span></span>}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  }
}

Editlines.propTypes = {
  fetchTransferPlayers1: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  teams: state.teams.items,
});

export default connect(mapStateToProps, { fetchTransferPlayers1 })(Editlines);
