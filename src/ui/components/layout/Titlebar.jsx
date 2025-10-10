import React from 'react';
import { Icons } from '../icons';

const Titlebar = ({ onMouseDown, version }) => {
  const handleMouseDown = (e) => {
    onMouseDown(e);
  };

  return (
    <div className="titlebar" onMouseDown={handleMouseDown}>
      <Icons.Surplus_ className="menu-icon" />
      <div className="title">Surplus{version && ` ${version}`}</div>
      <div className="credit">by mahdi, noam</div>
    </div>
  );
};

export default Titlebar;
