import React from 'react';
import { Icons } from '../icons';

const Header = ({ onMouseDown, version }) => {
  const handleMouseDown = (e) => {
    onMouseDown(e);
  };

  return (
    <div className="header" onMouseDown={handleMouseDown}>
      <Icons.Surplus_ className="menu-icon" />
      <div className="title">Surplus{version && ` ${version}`}</div>
      <div className="credit">by mahdi, noam</div>
    </div>
  );
};

export default Header;
