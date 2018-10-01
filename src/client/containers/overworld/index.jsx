import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Camera from '@containers/camera';
import Canvas from '@components/canvas';
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
import { buildGridArray, wallHelpers, transformToCoordinate } from '@utils/map_parser';
// import { getPlayerCoordinates } from '@utils/player_position';
import { gameMapSpecs } from '@utils/constants';
import { createImage } from '@utils/image_helpers';

import styles from './overworld.scss';

// #here temporary - move to a config or constants file
const velocity = 5;
const playerSize = 50;
const cellSize = sampleMap['0_0'].cellSize // 96px

const spriteMapSource = require('@images/sample_maps/sample_map_1.png');
const playerSprite = require('@images/swordsman.png');

class OverworldContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animationFramesId: null,
      // #here think of a better name!!! ZOMG!
      // move to duck / config constant
      playerContainerData: { // #static!
        height: playerSize,
        width: playerSize,
        verticalHalf: playerSize / 2,
        horizontalHalf: playerSize / 2,
        spatialDetectionCellRadius: 1,
      },
      cameraContainerData: { // #static!
        cameraWidth: 640,
        cameraHeight: 480,
        halfCameraWidth: 320,
        halfCameraHeight: 240,
      },
      playerOffsetTop: 0,
      playerOffsetLeft: 0,
      spatialFieldMetadata: {
        offsetTop: 0,
        offsetLeft: 0,
        width: 0,
        height: 0,
      },
      ctx: null,
      mapImage: null,
      playerSprite: null,
    };

    this.initializeCanvasContext = this.initializeCanvasContext.bind(this);
    this.drawMapInCanvas = this.drawMapInCanvas.bind(this);
    this.kickoffAnimationFrames = this.kickoffAnimationFrames.bind(this);
    this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.dispatchUpdateMapPosition = this.dispatchUpdateMapPosition.bind(this);
    this.updateContainer = this.updateContainer.bind(this);
    this.initializeMap = this.initializeMap.bind(this);
    this.initializePlayerSprite = this.initializePlayerSprite.bind(this);
    this.collisionDetection = this.collisionDetection.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);

    // #here move this
    this.setSpatialBoxData = this.setSpatialBoxData.bind(this);
  }

  componentDidMount() {
    const containerDiv = document.getElementById('overworldMovementContainer');
    containerDiv.focus();

    if (!this.state.mapImage) {
      this.initializeMap();
    }
    if (!this.state.playerSprite) {
      this.initializePlayerSprite();
    }
    this.initializeCanvasContext();
    this.kickoffAnimationFrames();
  }

  componentWillUnmount() {
    this.cancelAnimationFrame();
  }

  initializeCanvasContext() {
    const ctx = this.canvas.getContext('2d');
    this.setState({ ctx })
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
    // this.collisionDetection();
    this.dispatchUpdateMapPosition();
    this.updateCanvas();
  }

  initializeMap() {
    const { dispatch } = this.props;
    const mapArray = buildGridArray(sampleMap);
    const { findAllWalls, buildWallObject } = wallHelpers;
    const wallsArray = findAllWalls(mapArray);
    const wallsObject = buildWallObject(wallsArray);

    this.setState({ mapImage: createImage(spriteMapSource) })


    dispatch(updateCellSize(cellSize)); // #here - temporary constant
    dispatch(setMapArray(mapArray));
    dispatch(updateWalls(wallsObject));

    // #here -- player stariting position should determine map position
    // temporary... need better logic to determine starting point on map
    dispatch(updateGameMap({ x: -200, y: -100 }));

    // #here remove!!! #pcrectcall
    // currently draws spatial detection radius
    this.setSpatialBoxData();
  }

  initializePlayerSprite() {
    this.setState({ playerSpriteSheet: createImage(playerSprite) });
  }

  drawMapInCanvas() {
    // mov emapImage to store!
    const { ctx, mapImage } = this.state;

    ctx.drawImage(mapImage, 0, 0, 1152, 1152);
  }

  // #updatecanvas #here
  updateCanvas() {
    const { ctx, playerSpriteSheet } = this.state;

    // player on canvas
    // move logic to own function!!!
    // this function should only care about updating the canvas states
    const { row: stateRow, col: stateCol } = this.props.gameMap.playerCoordinates;
    const map = document.getElementById('overworldCanvas');
    const pc = document.getElementById('playerKarakter');

    const mapOffsetLeft = map.offsetLeft;
    const mapOffsetTop = map.offsetTop;
    const rectX = mapOffsetLeft <= 0 ?
      Math.abs(mapOffsetLeft) + pc.offsetLeft :
      pc.offsetLeft - map.offsetLeft;
    const rectY = mapOffsetTop <= 0 ?
      Math.abs(mapOffsetTop) + pc.offsetTop :
      pc.offsetTop - map.offsetTop;
    const pRow = transformToCoordinate({ cellSize, position: rectY });
    const pCol = transformToCoordinate({ cellSize, position: rectX });
    const playerCoordinates = {
      x: rectX,
      y: rectY,
      row: pRow,
      col: pCol,
    };

    this.drawMapInCanvas();

    ctx.fillStyle = 'yellow';
    ctx.fillRect(rectX, rectY, playerSize, playerSize);
    ctx.drawImage(playerSpriteSheet, 216, 0, 72, 72, rectX, rectY, playerSize, playerSize);

    // temporary - to prevent unnecessary updates when tracking player position
    if (pRow !== stateRow || pCol !== stateCol) {
      this.props.dispatch(updateGameMap({ playerCoordinates }));
    }

    ctx.save();
    // this.setState({ ctx });
  }

  handleKeypress(e) {
    const { keyCode, type } = e;
    const { keysPressed: { activeKeys }, dispatch } = this.props;
    const activeKey = type === 'keydown' ? assignKey(activeKeys, keyCode) : removeKey(activeKeys, keyCode);

    dispatch(updateActiveKeys(activeKey));
  }

  // #here - #collision
  collisionDetection() {
    // figure out if next cell is impassable or not
    // 8-dir (3 x 3) detection radius
    // if any next cell/s in detection radius is impassable,
    // disallow movement to that/those cell/s
    console.log('\n walls in map: ', this.props.gameMap.walls)
  }

  // onCollide() {
  //   // do not move player to next cell
  // }

  // #here - check collision status before moving
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

  // #here -- move to player character component #pcrect #spatialboxdata
  // calculates size and location of spatial detection field centered around player
  setSpatialBoxData() {
    const pc = document.getElementById('playerKarakter');
    const pcTop = pc.offsetTop;
    const pcLeft = pc.offsetLeft;
    const spatialBoxSize = 200;
    const spatialOffsetTop = (pcTop + (playerSize / 2)) - (spatialBoxSize / 2);
    const spatialOffsetLeft = (pcLeft + (playerSize / 2)) - (spatialBoxSize / 2);

    // #here make a mini-grid for spatial field
    // it'll act as an independent net to detect stuff like walls...
    const spatialFieldMetadata = {
      offsetTop: spatialOffsetTop,
      offsetLeft: spatialOffsetLeft,
      width: spatialBoxSize,
      height: spatialBoxSize,
      // cellSize: spatialBoxSize / 3,
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
      // #here move default styles to stylesheet
      background: '#ccc',
      // backgroundPosition: `${gameMap.x}px ${gameMap.y}px`,
      left: `${gameMap.x}px`,
      top: `${gameMap.y}px`,
    };

    const { height, width, verticalHalf, horizontalHalf } = this.state.playerContainerData;

    const { cameraWidth, cameraHeight, halfCameraWidth, halfCameraHeight } = this.state.cameraContainerData;

    const cameraDimensions = {
      height: `${cameraHeight}px`,
      width: `${cameraWidth}px`,
      left: `calc(50% - ${halfCameraWidth}px)`,
      top: `calc(50% - ${halfCameraHeight}px)`,
    };

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
      <div>
        <button onClick={this.cancelAnimationFrame}>Stop Animation Frames</button>
        <div
          tabIndex="0"
          role="presentation"
          id="overworldMovementContainer"
          onKeyDown={this.handleKeypress}
          onKeyUp={this.handleKeypress}
        >
          <Camera dimensions={cameraDimensions}>
            {/* #here insert player character component here */}
            <div id="spatialFieldStyles" style={spatialFieldStyles} className={styles.spatialField} />
            <h1 id="playerKarakter" style={playerStyles} className={styles.playerCharacter}></h1>
            {/* <div style={mapPosition} className={styles.mapBackground} /> */}
            <Canvas
              canvasStyle={mapPosition}
              canvasRef={(c) => { this.canvas = c; }}
              height={gameMapSpecs.canvasWidth}
              width={gameMapSpecs.canvasHeight}
            />
            {/* onKeyDown={}
            onKeyUp={} */}
          </Camera>
        </div>
      </div>
    );
  }
}

OverworldContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  keysPressed: PropTypes.shape().isRequired,
  gameMap: PropTypes.shape().isRequired,
  canvas: PropTypes.shape().isRequired,
};

const state = ({ keysPressed, gameMap, canvas }) => ({ keysPressed, gameMap, canvas });

export default connect(state)(OverworldContainer);
