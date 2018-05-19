import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Canvas from '@components/canvas';
import MapLegend from '@containers/map_legend';
import { tileSpecs, gridSpecs } from '@utils/constants';
import {
  updateHoveredCell,
  updateGridMatrix,
  initializeGridObject,
  updateGridObject,
  updateSelectedCell,
} from '@dux/map_builder';
import {
  drawGrid,
  generateGridObject,
  highlightCell,
  clearCanvas,
  drawFloorTile,
  drawPaintedCells,
} from '@utils/map_builder_helpers';
import styles from './map_builder.scss';

const spriteMapSource = require('@images/terrain.png');

class MapBuilder extends Component {
  constructor() {
    super();

    this.state = {
      context: null,
      canvasWidth: 1152, // 96 * 12
      canvasHeight: 1152,
      spriteMapImage: null,
    };

    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.initializeTool = this.initializeTool.bind(this);
    this.handleCanvasHover = this.handleCanvasHover.bind(this);
    this.update = this.update.bind(this);
    this.asyncUpdateGridObject = this.asyncUpdateGridObject.bind(this);
  }

  componentDidMount() {
    const { canvas } = this;
    const { context } = this.state;
    if (!context) {
      const ctx = canvas.getContext('2d');
      this.initializeTool({ ctx });
    }
  }

  initializeTool({ ctx }) {
    const { dispatch } = this.props;
    const gridMatrix = drawGrid({ context: ctx, ...gridSpecs });

    const spriteMapImage = new Image();
    spriteMapImage.src = spriteMapSource;

    this.setState({ context: ctx, spriteMapImage });
    dispatch(initializeGridObject(generateGridObject(gridMatrix)));
    dispatch(updateGridMatrix(gridMatrix));
  }

  asyncUpdateGridObject({ cellKey, clickedCell, selectedTile }) {
    const { dispatch } = this.props;
    return new Promise((resolve) => {
      dispatch(updateGridObject({ cellKey, data: { clickedCell, selectedTile } }));
      resolve();
    });
  }

  handleCanvasClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const {
      gridObject,
      hx,
      hy,
      selectedTile,
    } = this.props;
    const {
      type,
      tileCode,
      spriteX,
      spriteY,
    } = selectedTile;

    if (!tileCode) return null;

    const { tileSize, spriteSpecs } = tileSpecs;
    const {
      context,
      spriteMapImage,
    } = this.state;
    const cellKey = `${hx}_${hy}`;
    const clickedCell = gridObject[cellKey];

    const drawFloorSpriteParams = {
      type,
      context,
      spriteMapImage,
      dx: spriteX,
      dy: spriteY,
      dw: tileSize,
      dh: spriteSpecs[type].height,
      hx,
      hy,
      sw: tileSize,
      sh: spriteSpecs[type].height,
    };

    drawFloorTile({ drawFloorSpriteParams });
    context.save();
    this.asyncUpdateGridObject({ cellKey, clickedCell, selectedTile })
      .then(() => (this.update()));

    return null;
  }

  handleCanvasHover(e) {
    const { tileSize } = tileSpecs;
    const { dispatch } = this.props;
    const { context } = this.state;

    const rect = this.canvas.getBoundingClientRect();
    const canvasTopLeftX = rect.left;
    const canvasTopLeftY = rect.top;

    const cx = e.clientX - canvasTopLeftX;
    const cy = e.clientY - canvasTopLeftY;
    const hx = Math.floor(cx / tileSize) * tileSize;
    const hy = Math.floor(cy / tileSize) * tileSize;

    highlightCell({ context, tileSize, hx, hy });
    dispatch(updateHoveredCell({ x: hx, y: hy }));

    // #here
    // this should only run when hovering on a different cell
    this.update();
  }

  update() {
    const { gridObject } = this.props;
    const {
      canvasWidth,
      canvasHeight,
      context,
      spriteMapImage,
    } = this.state;

    clearCanvas({ context, canvasWidth, canvasHeight });
    drawPaintedCells({ context, spriteMapImage, gridObject });
    drawGrid({ context, ...gridSpecs }); // <-- calls context.save();
  }

  render() {
    const { canvasWidth, canvasHeight } = this.state;

    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Your window to a new world...</h1>
        <MapLegend />
        <Canvas
          canvasRef={(c) => { this.canvas = c; }}
          height={canvasWidth}
          width={canvasHeight}
          onClick={this.handleCanvasClick}
          onMouseMove={this.handleCanvasHover}
        />
      </div>
    );
  }
}

MapBuilder.propTypes = {
  dispatch: PropTypes.func.isRequired,
  gridObject: PropTypes.shape().isRequired,
  selectedTile: PropTypes.shape().isRequired,
  hx: PropTypes.number,
  hy: PropTypes.number,
};

MapBuilder.defaultProps = {
  hx: 0,
  hy: 0,
};

const duckState = ({ mapBuilder: {
  hoveredCell: { x: hx, y: hy },
  gridObject,
  selectedTile,
} }) => ({
  hx,
  hy,
  gridObject,
  selectedTile,
});

export default connect(duckState)(MapBuilder);
