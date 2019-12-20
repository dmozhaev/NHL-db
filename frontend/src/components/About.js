import React, { Component } from 'react';

import aboutImage from '../images/about.jpg';

class About extends Component {
  render() {
    return (
      <div className="aboutContainer">
        <img src={aboutImage} alt="About" width="1260" height="750"/>
        <div className="aboutText">
          <b>This is a test project made for concept studying and learning new technologies in building websites.</b><br/><br/>
          <b>Technologies used:</b><br/><br/>
            - Python / Django<br/>
            &nbsp;&nbsp;&nbsp;- media handling, including django-unused-media library<br/>
            &nbsp;&nbsp;&nbsp;- pagination / sorting<br/>
            - ReactJs / Redux<br/>
            &nbsp;&nbsp;&nbsp;- react-start-app<br/>
            &nbsp;&nbsp;&nbsp;- axios<br/>
            &nbsp;&nbsp;&nbsp;- Ant Design<br/>
            &nbsp;&nbsp;&nbsp;- react-beautiful-dnd<br/>
            - CSS Grid<br/>
            - PostgreSQL<br/>
            &nbsp;&nbsp;&nbsp;- incl. ready-made SQL script generated from MS Excel
        </div>
      </div>
    );
  }
}

export default About;
