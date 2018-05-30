import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
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
