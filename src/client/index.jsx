import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
// import promiseMiddleware from 'redux-promise-middleware';
// import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import routes from './routes.jsx';
import reducer from './store';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const storeWithMiddleware = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
const history = createHistory();

window.store = storeWithMiddleware;

const ProviderComponent = () => (
  <Provider store={storeWithMiddleware}>
    <Router history={history}>{routes}</Router>
  </Provider>
);
render(ProviderComponent(), document.getElementById('app'));
