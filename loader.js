document.addEventListener('DOMContentLoaded', function () {
  const settings = window.loaderSettings || {};

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
    background: ${settings.backgroundColor || '#000'};
    z-index: 9999;
    opacity: 1;
    transition: opacity ${settings.fadeOutSpeed || 500}ms ease;
  `;

  const loaderContent = document.createElement('div');
  loaderContent.style.cssText = `
    display: flex;
    align-items: center;
    flex-direction: ${settings.loaderStyle === 'bar' ? 'column' : 'row'};
    gap: 10px;
    font-family: inherit;
    color: inherit;
    font-size: inherit;
  `;

  if (settings.loaderType === 'image') {
    const logo = document.createElement('img');
    logo.src = settings.customLogo || '';
    logo.alt = 'Loading';
    logo.style.cssText = 'max-height: 40px;';
    loaderContent.appendChild(logo);
  } else if (settings.loaderType === 'text') {
    const text = document.createElement('div');
    text.innerText = settings.customText || 'Loading...';
    text.className = 'loader-text';
    loaderContent.appendChild(text);
  }

  if (settings.loaderStyle === 'circle') {
    const circle = document.createElement('div');
    circle.className = 'circle';
    loaderContent.appendChild(circle);
  } else if (settings.loaderStyle === 'bar') {
    const progressBar = document.createElement('div');
    progressBar.className = 'loading-bar';
    const progress = document.createElement('div');
    progress.className = 'bar-fill';
    progress.style.width = '0%';
    progressBar.appendChild(progress);
    loaderContent.appendChild(progressBar);

    let progressInterval = setInterval(() => {
      const currentWidth = parseFloat(progress.style.width) || 0;
      if (currentWidth < 95) {
        progress.style.width = `${currentWidth + 5}%`;
      }
    }, 200);

    window.addEventListener('load', () => {
      clearInterval(progressInterval);
      progress.style.width = '100%';
      setTimeout(() => {
        loaderWrapper.style.opacity = '0';
        setTimeout(() => loaderWrapper.remove(), settings.fadeOutSpeed || 500);
      }, settings.fadeOutSpeed || 500);
    });
  }

  loaderWrapper.appendChild(loaderContent);
  document.body.insertBefore(loaderWrapper, document.body.firstChild);
});
