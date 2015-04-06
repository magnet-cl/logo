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

  // render only the mantaray
  var logoAnimated = new MagnetLogo(document.getElementById('logo-animation'));
  logoAnimated.render({
    backgroundColor: '#00ff00',
    mantaColor: '#ff0000',
    textColor: '#0000ff',
    borderColor: '#ffff00'
  });
  logoAnimated.animate();
}());
