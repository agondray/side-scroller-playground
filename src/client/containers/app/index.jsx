import React from 'react';

import Navigation from '@components/navigation';
import style from './styles.scss';

const App = ({ children }) => (
  <div className={style.app}>
    <Navigation />
    {React.Children.map(children, child => React.cloneElement(child))}
  </div>
);

export default App;
