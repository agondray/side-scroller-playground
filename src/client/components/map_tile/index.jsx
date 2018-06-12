import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { spriteData } from '@utils/constants';
import styles from './map_tile.scss';

const MapTile = ({ code, isSelected, handleTileClick }) => {
  const { spriteParams, name, type } = spriteData[code];

  const handleClick = () => {
    handleTileClick({ type, tileCode: code, ...spriteParams });
  };

  const tiles = {
    floor: (
      <span>
        <div className={styles[name]} />
        <div className={styles[name]} />
        <div className={styles[name]} />
      </span>
    ),
    envObject: (<div className={styles[name]} />),
  };

  return (
    <div
      tabIndex="-1"
      role="button"
      className={cx(styles.tile, { [styles.selected]: isSelected })}
      onClick={handleClick}
    >
      {tiles[type]}
    </div>
  );
};

MapTile.propTypes = {
  code: PropTypes.string.isRequired,
  handleTileClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

MapTile.defaultProps = {
  isSelected: false,
};

export default MapTile;
