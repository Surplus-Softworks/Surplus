import React from 'react';

const Slider = ({ id, label, value, min = 0, max = 100, onChange }) => {
  const sliderValue = ((value - min) / (max - min)) * 100;

  const sliderStyle = {
    background: `linear-gradient(to right, #66db6a 0%, #66db6a ${sliderValue}%, #333 ${sliderValue}%, #3b3b3b 100%)`,
  };

  const handleChange = (e) => {
    e.stopPropagation();
    onChange(parseInt(e.target.value));
  };

  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="checkbox-item slider-container" onClick={handleClick}>
      <label htmlFor={id} style={{ color: '#ddd', fontSize: '0.8125rem', cursor: 'default', pointerEvents: 'none' }}>
        {label}
      </label>
      <input
        type="range"
        className="slider"
        id={id}
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        onInput={handleChange}
        onClick={handleClick}
        onMouseDown={(e) => e.stopPropagation()}
        style={sliderStyle}
      />
    </div>
  );
};

export default Slider;
