import React from 'react';
import PropTypes from 'prop-types';

const Canvas = ({
  style,
  canvasRef,
  width,
  height,
  onKeyDown,
  onKeyUp,
  onClick,
  onMouseMove,
  onMouseOver,
}) => (
  <canvas
    style={style}
    ref={canvasRef}
    height={height}
    width={width}
    onKeyDown={onKeyDown}
    onKeyUp={onKeyUp}
    onClick={onClick}
    onMouseMove={onMouseMove}
    onMouseOver={onMouseOver}
  />
);

Canvas.propTypes = {
  style: PropTypes.shape(),
  height: PropTypes.number,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onClick: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOver: PropTypes.func,
  canvasRef: PropTypes.func.isRequired,
  width: PropTypes.number,
};

Canvas.defaultProps = {
  style: { background: '#ccc' },
  width: 1000,
  height: 1000,
  onKeyDown: () => (null),
  onKeyUp: () => (null),
  onClick: () => (null),
  onMouseMove: () => (null),
  onMouseOver: () => (null),
};

export default Canvas;
