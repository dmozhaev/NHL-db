import React from "react";
import { Route } from "react-router-dom";

import Frontpage from "./components/Frontpage";
import Teams from "./components/Teams";
import Teamform from "./components/Teamform";
import Players from "./components/Players";
import Playerform from "./components/Playerform";
import Transfers from "./components/Transfers";
import Editlines from "./components/Editlines";
import About from "./components/About";

const BaseRouter = () => (
  <div>
    <Route exact path="/" component={Frontpage} />{" "}
    <Route exact path="/teams/list" component={Teams} />{" "}
    <Route exact path="/teams/add" component={Teamform} />{" "}
    <Route exact path="/teams/edit/:teamId" component={Teamform} />{" "}
    <Route exact path="/teams/editlines" component={Editlines} />{" "}
    <Route exact path="/players/list" component={Players} />{" "}
    <Route exact path="/players/add" component={Playerform} />{" "}
    <Route exact path="/players/edit/:playerId" component={Playerform} />{" "}
    <Route exact path="/transfers" component={Transfers} />{" "}
    <Route exact path="/about" component={About} />{" "}
  </div>
);

export default BaseRouter;
