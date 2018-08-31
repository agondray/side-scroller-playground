import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './overworld_camera.scss';

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
    return (
      <div className={styles.camera}>
        {this.props.children}
      </div>
    );
  }
}

Camera.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Camera;
