// =================
// Terrain Sprites
// =================

export const spriteData = {
  TILE_01: {
    name: 'grass',
    type: 'floor',
    spriteParams: {
      dx: 0,
      dy: 352,
      dw: 96,
      dh: 32,
      sw: 96,
      sh: 32,
    },
  },
  TILE_02: {
    name: 'snow',
    type: 'floor',
    spriteParams: {
      dx: 576,
      dy: 544,
      dw: 96,
      dh: 32,
      sw: 96,
      sh: 32,
    },
  },
  TILE_03: {
    name: 'dirt',
    type: 'ground',
    spriteParams: {
      dx: 0,
      dy: 64,
      dw: 96,
      dh: 96,
      sw: 96,
      sh: 96,
    },
  },
};

// =================
// Tile/Grid Constants
// =================
export const tileSpecs = {
  tileSize: 96,
  spriteSpecs: {
    floor: {
      height: 32,
      tileRows: 3,
    },
    ground: {
      height: 96,
      tileRows: 1,
    },
  },
};

export const gridColors = {
  mapMode: '#000',
  wallMode: '#f00',
};

export const gridSpecs = {
  cellSize: 96,
  rows: 12,
  cols: 12,
};

export default {
  spriteData,
  tileSpecs,
  gridSpecs,
  gridColors,
};
