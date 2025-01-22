/**
 * loader.js
 * 
 * Displays a custom loader overlay. Removes itself after window.load,
 * or forcibly after a fallback timer to avoid a permanent black screen
 * on certain Squarespace templates.
 */

(function() {
  // Identify the <script> tag that loaded this file
  var scriptEl = document.currentScript;

  // Helper: read data-* attr or return default
  function getAttr(name, defaultVal) {
    var val = scriptEl.getAttribute(name);
    return (val !== null) ? val : defaultVal;
  }

  // Config from data attributes
  var cfg = {
    loaderType:      getAttr('data-loader-type', 'image'),     // "image" or "text"
    customText:      getAttr('data-custom-text', 'Loading...'),// used if loaderType="text"
    customImage:     getAttr('data-custom-image', ''),         // used if loaderType="image"
    loaderStyle:     getAttr('data-loader-style', 'circle'),   // "circle" or "bar"
    fadeTime:        parseInt(getAttr('data-fade-time', '500'), 10),
    fallbackTime:    parseInt(getAttr('data-fallback-time', '10000'), 10), // force removal
    bgColor:         getAttr('data-bg-color', '#000000'),
    circleColor:     getAttr('data-circle-color', '#ffffff'),
    circleSize:      getAttr('data-circle-size', '40px'),
    barColor:        getAttr('data-bar-color', '#ffffff'),
    barBackground:   getAttr('data-bar-background', '#333333'),
    barWidth:        getAttr('data-bar-width', '70%'),
    barHeight:       getAttr('data-bar-height', '5px'),
    fontFamily:      getAttr('data-font-family', 'inherit'),
    textColor:       getAttr('data-text-color', '#ffffff'),
    textSize:        getAttr('data-text-size', '16px')
  };

  // 1) Create a <style> for the spinning circle keyframe (if used)
  var styleEl = document.createElement('style');
  styleEl.textContent = '@keyframes sqspLoaderSpin { to { transform: rotate(360deg); } }';
  document.head.appendChild(styleEl);

  // 2) Create the loader overlay
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
    'background: ' + cfg.bgColor,
    'z-index: 999999',
    'transition: opacity ' + cfg.fadeTime + 'ms ease'
  ].join(';');

  // Insert into the DOM immediately (or as soon as possible)
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

  // 3) Create inner content container
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

  // 4) Add image or text loader
  if (cfg.loaderType === 'image') {
    var imgEl = document.createElement('img');
    imgEl.src = cfg.customImage;
    imgEl.alt = 'Loading';
    imgEl.style.cssText = 'max-height: 40px;';
    loaderContent.appendChild(imgEl);
  } else {
    // text loader
    var textEl = document.createElement('div');
    textEl.textContent = cfg.customText;
    loaderContent.appendChild(textEl);
  }

  // 5) Add circle or bar
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
    // bar
    var progressBar = document.createElement('div');
    progressBar.style.cssText = [
      'width: ' + cfg.barWidth,
      'height: ' + cfg.barHeight,
      'background: ' + cfg.barBackground,
      'position: relative',
      'overflow: hidden',
      'border-radius: 5px'
    ].join(';');

    var barFill = document.createElement('div');
    barFill.style.cssText = [
      'width: 0%',
      'height: 100%',
      'background: ' + cfg.barColor,
      'transition: width 0.3s ease'
    ].join(';');

    progressBar.appendChild(barFill);
    loaderContent.appendChild(progressBar);

    // Simulate progress
    var currentWidth = 0;
    var intervalID = setInterval(function() {
      if (currentWidth < 95) {
        currentWidth += 5;
        barFill.style.width = currentWidth + '%';
      }
    }, 200);

    // When the page actually loads, fill to 100%
    window.addEventListener('load', function() {
      clearInterval(intervalID);
      barFill.style.width = '100%';
    });
  }

  // 6) Fade out after window.load, or forcibly after fallback time
  var removeLoader = function() {
    loaderWrapper.style.opacity = '0';
    setTimeout(function() {
      if (loaderWrapper.parentNode) {
        loaderWrapper.parentNode.removeChild(loaderWrapper);
      }
    }, cfg.fadeTime);
  };

  // a) On window load
  window.addEventListener('load', function() {
    setTimeout(removeLoader, cfg.fallbackTime < 50 ? 0 : cfg.additionalDelay || 0);
    // Above line references "cfg.additionalDelay" but we haven't used it in data-attrs.
    // If you want an extra delay after load, add data-additional-delay to the script.
  });

  // b) Fallback timer: forcibly remove if load doesn't fire
  setTimeout(function() {
    // If it's still on screen after fallbackTime, remove it
    if (document.body.contains(loaderWrapper)) {
      removeLoader();
    }
  }, cfg.fallbackTime || 10000);
})();
