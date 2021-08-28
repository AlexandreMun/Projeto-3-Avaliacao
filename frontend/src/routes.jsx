import React from "react";
import { Switch, Route, Redirect } from "react-router";

import Home from "./components/home/Home";
import PessoaCrud from "./components/home/pessoa/PessoaCrud";

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/pessoas" component={PessoaCrud} />
    <Redirect from="*" to="/" />
  </Switch>
);

