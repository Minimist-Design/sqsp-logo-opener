
(function () {

  var scriptEl = document.currentScript;


  function getDataAttr(attrName, defaultVal) {
    var val = scriptEl.getAttribute(attrName);
    return (val !== null) ? val : defaultVal;
  }


  function toBool(val) {
    if (!val) return false;
    return (val.toString().toLowerCase() === 'true');
  }


  var cfg = {
    loaderType:         getDataAttr('data-loader-type', 'image'), // 'image' or 'text'
    loaderImage:        getDataAttr('data-loader-image', ''), 
    loaderText:         getDataAttr('data-loader-text', 'Loading...'),
    loaderStyle:        getDataAttr('data-loader-style', 'circle'), // 'circle' or 'bar'
    removeLoadingLine:  toBool(getDataAttr('data-remove-loading-line', 'false')),
    fadeTime:           parseInt(getDataAttr('data-fade-time', '500'), 10),
    additionalDelay:    parseInt(getDataAttr('data-additional-delay', '0'), 10),
    showOnce:           toBool(getDataAttr('data-show-once', 'false')),

    backgroundColor:    getDataAttr('data-bg-color', '#000000'),
    circleColor:        getDataAttr('data-circle-color', '#ffffff'),
    circleSize:         getDataAttr('data-circle-size', '40px'),
    barColor:           getDataAttr('data-bar-color', '#ffffff'),
    barBackground:      getDataAttr('data-bar-background', '#333333'),
    barWidth:           getDataAttr('data-bar-width', '70%'),
    barHeight:          getDataAttr('data-bar-height', '5px'),
    textColor:          getDataAttr('data-text-color', '#ffffff'),
    textSize:           getDataAttr('data-text-size', '16px'),
    fontFamily:         getDataAttr('data-font-family', 'inherit')
  };


  if (cfg.showOnce && localStorage.getItem('sqspCustomLoaderShown') === 'yes') {
    return; 
  } else {

    if (cfg.showOnce) {
      localStorage.setItem('sqspCustomLoaderShown', 'yes');
    }
  }


  var styleEl = document.createElement('style');
  styleEl.textContent = '@keyframes sqspLoaderSpin { to { transform: rotate(360deg); } }';
  document.head.appendChild(styleEl);

  // Create preloader wrapper
  var loaderWrapper = document.createElement('div');
  loaderWrapper.id = 'sqsp-custom-loader';
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
    'background: ' + cfg.backgroundColor,
    'z-index: 999999', 
    'transition: opacity ' + cfg.fadeTime + 'ms ease'
  ].join(';');

  function appendLoader() {
    if (!document.body.contains(loaderWrapper)) {
      document.body.appendChild(loaderWrapper);
    }
  }
  if (document.body) {
    appendLoader();
  } else {
    document.addEventListener('DOMContentLoaded', appendLoader);
  }


  var loaderContent = document.createElement('div');
  loaderContent.style.cssText = [
    'display: flex',
    'align-items: center',
    (cfg.loaderStyle === 'bar') ? 'flex-direction: column' : 'flex-direction: row',
    'gap: 10px',
    'font-family: ' + cfg.fontFamily,
    'color: ' + cfg.textColor,
    'font-size: ' + cfg.textSize
  ].join(';');
  loaderWrapper.appendChild(loaderContent);

 
  if (cfg.loaderType === 'image') {
    var imgEl = document.createElement('img');
    imgEl.src = cfg.loaderImage;
    imgEl.alt = 'Loading';
    imgEl.style.cssText = 'max-height: 40px;';
    loaderContent.appendChild(imgEl);
  } else {
    var textEl = document.createElement('div');
    textEl.textContent = cfg.loaderText;
    loaderContent.appendChild(textEl);
  }


  if (cfg.loaderStyle === 'circle') {
    var circleEl = document.createElement('div');
    circleEl.style.cssText = [
      'width: ' + cfg.circleSize,
      'height: ' + cfg.circleSize,
      'border: 3px solid ' + cfg.circleColor,
      'border-radius: 50%',
      'border-top-color: transparent',
      'animation: sqspLoaderSpin 1s linear infinite'
    ].join(';');
    loaderContent.appendChild(circleEl);
  } else {
  
    var barWrapper = document.createElement('div');
    barWrapper.style.cssText = [
      'width: ' + cfg.barWidth,
      'height: ' + cfg.barHeight,
      'background: ' + cfg.barBackground,
      'position: relative',
      'overflow: hidden',
      'border-radius: 5px'
    ].join(';');


    if (cfg.removeLoadingLine) {
      barWrapper.style.display = 'none';
    }

    var barFill = document.createElement('div');
    barFill.style.cssText = [
      'width: 0%',
      'height: 100%',
      'background: ' + cfg.barColor,
      'transition: width 0.3s ease'
    ].join(';');

    barWrapper.appendChild(barFill);
    loaderContent.appendChild(barWrapper);

  
    var currentWidth = 0;
    var intervalID = setInterval(function () {
      if (currentWidth < 95) {
        currentWidth += 5;
        barFill.style.width = currentWidth + '%';
      }
    }, 200);

    window.addEventListener('load', function () {
      clearInterval(intervalID);
      barFill.style.width = '100%';
    });
  }


  window.addEventListener('load', function () {
    setTimeout(function () {
      loaderWrapper.style.opacity = '0';
      setTimeout(function () {
        if (loaderWrapper.parentNode) {
          loaderWrapper.parentNode.removeChild(loaderWrapper);
        }
      }, cfg.fadeTime);
    }, cfg.additionalDelay);
  });
})();
