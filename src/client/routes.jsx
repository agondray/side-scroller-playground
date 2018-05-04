import React from 'react';
import { Route, IndexRoute, browserHistory} from 'react-router';
// containers
import App from './components/app/';
import Hub from './components/hub/';

// components

export default (
  <Route path="/" component={ App }>
    <IndexRoute component={ Hub } />
  </Route>
);
