import React from 'react';
import Checkbox from '@/ui/components/interaction/Checkbox.jsx';
import Slider from '@/ui/components/interaction/Slider.jsx';
import SectionTitle from '@/ui/components/layout/SectionTitle.jsx';
import { Icons } from '@/ui/components/icons.jsx';

const Visuals = ({ settings, onSettingChange }) => {
  return (
    <div className="section">
      <SectionTitle
        icon={Icons.XRay_}
        label="X-Ray"
        enabled={settings.xray_.enabled_}
        onEnabledChange={(v) => onSettingChange((s) => (s.xray_.enabled_ = v))}
      />
      <div className={`group ${!settings.xray_.enabled_ ? 'hidden' : ''}`}>
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

      <SectionTitle
        icon={Icons.LayerSpoof_}
        label="Layer Spoofer"
        keybind={settings.keybinds_.toggleLayerSpoof_}
        keybindEditable={true}
        onKeybindChange={(newKey) =>
          onSettingChange((s) => (s.keybinds_.toggleLayerSpoof_ = newKey))
        }
        enabled={settings.layerSpoof_.enabled_}
        onEnabledChange={(v) => onSettingChange((s) => (s.layerSpoof_.enabled_ = v))}
      />

      <SectionTitle
        icon={Icons.ESP_}
        label="ESP"
        enabled={settings.esp_.enabled_}
        onEnabledChange={(v) => onSettingChange((s) => (s.esp_.enabled_ = v))}
      />
      <div className={`group ${!settings.esp_.enabled_ ? 'hidden' : ''}`}>
        <Checkbox
          id="visible-nametags"
          label="Visible Nametags"
          checked={settings.esp_.visibleNametags_}
          onChange={(v) => onSettingChange((s) => (s.esp_.visibleNametags_ = v))}
        />
        <Checkbox
          id="player-esp"
          label="Player Lines"
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
            id="grenade-trajectory"
            label="Trajectory"
            checked={settings.esp_.grenades_.trajectory_}
            onChange={(v) => onSettingChange((s) => (s.esp_.grenades_.trajectory_ = v))}
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
          <Checkbox
            id="flashlight-trajectory"
            label="Trajectory"
            checked={settings.esp_.flashlights_.trajectory_}
            onChange={(v) => onSettingChange((s) => (s.esp_.flashlights_.trajectory_ = v))}
            style={{ marginRight: '0.375rem' }}
          />
        </div>
      </div>

      <SectionTitle
        icon={Icons.InfiniteZoom_}
        label="Infinite Zoom"
        keybind={['Left Shift', 'Scroll']}
        keybindMode="multiple"
        enabled={settings.infiniteZoom_.enabled_}
        onEnabledChange={(v) => onSettingChange((s) => (s.infiniteZoom_.enabled_ = v))}
      />
    </div>
  );
};

export default Visuals;
