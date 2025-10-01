import React from 'react';
import { styles } from '@/ui/components/styles.js';

const Navbar = ({ activeTab, onTabChange, onClose }) => {
  const [closeBtnHovered, setCloseBtnHovered] = React.useState(false);

  const tabs = [
    { id: 'main', label: 'Main' },
    { id: 'visuals', label: 'Visuals' },
    { id: 'misc', label: 'Misc' },
    { id: 'help', label: 'Help' },
  ];

  const closeBtnStyle = {
    ...styles.closeBtn,
    ...(closeBtnHovered && {
      color: '#fff',
      rotate: '45deg',
      scale: '0.95',
      transition: 'all 0.2s ease',
    }),
  };

  return (
    <div className="navbar" style={styles.navbar}>
      <div className="nav-tabs" style={styles.navTabs}>
        {tabs.map((tab) => {
          const [isActive, setIsActive] = React.useState(false);
          const isActiveTab = activeTab === tab.id;

          const tabStyle = {
            ...styles.navTab,
            ...(isActiveTab && styles.navTabActive),
            ...(isActive && { transform: 'scale(0.95)' }),
          };

          return (
            <button
              key={tab.id}
              className={`nav-tab ${isActiveTab ? 'active' : ''}`}
              data-tab={tab.id}
              style={tabStyle}
              onClick={() => onTabChange(tab.id)}
              onMouseDown={() => setIsActive(true)}
              onMouseUp={() => setIsActive(false)}
              onMouseLeave={() => setIsActive(false)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <button
        className="close-btn"
        style={closeBtnStyle}
        onClick={onClose}
        onMouseEnter={() => setCloseBtnHovered(true)}
        onMouseLeave={() => setCloseBtnHovered(false)}
      >
        ×
      </button>
    </div>
  );
};

export default Navbar;
