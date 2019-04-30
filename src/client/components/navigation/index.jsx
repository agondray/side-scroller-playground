import React from 'react';
import { Link } from 'react-router-dom';

import styles from './navigation.scss';

const Navigation = () => (
  <div className={styles.container}>
    <div className={styles.navBar}>
      <Link
        className={styles.navLink}
        to="/"
      >
        Game Stage
      </Link>
      <Link
        className={styles.navLink}
        to="/map-builder"
      >
        Map Builder
      </Link>
      <Link
        className={styles.navLink}
        to="/overworld-movement"
      >
        Overworld Movement/Camera
      </Link>
    </div>
  </div>
);

export default Navigation;
