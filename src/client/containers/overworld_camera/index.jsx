import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './overworld_camera.scss';

class OverworldCamera extends Component {
  constructor(props) {
    super(props);

    // render player character in middle
    // expect player character props
  }

  render() {
    return (
      <div className={styles.camera}>
        <h1 className={styles.player}>x</h1>
        {this.props.children}
      </div>
    )
  }
}

export default OverworldCamera;
