import React from 'react';
import Checkbox from '@/ui/components/interaction/Checkbox.jsx';
import Slider from '@/ui/components/interaction/Slider.jsx';
import SectionTitle from '@/ui/components/layout/SectionTitle.jsx';
import { Icons } from '@/ui/components/icons.jsx';

const Misc = ({ settings, onSettingChange }) => {
  return (
    <div className="section">
      {/* Map Highlights Section */}
      <SectionTitle
        icon={Icons.Map}
        label="Map Highlights"
        enabled={settings.mapHighlights_.enabled_}
        onEnabledChange={(v) => onSettingChange((s) => (s.mapHighlights_.enabled_ = v))}
      />
      <div className={`group ${!settings.mapHighlights_.enabled_ ? 'hidden' : ''}`}>
        <Checkbox
          id="smaller-trees"
          label="Smaller Trees"
          checked={settings.mapHighlights_.smallerTrees_}
          onChange={(v) => onSettingChange((s) => (s.mapHighlights_.smallerTrees_ = v))}
        />
      </div>

      {/* Auto Loot Section */}
      <SectionTitle
        icon={Icons.AutoLoot}
        label="Auto Loot"
        enabled={settings.autoLoot_.enabled_}
        onEnabledChange={(v) => onSettingChange((s) => (s.autoLoot_.enabled_ = v))}
      />

      {/* Mobile Movement Section */}
      <SectionTitle
        icon={Icons.MobileMovement}
        label="Mobile Movement"
        enabled={settings.mobileMovement_.enabled_}
        onEnabledChange={(v) => onSettingChange((s) => (s.mobileMovement_.enabled_ = v))}
      />
      <div className={`group ${!settings.mobileMovement_.enabled_ ? 'hidden' : ''}`}>
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
