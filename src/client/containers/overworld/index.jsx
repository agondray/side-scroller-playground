import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Camera from '@containers/camera';
import { updateActiveKeys } from '@dux/keys_pressed';
import {
  updateWalls,
  setMapArray,
  updateMapX,
  updateMapY,
  updateCellSize,
  updateGameMap,
} from '@dux/game_map';
import { assignKey, removeKey } from '@utils/keypress_handlers';
import { allowedKeys } from '@utils/key_codes';
import { sampleMap_1 as sampleMap } from '@utils/sample_map_data/sample_map_1';
import { buildGridArray, wallHelpers } from '@utils/map_parser';
// import buildGridArray from '@utils/map_parser/build_grid_array';

import styles from './overworld.scss';

// #here - pass to <Canvas /> component as prop
// const sampleMapSource = require('@images/sample_maps/sample_map_1.png');
// move to helper
// const pixelToNumber = (pxString) => (parseInt(pxString.replace('px', '')));
// const numberToPixel = (pxNubmer) => (`${pxNubmer}px`);

// #here store in config file..
const velocity = 5;

// #here temporary...
const playerSize = 50;

class OverworldContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animationFramesId: null,
      // #here think of a better name!!! ZOMG!
      // move to duck
      playerContainerData: {
        height: playerSize,
        width: playerSize,
        verticalHalf: playerSize / 2,
        horizontalHalf: playerSize / 2,
        spatialDetectionCellRadius: 1,
      },
      playerOffsetTop: 0,
      playerOffsetLeft: 0,
      spatialFieldMetadata: {
        offsetTop: 0,
        offsetLeft: 0,
        width: 0,
        height: 0,
      }
    };

    this.kickoffAnimationFrames = this.kickoffAnimationFrames.bind(this);
    this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.dispatchUpdateMapPosition = this.dispatchUpdateMapPosition.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
    this.initializeMap = this.initializeMap.bind(this);

    // #here move thsi
    this.getPcRect = this.getPcRect.bind(this);
  }

  componentDidMount() {
    const mapArray = buildGridArray(sampleMap);
    const containerDiv = document.getElementById('overworldMovementContainer');
    containerDiv.focus();

    this.initializeMap(mapArray);
    this.kickoffAnimationFrames();
  }

  componentWillUnmount() {
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

  initializeMap(mapArray) {
    const { dispatch } = this.props;
    const { findAllWalls, buildWallObject } = wallHelpers;
    const wallsArray = findAllWalls(mapArray);
    const wallsObject = buildWallObject(wallsArray);

    // #here -- need to initialize starting position in map

    dispatch(updateCellSize(96)); // #here - temporary constant
    dispatch(setMapArray(mapArray));
    dispatch(updateWalls(wallsObject));
    // temporary... need better logic to determine starting point on map
    dispatch(updateGameMap({ x: 96, y: 96 }));

    // #here remove!!!
    this.getPcRect();
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

  // #here -- move to player character component #pcrect
  getPcRect() {
    const pc = document.getElementById('playerKarakter');
    const pcTop = pc.offsetTop;
    const pcLeft = pc.offsetLeft;
    const spatialBoxSize = 200;

    const spatialFieldMetadata = {
      offsetTop: (pcTop + (playerSize / 2)) - (spatialBoxSize / 2),
      offsetLeft: (pcLeft + (playerSize / 2)) - (spatialBoxSize / 2),
      width: spatialBoxSize,
      height: spatialBoxSize,
    };

    this.setState({
      playerOffsetTop: pcTop,
      playerOffsetLeft: pcLeft,
      spatialFieldMetadata,
    });
  }

  render() {
    const { gameMap } = this.props;
    const mapPosition = {
      backgroundPosition: `${gameMap.x}px ${gameMap.y}px`,
    };

    const { height, width, verticalHalf, horizontalHalf } = this.state.playerContainerData;

    const playerStyles = {
      height: `${height}px`,
      width: `${width}px`,
      left: `calc(50% - ${horizontalHalf}px)`,
      top: `calc(50% - ${verticalHalf}px)`,
    };

    const spatialFieldStyles = {
      top: `${this.state.spatialFieldMetadata.offsetTop}px`,
      left: `${this.state.spatialFieldMetadata.offsetLeft}px`,
      width: `${this.state.spatialFieldMetadata.width}px`,
      height: `${this.state.spatialFieldMetadata.height}px`,
    };

    return (
      <div
        tabIndex="0"
        role="presentation"
        id="overworldMovementContainer"
        onKeyDown={this.handleKeypress}
        onKeyUp={this.handleKeypress}
      >
        <Camera>
          {/* #here insert player character component here */}
          <div id="spatialFieldStyles" style={spatialFieldStyles} className={styles.spatialField} />
          <h1 id="playerKarakter" style={playerStyles} className={styles.playerCharacter}>x</h1>
          <div style={mapPosition} className={styles.mapBackground} />
        </Camera>
      </div>
    );
  }
}

OverworldContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  keysPressed: PropTypes.shape().isRequired,
  gameMap: PropTypes.shape().isRequired,
};

const state = ({ keysPressed, gameMap }) => ({ keysPressed, gameMap });

export default connect(state)(OverworldContainer);
