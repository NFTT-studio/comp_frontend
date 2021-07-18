import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import {Switch} from "@material-ui/core";

import {BrowserRouter as Router,Link ,Switch,Route} from "react-router-dom";
import Timer from "./componets/timer/Timer";
import StandardList from "./componets/standardlist/StandardList";

ReactDOM.render(
  <React.StrictMode>
      <Router>
      <Switch>
          <Route path="/list"><StandardList /> </Route>
          <Route path="/"><App /> </Route>
      </Switch>
      </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
