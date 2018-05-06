import React, { Component } from 'react';

import PlayerCharacter from '@entities/player_character';
import style from './styles.scss';

const playerSprite = require('@images/swordsman.png');

// #here - helpers / HOOK UP TO REDUX!!!

// ===============================
// move to helper file
const assignKeyDown = (obj, keyCode) => {
  const target = obj;
  target[keyCode] = {
    pressed: true,
    code: keyCode,
  };

  return target;
};

const removeObjectKey = (obj, keyCode) => {
  const target = obj;
  delete target[keyCode];
  return target;
};

const createPlayerAvatar = (imgSrc) => {
  const sprite = new Image();
  sprite.src = imgSrc;
  //  #here - no onload since image is drawn on update();
  return sprite;
};
// ===============================

class Stage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // set in redux prosp
      // put keys in constants or store
      activeKeys: {},
      allowedKeys: {
        left: 65,
        right: 68,
        jump: 32,
      },
      animation: null,
      autoUpdateX: null,
      gameStarted: false,
      context: null,
      player: null, // this will eventually be an array of players
      stage: {
        width: 800,
        height: 600,
      },
    };

    this.gameStart = this.gameStart.bind(this);
    this.initializeContextValues = this.initializeContextValues.bind(this);
    this.initializePlayerCharacter = this.initializePlayerCharacter.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.update = this.update.bind(this);
    this.handleAnimationFrameStop = this.handleAnimationFrameStop.bind(this);
    this.kickoffAnimationFrames = this.kickoffAnimationFrames.bind(this);
  }

  componentDidMount() {
    if (!this.state.context) {
      const { canvas } = this;
      const context = canvas.getContext('2d');
      this.gameStart({ context });
    }

    this.kickoffAnimationFrames();
  }

  gameStart({ context }) {
    this.setState({ context }, () => {
      this.initializeContextValues();
      this.initializePlayerCharacter();
    });
  }

  kickoffAnimationFrames() {
    const animation = requestAnimationFrame(() => { this.update(); });
    this.setState({ animation, gameStarted: true });
  }

  initializeContextValues() {
    const { context, stage: { width, height } } = this.state;
    context.fillStyle = '#aaa';
    context.fillRect(0, 0, width, height);
    // context.save() #here ?
  }

  initializePlayerCharacter() {
    const avatar = createPlayerAvatar(playerSprite);
    const player = new PlayerCharacter({ avatar });

    player.render(this.state.context);
    this.setState({ player });
  }

  // ==========================

  update() {
    console.log('updating game state');
    const { context, player } = this.state;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.initializeContextValues();
    this.updatePlayerPosition();
    player.render(context);
    context.restore();

    this.kickoffAnimationFrames();
  }

  updatePlayerPosition() {
    const { player, activeKeys, allowedKeys: { left, right, jump } } = this.state;
    if (activeKeys[left]) {
      player.move('left');
    }

    if (activeKeys[right]) {
      player.move('right');
    }
  }

  // DRY THESE UP!//
  handleKeyDown(e) {
    const { keyCode } = e;
    const { activeKeys } = this.state;
    this.setState({
      activeKeys: assignKeyDown(activeKeys, keyCode),
    });
  }
  //
  handleKeyUp(e) {
    const { keyCode } = e;
    const { activeKeys } = this.state;
    this.setState({
      activeKeys: removeObjectKey(activeKeys, keyCode),
    });
  }

  handleAnimationFrameStop() {
    cancelAnimationFrame(this.state.animation);
    this.setState({ animation: null, gameStarted: false });
  }

  render() {
    const { stage: { width, height } } = this.state;
    return (
      <div>
        <button onClick={this.handleAnimationFrameStop}>stop animation frame</button>
        <canvas
          tabIndex="0"
          ref={(canvas) => { this.canvas = canvas; }}
          width={width}
          height={height}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
        />
      </div>
    );
  }
}

export default Stage;
