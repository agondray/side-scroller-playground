import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import ReduxThunk from 'redux-thunk';

import Routes from './routes.jsx';
import reducer from './reducers';

const logger = createLogger();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// let storeWithMiddleware = createStore(reducer, composeEnhancers(
//   applyMiddleware(promiseMiddleware(), logger, ReduxThunk)
// ));

const storeWithMiddleware = createStore(reducer, applyMiddleware(promiseMiddleware, logger, ReduxThunk));

window.store = storeWithMiddleware;

const ProviderComponent = () => (
  <Provider store={storeWithMiddleware}>
    <Router history={browserHistory}>{Routes}</Router>
  </Provider>
);
render(ProviderComponent(), document.getElementById('app'));
