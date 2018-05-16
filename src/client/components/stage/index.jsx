import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PlayerCharacter from '@entities/player_character';
import Overworld from '@engines/overworld';
import { addActiveKey, removeActiveKey } from '@dux/player_character';
import { allowedKeys } from '@utils/key_codes';
import { assignKey, removeKey } from '@utils/keypress_handlers';
import { createImage } from '@utils/image_helpers';
import styles from './styles.scss';

const terrainSpriteSheet = require('@images/terrain.png');
const playerSprite = require('@images/swordsman.png');

class Stage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animation: null,
      autoUpdateX: null,
      cellSize: 96,
      cols: 12,
      gameStarted: false,
      context: null,
      overworld: null,
      player: null, // this will eventually be an array of players
      rows: 12,
      // 12 x 12 grid made of 96 x 96 tiles
      stage: {
        width: 1152,
        height: 1152,
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
    this.initializeOverwolrd = this.initializeOverwolrd.bind(this);
  }

  componentDidMount() {
    if (!this.state.context) {
      const { canvas } = this;
      const context = canvas.getContext('2d');
      this.gameStart({ context });
    }

    // animation start
    this.kickoffAnimationFrames();
  }

  gameStart({ context }) {
    this.setState({ context }, () => {
      this.initializeContextValues();
      this.initializePlayerCharacter();
      this.initializeOverwolrd();
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
    const { context } = this.state;
    const avatar = createImage(playerSprite);
    const player = new PlayerCharacter({ avatar });

    player.render(context);
    this.setState({ player });
  }

  initializeOverwolrd() {
    const { cellSize, cols, rows, context } = this.state;
    const spriteMap = createImage(terrainSpriteSheet);
    const overworldParams = {
      spriteMap,
      cols,
      rows,
      cellSize,
    };

    const overworld = new Overworld(overworldParams);
    overworld.render(context);
    this.setState({ overworld });
  }

  update() {
    const { context, player, overworld } = this.state;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.initializeContextValues();
    this.updatePlayerPosition();
    overworld.render(context);
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
