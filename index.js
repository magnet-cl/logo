(function() {
  'use strict';

  var logoMagnet = new LogoMagnet(document.getElementById('canvas'));

  logoMagnet.renderBackground('#00ff00');
  logoMagnet.renderManta('#ff0000');
  logoMagnet.renderText('#0000ff');

  logoMagnet.draw();

  logoMagnet.animate();

  window.logoMagnet = logoMagnet;
}());
