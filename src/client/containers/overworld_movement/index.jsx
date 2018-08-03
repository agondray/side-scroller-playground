import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import OverworldCamera from '@containers/overworld_camera';
import { updateActiveKeys } from '@dux/keys_pressed';
import { updateMapX, updateMapY } from '@dux/game_map';
import { assignKey, removeKey } from '@utils/keypress_handlers';
import { allowedKeys } from '@utils/key_codes';
// import { sampleMap_1 } from '@utils/sample_map_data/sample_map_1';

import styles from './overworld_movement.scss';

// #here - pass to <Canvas /> component as prop
const sampleMapSource = require('@images/sample_maps/sample_map_1.png');
// move to helper
// const pixelToNumber = (pxString) => (parseInt(pxString.replace('px', '')));
// const numberToPixel = (pxNubmer) => (`${pxNubmer}px`);
const velocity = 5;

class OverworldMovement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animationFramesId: null,
    };

    this.kickoffAnimationFrames = this.kickoffAnimationFrames.bind(this);
    this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.dispatchUpdateMapPosition = this.dispatchUpdateMapPosition.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
  }

  componentDidMount() {
    const containerDiv = document.getElementById('overworldMovementContainer');
    containerDiv.focus();

    this.kickoffAnimationFrames();
  }

  componentWillUnmount() {
    console.log('OVERWORLD MOVEMENT DEBUG - cancelling animation frame');
    this.cancelAnimationFrame();
  }

  kickoffAnimationFrames() {
    const animationFramesId = requestAnimationFrame(this.updateContainer);
    this.setState({ animationFramesId });
  }

  cancelAnimationFrame() {
    cancelAnimationFrame(this.state.animationFramesId);
    this.setState({ animationFramesId: null });
  }

  updateContainer() {
    this.dispatchUpdateMapPosition();
  }

  handleKeypress(e) {
    const { keyCode, type } = e;
    const { keysPressed: { activeKeys }, dispatch } = this.props;
    const activeKey = type === 'keydown' ? assignKey(activeKeys, keyCode) : removeKey(activeKeys, keyCode);

    dispatch(updateActiveKeys(activeKey));
  }

  dispatchUpdateMapPosition() {
    const { keysPressed: { activeKeys }, gameMap, dispatch } = this.props;
    const { left, right, up, down } = allowedKeys;

    if (activeKeys[left]) {
      dispatch(updateMapX(gameMap.x += velocity));
    }

    if (activeKeys[right]) {
      dispatch(updateMapX(gameMap.x -= velocity));
    }

    if (activeKeys[up]) {
      dispatch(updateMapY(gameMap.y += velocity));
    }

    if (activeKeys[down]) {
      dispatch(updateMapY(gameMap.y -= velocity));
    }

    this.kickoffAnimationFrames();
  }

  render() {
    const { gameMap } = this.props;
    const mapPosition = {
      // left: `${gameMap.x}px`,
      // top: `${gameMap.y}px`,
      backgroundPosition: `${gameMap.x}px ${gameMap.y}px`,
    };

    return (
      <div
        tabIndex="0"
        role="presentation"
        id="overworldMovementContainer"
        onKeyDown={this.handleKeypress}
        onKeyUp={this.handleKeypress}
      >
        <OverworldCamera>
          <div style={mapPosition} className={styles.mapBackground} />
        </OverworldCamera>
      </div>
    );
  }
}

{/* <img
  className={styles.sampleMap}
  style={mapPosition}
  id="sampleMap"
  src={sampleMapSource}
  alt="sample map"
/> */}

OverworldMovement.propTypes = {
  dispatch: PropTypes.func.isRequired,
  keysPressed: PropTypes.shape().isRequired,
  gameMap: PropTypes.shape().isRequired,
};

const state = ({ keysPressed, gameMap }) => ({ keysPressed, gameMap });

export default connect(state)(OverworldMovement);
