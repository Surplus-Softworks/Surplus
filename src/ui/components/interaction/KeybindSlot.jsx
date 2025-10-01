import React from 'react';
import { styles } from '@/ui/components/styles.js';

const KeybindSlot = ({ keybind, style = {} }) => {
  return (
    <div className="keybind-slot" style={{ ...styles.keybindSlot, ...style }}>
      {keybind}
    </div>
  );
};

export default KeybindSlot;
