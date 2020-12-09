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

  // render only the text
  var logoText = new MagnetLogo(document.getElementById('logo-text'));

  logoText.render({
    mantaEnabled: false,
    backgroundEnabled: false
  });

  window.logoText = logoText;

  // horizontal render
  var logoHorizontal = new MagnetLogo(
    document.getElementById('logo-horizontal')
  );
  logoHorizontal.render({
    horizontal: true
  });

  window.logoHorizontal = logoHorizontal;

  function getAspectRatio(renderText, renderManta, vertical) {
    if (renderText) {
      if (renderManta) {
        if (vertical) {
          return MagnetLogo.verticalIsologotypeRatio;
        }

        return MagnetLogo.horizontalIsologotypeRatio;
      }

      return MagnetLogo.logotypeRatio;
    }

    return MagnetLogo.isotypeRatio;
  }

  function updateHeightInput() {
    var width = parseInt(document.getElementById('width-input').value);
    var verticalInput = document.getElementById('vertical-input');
    var heightInput = document.getElementById('height-input');
    var renderText = document.getElementById('render-text-input').checked;
    var renderManta = document.getElementById('render-manta-input').checked;
    var fixedRatio = document.getElementById('fixed-ratio-input').checked;

    if (fixedRatio) {
      var aspectRatio = getAspectRatio(
        renderText, renderManta, verticalInput.checked
      );

      heightInput.value = parseInt(width / aspectRatio);
    }

    renderCustomLogo();
  }

  document.getElementById('width-input').onchange = updateHeightInput;

  document.getElementById('height-input').onchange = function() {
    var height = parseInt(this.value);
    var verticalInput = document.getElementById('vertical-input');
    var widthInput = document.getElementById('width-input');
    var renderText = document.getElementById('render-text-input').checked;
    var renderManta = document.getElementById('render-manta-input').checked;
    var fixedRatio = document.getElementById('fixed-ratio-input').checked;

    if (fixedRatio) {
      var aspectRatio = getAspectRatio(
        renderText, renderManta, verticalInput.checked
      );

      widthInput.value = parseInt(height * aspectRatio);
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
  document.getElementById('margin-top-input').onchange = updateLogo;
  document.getElementById('margin-bottom-input').onchange = updateLogo;
  document.getElementById('margin-left-input').onchange = updateLogo;
  document.getElementById('margin-right-input').onchange = updateLogo;
  document.getElementById('fixed-ratio-input').onchange = updateLogo;

  function updateLogo() {
    var fixedRatio = document.getElementById('fixed-ratio-input').checked;

    if (fixedRatio) {
      updateHeightInput();
    } else {
      renderCustomLogo();
    }
  }

  var firstTime = true;

  function renderCustomLogo() {
    var height = parseInt(document.getElementById('height-input').value);
    var width = parseInt(document.getElementById('width-input').value);

    var marginTop = parseInt(document.getElementById('margin-top-input').value);
    var marginBottom = parseInt(
      document.getElementById('margin-bottom-input').value
    );
    var marginLeft = parseInt(
      document.getElementById('margin-left-input').value
    );
    var marginRight = parseInt(
      document.getElementById('margin-right-input').value
    );

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
      marginBottom: marginBottom,
      marginLeft: marginLeft,
      marginRight: marginRight,
      marginTop: marginTop,
      textColor: textColor,
      textEnabled: renderText,
      width: width
    });

    document.getElementById('total-height').innerHTML = logoCustom.cssHeight;
    document.getElementById('total-width').innerHTML = logoCustom.cssWidth;

    var faIcon = document.getElementById('fa-input').value;
    var faColor = document.getElementById('fa-color-input').value;
    var faTop = parseFloat(document.getElementById('fa-top-input').value);
    var faLeft = parseFloat(document.getElementById('fa-left-input').value);
    var faSize = parseFloat(document.getElementById('fa-size-input').value);

    var icon = document.getElementById('fa');
    icon.className = faIcon;
    icon.style.display = 'none';

    var content = window.getComputedStyle(icon, ':before').content;
    var font = '"Font Awesome 5 Pro"';
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

  document.getElementById('width-input').onchange();

}());
