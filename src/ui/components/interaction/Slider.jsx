import React, { useState, useRef, useEffect, useCallback } from 'react';

const Slider = ({ id, label, value, min = 0, max = 100, warning = false, onChange }) => {
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

  const startDragging = useCallback(() => setIsDragging(true), []);
  const stopDragging = useCallback(() => setIsDragging(false), []);

  const handleMouseDown = useCallback(
    (e) => {
      e.stopPropagation();
      startDragging();
    },
    [startDragging]
  );

  const handleTouchStart = useCallback(
    (e) => {
      e.stopPropagation();
      startDragging();
    },
    [startDragging]
  );

  const handleMouseUp = useCallback(
    (e) => {
      if (e) {
        e.stopPropagation();
      }
      stopDragging();
    },
    [stopDragging]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (e) {
        e.stopPropagation();
      }
      stopDragging();
    },
    [stopDragging]
  );

  return (
    <div className="checkbox-item slider-container" onClick={handleClick}>
      <label
        htmlFor={id}
        style={{
          color: '#ddd',
          fontSize: '0.8125rem',
          cursor: 'default',
          pointerEvents: 'none',
        }}
      >
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
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={sliderStyle}
      />
      {warning && (
        <span className="risky-label" style={{ marginLeft: '0.5rem' }}>
          RISKY!!!
        </span>
      )}
    </div>
  );
};

export const WarningSlider = (props) => {
  const currentValue = props.value;
  return (
    <Slider
      {...props}
      value={currentValue}
      warning={props.shouldWarning?.(currentValue) ?? false}
    />
  );
};

export default Slider;
