from enum import Enum


class Conference(Enum):
    EASTERN = "Eastern Conference"
    WESTERN = "Western Conference"


class Division(Enum):
    ATLANTIC = "Atlantic Division"
    METROPOLITAN = "Metropolitan Division"
    CENTRAL = "Central Division"
    PACIFIC = "Pacific Division"


class Country(Enum):
    AUT = "Austria"
    CAN = "Canada"
    CZE = "Czech Republic"
    DEN = "Denmark"
    FIN = "Finland"
    FRA = "France"
    GBR = "Great Britain"
    GER = "Germany"
    LAT = "Latvia"
    NED = "Netherlands"
    NOR = "Norway"
    RUS = "Russia"
    SUI = "Switzerland"
    SVK = "Slovakia"
    SVN = "Slovenia"
    SWE = "Sweden"
    USA = "United States"


class IcePosition(Enum):
    C = "Center"
    D = "Defenseman"
    G = "Goalie"
    LW = "Left Wing"
    RW = "Right Wing"


class Shoots(Enum):
    L = "Left"
    R = "Right"
