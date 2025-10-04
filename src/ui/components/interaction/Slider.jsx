import React, { useState, useRef, useEffect } from 'react';

const Slider = ({ id, label, value, min = 0, max = 100, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const sliderValue = ((value - min) / (max - min)) * 100;

  const sliderStyle = {
    background: `linear-gradient(to right, #6edb72 0%, #58c05c ${sliderValue}%, #333 ${sliderValue}%, #333 100%)`,
  };

  const handleChange = (e) => {
    e.stopPropagation();
    onChange(parseInt(e.target.value));
  };

  const handleClick = (e) => {
    e.stopPropagation();
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="checkbox-item slider-container" onClick={handleClick}>
      <label htmlFor={id} style={{ color: '#ddd', fontSize: '0.8125rem', cursor: 'default', pointerEvents: 'none' }}>
        {label}
      </label>
      <input
        ref={sliderRef}
        type="range"
        className={`slider ${isDragging ? 'slider-dragging' : ''}`}
        id={id}
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        onInput={handleChange}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        style={sliderStyle}
      />
    </div>
  );
};

export default Slider;
