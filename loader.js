// Check if the loader should be shown only once
if (window.loaderSettings.showOnce && localStorage.getItem('loaderLoaded') === 'yes') {
  document.documentElement.classList.add('loaded');
} else {
  localStorage.setItem('loaderLoaded', 'yes');

  // Initialize loader
  const loaderWrapper = document.createElement('div');
  loaderWrapper.id = 'custom-loader';
  loaderWrapper.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${window.loaderSettings.backgroundColor || '#000'};
    z-index: 9999;
    transition: opacity ${window.loaderSettings.fadeOutSpeed || 500}ms ease;
    opacity: 1;
  `;

  const loaderContent = document.createElement('div');
  loaderContent.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: inherit;
    color: inherit;
  `;

  // Add loader type
  if (window.loaderSettings.loaderType === 'image' && window.loaderSettings.customLogo) {
    const logo = document.createElement('img');
    logo.src = window.loaderSettings.customLogo;
    logo.alt = 'Loading';
    logo.style.cssText = 'max-height: 40px;';
    loaderContent.appendChild(logo);
  } else {
    const text = document.createElement('div');
    text.textContent = window.loaderSettings.customText || 'Loading...';
    loaderContent.appendChild(text);
  }

  loaderWrapper.appendChild(loaderContent);
  document.body.appendChild(loaderWrapper);

  // Remove loader after the page loads
  window.addEventListener('load', function () {
    setTimeout(() => {
      loaderWrapper.style.opacity = '0';
      setTimeout(() => {
        loaderWrapper.remove();
        document.documentElement.classList.add('loaded'); // Unhide content
      }, window.loaderSettings.fadeOutSpeed || 500);
    }, window.loaderSettings.loaderAdditionalDelay || 0);
  });
}
