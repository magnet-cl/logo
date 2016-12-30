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
  var logoText = new MagnetLogo(document.getElementById('logo-text'), {
    backgroundEnabled: false,
    height: 400,
    mantaEnabled: false
  });

  logoText.render();

  window.logoText = logoText;

  var el = document.getElementById('logo-horizontal');
  var logoHorizontal = new MagnetLogo(el, {
    horizontal: true,
    height: 200,
    width: 600
  });

  logoHorizontal.render();

  window.logoHorizontal = logoHorizontal;

  // render only the mantaray
  var logoAnimated = new MagnetLogo(document.getElementById('logo-animation'));
  logoAnimated.render({
    backgroundColor: '#00ff00',
    mantaColor: '#ff0000',
    textColor: '#0000ff',
    borderColor: '#ffff00'
  });
  logoAnimated.animate();

  var options = {
    height: 500
  };

  var logoFullBackground = new MagnetLogo(
    document.getElementById('logo-full-background'),
    options
  );

  logoFullBackground.fitContainer();
  logoFullBackground.render({
    backgroundSize: 'cover'
  });
}());
