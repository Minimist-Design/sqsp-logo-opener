

(function () {

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleEl);

  document.addEventListener('DOMContentLoaded', function () {
    // Get settings from global variable
    const s = window.loaderSettings;
    if (!s) {
      console.warn('No loaderSettings found. Loader will not run.');
      return;
    }

 
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
      background: ${s.backgroundColor};
      z-index: 9999;
      transition: opacity ${s.fadeOutSpeed}ms ease;
    `;

  
    const loaderContent = document.createElement('div');
    loaderContent.style.cssText = `
      display: flex;
      align-items: center;
      flex-direction: ${s.loaderStyle === 'bar' ? 'column' : 'row'};
      gap: 10px;
      font-family: ${s.fontFamily};
      color: ${s.textColor};
      font-size: ${s.textSize};
    `;


    if (s.loaderType === 'image') {
      const logo = document.createElement('img');
      logo.src = s.customLogo;
      logo.alt = 'Loading';
      logo.style.cssText = 'max-height: 40px;';
      loaderContent.appendChild(logo);
    } else if (s.loaderType === 'text') {
      const text = document.createElement('div');
      text.innerText = s.customText;
      loaderContent.appendChild(text);
    }


    if (s.loaderStyle === 'circle') {
      // Circle
      const circle = document.createElement('div');
      circle.style.cssText = `
        width: ${s.circleSize};
        height: ${s.circleSize};
        border: 3px solid ${s.circleColor};
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
      `;
      loaderContent.appendChild(circle);

      window.addEventListener('load', () => {
        setTimeout(() => {
          loaderWrapper.style.opacity = '0';
          setTimeout(() => {
            loaderWrapper.remove();
            // Reveal the page after loader is removed
            document.body.style.visibility = 'visible';
          }, s.fadeOutSpeed);
        }, s.fadeOutSpeed);
      });

    } else if (s.loaderStyle === 'bar') {
      // Progress bar container
      const progressBar = document.createElement('div');
      progressBar.style.cssText = `
        width: ${s.barWidth};
        height: ${s.barHeight};
        background: ${s.barBackground};
        position: relative;
        overflow: hidden;
        border-radius: 5px;
      `;
      // Progress fill
      const progress = document.createElement('div');
      progress.style.cssText = `
        width: 0%;
        height: 100%;
        background: ${s.barColor};
        transition: width 0.3s ease;
      `;
      progressBar.appendChild(progress);
      loaderContent.appendChild(progressBar);

      let progressInterval = setInterval(() => {
        const currentWidth = parseFloat(progress.style.width) || 0;
        if (currentWidth < 95) {
          progress.style.width = (currentWidth + 5) + '%';
        }
      }, 200);

      window.addEventListener('load', () => {
        clearInterval(progressInterval);
        progress.style.width = '100%';
        setTimeout(() => {
          loaderWrapper.style.opacity = '0';
          setTimeout(() => {
            loaderWrapper.remove();
            // Reveal the page
            document.body.style.visibility = 'visible';
          }, s.fadeOutSpeed);
        }, s.fadeOutSpeed);
      });
    }

    loaderWrapper.appendChild(loaderContent);
    document.body.appendChild(loaderWrapper);
  });
})();
