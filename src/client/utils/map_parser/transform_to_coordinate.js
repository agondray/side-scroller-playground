const transformToCoordinate = ({ cellSize, position }) => {
  // WIP - may need to cover more edge cases...
  if (position === cellSize && position > 0) return 2;
  if (position < cellSize) return 1;

  return Math.round(position / cellSize) + 1;
};

export default transformToCoordinate;
