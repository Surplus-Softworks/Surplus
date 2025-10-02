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

  .popup {
    user-select: none;
    position: relative;
    background: #131313;
    border-radius: 0.9375rem;
    box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.3);
    width: 21.25rem;
    overflow: hidden;
    border: 0.0625rem solid #333;
    transition: all 0.3s ease-out;
  }

  .header {
    background: #181818;
    padding: 0.625rem;
    border-bottom: 0.0625rem solid #313131;
    user-select: none;
    transition: all 0.1s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .header::after {
    content: '';
    position: absolute;
    bottom: -0.0625rem;
    left: 0;
    right: 0;
    height: 0.0625rem;
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

  .menu-icon {
    height: 1.25rem;
    pointer-events: none;
    position: absolute;
    left: 0.375rem;
    top: 0.4375rem;
  }

  .navbar {
    background: #161616;
    padding: 0.5rem;
    border-bottom: 0.0625rem solid #333;
  }

  .title {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .credit {
    font-size: 0.75rem;
    font-style: italic;
    color: rgba(255, 255, 255, 0.45);
    text-align: center;
    display: block;
    position: relative;
    z-index: 1;
  }

  .nav-tabs {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .nav-tab {
    padding: 0.375rem 0.75rem;
    background: #202020;
    border: none;
    border-radius: 0.28125rem;
    color: #bababa;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  .nav-tab:active {
    transform: scale(0.95);
  }

  .nav-tab.active {
    color: #fff;
    border: 0.0625rem solid #6f6f6f;
    transform: translateY(-0.0625rem);
  }

  .close-btn {
    position: absolute;
    top: 0.0625rem;
    right: 0.5rem;
    cursor: pointer;
    border: none;
    background: none;
    font-size: 1.25rem;
    color: #666;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    color: #fff;
    rotate: 45deg;
    scale: 0.95;
    transition: all 0.2s ease;
  }

  .content-container {
    padding-top: 0.625rem;
    padding-left: 1rem;
    padding-right: 1rem;
    display: none;
  }

  .content-container.active {
    display: block;
  }

  .section {
    margin-bottom: 1.25rem;
  }

  .section-title {
    color: #fff;
    font-size: 0.8125rem;
    font-weight: 600;
    margin: 0 0 0.375rem 0;
    letter-spacing: 0.03125rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.375rem;
  }

  .section-title svg {
    height: 1rem;
    width: 1rem;
    fill: #e3e3e3;
  }

  .section-title .checkbox-item {
    border: none;
    background: none;
    padding: 0.25rem 0.375rem;
    margin: 0;
  }

  .section-title .checkbox-item:hover {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.375rem;
  }

  .section-title label {
    font-size: 0.75rem;
    color: #ddd !important;
  }

  .section-title-container {
    flex-grow: 1;
  }

  .subsection-title {
    color: #bbb;
    font-size: 0.75rem;
    font-weight: 600;
    margin: 0.875rem 0 0.25rem 0.9375rem;
    position: relative;
  }

  .subsection-title::before {
    content: '';
    position: absolute;
    left: -0.625rem;
    top: 50%;
    height: 0.0625rem;
    width: 0.375rem;
    background: #666;
  }

  .group {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0.5rem;
    padding: 0.625rem;
    margin-bottom: 0.625rem;
    gap: 0.375rem;
    border: 0.0625rem solid rgba(255,255,255,0.1);
    transition: all 0.1s ease, transform 0.1s ease;
  }

  .group:hover {
    background: rgba(255,255,255,.02);
    transform: translateY(-0.0625rem);
  }

  .group .section-title {
    margin-top: 0.625rem;
  }

  .subgroup {
    margin-left: 0.9375rem;
    border-left: 0.125rem solid rgba(255, 255, 255, 0.1);
    padding-left: 0.625rem;
  }

  .subgroup .checkbox-item {
    margin-right: 0.375rem;
  }

  .checkbox-item {
    border: 0.0625rem solid #2c2c2c;
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.5rem 0.375rem 0.5rem;
    border-radius: 0.375rem;
    transition: background 0.2s ease;
    cursor: pointer;
    width: fit-content;
    background-color: rgba(0, 0, 0, 0.04);
  }

  .checkbox-item:hover {
    background: rgba(255, 255, 255, 0.05);
    transition: background 0.2s ease;
  }

  .checkbox-item:active {
    transform: scale(0.95);
  }

  .checkbox-item-label {
    color: #ddd;
    font-size: 0.8125rem;
    margin-left: 0.5rem;
    cursor: pointer;
    pointer-events: none;
  }

  .checkbox {
    appearance: none;
    width: 1rem;
    height: 0.875rem;
    border-width: 0.125rem;
    border-style: solid;
    border-color: #888;
    border-radius: 0.25rem;
    background: #222;
    position: relative;
    transition: all 0.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    cursor: pointer;
  }

  .checkbox-checked {
    background: #66db6a;
    border-color: #66db6a;
    box-shadow: 0 0 0.625rem rgba(102, 219, 106, 0.12);
  }

  .slider-container {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .slider {
    appearance: none;
    width: 5.625rem;
    height: 0.3125rem;
    background: #333;
    border-radius: 0.3125rem;
    outline: none;
    cursor: pointer;
  }

  .keybind-slot {
    width: 1.75rem;
    height: 0.75rem;
    background-color: #2a2a2a;
    color: #888;
    font-size: 0.5625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
  }

  .help-section {
    font-size: 0.8125rem;
  }

  .help-title {
    color: white;
    font-size: 0.9375rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  .help-title svg {
    height: 1rem;
    width: 1rem;
    fill: #e3e3e3;
  }

  .help-panel {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    padding: 0.625rem;
    margin-bottom: 0.75rem;
    border: 0.0625rem solid rgba(255, 255, 255, 0.08);
  }

  .keybind-button {
    background: #333;
    color: #fff;
    padding: 0.1875rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .keybind-description {
    margin-left: 0.625rem;
    color: #fff;
    font-size: 0.8125rem;
  }

  .keybind-help-text {
    color: #bbb;
    font-size: 0.75rem;
    line-height: 1.4;
    margin: 0;
  }

  .discord-panel {
    background: rgba(88, 101, 242, 0.15);
    border-radius: 0.5rem;
    padding: 0.625rem;
    margin-bottom: 0.75rem;
    border: 0.0625rem solid rgba(88, 101, 242, 0.3);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 9.375rem;
  }

  .website-panel {
    background: rgba(105, 247, 76, 0.1);
    border-radius: 0.5rem;
    padding: 0.625rem;
    margin-bottom: 0.75rem;
    border: 0.0625rem solid rgba(105, 247, 76, 0.3);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 9.375rem;
  }

  .discord-link {
    display: block;
    background: rgba(88, 101, 242, 0.3);
    color: #fff;
    text-decoration: none;
    padding: 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    text-align: center;
    font-weight: 600;
    border: 0.0625rem solid rgba(88, 101, 242, 0.5);
    transition: all 0.3s ease-out;
    margin-top: auto;
  }

  .discord-link:hover {
    background: rgba(88, 101, 242, 0.4);
    transition: all 0.3s ease-out;
  }

  .website-link {
    display: block;
    background: rgba(105, 247, 76, 0.15);
    color: #fff;
    text-decoration: none;
    padding: 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    text-align: center;
    font-weight: 600;
    border: 0.0625rem solid rgba(105, 247, 76, 0.3);
    transition: all 0.3s ease-out;
    margin-top: auto;
  }

  .website-link:hover {
    background: rgba(105, 247, 76, 0.20);
    transition: all 0.3s ease-out;
  }

  .credits-panel {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    padding: 0.625rem;
    margin-bottom: 0.75rem;
    border: 0.0625rem solid rgba(255, 255, 255, 0.08);
  }

  .credits-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    color: #ddd;
    font-size: 0.8125rem;
  }

  .credit-item {
    flex: 1;
    min-width: 7.5rem;
  }

  .credit-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #fff;
  }

  .section-subtitle {
    color: #fff;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .features-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .feature-item {
    display: flex;
    align-items: center;
    border-radius: 0.375rem;
  }

  .feature-name {
    color: #fff;
    font-size: 0.8125rem;
    margin-right: 0.375rem;
  }

  .community-container {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .aimbot-dot {
    position: fixed;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: red;
    border: 0.125rem solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 0.5rem rgba(255, 0, 0, 0.5);
    transform: translate(-50%, -50%);
    pointer-events: none;
    display: none;
    z-index: 2147483647;
  }

  input[type='checkbox'] {
    appearance: none;
    width: 1rem;
    height: 0.875rem;
    border: 0.125rem solid #888;
    border-radius: 0.25rem;
    background: #222;
    position: relative;
    transition: all 0.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    cursor: pointer;
  }

  input[type='checkbox']:checked {
    background: #66db6a;
    border-color: #66db6a;
    box-shadow: 0 0 0.625rem rgba(102, 219, 106, 0.12);
  }

  input[type='range'] {
    appearance: none;
    width: 5.625rem;
    height: 0.3125rem;
    background: #333;
    border-radius: 0.3125rem;
    outline: none;
    cursor: pointer;
  }

  input[type='range']::-webkit-slider-thumb {
    appearance: none;
    width: 1rem;
    height: 1rem;
    background: #888;
    border: 0.125rem solid #2c2c2c;
    border-radius: 50%;
    cursor: pointer;
  }

  input[type='range']::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    background: #888;
    border: 0.125rem solid #2c2c2c;
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

  li::marker {
    color: rgb(192, 192, 192);
  }
`;
