import React from 'react';

import autFlag from './images/flags/aut.png';
import canFlag from './images/flags/can.png';
import czeFlag from './images/flags/cze.png';
import denFlag from './images/flags/den.png';
import finFlag from './images/flags/fin.png';
import fraFlag from './images/flags/fra.png';
import gbrFlag from './images/flags/gbr.png';
import gerFlag from './images/flags/ger.png';
import latFlag from './images/flags/lat.png';
import nedFlag from './images/flags/ned.png';
import norFlag from './images/flags/nor.png';
import rusFlag from './images/flags/rus.png';
import suiFlag from './images/flags/sui.png';
import svkFlag from './images/flags/svk.png';
import svnFlag from './images/flags/svn.png';
import sweFlag from './images/flags/swe.png';
import usaFlag from './images/flags/usa.png';

export function PopulateYearDropdown(){
  let thisYear = (new Date()).getFullYear();
  let allYears = [];
  for(let x = 1900; x <= thisYear; x++) {
    allYears.push(x)
  }

  return allYears.sort((a, b) => b - a).map((x) => {return(<option key={x} value={x}>{x}</option>)});
}

export function PopulateJerseyDropdown(){
  let jerseys = [];
  for(let x = 1; x <= 99; x++) {
    jerseys.push(x)
  }

  return jerseys.map((x) => {return(<option key={x} value={x}>{x}</option>)});
}

export function CompareByAlph(a, b) {
  if (a > b) {
    return -1;
  } if (a < b) {
    return 1; 
  } 
  return 0;   
}

export function ConvertToFormData(obj){
  var formData = new FormData();
  for (var key in obj) {
    formData.append(key, obj[key]);
  }

  return formData;
}

export function GetTeamNameForId(teamId, teams) {
  if (teamId && teams && teams.length !== 0) {
    return teams.find(x => x.id === teamId).name;
  }
  return '';
}

export function GetLogoForTeam(name, teams) {
  if (name && teams.length !== 0) {
    return teams.find(x => x.name === name).logo;
  }
  return '';
}

export function GetTeamFilterForPlayerList(teams) {
  return teams.map(team => {
    return {
      text: team.name,
      value: team.name,
    }
  });
}

export function KeyValueObjectArrayToString(obj) {
  var arr = [];
  for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
          arr.push(key + '=' + obj[key]);
      }
  };
  return arr.join('\r\n');
}

export function GetFlagImgForCountry(country, height, width) {
  switch (country) {
    case 'AUT':
      return <img src={autFlag} alt="AUT" width={width} height={height} />
    case 'CAN':
      return <img src={canFlag} alt="CAN" width={width} height={height} />
    case 'CZE':
      return <img src={czeFlag} alt="CZE" width={width} height={height} />
    case 'DEN':
      return <img src={denFlag} alt="DEN" width={width} height={height} />
    case 'FIN':
      return <img src={finFlag} alt="FIN" width={width} height={height} />
    case 'FRA':
      return <img src={fraFlag} alt="FRA" width={width} height={height} />
    case 'GBR':
      return <img src={gbrFlag} alt="GBR" width={width} height={height} />
    case 'GER':
      return <img src={gerFlag} alt="GER" width={width} height={height} />
    case 'LAT':
      return <img src={latFlag} alt="LAT" width={width} height={height} />
    case 'NED':
      return <img src={nedFlag} alt="NED" width={width} height={height} />
    case 'NOR':
      return <img src={norFlag} alt="NOR" width={width} height={height} />
    case 'RUS':
      return <img src={rusFlag} alt="RUS" width={width} height={height} />
    case 'SUI':
      return <img src={suiFlag} alt="SUI" width={width} height={height} />
    case 'SVK':
      return <img src={svkFlag} alt="SVK" width={width} height={height} />
    case 'SVN':
      return <img src={svnFlag} alt="SVN" width={width} height={height} />
    case 'SWE':
      return <img src={sweFlag} alt="SWE" width={width} height={height} />
    case 'USA':
      return <img src={usaFlag} alt="USA" width={width} height={height} />
    default:
      return '';
  }
}
