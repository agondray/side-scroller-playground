import React from 'react';
import PropTypes from 'prop-types';

import styles from './map-builder-save-modal.scss';

const MapBuilderSaveModal = ({
  handleInputChange,
  handleConfirmClick,
  imageBlob,
  imageName,
  gridObject,
}) => {
  const onInputChange = (e) => {
    handleInputChange(e.target.value);
  };

  const handleDownloadClick = () => {
    document.getElementById('downloadable-grid-object').click();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.wrapper}>
        <p className={styles.heading}>Enter a filename for this image</p>
        <p>Temp Note: get grid object from store and use in Overworld engine</p>
        <input
          className={styles.nameInput}
          type="text"
          onChange={onInputChange}
          value={imageName}
        />
        <div className={styles.buttonsBox}>
          <a
            id="downloadable-map-image"
            href={imageBlob}
            download={imageName}
            title={imageName}
            onClick={handleDownloadClick}
          >
            <button
              className={styles.downloadButton}
              onClick={() => (null)}
            >
              Download
            </button>
          </a>
          <button
            className={styles.closeButton}
            onClick={handleConfirmClick}
          >
            Close Modal
          </button>
        </div>
        <p>PREVIEW:</p>
        <img
          className={styles.mapPreview}
          src={imageBlob}
          alt="map preview"
          width="500"
          height="500"
        />
      </div>
      <a
        id="downloadable-grid-object"
        href={`data:text/json;charset=utf-8,${JSON.stringify(gridObject)}`}
        style={{ display: 'none' }}
        download={`${imageName || gridObject}.json`}
      />
    </div>
  );
};

MapBuilderSaveModal.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleConfirmClick: PropTypes.func.isRequired,
  imageBlob: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
  gridObject: PropTypes.shape().isRequired,
};

export default MapBuilderSaveModal;
