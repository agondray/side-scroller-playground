import { generateBaseLayer } from '@utils/map_layer_generator';

// const sampleMap = document.getElementById('sampleMap');

export default class Overworld {
  constructor({ sampleMap, cols, rows, cellSize }) {
    this.attributes = {
      layers: [],
      // spriteMap,
      sampleMap,
      cols,
      rows,
      cellSize,
    };
  }

  render(context) {
    const { sampleMap } = this.attributes;
    // const { spriteMap, cols, rows } = this.attributes;
    // generateBaseLayer({ type: 'snow', context, spriteMap, rows, cols });

    context.drawImage(sampleMap, 0, 0, 1152, 1152, 0, 0, 1152, 1152);
  }
}
