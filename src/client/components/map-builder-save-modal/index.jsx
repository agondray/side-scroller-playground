import React from 'react';
import PropTypes from 'prop-types';

import styles from './map-builder-save-modal.scss';

const MapBuilderSaveModal = ({
  handleInputChange,
  handleConfirmClick,
  imageBlob,
  imageName,
}) => {
  const onInputChange = (e) => {
    handleInputChange(e.target.value);
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
            href={imageBlob}
            download={imageName}
            title={imageName}
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
    </div>
  );
};

MapBuilderSaveModal.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleConfirmClick: PropTypes.func.isRequired,
  imageBlob: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
};

export default MapBuilderSaveModal;
