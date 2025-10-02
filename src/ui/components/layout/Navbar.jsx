import React from 'react';

const Navbar = ({ activeTab, onTabChange, onClose }) => {
  const tabs = [
    { id: 'main', label: 'Main' },
    { id: 'visuals', label: 'Visuals' },
    { id: 'misc', label: 'Misc' },
    { id: 'help', label: 'Help' },
  ];

  return (
    <div className="navbar">
      <div className="nav-tabs">
        {tabs.map((tab) => {
          const isActiveTab = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`nav-tab ${isActiveTab ? 'active' : ''}`}
              data-tab={tab.id}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Navbar;
