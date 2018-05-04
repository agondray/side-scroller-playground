import React, { Component } from 'react';

import PlayerCharacter from '@entities/player_character';
import style from './styles.scss';

const playerSprite = require('@images/swordsman.png');

// #here - helpers / HOOK UP TO REDUX!!!

// const setObjectKey = (obj, key) => {
//   const target = obj;
//   target[key] = {
//     pressed: true,
//     code: key,
//   };
//
//   return target;
// };
//
// const removeObjectKey = (obj, key) => {
//   const target = obj;
//   delete target[key];
//   return target;
// };

class Stage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // set in redux prosp
      activeKeys: {},
      // put keys in constants or store
      allowedKeys: {
        left: 65,
        right: 68,
        jump: 32,
      },
      autoUpdateX: null,
      player: null,
      playerX: null,
      playerStyles: null,
      context: null,
      stage: {
        width: 800,
        height: 600,
      },
    };

    this.setContext = this.setContext.bind(this);
    this.initializeContextValues = this.initializeContextValues.bind(this);
    this.initializePlayerCharacter = this.initializePlayerCharacter.bind(this);
  }

  componentDidMount() {
    const { canvas } = this;
    const context = canvas.getContext('2d');
    this.setContext({ context });
  }

  setContext({ context }) {
    this.setState({ context }, () => {
      this.initializeContextValues();
      this.initializePlayerCharacter();
    });
  }

  initializeContextValues() {
    const { context, stage: { width, height } } = this.state;
    context.fillStyle = '#aaa';
    context.fillRect(0, 0, width, height);
  }

  initializePlayerCharacter() {
    const player = new PlayerCharacter();
    player.createSprite(this.state.context, playerSprite);
    player.render(this.state.context);
  }

  // ==========================

  // move(dir) {
  //   const { playerX, playerStyles } = this.state;
  //   const delta = 10;
  //   let x = playerX;
  //
  //   if (dir === 'right') {
  //     this.setState({ playerX: `${x += delta}px` });
  //   }
  // }
  //
  // updatePlayerPosition() {
  //   const { activeKeys, allowedKeys: { left, right, jump } } = this.state;
  //   if (activeKeys[left]) {
  //     this.move('left');
  //   }
  //
  //   if (activeKeys[right]) {
  //     this.move('right');
  //   }
  //
  //   if (activeKeys[jump]) {
  //     this.move('jump');
  //   }
  // }
  //
  // handleKeyDown(e) {
  //   const { keyCode } = e;
  //   const { activeKeys } = this.state;
  //   this.setState({
  //     activeKeys: setObjectKey(activeKeys, keyCode),
  //   }, () => {
  //     this.updatePlayerPosition();
  //   });
  // }
  //
  // handleKeyUp(e) {
  //   const { keyCode } = e;
  //   const { activeKeys } = this.state;
  //   this.setState({
  //     activeKeys: removeObjectKey(activeKeys, keyCode),
  //   });
  // }

  render() {
    const { stage: { width, height } } = this.state
    return (
      <div>
        <canvas
          ref={(canvas) => { this.canvas = canvas; }}
          width={width}
          height={height}
        />
      </div>
    );
  }
}

export default Stage;
