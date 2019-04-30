// import from constants
const cellSize = 96;

const findAllWalls = cells => cells.filter(cell => cell.meta.impassable);

const buildWallObject = walls => (
  walls.reduce((acc, wall) => {
    const result = acc;
    const wallObj = wall;
    const { row, col, x, y } = wallObj;

    // const wallWithBorders = Object.assign(wallObj, { foo: 'bar' });
    result[`${col}_${row}`] = wallObj;
    return result;
  }, {})
);

// const detectNearbyWalls = ({ charPosition, wallsObject }) => {
  // #here
  // simple spatial detection algorithm
// };

export default {
  findAllWalls,
  buildWallObject,
};
