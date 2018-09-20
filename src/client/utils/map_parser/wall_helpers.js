const findAllWalls = cells => cells.filter(cell => cell.meta.impassable);

const buildWallObject = walls => (
  walls.reduce((acc, wall) => {
    const result = acc;
    const { row, col } = wall;
    result[`${col}_${row}`] = wall; // lazy... need to format this value
    return result;
  }, {})
);

const detectNearbyWalls = ({ charPosition, wallsObject }) => {
  // #here
  // simple spatial detection algorithm
};

export default {
  findAllWalls,
  buildWallObject,
};
