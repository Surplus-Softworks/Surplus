import React from 'react';
import { styles } from '@/ui/components/styles.js';
import Checkbox from '@/ui/components/interaction/Checkbox.jsx';
import Slider from '@/ui/components/interaction/Slider.jsx';
import KeybindSlot from '@/ui/components/interaction/KeybindSlot.jsx';

const Main = ({ settings, onSettingChange }) => {
  return (
    <div className="section" style={styles.section}>
      {/* Aimbot Section */}
      <div style={styles.sectionTitle}>
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#e3e3e3">
          <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 280q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
        </svg>
        <div style={styles.sectionTitleContainer}>Aimbot</div>
        <KeybindSlot keybind="B" />
        <Checkbox
          id="aim-enable"
          label="Enabled"
          checked={settings.aimbot_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.aimbot_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '4px 6px', margin: 0 }}
        />
      </div>
      <div style={styles.group}>
        <Checkbox
          id="target-knocked"
          label="Target Knocked"
          checked={settings.aimbot_.targetKnocked_}
          onChange={(v) => onSettingChange((s) => (s.aimbot_.targetKnocked_ = v))}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Checkbox
            id="sticky-target"
            label="Sticky Target"
            checked={settings.aimbot_.stickyTarget_}
            onChange={(v) => onSettingChange((s) => (s.aimbot_.stickyTarget_ = v))}
          />
          <KeybindSlot keybind="N" style={{ marginLeft: '10px' }} />
        </div>
      </div>

      {/* Melee Lock Section */}
      <div style={styles.sectionTitle}>
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" width="16px" fill="#ffffff" viewBox="0 0 445.167 445.167">
          <path d="M341.096,330.36l-11.788-25.336c-4.408-9.48-14.788-16.102-25.244-16.102h-33.804V70.595c0-5.453-2.346-12.943-5.457-17.423 l-33.55-48.314C229.109,1.771,225.95,0,222.584,0s-6.526,1.771-8.67,4.858l-33.55,48.313c-3.11,4.479-5.456,11.97-5.456,17.423 v218.328h-33.804c-10.453,0-20.833,6.619-25.243,16.097L104.07,330.36c-4.66,10.016-0.318,21.911,9.696,26.57 c10.014,4.659,21.91,0.319,26.57-9.695l8.52-18.313h41.912l8.426,40.698c-10.87,7.47-18.015,19.985-18.015,34.142 c0,22.83,18.574,41.404,41.405,41.404c22.831,0,41.405-18.574,41.405-41.404c0-14.157-7.145-26.672-18.015-34.142l8.425-40.698 h41.911l8.521,18.313c3.39,7.285,10.606,11.568,18.146,11.567c2.824,0,5.695-0.602,8.425-1.872 C341.416,352.271,345.757,340.376,341.096,330.36z"/>
        </svg>
        <div style={styles.sectionTitleContainer}>Melee Lock</div>
        <Checkbox
          id="melee-lock"
          label="Enabled"
          checked={settings.meleeLock_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.meleeLock_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '4px 6px', margin: 0 }}
        />
      </div>
      <div style={styles.group}>
        <Checkbox
          id="auto-melee"
          label="Auto Equip"
          checked={settings.meleeLock_.autoMelee_}
          onChange={(v) => onSettingChange((s) => (s.meleeLock_.autoMelee_ = v))}
        />
      </div>

      {/* Auto Switch Section */}
      <div style={styles.sectionTitle}>
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#e3e3e3">
          <path d="m320-160-56-57 103-103H80v-80h287L264-503l56-57 200 200-200 200Zm320-240L440-600l200-200 56 57-103 103h287v80H593l103 103-56 57Z"/>
        </svg>
        <div style={styles.sectionTitleContainer}>Auto Switch</div>
        <Checkbox
          id="autoswitch-enable"
          label="Enabled"
          checked={settings.autoSwitch_.enabled_}
          onChange={(v) => onSettingChange((s) => (s.autoSwitch_.enabled_ = v))}
          style={{ border: 'none', background: 'none', padding: '4px 6px', margin: 0 }}
        />
      </div>
      <div style={styles.group}>
        <Checkbox
          id="useonegun"
          label="Use One Gun"
          checked={settings.autoSwitch_.useOneGun_}
          onChange={(v) => onSettingChange((s) => (s.autoSwitch_.useOneGun_ = v))}
        />
      </div>

      {/* Semi Auto Section */}
      <div style={styles.sectionTitle}>
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#e3e3e3">
          <path d="m226-559 78 33q14-28 29-54t33-52l-56-11-84 84Zm142 83 114 113q42-16 90-49t90-75q70-70 109.5-155.5T806-800q-72-5-158 34.5T492-656q-42 42-75 90t-49 90Zm178-65q-23-23-23-56.5t23-56.5q23-23 57-23t57 23q23 23 23 56.5T660-541q-23 23-57 23t-57-23Zm19 321 84-84-11-56q-26 18-52 32.5T532-299l33 79Zm313-653q19 121-23.5 235.5T708-419l20 99q4 20-2 39t-20 33L538-80l-84-197-171-171-197-84 167-168q14-14 33.5-20t39.5-2l99 20q104-104 218-147t235-24ZM157-321q35-35 85.5-35.5T328-322q35 35 34.5 85.5T327-151q-25 25-83.5 43T82-76q14-103 32-161.5t43-83.5Zm57 56q-10 10-20 36.5T180-175q27-4 53.5-13.5T270-208q12-12 13-29t-11-29q-12-12-29-11.5T214-265Z"/>
        </svg>
        <div style={styles.sectionTitleContainer}>Semi Auto</div>
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
