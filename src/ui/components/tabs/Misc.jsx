import React from 'react';
import { styles } from '@/ui/components/styles.js';
import Checkbox from '@/ui/components/interaction/Checkbox.jsx';
import Slider from '@/ui/components/interaction/Slider.jsx';

const Misc = ({ settings, onSettingChange }) => {
  return (
    <div className="section" style={styles.section}>
      {/* Map Highlights Section */}
      <div style={styles.sectionTitle}>
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#e3e3e3">
          <path d="m600-144-240-72-153 51q-23 8-43-6t-20-40v-498q0-16 9.5-28.5T177-755l183-61 240 72 153-51q23-10 43 5t20 41v498q0 16-9 29t-24 17l-183 61Zm-36-86v-450l-168-50v450l168 50Zm72-2 108-36v-448l-108 36v448Zm-420-12 108-36v-448l-108 36v448Zm420-436v448-448Zm-312-48v448-448Z"/>
        </svg>
        <div style={styles.sectionTitleContainer}>Map Highlights</div>
        <Checkbox
          id="maphighlights"
          label="Enabled"
          checked={settings.mapHighlights_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.mapHighlights_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '4px 6px', margin: 0 }}
        />
      </div>
      <div style={styles.group}>
        <Checkbox
          id="smaller-trees"
          label="Smaller Trees"
          checked={settings.mapHighlights_.smallerTrees_}
          onChange={(v) => onSettingChange((s) => (s.mapHighlights_.smallerTrees_ = v))}
        />
      </div>

      {/* Auto Loot Section */}
      <div style={styles.sectionTitle}>
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#e3e3e3">
          <path d="M349-144q-85 0-145-60t-60-145q0-35 11.5-68t32.5-60l130-165-72-174h468l-73 174 131 165q21 27 32.5 60t11.5 68q0 85-60 145t-145 60H349Zm131-180q-35 0-59.5-24.5T396-408q0-35 24.5-59.5T480-492q35 0 59.5 24.5T564-408q0 35-24.5 59.5T480-324Zm-96-348h192l30-72H354l30 72Zm-35 456h262q55 0 94-39t39-94q0-23-7.5-44T715-432L583-600H377L245-432q-14 18-21.5 39t-7.5 44q0 55 39 94t94 39Z"/>
        </svg>
        <div style={styles.sectionTitleContainer}>Auto Loot</div>
        <Checkbox
          id="auto-loot"
          label="Enabled"
          checked={settings.autoLoot_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.autoLoot_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '4px 6px', margin: 0 }}
        />
      </div>

      {/* Mobile Movement Section */}
      <div style={styles.sectionTitle}>
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#e3e3e3">
          <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227H480v-320q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/>
        </svg>
        <div style={styles.sectionTitleContainer}>Mobile Movement</div>
        <Checkbox
          id="mobile-movement-enable"
          label="Enabled"
          checked={settings.mobileMovement_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.mobileMovement_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '4px 6px', margin: 0 }}
        />
      </div>
      <div style={styles.group}>
        <Slider
          id="mobile-movement-smooth"
          label="Smooth"
          value={settings.mobileMovement_.smooth_}
          onChange={(v) => onSettingChange((s) => (s.mobileMovement_.smooth_ = v))}
        />
      </div>
    </div>
  );
};

export default Misc;
