import React, { useState, useEffect, useRef } from 'react';
import { outer, outerDocument } from '@/core/outer.js';
import { ref_addEventListener, ref_removeEventListener } from '@/core/hook';

const DiscordNotification = ({ settings, onSettingChange }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const notificationRef = useRef(null);

  useEffect(() => {
    const initialX = outer.innerWidth / 2 - 200;
    const initialY = outer.innerHeight / 2 - 150;
    setPosition({ x: initialX, y: initialY });
  }, []);

  const markAsShown = () => {
    onSettingChange((s) => {
      s.misc_.discordNotifShown_ = true;
    });
  };

  const handleClose = () => {
    markAsShown();
    setIsVisible(false);
  };

  const handleJoinDiscord = () => {
    markAsShown();
    setIsVisible(false);
    window.open('https://discord.gg/4tXaeQfur8', '_blank');
  };

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
        const notificationElement = notificationRef.current;
        if (!notificationElement) return;

        const titlebarElement = notificationElement.querySelector('.titlebar');
        if (!titlebarElement) return;

        const titlebarRect = titlebarElement.getBoundingClientRect();
        const notificationWidth = notificationElement.offsetWidth;
        const minVisibleWidth = 100;

        let newX = e.clientX - dragStart.x;
        let newY = e.clientY - dragStart.y;

        const minX = -(notificationWidth - minVisibleWidth);
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
  }, [isDragging, dragStart, position]);

  if (!isVisible) return null;

  const containerStyle = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: '999999',
  };

  return (
    <div id="ui" ref={notificationRef} style={containerStyle}>
      <div className="popup" style={{ width: '25rem' }}>
        <div className="titlebar" onMouseDown={handleMouseDown}>
          <div className="title">New Discord Server!</div>
          <span className="credit">Join our community</span>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div style={{ padding: '1rem' }}>
          <div className="discord-panel" style={{ marginBottom: '0' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: '1rem', height: '1rem', color: '#5865F2' }}
              >
                <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
              </svg>
              <span
                style={{
                  marginLeft: '0.375rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                We have a new Discord server!
              </span>
            </div>
            <p
              style={{
                color: '#bbb',
                fontSize: '0.75rem',
                lineHeight: 1.4,
                marginBottom: '0.625rem',
                flexGrow: 1,
              }}
            >
              Join our new official Discord server to stay updated, get support, and connect with
              the community. Don't miss out on announcements, updates, and exclusive features!
            </p>
            <a
              href="https://discord.gg/4tXaeQfur8"
              target="_blank"
              rel="noopener noreferrer"
              className="discord-link"
              onClick={handleJoinDiscord}
            >
              Join Discord Server
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordNotification;
