// Immediately create and insert loader
(function() {
  // Create loader as early as possible
  const settings = window.loaderSettings || {
    loaderType: 'text',
    customText: 'Loading...',
    loaderStyle: 'bar',
    fadeOutSpeed: 500,
    backgroundColor: '#000000',
    textColor: '#ffffff',
    barColor: '#ffffff',
    barBackground: '#333333',
    barWidth: '70%',
    barHeight: '5px'
  };

  // Create loader elements
  const loaderWrapper = document.createElement('div');
  loaderWrapper.id = 'custom-loader';
  loaderWrapper.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${settings.backgroundColor};
    z-index: 9999;
    opacity: 1;
    transition: opacity ${settings.fadeOutSpeed}ms ease;
  `;

  const loaderContent = document.createElement('div');
  loaderContent.style.cssText = `
    display: flex;
    align-items: center;
    flex-direction: ${settings.loaderStyle === 'bar' ? 'column' : 'row'};
    gap: 10px;
    font-family: ${settings.fontFamily || 'inherit'};
    color: ${settings.textColor};
    font-size: ${settings.textSize || '16px'};
  `;

  // Add loader content based on settings
  if (settings.loaderType === 'image' && settings.customLogo) {
    const logo = document.createElement('img');
    logo.src = settings.customLogo;
    logo.alt = 'Loading';
    logo.style.cssText = 'max-height: 40px;';
    loaderContent.appendChild(logo);
  } else {
    const text = document.createElement('div');
    text.innerText = settings.customText || 'Loading...';
    loaderContent.appendChild(text);
  }

  // Add progress indicator
  if (settings.loaderStyle === 'bar') {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      width: ${settings.barWidth};
      height: ${settings.barHeight};
      background: ${settings.barBackground};
      border-radius: 5px;
      overflow: hidden;
    `;

    const progress = document.createElement('div');
    progress.style.cssText = `
      width: 0%;
      height: 100%;
      background: ${settings.barColor};
      transition: width 0.3s ease;
    `;
    
    progressBar.appendChild(progress);
    loaderContent.appendChild(progressBar);

    // Animate progress
    let progressInterval = setInterval(() => {
      const currentWidth = parseFloat(progress.style.width) || 0;
      if (currentWidth < 95) {
        progress.style.width = `${currentWidth + 5}%`;
      }
    }, 200);

    // Clean up on load
    window.addEventListener('load', () => {
      clearInterval(progressInterval);
      progress.style.width = '100%';
      setTimeout(() => {
        loaderWrapper.style.opacity = '0';
        setTimeout(() => loaderWrapper.remove(), settings.fadeOutSpeed);
      }, settings.fadeOutSpeed);
    });
  } else if (settings.loaderStyle === 'circle') {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleEl);

    const circle = document.createElement('div');
    circle.style.cssText = `
      width: ${settings.circleSize || '40px'};
      height: ${settings.circleSize || '40px'};
      border: 3px solid ${settings.circleColor || '#ffffff'};
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s linear infinite;
    `;
    loaderContent.appendChild(circle);

    // Clean up on load
    window.addEventListener('load', () => {
      setTimeout(() => {
        loaderWrapper.style.opacity = '0';
        setTimeout(() => loaderWrapper.remove(), settings.fadeOutSpeed);
      }, settings.fadeOutSpeed);
    });
  }

  loaderWrapper.appendChild(loaderContent);
  
  // Insert loader immediately
  if (document.body) {
    document.body.appendChild(loaderWrapper);
  } else {
    // If body isn't ready, wait for it
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(loaderWrapper);
    });
  }
})();
