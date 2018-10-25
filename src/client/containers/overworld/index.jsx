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
import { drawPaintedCells, highlightCell } from '@utils/map_builder_helpers';

import styles from './overworld.scss';

// #here temporary - move to a config or constants file
const velocity = 5;
const playerSize = 50;
const cellSize = sampleMap['0_0'].cellSize // 96px

const spriteMapSource = require('@images/sample_maps/sample_map_1.png');
const playerSprite = require('@images/swordsman.png');


const { findAllWalls, buildWallObject } = wallHelpers;
const mapArray = buildGridArray(sampleMap);
const wallsArray = findAllWalls(mapArray);
const wallsObject = buildWallObject(wallsArray);

const highlightWalls = (ctx) => {
  const wallCoords = Object.keys(wallsObject);

  wallCoords.forEach((coordString) => {
    const hx = wallsObject[coordString].x;
    const hy = wallsObject[coordString].y;


    highlightCell({
      context: ctx,
      tileSize: cellSize,
      hx,
      hy,
      cellHighlightColor: 'rgba(255, 0, 0, 0.5)',
    });
  });
};

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
      wallsHighlighted: false,
      spatialFieldCoordStrings: [],
      playerTLCoords: {
        x: null,
        y: null,
        rectX: null,
        rectY: null,
      },
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
    this.updateCanvas = this.updateCanvas.bind(this);
    this.toggleWallHighlights = this.toggleWallHighlights.bind(this);

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

    this.props.dispatch(updateActiveKeys({}));
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

  // #updatecontainer
  updateContainer() {
    // this.collisionDetection();

    const { keysPressed: { activeKeys } } = this.props;

    if (activeKeys) {
      this.dispatchUpdateMapPosition();
    }

    this.updateCanvas();
  }

  initializeMap() {
    const { dispatch } = this.props;
    // const mapArray = buildGridArray(sampleMap);
    // const { findAllWalls, buildWallObject } = wallHelpers;
    // const wallsArray = findAllWalls(mapArray);
    // const wallsObject = buildWallObject(wallsArray);

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
    const { ctx, mapImage, wallsHighlighted } = this.state;

    ctx.drawImage(mapImage, 0, 0, 1152, 1152);

    // #ctxhighlight
    if (wallsHighlighted) {
      highlightWalls(ctx);
    }
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

    const halfPlayerSize = playerSize / 2;
    const mapOffsetLeft = map.offsetLeft;
    const mapOffsetTop = map.offsetTop;
    const rectX = mapOffsetLeft <= 0 ?
      Math.abs(mapOffsetLeft) + pc.offsetLeft :
      pc.offsetLeft - map.offsetLeft;
    const rectY = mapOffsetTop <= 0 ?
      Math.abs(mapOffsetTop) + pc.offsetTop :
      pc.offsetTop - map.offsetTop;
    const centerX = rectX + halfPlayerSize; // column
    const centerY = rectY + halfPlayerSize; // row
    const pRow = transformToCoordinate({ cellSize, position: centerY }); // y-coord
    const pCol = transformToCoordinate({ cellSize, position: centerX }); // x-coord
    const playerCoordinates = {
      tlX: rectX,
      tlY: rectY,
      centerX,
      centerY,
      row: pRow, // calculated from center of character square
      col: pCol, // calculated from center of character square
    };

    this.drawMapInCanvas();

    // #playersprite
    ctx.fillStyle = 'yellow';
    ctx.fillRect(rectX, rectY, playerSize, playerSize);
    ctx.drawImage(playerSpriteSheet, 216, 0, 72, 72, rectX, rectY, playerSize, playerSize);

    // #spatial detection logic
    // initial idea - 8 directions represented as blocks forming a 3x3 square around player
    const spatialFieldCoordStrings = [
      `${pCol}_${pRow - 1}`, // top
      `${pCol + 1}_${pRow - 1}`, // top-right
      `${pCol + 1}_${pRow}`, // right
      `${pCol + 1}_${pRow + 1}`, // bottom-right
      `${pCol}_${pRow + 1}`, // bottom
      `${pCol - 1}_${pRow + 1}`, // bottom-left
      `${pCol - 1}_${pRow}`, // left
      `${pCol - 1}_${pRow - 1}`, // top-left
    ];

    this.setState({
      spatialFieldCoordStrings,
      playerTLCoords: {
        x: pCol,
        y: pRow,
        rectX,
        rectY,
        centerX,
        centerY,
      },
    });

    // WIP - experiment with simplified ray casting to find walls
    // need 8 rays for each direction
    // each ray will be a vector of the same "length" or "distance" from the character's center
    // goal: calculate

    // const calcHypotenuseEndpoint = (sx, sy) => {
      // from pythagorean theorem, use vector equation:
      //  V = sqrt((x2 - x1)^2 + (y2 - y1)^2)
      //  (y2 - y1)^2 = (x2 - x1)^2 - v^2
      //    y2 = sqrt((x2 - x1)^2 - v^2) + y1
      //  x2 = sqrt((y2 - y1)^2 - v^2) + x1
      //  x2 = sqrt((sqrt((x2 - x1)^2 - v^2) + y1)^2 - v^2) + x1 <-- solve this, then use x2's value to get y2...
      //
      // have starting point and hypotenuse length
      // need coords of hyp endpoint

      // get length of a when sx has not changed
      // get length of b when xy has not changed

      // math...
    // }

    // const generateSpatialDetectionRays = (centerX, centerY, distanceFromObjectCenter) => {
      // use pseudo-raycasting to detect walls at n distance from object's center coordinates
      //   e.g. top raycast detection:
      //     * project a line from the object's center to n `distance`
      //     * at n, convert coordinate to col/row string
      // return array containing raycast endponts for all 8 directions
      //  each element should be a coordinate string `col_row` (representing game map x_y)

      // const x = transformToCoordinate({ cellSize, centerX }); // x-coord
      // const y = transformToCoordinate({ cellSize, centerY }); // y-coord
    //   const top = `${col}_${row}`;
    //   return [top, topRight, right, bottomRight, bottom, bottomLeft, Left, topLeft];
    // }
    // use spatialDetectionRayCoords to check if each coord exists as a key in `walls`
    // const spatialDetectionRayCoords = generateSpatialDetectionRays(1000);


    const detectWalls = () => (
      spatialFieldCoordStrings.filter(coord => (
        this.props.gameMap.walls.hasOwnProperty(coord)
      ))
    );

    const detectedWalls = detectWalls();
    console.log('walls detected: ', detectedWalls);

    // #collision
    // const collisionDetection = () => {
    //
    // }

    ctx.save();

    // temporary - to prevent unnecessary state updates when tracking player position
    if (pRow !== stateRow || pCol !== stateCol) {
      this.props.dispatch(updateGameMap({
        playerCoordinates,
        detectedWalls: detectedWalls,
      }));
    }
    // this.setState({ ctx });
  }

  handleKeypress(e) {
    const { keyCode, type } = e;
    const { keysPressed: { activeKeys }, dispatch } = this.props;
    const activeKey = type === 'keydown' ? assignKey(activeKeys, keyCode) : removeKey(activeKeys, keyCode);

    dispatch(updateActiveKeys(activeKey));
  }

  // #here - #collision
  // collisionDetection() {
    // figure out if next cell is impassable or not
    // 8-dir (3 x 3) detection radius
    // if any next cell/s in detection radius is impassable,
    // disallow movement to that/those cell/s
    // console.log('\n walls in map: ', this.props.gameMap.walls)
  // }

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

  toggleWallHighlights() {
    this.setState({ wallsHighlighted: !this.state.wallsHighlighted });
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
        <button onClick={this.toggleWallHighlights}>TOGGLE WALL HIGHLIGHTS</button>
        <div
          tabIndex="0"
          role="presentation"
          id="overworldMovementContainer"
          onKeyDown={this.handleKeypress}
          onKeyUp={this.handleKeypress}
        >
          <Camera dimensions={cameraDimensions}>
            {/* #here insert player character component here */}
            {/* <div id="spatialFieldStyles" style={spatialFieldStyles} className={styles.spatialField} /> */}
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
