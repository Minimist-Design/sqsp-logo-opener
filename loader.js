
(function () {

  var scriptEl = document.currentScript;

  function getAttr(name, defaultVal) {
    return scriptEl.getAttribute(name) || defaultVal;
  }

  var s = {
    loaderType:       getAttr('data-loader-type',   'text'),  // 'text' or 'image'
    customText:       getAttr('data-custom-text',   'Loading...'),
    customLogo:       getAttr('data-custom-logo',   ''), 
    loaderStyle:      getAttr('data-loader-style',  'circle'), // 'circle' or 'bar'
    fadeOutSpeed:     parseInt(getAttr('data-fade-out-speed', '500'), 10),
    circleColor:      getAttr('data-circle-color',  '#ffffff'),
    circleSize:       getAttr('data-circle-size',   '40px'),
    barColor:         getAttr('data-bar-color',     '#ffffff'),
    barBackground:    getAttr('data-bar-background','#333333'),
    barWidth:         getAttr('data-bar-width',     '70%'),
    barHeight:        getAttr('data-bar-height',    '5px'),
    fontFamily:       getAttr('data-font-family',   'inherit'),
    textColor:        getAttr('data-text-color',    '#ffffff'),
    textSize:         getAttr('data-text-size',     '16px'),
    backgroundColor:  getAttr('data-background-color','#000000')
  };


  var styleEl = document.createElement('style');
  styleEl.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(styleEl);


  var loaderWrapper = document.createElement('div');
  loaderWrapper.id = 'custom-loader';
  loaderWrapper.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    'width: 100%',
    'height: 100%',
    'display: flex',
    'flex-direction: column',
    'justify-content: center',
    'align-items: center',
    'background: ' + s.backgroundColor,
    'z-index: 9999',
    'transition: opacity ' + s.fadeOutSpeed + 'ms ease'
  ].join(';');

  // Append to body as soon as we can
  if (document.body) {
    document.body.appendChild(loaderWrapper);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(loaderWrapper);
    });
  }

  // Create loader content container
  var loaderContent = document.createElement('div');
  loaderContent.style.cssText = [
    'display: flex',
    'align-items: center',
    (s.loaderStyle === 'bar') ? 'flex-direction: column' : 'flex-direction: row',
    'gap: 10px',
    'font-family: ' + s.fontFamily,
    'color: ' + s.textColor,
    'font-size: ' + s.textSize
  ].join(';');
  loaderWrapper.appendChild(loaderContent);

  // Add image or text
  if (s.loaderType === 'image') {
    var logo = document.createElement('img');
    logo.src = s.customLogo;
    logo.alt = 'Loading';
    logo.style.cssText = 'max-height: 40px;';
    loaderContent.appendChild(logo);
  } else {
    // default if 'text' or anything else
    var textEl = document.createElement('div');
    textEl.innerText = s.customText;
    loaderContent.appendChild(textEl);
  }

  // Circle or bar
  if (s.loaderStyle === 'circle') {
    var circle = document.createElement('div');
    circle.style.cssText = [
      'width: ' + s.circleSize,
      'height: ' + s.circleSize,
      'border: 3px solid ' + s.circleColor,
      'border-radius: 50%',
      'border-top-color: transparent',
      'animation: spin 1s linear infinite'
    ].join(';');
    loaderContent.appendChild(circle);

  } else {
    // "bar"
    var progressBar = document.createElement('div');
    progressBar.style.cssText = [
      'width: ' + s.barWidth,
      'height: ' + s.barHeight,
      'background: ' + s.barBackground,
      'position: relative',
      'overflow: hidden',
      'border-radius: 5px'
    ].join(';');

    var progress = document.createElement('div');
    progress.style.cssText = [
      'width: 0%',
      'height: 100%',
      'background: ' + s.barColor,
      'transition: width 0.3s ease'
    ].join(';');

    progressBar.appendChild(progress);
    loaderContent.appendChild(progressBar);

    var currentWidth = 0;
    var intervalID = setInterval(function() {
      if (currentWidth < 95) {
        currentWidth += 5;
        progress.style.width = currentWidth + '%';
      }
    }, 200);

    window.addEventListener('load', function() {
      clearInterval(intervalID);
      progress.style.width = '100%';
    });
  }

  // Fade out once the page fully loads
  window.addEventListener('load', function() {
    setTimeout(function() {
      loaderWrapper.style.opacity = '0';
      setTimeout(function() {
        if (loaderWrapper.parentNode) {
          loaderWrapper.parentNode.removeChild(loaderWrapper);
        }
      }, s.fadeOutSpeed);
    }, s.fadeOutSpeed);
  });
})();
