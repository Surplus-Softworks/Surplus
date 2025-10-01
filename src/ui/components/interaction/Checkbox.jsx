import React from 'react';
import { styles } from '@/ui/components/styles.js';

const Checkbox = ({ id, label, checked, onChange, style = {} }) => {
  const handleClick = (e) => {
    if (e.target.type !== 'checkbox') {
      onChange(!checked);
    }
  };

  return (
    <div
      className="checkbox-item"
      style={{ ...styles.checkboxItem, ...style }}
      onClick={handleClick}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.checked);
        }}
        style={{
          ...styles.checkbox,
          ...(checked ? styles.checkboxChecked : {}),
        }}
      />
      <label
        htmlFor={id}
        style={styles.checkboxItemLabel}
        onClick={(e) => e.stopPropagation()}
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
