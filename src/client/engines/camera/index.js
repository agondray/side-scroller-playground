export default class Camera {
  constructor({ initialPosition, dimensions }) {
    this.attributes = {
      initialPosition: {
        x: initialPosition ? initialPosition.x : 0,
        y: initialPosition ? initialPosition.y : 0,
      },
      dimensions: {
        width: dimensions ? dimensions.x : 640,
        height: dimensions ? dimensions.y : 480,
      },
    };
  }
}
