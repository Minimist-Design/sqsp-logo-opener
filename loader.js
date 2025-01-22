document.addEventListener('DOMContentLoaded', function () {
  // Create the loader wrapper
  const loaderWrapper = document.createElement('div');
  loaderWrapper.id = 'custom-loader';

  // Style the wrapper (users can control via CSS variables)
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
    background: var(--loader-background, #000);
    z-index: 9999;
    transition: opacity 500ms ease;
  `;

  // Create loader content
  const loaderContent = document.createElement('div');
  loaderContent.className = 'loader-content';

  // Add logo or text
  if (window.loaderSettings.loaderType === 'image') {
    const logo = document.createElement('img');
    logo.src = window.loaderSettings.customLogo || '';
    logo.alt = 'Loading';
    logo.style.cssText = 'max-height: 40px;';
    loaderContent.appendChild(logo);
  } else if (window.loaderSettings.loaderType === 'text') {
    const text = document.createElement('div');
    text.innerText = window.loaderSettings.customText || 'Loading...';
    loaderContent.appendChild(text);
  }

  // Add the circle or bar
  if (window.loaderSettings.loaderStyle === 'circle') {
    const circle = document.createElement('div');
    circle.className = 'circle';
    loaderContent.appendChild(circle);
  } else if (window.loaderSettings.loaderStyle === 'bar') {
    const progressBar = document.createElement('div');
    progressBar.className = 'loading-bar';
    const progress = document.createElement('div');
    progress.className = 'bar-fill';
    progressBar.appendChild(progress);
    loaderContent.appendChild(progressBar);
  }

  loaderWrapper.appendChild(loaderContent);
  document.body.appendChild(loaderWrapper);

  // Fade out on page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      loaderWrapper.style.opacity = '0';
      setTimeout(() => loaderWrapper.remove(), 500);
    }, 500);
  });
});
