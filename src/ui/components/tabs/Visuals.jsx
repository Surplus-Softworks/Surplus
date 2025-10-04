import React from 'react';
import Checkbox from '@/ui/components/interaction/Checkbox.jsx';
import Slider from '@/ui/components/interaction/Slider.jsx';
import KeybindSlot from '@/ui/components/interaction/KeybindSlot.jsx';
import { Icons } from '@/ui/components/icons.jsx';

const Visuals = ({ settings, onSettingChange }) => {
  return (
    <div className="section">
      {/* X-Ray Section */}
      <div className="section-title">
        <Icons.XRay size={16} />
        <div className="section-title-container">X-Ray</div>
        <Checkbox
          id="xray"
          label="Enabled"
          checked={settings.xray_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.xray_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '0.25rem 0.375rem', margin: 0 }}
        />
      </div>
      <div className="group">
        <Checkbox
          id="remove-ceilings"
          label="Remove Ceilings"
          checked={settings.xray_.removeCeilings_}
          onChange={(v) => onSettingChange((s) => (s.xray_.removeCeilings_ = v))}
        />
        <Checkbox
          id="darker-smokes"
          label="Darker Smokes"
          checked={settings.xray_.darkerSmokes_}
          onChange={(v) => onSettingChange((s) => (s.xray_.darkerSmokes_ = v))}
        />
        <Slider
          id="smoke-opacity"
          label="Smoke Opacity"
          value={settings.xray_.smokeOpacity_}
          onChange={(v) => onSettingChange((s) => (s.xray_.smokeOpacity_ = v))}
        />
        <Slider
          id="tree-opacity"
          label="Tree Opacity"
          value={settings.xray_.treeOpacity_}
          onChange={(v) => onSettingChange((s) => (s.xray_.treeOpacity_ = v))}
        />
      </div>

      {/* Layer Spoofer Section */}
      <div className="section-title">
        <Icons.LayerSpoof size={16} />
        <div className="section-title-container">Layer Spoofer</div>
        <KeybindSlot keybind="Space" />
        <Checkbox
          id="layerspoof-enable"
          label="Enabled"
          checked={settings.layerSpoof_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.layerSpoof_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '0.25rem 0.375rem', margin: 0 }}
        />
      </div>

      {/* ESP Section */}
      <div className="section-title">
        <Icons.ESP size={16} />
        <div className="section-title-container">ESP</div>
        <Checkbox
          id="esp-enable"
          label="Enabled"
          checked={settings.esp_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.esp_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '0.25rem 0.375rem', margin: 0 }}
        />
      </div>
      <div className="group">
        <Checkbox
          id="visible-nametags"
          label="Visible Nametags"
          checked={settings.esp_.visibleNametags_}
          onChange={(v) => onSettingChange((s) => (s.esp_.visibleNametags_ = v))}
        />
        <Checkbox
          id="player-esp"
          label="Players"
          checked={settings.esp_.players_}
          onChange={(v) => onSettingChange((s) => (s.esp_.players_ = v))}
        />

        <div className="section-title">Grenades</div>
        <div className="subgroup">
          <Checkbox
            id="grenade-esp"
            label="Explosions"
            checked={settings.esp_.grenades_.explosions_}
            onChange={(v) => onSettingChange((s) => (s.esp_.grenades_.explosions_ = v))}
            style={{ marginRight: '0.375rem' }}
          />
          <Checkbox
            id="grenade-trajectories"
            label="Trajectories"
            checked={settings.esp_.grenades_.trajectories_}
            onChange={(v) => onSettingChange((s) => (s.esp_.grenades_.trajectories_ = v))}
            style={{ marginRight: '0.375rem' }}
          />
        </div>

        <div className="section-title">Flashlights</div>
        <div className="subgroup">
          <Checkbox
            id="own-flashlight"
            label="Own"
            checked={settings.esp_.flashlights_.own_}
            onChange={(v) => onSettingChange((s) => (s.esp_.flashlights_.own_ = v))}
            style={{ marginRight: '0.375rem' }}
          />
          <Checkbox
            id="others-flashlight"
            label="Others"
            checked={settings.esp_.flashlights_.others_}
            onChange={(v) => onSettingChange((s) => (s.esp_.flashlights_.others_ = v))}
            style={{ marginRight: '0.375rem' }}
          />
        </div>
      </div>

      {/* Infinite Zoom Section */}
      <div className="section-title">
        <Icons.InfiniteZoom size={16} />
        <div className="section-title-container">Infinite Zoom</div>
        <KeybindSlot keybind={['Shift', 'Scroll']} mode="multiple" />
        <Checkbox
          id="infinite-zoom-enable"
          label="Enabled"
          checked={settings.infiniteZoom_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.infiniteZoom_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '0.25rem 0.375rem', margin: 0 }}
        />
      </div>
    </div>
  );
};

export default Visuals;
