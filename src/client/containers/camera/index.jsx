import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './camera.scss';

class Camera extends Component {
  constructor(props) {
    super(props);

    // render player character in middle
    // expect player character props
    this.foo = this.foo.bind(this);
  }

  // #here - update player position in state
  foo() {
    const bar = this.props;
    return null;
  }

  render() {
    const { dimensions } = this.props;
    return (
      <div style={{ ...dimensions }} className={styles.camera}>
        {this.props.children}
      </div>
    );
  }
}

Camera.propTypes = {
  children: PropTypes.node.isRequired,
  dimensions: PropTypes.shape({
    cameraWidth: PropTypes.string,
    cameraHeight: PropTypes.string,
    halfCameraWidth: PropTypes.string,
    halfCameraHeight: PropTypes.string,
  }).isRequired,
};

export default Camera;
