import React from 'react';
import Checkbox from '@/ui/components/interaction/Checkbox.jsx';
import Slider from '@/ui/components/interaction/Slider.jsx';
import { Icons } from '@/ui/components/icons.jsx';

const Misc = ({ settings, onSettingChange }) => {
  return (
    <div className="section">
      {/* Map Highlights Section */}
      <div className="section-title">
        <Icons.Map size={16} />
        <div className="section-title-container">Map Highlights</div>
        <Checkbox
          id="maphighlights"
          label="Enabled"
          checked={settings.mapHighlights_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.mapHighlights_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '0.25rem 0.375rem', margin: 0 }}
        />
      </div>
      <div className="group">
        <Checkbox
          id="smaller-trees"
          label="Smaller Trees"
          checked={settings.mapHighlights_.smallerTrees_}
          onChange={(v) => onSettingChange((s) => (s.mapHighlights_.smallerTrees_ = v))}
        />
      </div>

      {/* Auto Loot Section */}
      <div className="section-title">
        <Icons.AutoLoot size={16} />
        <div className="section-title-container">Auto Loot</div>
        <Checkbox
          id="auto-loot"
          label="Enabled"
          checked={settings.autoLoot_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.autoLoot_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '0.25rem 0.375rem', margin: 0 }}
        />
      </div>

      {/* Mobile Movement Section */}
      <div className="section-title">
        <Icons.MobileMovement size={16} />
        <div className="section-title-container">Mobile Movement</div>
        <Checkbox
          id="mobile-movement-enable"
          label="Enabled"
          checked={settings.mobileMovement_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.mobileMovement_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '0.25rem 0.375rem', margin: 0 }}
        />
      </div>
      <div className="group">
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
