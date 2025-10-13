import React from 'react';
import KeybindSlot from '@/ui/components/interaction/KeybindSlot.jsx';
import { Icons } from '@/ui/components/icons.jsx';

const Help = ({ settings, onSettingChange }) => {
  return (
    <div className="section help-section">
      <div className="help-title">
        <Icons.Help_ size={16} />
        <span>Controls & Information</span>
      </div>

      <div className="help-panel" style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.375rem' }}>
          <KeybindSlot keybind={settings?.keybinds_?.toggleMenu_ || 'ShiftRight'} />
          <span className="keybind-description">Show/Hide Menu</span>
        </div>
        <p className="keybind-help-text">
          Toggle the menu visibility at any time using this keybind.
        </p>
      </div>

      <div className="section-subtitle">Feature Keybinds</div>
      <div className="help-panel">
        <p className="keybind-help-text" style={{ marginBottom: '0.5rem' }}>
          Keybinds can be customized next to each feature in their respective tabs:
        </p>
        <div className="features-container">
          <div className="feature-item">
            <span className="feature-name">Aimbot</span>
            <KeybindSlot keybind={settings?.keybinds_?.toggleAimbot_ || 'KeyB'} />
          </div>
          <div className="feature-item">
            <span className="feature-name">Sticky Target</span>
            <KeybindSlot keybind={settings?.keybinds_?.toggleStickyTarget_ || 'KeyN'} />
          </div>
          <div className="feature-item">
            <span className="feature-name">Layer Spoofer</span>
            <KeybindSlot keybind={settings?.keybinds_?.toggleLayerSpoof_ || 'KeyT'} />
          </div>
        </div>
      </div>

      <div className="help-title" style={{ marginTop: '1rem' }}>
        <Icons.Community_ size={16} />
        <span>Community & Support</span>
      </div>

      <div className="community-container">
        <div className="discord-panel">
          <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
            <Icons.Discord_ style={{ width: '1rem', height: '1rem', color: '#5865F2' }} />
            <span
              style={{
                marginLeft: '0.375rem',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Discord Server
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
            Join for support, bug reports, suggestions, and announcements:
          </p>
          <a
            href="https://discord.gg/4tXaeQfur8"
            target="_blank"
            rel="noopener noreferrer"
            className="discord-link"
          >
            discord.gg
          </a>
        </div>

        <div className="website-panel">
          <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
            <Icons.Website_ style={{ color: '#69f74c' }} />
            <span
              style={{
                marginLeft: '0.375rem',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Official Website
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
        <Icons.Credits_ size={16} />
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
