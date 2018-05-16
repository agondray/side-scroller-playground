import { generateBaseLayer } from '@utils/map_layer_generator';

export default class Overworld {
  constructor({ spriteMap, cols, rows, cellSize }) {
    this.attributes = {
      layers: [],
      spriteMap,
      cols,
      rows,
      cellSize,
    };
  }

  render(context) {
    const { spriteMap, cols, rows } = this.attributes;
    generateBaseLayer({ type: 'grass', context, spriteMap, rows, cols });
  }
}
