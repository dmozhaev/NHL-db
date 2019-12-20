export function TranslateEnumValue (enumValue) {
  switch (enumValue) {
    // Conference
    case 'EASTERN':
      return 'Eastern';
    case 'WESTERN':
      return 'Western';

    // Division
    case 'ATLANTIC':
      return 'Atlantic';
    case 'METROPOLITAN':
      return 'Metropolitan';
    case 'CENTRAL':
      return 'Central';
    case 'PACIFIC':
      return 'Pacific';

    // Country
    case 'AUT':
      return 'Austria';
    case 'CAN':
      return 'Canada';
    case 'CZE':
      return 'Czech Republic';
    case 'DEN':
      return 'Denmark';
    case 'FIN':
      return 'Finland';
    case 'FRA':
      return 'France';
    case 'GBR':
      return 'Great Britain';
    case 'GER':
      return 'Germany';
    case 'LAT':
      return 'Latvia';
    case 'NED':
      return 'Netherlands';
    case 'NOR':
      return 'Norway';
    case 'RUS':
      return 'Russia';
    case 'SUI':
      return 'Switzerland';
    case 'SVK':
      return 'Slovakia';  
    case 'SVN':
      return 'Slovenia';
    case 'SWE':
      return 'Sweden';
    case 'USA':
      return 'United States';

    // IcePositions
    case 'C':
      return 'Center';
    case 'D':
      return 'Defenseman';
    case 'G':
      return 'Goalie';
    case 'LW':
      return 'Left Wing';
    case 'RW':
      return 'Right Wing';

    // Shoots
    case 'L':
      return 'Left';
    case 'R':
      return 'Right';

    default:
      return '';
  }
}
