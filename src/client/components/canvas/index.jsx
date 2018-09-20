import React from 'react';
import PropTypes from 'prop-types';

import styles from './canvas.scss';

const Canvas = ({
  canvasStyle,
  canvasRef,
  width,
  height,
  onKeyDown,
  onKeyUp,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseMove,
  onMouseOver,
}) => (
  <canvas
    className={styles.canvas}
    style={canvasStyle}
    ref={canvasRef}
    height={height}
    width={width}
    onKeyDown={onKeyDown}
    onKeyUp={onKeyUp}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseMove={onMouseMove}
    onMouseOver={onMouseOver}
  />
);

Canvas.propTypes = {
  canvasRef: PropTypes.func.isRequired,
  canvasStyle: PropTypes.shape(),
  height: PropTypes.number,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOver: PropTypes.func,
  width: PropTypes.number,
};

Canvas.defaultProps = {
  canvasStyle: { background: '#ccc' },
  width: 1000,
  height: 1000,
  onKeyDown: () => (null),
  onKeyUp: () => (null),
  onClick: () => (null),
  onMouseDown: () => (null),
  onMouseUp: () => (null),
  onMouseMove: () => (null),
  onMouseOver: () => (null),
};

export default Canvas;
