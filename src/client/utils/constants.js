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
    name: 'desert',
    type: 'floor',
    spriteParams: {
      dx: 0,
      dy: 160,
      dw: 96,
      dh: 32,
      sw: 96,
      sh: 32,
    },
  },
  TILE_04: {
    name: 'dirt',
    type: 'floor',
    spriteParams: {
      dx: 192,
      dy: 160,
      dw: 96,
      dh: 32,
      sw: 96,
      sh: 32,
    },
  },
  TILE_05: {
    name: 'granite',
    type: 'floor',
    spriteParams: {
      dx: 288,
      dy: 160,
      dw: 96,
      dh: 32,
      sw: 96,
      sh: 32,
    },
  },
  TILE_06: {
    name: 'water',
    type: 'floor',
    spriteParams: {
      dx: 480,
      dy: 544,
      dw: 96,
      dh: 32,
      sw: 96,
      sh: 32,
    },
  },
  TILE_07: {
    name: 'sandPatch',
    type: 'envObject',
    spriteParams: {
      dx: 0,
      dy: 64,
      dw: 96,
      dh: 96,
      sw: 96,
      sh: 96,
    },
  },
  TILE_08: {
    name: 'tinyLake',
    type: 'envObject',
    spriteParams: {
      dx: 480,
      dy: 448,
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
const hoverOpacity = '0.5';
export const tileSpecs = {
  tileSize: 96,
  spriteSpecs: {
    floor: {
      height: 32,
      tileRows: 3,
    },
    envObject: {
      height: 96,
      tileRows: 1,
    },
  },
};

export const gridColors = {
  mapBuilderMode: {
    grid: '#000',
    highlight: `rgba(255, 255, 255, ${hoverOpacity})`,
  },
  wallBuilderMode: {
    grid: '#f00',
    highlight: `rgba(1, 139, 247, ${hoverOpacity})`,
  },
};

export const gridSpecs = {
  cellSize: 96,
  rows: 12,
  cols: 12,
};

export const cellTypes = {
  floor: {
    name: 'envSprite',
    impassable: false,
    highlight: 'rgba(0, 0, 0, 0)',
  },
  wall: {
    name: 'wall',
    impassable: true,
    highlight: `rgba(255, 0, 0, ${hoverOpacity})`,
  },
};

export default {
  spriteData,
  tileSpecs,
  gridSpecs,
  gridColors,
  cellTypes,
};
