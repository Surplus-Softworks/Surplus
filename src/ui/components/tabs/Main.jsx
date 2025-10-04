import React from 'react';
import Checkbox from '@/ui/components/interaction/Checkbox.jsx';
import Slider from '@/ui/components/interaction/Slider.jsx';
import KeybindSlot from '@/ui/components/interaction/KeybindSlot.jsx';
import { Icons } from '@/ui/components/icons.jsx';

const Main = ({ settings, onSettingChange }) => {
  return (
    <div className="section">
      {/* Aimbot Section */}
      <div className="section-title">
        <Icons.Aimbot size={16} />
        <div className="section-title-container">Aimbot</div>
        <KeybindSlot keybind="B" />
        <Checkbox
          id="aim-enable"
          label="Enabled"
          checked={settings.aimbot_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.aimbot_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '4px 6px', margin: 0 }}
        />
      </div>
      <div className="group">
        <Checkbox
          id="target-knocked"
          label="Target Knocked"
          checked={settings.aimbot_.targetKnocked_}
          onChange={(v) => onSettingChange((s) => (s.aimbot_.targetKnocked_ = v))}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Checkbox
            id="sticky-target"
            label="Sticky Target"
            checked={settings.aimbot_.stickyTarget_}
            onChange={(v) => onSettingChange((s) => (s.aimbot_.stickyTarget_ = v))}
          />
          <KeybindSlot keybind="N" />
        </div>
      </div>

      {/* Melee Lock Section */}
      <div className="section-title">
        <Icons.MeleeLock size={16} />
        <div className="section-title-container">Melee Lock</div>
        <Checkbox
          id="melee-lock"
          label="Enabled"
          checked={settings.meleeLock_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.meleeLock_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '4px 6px', margin: 0 }}
        />
      </div>
      <div className="group">
        <Checkbox
          id="auto-melee"
          label="Auto Equip"
          checked={settings.meleeLock_.autoMelee_}
          onChange={(v) => onSettingChange((s) => (s.meleeLock_.autoMelee_ = v))}
        />
      </div>

      {/* Auto Switch Section */}
      <div className="section-title">
        <Icons.AutoSwitch size={16} />
        <div className="section-title-container">Auto Switch</div>
        <Checkbox
          id="autoswitch-enable"
          label="Enabled"
          checked={settings.autoSwitch_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.autoSwitch_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '4px 6px', margin: 0 }}
        />
      </div>
      <div className="group">
        <Checkbox
          id="useonegun"
          label="Use One Gun"
          checked={settings.autoSwitch_.useOneGun_}
          onChange={(v) => onSettingChange((s) => (s.autoSwitch_.useOneGun_ = v))}
        />
      </div>

      {/* Semi Auto Section */}
      <div className="section-title">
        <Icons.SemiAuto size={16} />
        <div className="section-title-container">Semi Auto</div>
        <Checkbox
          id="semiauto-enable"
          label="Enabled"
          checked={settings.autoFire_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.autoFire_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '4px 6px', margin: 0 }}
        />
      </div>
    </div>
  );
};

export default Main;
