const transformToCoordinate = ({ cellSize, position, maxCoord = 12 }) => {
  // WIP - may need to cover more edge cases...
  // if (position === cellSize && position > 0) return 2;
  if (position < cellSize) return 1;

  const coordinate = Math.floor(position / cellSize) + 1;
  return coordinate >= maxCoord ? maxCoord : coordinate;
};

export default transformToCoordinate;
