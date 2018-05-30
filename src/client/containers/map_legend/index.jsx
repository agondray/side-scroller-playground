import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';

import MapTile from '@components/map_tile';
import { updateSelectedTile } from '@dux/map_builder';
import { spriteData } from '@utils/constants';
import styles from './map_legend.scss';

// #here - put this in components
const ToggleButton = ({ handleClick }) => (
  <div
    className={styles.toggleButton}
    tabIndex="-1"
    role="button"
    onClick={handleClick}
  >
    &#10007;
  </div>
);

ToggleButton.propTypes = { handleClick: PropTypes.func.isRequired };

class MapLegend extends Component {
  constructor() {
    super();

    this.state = {
      collapsed: false,
    };

    this.handleTileClick = this.handleTileClick.bind(this);
    this.renderMapTiles = this.renderMapTiles.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  handleTileClick(tileData) {
    this.props.dispatch(updateSelectedTile(tileData));
  }

  handleToggleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ collapsed: !this.state.collapsed });
  }

  renderMapTiles() {
    const { selectedTile } = this.props;
    return Object.keys(spriteData).map(key => (
      <MapTile
        code={key}
        isSelected={selectedTile.tileCode === key}
        handleTileClick={this.handleTileClick}
      />
    ));
  }

  renderContent() {
    if (this.state.collapsed) {
      return (<ToggleButton handleClick={this.handleToggleClick} />);
    }

    return (
      <div>
        <ToggleButton handleClick={this.handleToggleClick} />
        {this.renderMapTiles()}
      </div>
    );
  }

  render() {
    return (
      <div className={cx(styles.container, { [styles.collapsed]: this.state.collapsed })}>
        {this.renderContent()}
      </div>
    );
  }
}

MapLegend.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedTile: PropTypes.shape(),
};

MapLegend.defaultProps = {
  selectedTile: {},
};

const duckState = ({ mapBuilder: { selectedTile } }) => ({ selectedTile });

export default connect(duckState)(MapLegend);
