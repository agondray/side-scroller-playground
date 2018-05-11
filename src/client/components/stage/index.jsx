import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PlayerCharacter from '@entities/player_character';
import { addActiveKey, removeActiveKey } from '@dux/player_character';
import { allowedKeys } from '@utils/key_codes';
import { assignKey, removeKey } from '@utils/keypress_handlers';
import { createPlayerAvatar } from '@utils/avatar_helpers';
import styles from './styles.scss';

const playerSprite = require('@images/swordsman.png');

class Stage extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    const { context, player } = this.state;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.initializeContextValues();
    this.updatePlayerPosition();
    player.render(context);
    context.restore();

    this.kickoffAnimationFrames();
  }

  updatePlayerPosition() {
    const { player } = this.state;
    const { activeKeys } = this.props;
    const { left, right, up, down } = allowedKeys;

    if (activeKeys[left]) {
      player.move('left');
    }

    if (activeKeys[right]) {
      player.move('right');
    }

    if (activeKeys[up]) {
      player.move('up');
    }

    if (activeKeys[down]) {
      player.move('down');
    }
  }

  // #here - DRY THESE UP!//
  handleKeyDown(e) {
    const { keyCode } = e;
    const { activeKeys, dispatch } = this.props;
    const activeKey = assignKey(activeKeys, keyCode);

    dispatch(addActiveKey(activeKey));
  }
  //
  handleKeyUp(e) {
    const { keyCode } = e;
    const { activeKeys, dispatch } = this.props;
    const activeKey = removeKey(activeKeys, keyCode);

    dispatch(removeActiveKey(activeKey));
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

const activeKeysShape = {
  pressed: PropTypes.bool,
  code: PropTypes.string,
};

Stage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  activeKeys: PropTypes.shape(PropTypes.objectOf(activeKeysShape)).isRequired,
};

const state = ({ playerCharacter: { activeKeys } }) => ({
  activeKeys,
});

export default connect(state)(Stage);
