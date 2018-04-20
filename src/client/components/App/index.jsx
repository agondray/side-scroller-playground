import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from '../Header';
import style from './styles.scss';

const App = ({ children }) => (
  <MuiThemeProvider>
    <div className={style.app}>
      <Header />
      {React.Children.map(children, child => React.cloneElement(child))}
    </div>
  </MuiThemeProvider>
);

export default App;
