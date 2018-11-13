import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Camera from '@containers/camera';
import Canvas from '@components/canvas';
import { updateActiveKeys, clearActiveKeys } from '@dux/keys_pressed';
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

// =====================================================
// #here temporary - move to a config or constants file
// pre-load assets with new states (aka when loading a different map or character/s)
// =====================================================
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

// #collision
// initial idea:
// if nearbyWalls has contents, iterate through the array
  // lookup keys in wallsObject
    // calculate all top, right, left, and bottom pixel coordinates for each wall cell
    // create a min/max range for each side
      // (optimization opportunity for cell borders with same coordinates)
  // store min/max ranges for each side in state

// on collide
  // get 8-dir "border" coordinates from player center
  // if any of the x coordinates equal (or less that 1px difference???) the x coordinates in stored range, set "movement allowed" state to false
  // if any of the y coordinates equal (or less that 1px difference???) the x coordinates in stored range, set "movement allowed" state to false
// const collisionDetection = (nearbyWalls) => {
//   if (!nearbyWalls.length) return null;
//
//   // nearbyWalls.forEach((wallCoord) => {
//   //   wallsObject[wallCoord]
//   // })
//   return 'something...'
// };


// =====================================================

class OverworldContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animationFramesId: null,
      lastFrameTimestamp: 0,
      currentFrameTimestamp: 0,
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
    this.stopAnimationFrame = this.stopAnimationFrame.bind(this);
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

    this.initializeCanvasContext().then(() => {
      // #kickoff
      this.kickoffAnimationFrames();
    });
  }

  componentWillUnmount() {
    this.stopAnimationFrame();
  }

  initializeCanvasContext() {
    return new Promise((resolve) => {
      const ctx = this.canvas.getContext('2d');
      this.setState({ ctx });

      resolve();
    })
  }

  // #gameloop #mainloop
  kickoffAnimationFrames() {
    // #here - is this #Necessary?
    // if (this.state.animationFramesId) {
    //   cancelAnimationFrame(this.state.animationFramesId);
    // }

    // const timestamp = Date.now();
    // const { lastFrameTimestamp, currentFrameTimestamp } = this.state;
    // console.log('last frame timestamp: ', lastFrameTimestamp);
    // console.log('timestamp: ', timestamp)
    //
    // if (!lastFrameTimestamp || lastFrameTimestamp + (1000 / 60) <= timestamp) {
    //   this.updateContainer();
    //
    //   const animationFramesId = requestAnimationFrame(this.kickoffAnimationFrames);
    //
    //   console.log('kicking off animation frame id: ', animationFramesId);
    //   this.setState({
    //     animationFramesId,
    //     lastFrameTimestamp: timestamp,
    //     currentFrameTimestamp: timestamp,
    //   });
    // }


    // else {
    //   console.log('lastFrameTimestamp less than timestamp: ', timestamp);
    //   const animationFramesId = requestAnimationFrame(this.kickoffAnimationFrames);
    //   this.setState({ animationFramesId, currentFrameTimestamp: timestamp });
    // }

    // if (!this.state.ctx) {
    //   this.initializeCanvasContext();
    // }

    this.updateContainer();
    const animationFramesId = requestAnimationFrame(this.kickoffAnimationFrames);
    // console.log('kicking off animation frame id: ', animationFramesId);
    this.setState({ animationFramesId });

    // const animationFramesId = requestAnimationFrame(this.updateContainer);
    // console.log('kicking off animation frame id: ', animationFramesId);
    // this.setState({ animationFramesId });

    // requestAnimationFrame(this.);

  }

  stopAnimationFrame() {
    cancelAnimationFrame(this.state.animationFramesId);
    this.setState({ animationFramesId: null });
  }

  // #updatecontainer #gameloop
  updateContainer() {
    // must happen synchronously???
    // #movement
    this.handleMovement();
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
    // #dispatchmaparraydispatch
    // console.log('map array before dispatch: ', mapArray)
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

    // #ctxhighlight #highlight
    if (wallsHighlighted) {
      highlightWalls(ctx);
    }
  }

  // #updatecanvas #here #update-definition
  updateCanvas() {
    const { ctx, playerSpriteSheet } = this.state;

    // player on canvas
    // move logic to own function!!!
    // this function should only care about updating the canvas states
    const { tlX, tlY } = this.props.gameMap.playerCoordinates;
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

    // #here calculation seems to work... it's just a matter of when this gets assigned
    // playerrhitbox #hitboxboundaries #boundaries
    const playerHitbox = {
      left: tlX,
      right: tlX + playerSize,
      top: tlY,
      bottom: tlY + playerSize,
    };

    const playerCoordinates = {
      tlX: rectX,
      tlY: rectY,
      centerX,
      centerY,
      row: pRow, // calculated from center of character square
      col: pCol, // calculated from center of character square
      playerSize,
      halfPlayerSize,
      // playerHitbox,
    };

    this.drawMapInCanvas();

    // #playersprite #drawplayer
    ctx.fillStyle = 'yellow';
    ctx.fillRect(rectX, rectY, playerSize, playerSize);
    ctx.drawImage(playerSpriteSheet, 216, 0, 72, 72, rectX, rectY, playerSize, playerSize);

    // #spatial detection area #hurr
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

    // this.setState({
    //   playerTLCoords: {
    //     x: pCol,
    //     y: pRow,
    //     rectX,
    //     rectY,
    //     centerX,
    //     centerY,
    //   },
    // });

    // #wall detection here
    const detectWalls = () => (
      spatialFieldCoordStrings.filter(coord => (
        this.props.gameMap.walls.hasOwnProperty(coord)
      ))
    );

    const nearbyWalls = detectWalls();
    // keep this log for visual debugging / demo
    // console.log('nearby walls detected: ', nearbyWalls);


    ctx.save();

    // temporary - to prevent unnecessary state updates when tracking player position
    if (rectY !== tlY || rectX !== tlX) {
      // multiple dispatches vs one???
      this.props.dispatch(updateGameMap({
        playerCoordinates,
        nearbyWalls,
        playerHitbox,
      }));
    }

    // this.handleMovement();
    // this.setState({ ctx });
  }

  // #keypress #press #keydown #keyup
  handleKeypress(e) {
    const { keyCode, type } = e;
    const { keysPressed: { activeKeys }, dispatch } = this.props;
    const allowedKeyCodes = Object.values(allowedKeys);
    const activeKeyCodes = Object.values(activeKeys);

    if (!allowedKeyCodes.includes(keyCode)) return;
    if (activeKeyCodes.includes(keyCode)) return;

    const currentActiveKeysObj = type === 'keydown' ? assignKey(activeKeys, keyCode) : removeKey(activeKeys, keyCode);

    // cosole.log('if activeKey')

    // #here hmm..?
    // call this.handleMovement here
    dispatch((dispatch) => (
      new Promise((resolve) => {
        // debugger
        dispatch(updateActiveKeys(currentActiveKeysObj))
        resolve();
      })
    )).then(() => {
      // this.handleMovement()
      if (Object.keys(activeKeys).length) {
        // console.log('active keys: ', Object.keys(activeKeys).length)
        // this.dispatchUpdateMapPosition();
        // #updatehere
        this.updateContainer();
      }
    });
  }

  // #move #handlemove
  handleMovement = () => {
    const {
      keysPressed: { activeKeys },
      gameMap: {
        playerHitbox,
        nearbyWalls,
        walls,
      },
      dispatch,
    } = this.props;

    const {
      left: pLeft,
      right: pRight,
      top: pTop,
      bottom: pBottom,
    } = playerHitbox;

    // collisionThreshold is tentative... can change this value to w/e
    const collisionThreshold = 10;

    // console.log('active keys: ', Object.keys(activeKeys).length)
    if (!Object.keys(activeKeys).length) return;

    // #move this out...
    // move this into update()
      // - collision detection logic should be separate from movement logic!
      // - add parameter for detection detector and detectee (aka player detecting walls or projectiles)
    const detectWallCollision = () => {
      if (!nearbyWalls.length) return [];// false;

      // make an array of wall collision objects
      // each object will contain
      return nearbyWalls.reduce((acc, wallCoord) => {
        const accum = acc;
        const wall = walls[wallCoord];
        const playerLeftCollide = pLeft <= wall.x + cellSize; // player left x <= wall right x
        const playerRightCollide = pRight >= wall.x; // player right x >= wall left x
        const playerTopCollide = pTop <= wall.y + cellSize; // player top y <= wall bottom y
        const playerBottomCollide = pBottom >= wall.y; // player bottom y >= wall top y

        if (playerLeftCollide && playerRightCollide && playerTopCollide && playerBottomCollide) {
          const pLeftCollision = Math.abs(pLeft - (wall.x + cellSize))
          const pRightCollision = Math.abs(pRight - wall.x)
          const pTopCollision = Math.abs(pTop - (wall.y + cellSize))
          const pBottomCollision = Math.abs(pBottom - wall.y)

          const playerHitboxCollidingSides = Object.keys(playerHitbox).filter((hitboxSide) => {
            // hmmm... can still improve/change this switch statement
            switch (hitboxSide) {
              case 'left': {
                if (pLeftCollision <= collisionThreshold) {
                  return hitboxSide;
                }
                return;
              }
              case 'right': {
                if (pRightCollision <= collisionThreshold) {
                  return hitboxSide;
                }
                return;
              }
              case 'top': {
                if (pTopCollision <= collisionThreshold) {
                  return hitboxSide;
                }
                return;
              }
              default: {
                if (pBottomCollision <= collisionThreshold) {
                  return hitboxSide;
                }
                return;
              }
            }
          })

          accum.push({
            wallCoord,
            playerHitboxCollidingSides,
            // temporary -- can delete if not needed:
            pLeftCollision,
            pRightCollision,
            pTopCollision,
            pBottomCollision,
          });

          return accum;
        }

        return accum;
      }, []);
    };

    const bumpedWalls = detectWallCollision();



    if (bumpedWalls.length > 0) {
      console.log('collision detected!!! BOOM ~ ~  ~ ~ ~ ~ ~');

      // #updatecanvas
      // this.updateCanvas();
      // update map and player position
    }

    console.log('bumped walls...: ', bumpedWalls);

    dispatch(updateGameMap({
      playerHitboxCollidingSides: bumpedWalls.length ? bumpedWalls[0].playerHitboxCollidingSides : [],
    }));
    this.dispatchUpdateMapPosition({ velocity });
  }

  dispatchUpdateMapPosition({ velocity }) {
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

    // #wat what... WAT?!??!?!
    // #updatecanvas
    this.updateCanvas();
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

  handleContainerBlur = () => {
    console.log('bllurring div');

    const { dispatch } = this.props;
    dispatch(clearActiveKeys());
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
        <button onClick={this.stopAnimationFrame}>Stop Animation Frames</button>
        <button onClick={this.toggleWallHighlights}>TOGGLE WALL HIGHLIGHTS</button>
        <div
          tabIndex="0"
          role="presentation"
          id="overworldMovementContainer"
          onKeyDown={this.handleKeypress}
          onKeyUp={this.handleKeypress}
          onBlur={this.handleContainerBlur}
        >
          <Camera dimensions={cameraDimensions}>
            {/* #here insert player character component here */}
            {/* <div id="spatialFieldStyles" style={spatialFieldStyles} className={styles.spatialField} /> */}
            <h1 id="playerKarakter" style={playerStyles} className={styles.playerCharacter} />
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
