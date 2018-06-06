import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Canvas from '@components/canvas';
import MapBuilderSaveModal from '@components/map-builder-save-modal';
import MapLegend from '@containers/map_legend';
import {
  tileSpecs,
  gridSpecs,
  gridColors,
  cellTypes,
} from '@utils/constants';
import {
  updateHoveredCell,
  initializeGridObject,
  updateGridObject,
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
      gridColor: gridColors.mapBuilderMode.grid, // <-- does not need to be in state
      cellHoverColor: gridColors.mapBuilderMode.highlight, // <-- does not need to be in state
      inMapMode: true,
      imageBlob: '',
      imageName: '',
      saving: false,
    };

    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.initializeTool = this.initializeTool.bind(this);
    this.handleCanvasHover = this.handleCanvasHover.bind(this);
    this.update = this.update.bind(this);
    this.asyncUpdateGridObject = this.asyncUpdateGridObject.bind(this);
    this.handleModeToggleClick = this.handleModeToggleClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleModalInputChange = this.handleModalInputChange.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
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
    const { gridColor } = this.state;
    const { dispatch } = this.props;
    const gridMatrix = drawGrid({
      gridColor,
      context: ctx,
      ...gridSpecs,
    });

    const spriteMapImage = new Image();
    spriteMapImage.src = spriteMapSource;

    this.setState({ context: ctx, spriteMapImage });
    dispatch(initializeGridObject(generateGridObject(gridMatrix)));
  }

  asyncUpdateGridObject(params) {
    const { cellKey, selectedTile, selectedCellType } = params;
    const { dispatch, gridObject } = this.props;
    const { tileData } = gridObject[cellKey];

    return new Promise((resolve) => {
      dispatch(updateGridObject({
        cellKey,
        data: {
          tileData: selectedTile || tileData,
          cellType: selectedCellType,
        },
      }));

      resolve();
    });
  }

  handleModeToggleClick(e) {
    e.stopPropagation();
    const {
      mapBuilderMode: {
        grid: mapBuilderGridColor,
        highlight: mapBuilderHighlightColor,
      },
      wallBuilderMode: {
        grid: wallBuilderGridColor,
        highlight: wallBuilderHighlightColor,
      },
    } = gridColors;

    this.setState({
      inMapMode: !this.state.inMapMode,
      gridColor: this.state.inMapMode ? wallBuilderGridColor : mapBuilderGridColor,
      cellHoverColor: this.state.inMapMode ?
        wallBuilderHighlightColor : mapBuilderHighlightColor,
    }, () => { this.update(); });
  }

  handleSaveClick() {
    const { gridObject } = this.props;
    const {
      canvasWidth,
      canvasHeight,
      context,
      spriteMapImage,
    } = this.state;

    clearCanvas({ context, canvasWidth, canvasHeight });
    drawPaintedCells({ context, spriteMapImage, gridObject });

    this.setState({ saving: true, imageBlob: this.canvas.toDataURL() });
  }

  handleModalInputChange(val) {
    this.setState({ imageName: val });
  }

  handleModalClose() {
    this.setState({ saving: false, imageName: '', imageBlob: '' });
    this.update();
  }

  handleCanvasClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const {
      hx,
      hy,
      selectedTile,
      selectedCellType: defaultCellType,
      gridObject,
    } = this.props;
    const {
      context,
      spriteMapImage,
      inMapMode,
    } = this.state;
    const {
      type,
      tileCode,
      dx,
      dy,
    } = selectedTile;
    const cellKey = `${hx}_${hy}`;
    const clickedCell = gridObject[cellKey];
    const clickedCellType = clickedCell.cellType || defaultCellType;
    const { tileSize, spriteSpecs } = tileSpecs;

    if (inMapMode && tileCode) {
      const drawFloorSpriteParams = {
        type,
        context,
        spriteMapImage,
        dx,
        dy,
        dw: tileSize,
        dh: spriteSpecs[type].height,
        hx,
        hy,
        sw: tileSize,
        sh: spriteSpecs[type].height,
      };

      drawFloorTile({ drawFloorSpriteParams });
      this.asyncUpdateGridObject({ cellKey, selectedTile, selectedCellType: clickedCellType });
    } else if (!inMapMode) {
      highlightCell({ context, tileSize, hx, hy, cellHighlightColor: cellTypes.wall.highlight });
      this.asyncUpdateGridObject({ cellKey, selectedCellType: cellTypes.wall });
    }

    return null;
  }

  handleCanvasHover(e) {
    const { tileSize } = tileSpecs;
    const { dispatch } = this.props;
    const { context, cellHoverColor } = this.state;

    const rect = this.canvas.getBoundingClientRect();
    const canvasTopLeftX = rect.left;
    const canvasTopLeftY = rect.top;

    const cx = e.clientX - canvasTopLeftX;
    const cy = e.clientY - canvasTopLeftY;
    const hx = Math.floor(cx / tileSize) * tileSize;
    const hy = Math.floor(cy / tileSize) * tileSize;
    const { hx: prevHx, hy: prevHy } = this.props;

    if (hx !== prevHx || hy !== prevHy) {
      dispatch(updateHoveredCell({ x: hx, y: hy }));
      this.update();
      highlightCell({ context, tileSize, hx, hy, cellHighlightColor: cellHoverColor });
    }
  }

  update() {
    const { gridObject } = this.props;
    const {
      canvasWidth,
      canvasHeight,
      context,
      spriteMapImage,
      gridColor,
      inMapMode,
    } = this.state;

    clearCanvas({ context, canvasWidth, canvasHeight });
    drawPaintedCells({ context, spriteMapImage, gridObject, showImpassableHighlights: !inMapMode });
    drawGrid({
      gridColor,
      context,
      ...gridSpecs,
    });
  }

  render() {
    const {
      canvasWidth,
      canvasHeight,
      inMapMode,
      imageBlob,
      imageName,
      saving,
    } = this.state;

    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Your window to a new world...</h1>
        {inMapMode ? <MapLegend /> : null }
        <div className={styles.buttonsContainer}>
          <button
            className={styles.toggleModesButton}
            onClick={this.handleModeToggleClick}
          >
            Toggle Build vs Wall Modes
          </button>
          <button
            className={styles.saveButton}
            onClick={this.handleSaveClick}
          >
            SAVE AND DOWNLOAD MAP IMAGE
          </button>
        </div>
        <Canvas
          canvasRef={(c) => { this.canvas = c; }}
          height={canvasWidth}
          width={canvasHeight}
          onClick={this.handleCanvasClick}
          onMouseMove={this.handleCanvasHover}
        />
        { saving ?
          <MapBuilderSaveModal
            handleInputChange={this.handleModalInputChange}
            handleConfirmClick={this.handleModalClose}
            imageBlob={imageBlob}
            imageName={imageName}
          /> :
          null }
      </div>
    );
  }
}

MapBuilder.propTypes = {
  dispatch: PropTypes.func.isRequired,
  gridObject: PropTypes.shape().isRequired,
  selectedTile: PropTypes.shape().isRequired,
  selectedCellType: PropTypes.shape().isRequired,
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
  selectedCellType,
} }) => ({
  hx,
  hy,
  gridObject,
  selectedTile,
  selectedCellType,
});

export default connect(duckState)(MapBuilder);
