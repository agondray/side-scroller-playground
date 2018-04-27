import React, { Component } from 'react';

import style from './styles.scss';

// #here - HOOK UP TO REDUX!!!

const setObjectKey = (obj, key) => {
  const target = obj;
  target[key] = {
    pressed: true,
    code: key,
  };

  return target;
};

const removeObjectKey = (obj, key) => {
  const target = obj;
  delete target[key];
  return target;
};

class Stage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // set in redux prosp
      activeKeys: {},
      allowedKeys: {
        left: 65,
        right: 68,
        jupm: 32,
      },
      autoUpdateX: null,
      player: null,
      playerStyles: null,
    };

    this.definePlayerNode = this.definePlayerNode.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    // this.move = this.move.bind(this);
  }

  componentDidMount() {
    this.definePlayerNode();
  }

  definePlayerNode() {
    const player = document.getElementById('pc');
    const playerStyles = window.getComputedStyle(player);

    this.setState({ player, playerStyles });
  }

  // move({ direction, playerStyles }) {
  //   console.log('moving...');
    // let currentX = parseInt(playerStyles.left.substring(0, player));

  // }

  handleKeyDown(e) {
    const { keyCode } = e;
    const { allowedKeys, activeKeys } = this.state;
    this.setState({
      activeKeys: setObjectKey(activeKeys, keyCode),
    });
  }

  handleKeyUp(e) {
    const { keyCode } = e;
    const { allowedKeys, activeKeys } = this.state;
    this.setState({
      activeKeys: removeObjectKey(activeKeys, keyCode),
    }, () => {debugger});
  }

  render() {
    // tabIndex="0" onKeyDown={this.foo}
    return (
      <div
        role="textbox"
        className={style.stage}
        tabIndex="0"
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
      >
        <div id="pc" className={style.player} />
      </div>
    );
  }
}

export default Stage;
