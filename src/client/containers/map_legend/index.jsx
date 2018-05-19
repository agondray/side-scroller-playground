import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MapTile from '@components/map_tile';
import { updateSelectedTile } from '@dux/map_builder';
import { spriteData } from '@utils/constants';
import styles from './map_legend.scss';

const MapLegend = ({ dispatch, selectedTile }) => {
  const handleTileClick = (tileData) => {
    dispatch(updateSelectedTile(tileData));
  };

  const renderMapTiles = () => (
    Object.keys(spriteData).map(key => (
      <MapTile
        code={key}
        isSelected={selectedTile.tileCode === key}
        handleTileClick={handleTileClick}
      />
    ))
  );

  return (
    <div className={styles.container}>
      {renderMapTiles()}
    </div>
  );
};

MapLegend.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedTile: PropTypes.shape(),
};

MapLegend.defaultProps = {
  selectedTile: {},
};

const duckState = ({ mapBuilder: { selectedTile } }) => ({ selectedTile });

export default connect(duckState)(MapLegend);
