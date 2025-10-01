import React from 'react';
import { styles } from '@/ui/components/styles.js';

const Header = ({ onMouseDown, version }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const headerStyle = {
    ...styles.header,
    ...(isHovered && { background: '#1b1b1b', transition: 'all 0.2s ease' }),
    ...(isActive && { background: '#1d1d1d', transition: 'all 0.2s ease' }),
  };

  const handleMouseDown = (e) => {
    setIsActive(true);
    onMouseDown(e);
  };

  return (
    <div
      className="header"
      style={headerStyle}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
      onMouseUp={() => setIsActive(false)}
    >
      <img
        src="https://i.postimg.cc/W4g7cxLP/image.png"
        alt="Menu"
        style={styles.menuIcon}
      />
      <div className="title" style={styles.title}>
        Surplus{version && ` ${version}`}
      </div>
      <div className="credit" style={styles.credit}>
        by mahdi, noam
      </div>
    </div>
  );
};

export default Header;
