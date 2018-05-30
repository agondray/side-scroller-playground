import { spriteData, tileSpecs } from '@utils/constants';

export const drawGrid = ({ context, cellSize, rows, cols, gridColor }) => {
  context.restore();
  context.fillStyle = '#ccc';
  context.strokeStyle = gridColor;

  const mapMatrix = Array(rows).fill().map((_y, y) => {
    const columnsArray = Array(cols).fill().map((_x, x) => {
      const sx = x * cellSize;
      const sy = y * cellSize;
      const row = y + 1;
      const col = x + 1;

      context.strokeRect(sx, sy, cellSize, cellSize);

      return { sx, sy, cellSize, row, col };
    });

    return columnsArray;
  });

  context.save();

  return mapMatrix;
};

export const generateGridObject = (mapMatrix) => {
  const mapObject = {};

  mapMatrix.forEach((row) => {
    row.forEach((cellData) => {
      mapObject[`${cellData.sx}_${cellData.sy}`] = cellData;
    });
  });

  return mapObject;
};

export const highlightCell = ({ context, tileSize, hx, hy }) => {
  context.globalAlpha = 0.5;
  context.fillStyle = '#fff';
  context.fillRect(
    hx,
    hy,
    tileSize,
    tileSize,
  );
  context.globalAlpha = 1;

  context.save();
};

export const clearCanvas = ({ context, canvasWidth, canvasHeight }) => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
};

export const drawSprite = ({
  context,
  spriteMapImage,
  sx,
  sy,
  dx,
  dy,
  dw,
  dh,
  sw,
  sh,
}) => (context.drawImage(spriteMapImage, dx, dy, dw, dh, sx, sy, sw, sh));

export const drawFloorTile = ({ drawFloorSpriteParams }) => {
  const { spriteSpecs } = tileSpecs;
  const { hx, hy, type } = drawFloorSpriteParams;
  const { height: spriteHeight, tileRows } = spriteSpecs[type];
  const sx = hx;

  Array(tileRows).fill().forEach((_, y) => {
    const sy = hy + (spriteHeight * y);
    drawSprite({ sx, sy, ...drawFloorSpriteParams });
  });
};

export const drawPaintedCells = ({ context, spriteMapImage, gridObject }) => {
  const gridKeys = Object.keys(gridObject);
  return gridKeys.forEach((key) => {
    if (!gridObject[key].selectedTile) return;

    const coordsXY = key.split('_');
    const hx = parseInt(coordsXY[0], 10);
    const hy = parseInt(coordsXY[1], 10);
    const { tileCode, type } = gridObject[key].selectedTile;
    const { spriteParams } = spriteData[tileCode];
    const drawFloorSpriteParams = {
      type,
      context,
      spriteMapImage,
      hx,
      hy,
      ...spriteParams,
    };

    drawFloorTile({ drawFloorSpriteParams });
  });
};

export default {
  drawGrid,
  generateGridObject,
  highlightCell,
  clearCanvas,
  drawSprite,
};
