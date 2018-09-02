(function() {
  'use strict';

  // render the default form of the logo
  var logo = new MagnetLogo(document.getElementById('logo'));
  logo.render();

  // render only the mantaray
  var logoManta = new MagnetLogo(document.getElementById('logo-manta'));
  logoManta.render({
    backgroundEnabled: false,
    textEnabled: false
  });

  // render only the mantaray
  var logoText = new MagnetLogo(document.getElementById('logo-text'));

  logoText.render({
    mantaEnabled: false,
    backgroundEnabled: false
  });

  window.logoText = logoText;

  // horizontal render
  var el = document.getElementById('logo-horizontal');
  var logoHorizontal = new MagnetLogo(el);

  logoHorizontal.render({
    horizontal: true,
    height: 250,
    width: 750
  });

  window.logoHorizontal = logoHorizontal;

  // render only the mantaray
  var logoAnimated = new MagnetLogo(document.getElementById('logo-animation'));
  logoAnimated.render({
    backgroundColor: '#00ff00',
    mantaColor: '#ff0000',
    textColor: '#0000ff'
  });
  logoAnimated.animate();

  document.getElementById('width-input').onchange = function() {
    var width = parseInt(this.value);
    var verticalInput = document.getElementById('vertical-input');
    var heightInput = document.getElementById('height-input');
    var renderText = document.getElementById('render-text-input').checked;
    var renderBackground = document.getElementById(
      'render-background-input'
    ).checked;
    var renderManta = document.getElementById('render-manta-input').checked;

    if (renderText) {
      if (renderBackground || renderManta) {
        if (verticalInput.checked) {
          heightInput.value = parseInt(width * 689 / 600);
        } else {
          heightInput.value = parseInt(width / 3);
        }
      } else {
        heightInput.value = parseInt(width * 64 / 600);
      }
    } else {
      heightInput.value = width;
    }

    renderCustomLogo();
  };

  document.getElementById('height-input').onchange = function() {
    var height = parseInt(this.value);
    var verticalInput = document.getElementById('vertical-input');
    var widthInput = document.getElementById('width-input');
    var renderText = document.getElementById('render-text-input').checked;
    var renderBackground = document.getElementById(
      'render-background-input'
    ).checked;
    var renderManta = document.getElementById('render-manta-input').checked;

    if (renderText) {
      if (renderBackground || renderManta) {
        if (verticalInput.checked) {
          widthInput.value = parseInt(height * 600 / 689);
        } else {
          widthInput.value = parseInt(height * 3);
        }
      } else {
        if (verticalInput.checked) {
          widthInput.value = parseInt(height * 600 / 61);
        } else {
          widthInput.value = parseInt(height * 3);
        }
      }
    } else {
      widthInput.value = height;
    }

    renderCustomLogo();
  };

  document.getElementById('vertical-input').onchange = updateLogo;
  document.getElementById('horizontal-input').onchange = updateLogo;
  document.getElementById('render-text-input').onchange = updateLogo;
  document.getElementById('render-background-input').onchange = updateLogo;
  document.getElementById('render-manta-input').onchange = updateLogo;
  document.getElementById('manta-color-input').onchange = updateLogo;
  document.getElementById('background-color-input').onchange = updateLogo;
  document.getElementById('text-color-input').onchange = updateLogo;
  document.getElementById('border-color-input').onchange = updateLogo;
  document.getElementById('eyes-color-input').onchange = updateLogo;
  document.getElementById('fa-input').onchange = updateLogo;
  document.getElementById('fa-color-input').onchange = updateLogo;
  document.getElementById('fa-top-input').onchange = updateLogo;
  document.getElementById('fa-left-input').onchange = updateLogo;
  document.getElementById('fa-size-input').onchange = updateLogo;

  function updateLogo() {
    renderCustomLogo();
  }

  var firstTime = true;

  function renderCustomLogo() {
    var height = parseInt(document.getElementById('height-input').value);
    var width = parseInt(document.getElementById('width-input').value);
    var logoCustom = new MagnetLogo(document.getElementById('logo-custom'));
    var vertical = document.getElementById('vertical-input').checked;
    var renderText = document.getElementById('render-text-input').checked;
    var renderBackground = document.getElementById(
      'render-background-input'
    ).checked;
    var renderManta = document.getElementById('render-manta-input').checked;
    var textColor = document.getElementById('text-color-input').value;
    var backgroundColor = document.getElementById(
      'background-color-input'
    ).value;
    var mantaColor = document.getElementById('manta-color-input').value;
    var borderColor = document.getElementById('border-color-input').value;
    var eyesColor = document.getElementById('eyes-color-input').value;

    logoCustom.render({
      backgroundColor: backgroundColor,
      backgroundEnabled: renderBackground,
      borderColor: borderColor,
      eyesColor: eyesColor,
      height: height,
      horizontal: !vertical,
      mantaColor: mantaColor,
      mantaEnabled: renderManta,
      textColor: textColor,
      textEnabled: renderText,
      width: width
    });

    var faIcon = document.getElementById('fa-input').value;
    var faColor = document.getElementById('fa-color-input').value;
    var faTop = parseInt(document.getElementById('fa-top-input').value);
    var faLeft = parseInt(document.getElementById('fa-left-input').value);
    var faSize = parseInt(document.getElementById('fa-size-input').value);

    var icon = document.getElementById('fa');
    icon.className = faIcon;
    icon.style.display = 'none';

    var content = window.getComputedStyle(icon, ':before').content;
    var font = '"Font Awesome 5 Free"';
    var fontSize = faSize + 'px';
    var fontWeight = '400';

    if (content !== 'none') {
      if (faIcon.startsWith('fas ')) {
        fontWeight = '900';
      } else if (faIcon.startsWith('fab ')) {
        font = '"Font Awesome 5 Brands"';
      }

      logoCustom.ctx.font = fontWeight + ' ' + fontSize + ' ' + font;
      logoCustom.ctx.fillStyle = faColor;

      logoCustom.ctx.fillText(eval(content), faLeft, faTop);

      if (firstTime) {
        firstTime = false;
        setTimeout(function() {
          renderCustomLogo();
        }, 300);
      }
    }
  }

  renderCustomLogo();

}());
