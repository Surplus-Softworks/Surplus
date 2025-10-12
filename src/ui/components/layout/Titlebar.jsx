import React from 'react';
import { Icons } from '@/ui/components/icons.jsx';

const Titlebar = ({ onMouseDown, version }) => {
  const handleMouseDown = (e) => {
    onMouseDown(e);
  };

  const renderVersion = () => {
    if (!version) return null;

    const updateMatch = version.match(/^([\d.]+)\s*update available!$/);
    if (updateMatch) {
      const versionNumber = updateMatch[1];
      return (
        <>
          {versionNumber}
          <span className="update-available-text"> update available!</span>
        </>
      );
    }

    return version;
  };

  return (
    <div className="titlebar" onMouseDown={handleMouseDown}>
      <Icons.Surplus_ className="menu-icon" />
      {version && <div className="version-text">{renderVersion()}</div>}
      <div className="title">Surplus</div>
      <div className="credit">by mahdi, noam</div>
    </div>
  );
};

export default Titlebar;
