import React from 'react';
import { styles } from '@/ui/components/styles.js';
import KeybindSlot from '@/ui/components/interaction/KeybindSlot.jsx';

const Help = () => {
  return (
    <div className="section help-section" style={{ ...styles.section, ...styles.helpSection }}>
      <div className="help-title" style={styles.helpTitle}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" style={{ height: '16px', width: '16px', fill: '#e3e3e3' }}>
          <path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-10 34.5T512-534q-44 33-57 54.5T442-394Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
        </svg>
        <span>Controls & Information</span>
      </div>

      <div style={{ ...styles.helpPanel, marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <div style={styles.keybindButton}>Right Shift</div>
          <span style={styles.keybindDescription}>Show/Hide Menu</span>
        </div>
        <p style={styles.keybindHelpText}>
          Press <strong>Right Shift</strong> at any time to toggle the entire menu visibility.
        </p>
      </div>

      <div style={styles.sectionSubtitle}>Feature Keybinds</div>
      <div style={styles.helpPanel}>
        <p style={{ ...styles.keybindHelpText, marginBottom: '8px' }}>
          Each feature's keybind is displayed next to its name in the menu:
        </p>
        <div style={styles.featuresContainer}>
          <div style={styles.featureItem}>
            <span style={styles.featureName}>Aimbot</span>
            <KeybindSlot keybind="B" />
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureName}>Spinbot</span>
            <KeybindSlot keybind="H" />
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureName}>Layer Spoofer</span>
            <KeybindSlot keybind="T" />
          </div>
        </div>
      </div>

      <div className="help-title" style={{ ...styles.helpTitle, marginTop: '16px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" style={{ height: '16px', width: '16px', fill: '#e3e3e3' }}>
          <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Zm80 0h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
        </svg>
        <span>Community & Support</span>
      </div>

      <div style={styles.communityContainer}>
        <div style={styles.discordPanel}>
          <div style={{ display: 'flex', marginBottom: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: '#5865F2' }}>
              <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.02.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/>
            </svg>
            <span style={{ marginLeft: '6px', color: '#fff', fontSize: '14px', fontWeight: 600 }}>Discord Server</span>
          </div>
          <p style={{ color: '#bbb', fontSize: '12px', lineHeight: 1.4, marginBottom: '10px', flexGrow: 1 }}>
            Join for support, bug reports, suggestions, and announcements:
          </p>
          <a
            href="https://discord.gg/Bc2FDqddmH"
            target="_blank"
            rel="noopener noreferrer"
            className="discord-link"
            style={styles.discordLink}
          >
            discord.gg
          </a>
        </div>

        <div style={styles.websitePanel}>
          <div style={{ display: 'flex', marginBottom: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" style={{ width: '18px', height: '18px', fill: '#69f74c' }}>
              <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
            </svg>
            <span style={{ marginLeft: '6px', color: '#fff', fontSize: '14px', fontWeight: 600 }}>Official Website</span>
          </div>
          <p style={{ color: '#bbb', fontSize: '12px', lineHeight: 1.4, marginBottom: '10px', flexGrow: 1 }}>
            Visit our website for the latest updates and a backup Discord invite link:
          </p>
          <a
            href="https://s.urpl.us"
            target="_blank"
            rel="noopener noreferrer"
            className="website-link"
            style={styles.websiteLink}
          >
            s.urpl.us
          </a>
        </div>
      </div>

      <div className="help-title" style={styles.helpTitle}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" style={{ height: '16px', width: '16px', fill: '#e3e3e3' }}>
          <path d="M479.5-144q-140.5 0-238-41.85T144-288v-384q0-60 98-102t237.5-42q139.5 0 238 42T816-672v384q0 60.3-98 102.15Q620-144 479.5-144Zm.47-456Q566-600 646-621.5t98-50.5q-18-28-98.5-50t-165.53-22Q394-744 313.5-722T216-672q17 29 96.5 50.5T479.97-600Zm.03 192q42 0 80-4.5t71.5-12.5q33.5-8 62-20.5T744-474v-109q-24.25 13.22-53.62 23.61Q661-549 627.17-542.15q-33.83 6.85-71 10.5Q519-528 479.5-528t-77.11-3.65q-37.62-3.65-71-10.5Q298-549 268.5-559.5 239-570 216-583v109q22.41 15.94 50.21 28.47Q294-433 327.5-425q33.5 8 72 12.5T480-408Zm.32 192q43.32 0 88.05-6.4 44.73-6.39 82.4-16.9 37.67-10.5 63.09-23.75Q739.29-276.3 744-290v-101q-24.25 13.22-53.62 23.61Q661-357 627.17-350.15q-33.83 6.85-71 10.5Q519-336 479.5-336t-77.11-3.65q-37.62-3.65-71-10.5Q298-357 268.5-367.5 239-378 216-391v103q5 13 30.5 26t63 23q37.5 10 82.5 16.5t88.32 6.5Z"/>
        </svg>
        <span>Credits</span>
      </div>
      <div style={styles.creditsPanel}>
        <div style={styles.creditsContainer}>
          <div style={styles.creditItem}>
            <div style={styles.creditName}>mahdi</div>
            <div>Developer, Designer</div>
          </div>
          <div style={styles.creditItem}>
            <div style={styles.creditName}>noam</div>
            <div>Developer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
