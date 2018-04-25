import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import styles from './style';

const Hub = () => (
  <div>
    <h4>Insert Token To Play...</h4>
    <div id="stage">
      <div id="player" />
    </div>
  </div>
);

export default Hub;
