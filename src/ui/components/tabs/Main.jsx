import React from 'react';
import Checkbox from '@/ui/components/interaction/Checkbox.jsx';
import Slider from '@/ui/components/interaction/Slider.jsx';
import SectionTitle from '@/ui/components/layout/SectionTitle.jsx';
import { Icons } from '@/ui/components/icons.jsx';
import KeybindSlot from '@/ui/components/interaction/KeybindSlot.jsx';

const Main = ({ settings, onSettingChange }) => {
  return (
    <div className="section">
      <SectionTitle
        icon={Icons.Aimbot}
        label="Aimbot"
        keybind="B"
        enabled={settings.aimbot_.enabled_}
        onEnabledChange={(v) => onSettingChange((s) => (s.aimbot_.enabled_ = v))}
      />
      <div className={`group ${!settings.aimbot_.enabled_ ? 'hidden' : ''}`}>
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
        <Checkbox
          id="aimbot-show-dot"
          label="Aimbot Dot"
          checked={settings.aimbot_.showDot_}
          onChange={(v) => onSettingChange((s) => (s.aimbot_.showDot_ = v))}
        />
      </div>

      <SectionTitle
        icon={Icons.MeleeLock}
        label="Melee Lock"
        enabled={settings.meleeLock_.enabled_}
        onEnabledChange={(v) => onSettingChange((s) => (s.meleeLock_.enabled_ = v))}
        warning={true}
      />
      <div className={`group ${!settings.meleeLock_.enabled_ ? 'hidden' : ''}`}>
        <Checkbox
          id="auto-melee"
          label="Auto Melee"
          checked={settings.meleeLock_.autoMelee_}
          onChange={(v) => onSettingChange((s) => (s.meleeLock_.autoMelee_ = v))}
        />
      </div>

      <SectionTitle
        icon={Icons.AutoSwitch}
        label="Auto Switch"
        enabled={settings.autoSwitch_.enabled_}
        onEnabledChange={(v) => onSettingChange((s) => (s.autoSwitch_.enabled_ = v))}
      />
      <div className={`group ${!settings.autoSwitch_.enabled_ ? 'hidden' : ''}`}>
        <Checkbox
          id="useonegun"
          label="Use One Gun"
          checked={settings.autoSwitch_.useOneGun_}
          onChange={(v) => onSettingChange((s) => (s.autoSwitch_.useOneGun_ = v))}
        />
      </div>

      <SectionTitle
        icon={Icons.SemiAuto}
        label="Semi Auto"
        enabled={settings.autoFire_.enabled_}
        onEnabledChange={(v) => onSettingChange((s) => (s.autoFire_.enabled_ = v))}
      />
    </div>
  );
};

export default Main;
