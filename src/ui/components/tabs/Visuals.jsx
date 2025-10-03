import React from 'react';
import Checkbox from '@/ui/components/interaction/Checkbox.jsx';
import Slider from '@/ui/components/interaction/Slider.jsx';
import KeybindSlot from '@/ui/components/interaction/KeybindSlot.jsx';

const Visuals = ({ settings, onSettingChange }) => {
  return (
    <div className="section">
      {/* X-Ray Section */}
      <div className="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#e3e3e3">
          <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
        </svg>
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
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#e3e3e3">
          <path d="M480-80v-80h80q66 0 113-47t47-113v-120h80v120q0 92-64 156t-156 64H480Zm-160 0v-80q-92 0-156-64T80-380v-120h80v120q0 66 47 113t113 47h80ZM80-480v-80h80q0-66 47-113t113-47h240v-80h-240q-92 0-156 64T80-620v140h80Zm720 0v-140q0-92-64-156T600-840H360v80h240q66 0 113 47t47 113v80h80Z"/>
        </svg>
        <div className="section-title-container">Layer Spoofer</div>
        <KeybindSlot keybind="Space" style={{ width: '2.375rem' }} />
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
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#e3e3e3">
          <path d="M197-197q-54-55-85.5-127.5T80-480q0-84 31.5-156.5T197-763l57 57q-44 44-69 102t-25 124q0 67 25 125t69 101l-57 57Zm113-113q-32-33-51-76.5T240-480q0-51 19-94.5t51-75.5l57 57q-22 22-34.5 51T320-480q0 33 12.5 62t34.5 51l-57 57Zm170-90q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm170 90-57-57q22-22 34.5-51t12.5-62q0-33-12.5-62T593-593l57-57q32 32 51 75.5t19 94.5q0 50-19 93.5T650-310Zm113 113-57-57q44-44 69-102t25-124q0-67-25-125t-69-101l57-57q54 54 85.5 126.5T880-480q0 83-31.5 155.5T763-197Z"/>
        </svg>
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
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#e3e3e3">
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
        </svg>
        <div className="section-title-container">Infinite Zoom</div>
        <KeybindSlot keybind="Shift" style={{ width: '2.375rem' }} />
        <KeybindSlot keybind="Scroll" style={{ width: '2.375rem' }} />
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
