import React from 'react';
import { Route, IndexRoute, browserHistory} from 'react-router';
import App from './components/app/';
import Hub from './components/hub/';
import Sandbox from './components/sandbox/';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Hub} />
    <Route path="/sandbox" component={Sandbox} />
  </Route>
);
