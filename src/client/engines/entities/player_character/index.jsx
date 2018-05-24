export default class PlayerCharacter {
  constructor({ position, avatar }) {
    this.attributes = {
      position: {
        x: position ? position.x : 100,
        y: position ? position.y : 100,
      },
      velocity: {
        x: 5,
        y: 5,
      },
      avatar: avatar || null, // #here - avatar must be required || throw error
      cellSize: 96,
    };
  }

  move(direction) {
    const { position, velocity } = this.attributes;
    switch (direction) {
      case 'up':
        position.y -= velocity.y;
        break;
      case 'down':
        position.y += velocity.y;
        break;
      case 'right':
        position.x += velocity.x;
        break;
      case 'left':
        position.x -= velocity.x;
        break;
      default:
        break;
    }
  }

  render(context) {
    const { avatar, position, cellSize } = this.attributes;
    console.log('player position: ', position);

    context.save();
    // #here add isMoving logic for re-painting avatar
    context.drawImage(avatar, 216, 0, 72, 72, position.x, position.y, cellSize, cellSize);
    context.restore();
  }
}
