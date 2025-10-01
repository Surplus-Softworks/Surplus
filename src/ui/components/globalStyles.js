export const globalStylesheet = `
  * {
    font-family: 'GothamPro', sans-serif;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  *:focus-visible {
    outline: none;
  }

  .header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #5b5b5b 50%, transparent);
  }

  .header:hover {
    background: #1b1b1b !important;
    transition: all 0.2s ease;
  }

  .header:active {
    background: #1d1d1d !important;
    transition: all 0.2s ease;
  }

  .nav-tab:active {
    transform: scale(0.95);
  }

  .nav-tab.active {
    color: #fff;
    border: 1px solid #6f6f6f;
    transform: translateY(-1px);
  }

  .close-btn:hover {
    color: #fff;
    rotate: 45deg;
    scale: 0.95;
    transition: all 0.2s ease;
  }

  .group:hover {
    background: rgba(255,255,255,.02);
    transform: translateY(-1px);
  }

  .group .section-title {
    margin-top: 10px;
  }

  .section-title .checkbox-item {
    border: none;
    background: none;
    padding: 4px 6px;
    margin: 0;
  }

  .section-title .checkbox-item:hover {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
  }

  .section-title label {
    font-size: 12px;
    color: #ddd !important;
  }

  .subsection-title::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    height: 1px;
    width: 6px;
    background: #666;
  }

  .subgroup .checkbox-item {
    margin-right: 6px;
  }

  .checkbox-item:hover {
    background: rgba(255, 255, 255, 0.05);
    transition: background 0.2s ease;
  }

  .checkbox-item:active {
    transform: scale(0.95);
  }

  .aimbot-dot {
    position: fixed;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: red;
    border: 2px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 8px rgba(255, 0, 0, 0.5);
    transform: translate(-50%, -50%);
    pointer-events: none;
    display: none;
    z-index: 2147483647;
  }

  input[type='checkbox'] {
    appearance: none;
    width: 16px;
    height: 14px;
    border: 2px solid #888;
    border-radius: 4px;
    background: #222;
    position: relative;
    transition: all 0.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    cursor: pointer;
  }

  input[type='checkbox']:checked {
    background: #66db6a;
    border-color: #66db6a;
    box-shadow: 0 0 10px rgba(102, 219, 106, 0.12);
  }

  input[type='range'] {
    appearance: none;
    width: 90px;
    height: 5px;
    background: #333;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
  }

  input[type='range']::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #888;
    border: 2px solid #2c2c2c;
    border-radius: 50%;
    cursor: pointer;
  }

  input[type='range']::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #888;
    border: 2px solid #2c2c2c;
    border-radius: 50%;
    cursor: pointer;
  }

  input[type='range']::-webkit-slider-thumb:hover,
  input[type='range']::-moz-range-thumb:hover {
    background: #bbb;
  }

  input[type='range']::-webkit-slider-thumb:active,
  input[type='range']::-moz-range-thumb:active {
    background: #ddd;
  }

  .discord-link:hover {
    background: rgba(88, 101, 242, 0.4);
    transition: all 0.3s ease-out;
  }

  .website-link:hover {
    background: rgba(105, 247, 76, 0.20);
    transition: all 0.3s ease-out;
  }

  .help-title svg {
    height: 16px;
    width: 16px;
    fill: #e3e3e3;
  }

  .section-title svg {
    height: 16px;
    width: 16px;
    fill: #e3e3e3;
  }

  li::marker {
    color: rgb(192, 192, 192);
  }
`;
