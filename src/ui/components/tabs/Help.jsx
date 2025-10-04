import React from 'react';
import KeybindSlot from '@/ui/components/interaction/KeybindSlot.jsx';
import { Icons } from '@/ui/components/icons.jsx';

const Help = () => {
  return (
    <div className="section help-section">
      <div className="help-title">
        <Icons.Help size={16} />
        <span>Controls & Information</span>
      </div>

      <div className="help-panel" style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.375rem' }}>
          <div className="keybind-button">Right Shift</div>
          <span className="keybind-description">Show/Hide Menu</span>
        </div>
        <p className="keybind-help-text">
          Press <strong>Right Shift</strong> at any time to toggle the entire menu visibility.
        </p>
      </div>

      <div className="section-subtitle">Feature Keybinds</div>
      <div className="help-panel">
        <p className="keybind-help-text" style={{ marginBottom: '0.5rem' }}>
          Each feature's keybind is displayed next to its name in the menu:
        </p>
        <div className="features-container">
          <div className="feature-item">
            <span className="feature-name">Aimbot</span>
            <KeybindSlot keybind="B" />
          </div>
          <div className="feature-item">
            <span className="feature-name">Spinbot</span>
            <KeybindSlot keybind="H" />
          </div>
          <div className="feature-item">
            <span className="feature-name">Layer Spoofer</span>
            <KeybindSlot keybind="T" />
          </div>
        </div>
      </div>

      <div className="help-title" style={{ marginTop: '1rem' }}>
        <Icons.Community size={16} />
        <span>Community & Support</span>
      </div>

      <div className="community-container">
        <div className="discord-panel">
          <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
            <Icons.Discord style={{ color: '#5865F2' }} />
            <span style={{ marginLeft: '0.375rem', color: '#fff', fontSize: '0.875rem', fontWeight: 600 }}>Discord Server</span>
          </div>
          <p style={{ color: '#bbb', fontSize: '0.75rem', lineHeight: 1.4, marginBottom: '0.625rem', flexGrow: 1 }}>
            Join for support, bug reports, suggestions, and announcements:
          </p>
          <a
            href="https://discord.gg/Bc2FDqddmH"
            target="_blank"
            rel="noopener noreferrer"
            className="discord-link"
          >
            discord.gg
          </a>
        </div>

        <div className="website-panel">
          <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
            <Icons.Website style={{ color: '#69f74c' }} />
            <span style={{ marginLeft: '0.375rem', color: '#fff', fontSize: '0.875rem', fontWeight: 600 }}>Official Website</span>
          </div>
          <p style={{ color: '#bbb', fontSize: '0.75rem', lineHeight: 1.4, marginBottom: '0.625rem', flexGrow: 1 }}>
            Visit our website for the latest updates and a backup Discord invite link:
          </p>
          <a
            href="https://s.urpl.us"
            target="_blank"
            rel="noopener noreferrer"
            className="website-link"
          >
            s.urpl.us
          </a>
        </div>
      </div>

      <div className="help-title">
        <Icons.Credits size={16} />
        <span>Credits</span>
      </div>
      <div className="credits-panel">
        <div className="credits-container">
          <div className="credit-item">
            <div className="credit-name">mahdi</div>
            <div>Developer, Designer</div>
          </div>
          <div className="credit-item">
            <div className="credit-name">noam</div>
            <div>Developer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
