import React, { useState, useEffect, useRef } from 'react';
import Titlebar from '@/ui/components/layout/Titlebar.jsx';
import Navbar from '@/ui/components/layout/Navbar.jsx';
import MainTab from '@/ui/components/tabs/Main.jsx';
import VisualsTab from '@/ui/components/tabs/Visuals.jsx';
import MiscTab from '@/ui/components/tabs/Misc.jsx';
import HelpTab from '@/ui/components/tabs/Help.jsx';
import { outer, outerDocument } from '@/core/outer.js';
import { ref_addEventListener, ref_removeEventListener } from '@/core/hook';

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

        const titlebarElement = menuElement.querySelector('.titlebar');
        if (!titlebarElement) return;

        const titlebarRect = titlebarElement.getBoundingClientRect();
        const menuWidth = menuElement.offsetWidth;
        const minVisibleWidth = 100;

        let newX = e.clientX - dragStart.x;
        let newY = e.clientY - dragStart.y;

        const minX = -(menuWidth - minVisibleWidth);
        const maxX = outer.innerWidth - minVisibleWidth;

        const minY = 0;
        const maxY = outer.innerHeight - titlebarRect.height;

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
      Reflect.apply(ref_addEventListener, outerDocument, ['mousemove', handleMouseMove]);
      Reflect.apply(ref_addEventListener, outerDocument, ['mouseup', handleMouseUp]);
    }

    return () => {
      Reflect.apply(ref_removeEventListener, outerDocument, ['mousemove', handleMouseMove]);
      Reflect.apply(ref_removeEventListener, outerDocument, ['mouseup', handleMouseUp]);
    };
  }, [isDragging, dragStart]);

  useEffect(() => {
    const clampPosition = () => {
      const menuElement = menuRef.current;
      if (!menuElement) return;

      const titlebarElement = menuElement.querySelector('.titlebar');
      if (!titlebarElement) return;

      const titlebarRect = titlebarElement.getBoundingClientRect();
      const menuWidth = menuElement.offsetWidth;
      const minVisibleWidth = 100;

      const minX = -(menuWidth - minVisibleWidth);
      const maxX = outer.innerWidth - minVisibleWidth;
      const minY = 0;
      const maxY = outer.innerHeight - titlebarRect.height;

      setPosition((prev) => ({
        x: Math.max(minX, Math.min(maxX, prev.x)),
        y: Math.max(minY, Math.min(maxY, prev.y)),
      }));
    };

    Reflect.apply(ref_addEventListener, outer, ['resize', clampPosition]);

    return () => {
      Reflect.apply(ref_removeEventListener, outer, ['resize', clampPosition]);
    };
  }, []);

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
        return <HelpTab settings={settings} onSettingChange={onSettingChange} />;
      default:
        return <HelpTab settings={settings} onSettingChange={onSettingChange} />;
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
        <Titlebar onMouseDown={handleMouseDown} version={version} />
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} onClose={onClose} />
        <div className={`content-container ${activeTab ? 'active' : ''}`}>{renderActiveTab()}</div>
      </div>
    </div>
  );
};

export default Menu;
