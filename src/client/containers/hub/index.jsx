import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import Stage from '@containers/stage';
import styles from './style';

const Hub = () => (
  <div>
    <h4>Insert Token To Play...</h4>
    <Stage />
  </div>
);

export default Hub;
