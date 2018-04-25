import React from 'react';
import { Route, IndexRoute, browserHistory} from 'react-router';
// containers
import App from './components/App/';
import Hub from './components/Hub/';

// components

export default (
  <Route path="/" component={ App }>
    <IndexRoute component={ Hub } />
  </Route>
);
