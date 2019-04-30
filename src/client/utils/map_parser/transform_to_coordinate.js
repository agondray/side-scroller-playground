const transformToCoordinate = ({ cellSize, position, maxCoord = 12 }) => {
  // cellSize is really just the length of a cell's side.
  if (position < cellSize) return 1;

  const coordinate = Math.floor(position / cellSize) + 1;
  return coordinate >= maxCoord ? maxCoord : coordinate;
};

export default transformToCoordinate;
