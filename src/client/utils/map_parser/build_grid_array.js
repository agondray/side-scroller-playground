import transformToCoordinate from './transform_to_coordinate';

const buildGridArray = gridData => (
  Object.keys(gridData).map((key) => {
    console.log('redux latency.. WTF??');
    const { sx, sy, cellType: { impassable }, cellSize } = gridData[key];
    return {
      x: sx,
      y: sy,
      row: transformToCoordinate({ cellSize, position: sy }), // y == row
      col: transformToCoordinate({ cellSize, position: sx }), // x == col
      meta: { impassable, cellSize },
      cellBorderCoords: {
        // top: { x1: sx, y1: sy, x2: sx + cellSize, y2: sy },
        // right: { x1: sx + cellSize, y1: sy, x2: sx + cellSize, y2: sy + cellSize },
        // bottom: { x1: sx, y1: sy + cellSize, x2: sx + cellSize, y2: sy + cellSize },
        // left: { x1: sx, y1: sy, x2: sx, y2: sy + cellSize },

        topLeft: { x: sx, y: sy },
        topRight: { x: sx + cellSize, y: sy },
        bottomRight: { x: sx + cellSize, y: sy + cellSize },
        bottomLeft: { x: sx, y: sy + cellSize },
      },
    };
  })
);

export default buildGridArray;
