import React from 'react';

const Header = ({ onMouseDown, version }) => {
  const handleMouseDown = (e) => {
    onMouseDown(e);
  };

  return (
    <div className="header" onMouseDown={handleMouseDown}>
      <img src="https://i.postimg.cc/W4g7cxLP/image.png" alt="Menu" className="menu-icon" />
      <div className="title">Surplus{version && ` ${version}`}</div>
      <div className="credit">by mahdi, noam</div>
    </div>
  );
};

export default Header;
