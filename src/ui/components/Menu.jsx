import React, { useState, useEffect, useRef } from 'react';
import Header from '@/ui/components/layout/Header.jsx';
import Navbar from '@/ui/components/layout/Navbar.jsx';
import MainTab from '@/ui/components/tabs/Main.jsx';
import VisualsTab from '@/ui/components/tabs/Visuals.jsx';
import MiscTab from '@/ui/components/tabs/Misc.jsx';
import HelpTab from '@/ui/components/tabs/Help.jsx';

const Menu = ({ settings, onSettingChange, onClose, version }) => {
  const [activeTab, setActiveTab] = useState('help');
  const [position, setPosition] = useState({ x: 175, y: 125 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const menuElement = menuRef.current;
        if (!menuElement) return;

        const headerElement = menuElement.querySelector('.header');
        if (!headerElement) return;

        const headerRect = headerElement.getBoundingClientRect();
        const menuWidth = menuElement.offsetWidth;
        const minVisibleWidth = 100; // Minimum visible width to ensure user can always grab the header

        let newX = e.clientX - dragStart.x;
        let newY = e.clientY - dragStart.y;

        // Constrain horizontal position
        // Left boundary: allow menu to go partially off-screen but keep some visible
        const minX = -(menuWidth - minVisibleWidth);
        // Right boundary: keep at least minVisibleWidth on screen
        const maxX = window.innerWidth - minVisibleWidth;

        // Constrain vertical position
        // Top boundary: header top can't go above 0
        const minY = 0;
        // Bottom boundary: header bottom can't go below window height
        const maxY = window.innerHeight - headerRect.height;

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));

        setPosition({
          x: newX,
          y: newY,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleClick = (e) => {
    e.stopPropagation();
  };

  const containerStyle = {
    position: 'fixed',
    zIndex: '99999',
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'main':
        return <MainTab settings={settings} onSettingChange={onSettingChange} />;
      case 'visuals':
        return <VisualsTab settings={settings} onSettingChange={onSettingChange} />;
      case 'misc':
        return <MiscTab settings={settings} onSettingChange={onSettingChange} />;
      case 'help':
        return <HelpTab />;
      default:
        return <HelpTab />;
    }
  };

  return (
    <div
      id="ui"
      ref={menuRef}
      style={containerStyle}
      onClick={handleClick}
      onMouseDown={handleClick}
      onPointerDown={handleClick}
      onPointerUp={handleClick}
      onTouchStart={handleClick}
      onTouchEnd={handleClick}
    >
      <div className="popup">
        <Header onMouseDown={handleMouseDown} version={version} />
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} onClose={onClose} />
        <div className={`content-container ${activeTab ? 'active' : ''}`}>
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default Menu;
