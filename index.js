(function() {
  'use strict';

  var logoMagnet = new LogoMagnet(document.getElementById('canvas'));

  logoMagnet.renderBackground();
  logoMagnet.renderManta();
  logoMagnet.renderText();

  logoMagnet.draw();

  logoMagnet.animate();

  window.logoMagnet = logoMagnet;
}());
