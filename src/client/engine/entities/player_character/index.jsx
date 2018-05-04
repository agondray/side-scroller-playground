const playerSprite = require('@images/swordsman.png');

export default class PlayerCharacter {
  constructor() {
    this.createSprite = this.createSprite.bind(this);
  }

  createSprite(context, imgSrc) {
    const sprite = new Image();
    sprite.onload = () => {
      context.drawImage(sprite, 216, 0, 72, 72, 0, 0, 72, 72);
    };
    sprite.src = imgSrc;
  }

  render(context) {
    context.save();
  }
}
