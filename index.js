(function() {
  'use strict';

  var logoMagnet = new MagnetLogo(document.getElementById('canvas'));

  logoMagnet.render({
    backgroundColor: '#00ff00',
    mantaColor: '#ff0000',
    textColor: '#0000ff'
  });

  logoMagnet.animate();

  window.logoMagnet = logoMagnet;
}());
