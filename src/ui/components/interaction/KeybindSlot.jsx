import React from 'react';

const KeybindSlot = ({ keybind, mode = 'single', style = {} }) => {
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

  return (
    <div className="keybind-slot" style={style}>
      {keybind}
    </div>
  );
};

export default KeybindSlot;
