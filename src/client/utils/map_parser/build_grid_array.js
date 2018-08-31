import transformToCoordinate from './transform_to_coordinate';

const buildGridArray = gridData => (
  Object.keys(gridData).map((key) => {
    const { sx, sy, cellType: { impassable }, cellSize } = gridData[key];
    return {
      x: sx,
      y: sy,
      row: transformToCoordinate({ cellSize, position: sy }), // y == row
      col: transformToCoordinate({ cellSize, position: sx }), // x == col
      impassable,
    };
  })
);

export default buildGridArray;
