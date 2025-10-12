import React, { useState } from 'react';
import { ref_addEventListener, ref_removeEventListener } from '@/core/hook';
import { outer } from '@/core/outer';
import { Icons } from '@/ui/components/icons.jsx';

const formatKeyCode = (code) => {
  const keyMap = {
    ShiftRight: 'Right Shift',
    ShiftLeft: 'Left Shift',
    ControlRight: 'Right Ctrl',
    ControlLeft: 'Left Ctrl',
    AltRight: 'Right Alt',
    AltLeft: 'Left Alt',
    Space: 'Space',
    Enter: 'Enter',
    Escape: 'Escape',
  };

  if (keyMap[code]) return keyMap[code];
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  return code;
};

const KeybindSlot = ({ keybind, mode = 'single', style = {}, onClick, editable = false }) => {
  const [isWaiting, setIsWaiting] = useState(false);

  const handleClick = (e) => {
    if (!editable || !onClick) return;
    e.stopPropagation();
    setIsWaiting(true);

    const handleKeyPress = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const newKey = event.code;
      onClick(newKey);
      setIsWaiting(false);

      Reflect.apply(ref_removeEventListener, outer, ['keydown', handleKeyPress, true]);
    };

    Reflect.apply(ref_addEventListener, outer, ['keydown', handleKeyPress, true]);
  };

  if (mode === 'multiple' && Array.isArray(keybind)) {
    return (
      <div className="keybind-slot-container" style={style}>
        {keybind.map((key, index) => (
          <React.Fragment key={index}>
            <div className="keybind-slot">{key}</div>
            {index < keybind.length - 1 && <span className="keybind-slot-separator">+</span>}
          </React.Fragment>
        ))}
      </div>
    );
  }

  const displayText = isWaiting ? '...' : formatKeyCode(keybind);
  const className = `keybind-slot ${editable ? 'keybind-slot-editable' : ''} ${isWaiting ? 'keybind-slot-waiting' : ''}`;

  return (
    <div className={className} style={style} onClick={handleClick}>
      {displayText}
      {editable && !isWaiting && <Icons.Pen_ className="keybind-pen-icon" />}
    </div>
  );
};

export default KeybindSlot;
