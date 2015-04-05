(function() {
  'use strict';

  /**
  * Magnet logo class constructor.
  * @constructor
  * @param {HTMLCanvasElement} element Target canvas.
  */
  function MagnetLogo(element) {
    if (element.tagName == 'CANVAS') {
      this.canvas = element;
    } else {
      this.canvas = document.createElement('canvas');
      element.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');

    this.logoW = 600;
    this.logoH = 689;
    this.backgroundHeight = 600;
    this.textHeight = 688.299980 - 627.099980;

    this.clientWidth = element.clientWidth;
    this.clientHeight = element.clientHeight;

    this.noiseRes = 200;

    this.canvas.width = this.clientWidth;
    this.canvas.height = this.clientHeight;

    this.currentAngle = 0;
    this.deltaAngle = Math.PI / 180;

    this.backgroundColor = 'rgb(40, 175, 206)';
    this.mantaColor = 'rgb(40, 175, 206)';
    this.textColor = 'rgb(87, 87, 87)';

    this.currentScale = 1;

    this.currentScaledCanvasWidth = this.clientWidth / this.currentScale;

    this.updateFrameValues(0);
  }

  MagnetLogo.prototype.animate = function() {
    this.animating = true;
    window.requestAnimationFrame(this.animationCallback.bind(this));
  };

  MagnetLogo.prototype.animationCallback = function(timestamp) {
    this.updateFrameValues(timestamp);
    this.ctx.save();
    this.clear();
    //this.resize();
    //this.rotate();
    this.fitContainer();
    this.draw();
    this.ctx.restore();

    // Request next frame
    if (this.animating) {
      window.requestAnimationFrame(this.animationCallback.bind(this));
    }
  };

  MagnetLogo.prototype.swim = function() {
    this.noiseInit();
  };

  MagnetLogo.prototype.resize = function() {
    var size = Math.sin(Date.now() / 1000) + 1;
    this.ctx.scale(size, size);
    var auxColor;

    if (size > 1.5) {
      auxColor = this.backgroundColor;

      this.backgroundColor = this.mantaColor;
      this.mantaColor = this.textColor;
      this.textColor = auxColor;
    }
  };

  /**
  * MagnetLogo.center - Aligns the logo with the canvas center.
  */
  MagnetLogo.prototype.center = function() {
    var ox = (
        this.clientWidth - this.currentScale * this.logoW) /
      2 / this.currentScale;

    var oy = (
      this.clientHeight - this.currentScale * this.logoH) /
      2 / this.currentScale;

    this.ctx.translate(ox, oy);
  };

  MagnetLogo.prototype.fitContainer = function() {
    var baseWidth;
    var baseHeight;

    var horizontalOffset = 73.977794;

    var topOffset = 0;

    if (this.backgroundEnabled || this.textEnabled) {
      baseWidth = this.logoW;
    } else {
      baseWidth = this.logoW - horizontalOffset * 2;
    }

    if (this.textEnabled && (this.backgroundEnabled || this.mantaEnabled)) {
      baseHeight = 689;
    } else if (!this.textEnabled) {
      baseHeight = this.backgroundHeight;
    } else {
      // te text has to be moved to the top
      var topOffset = 627.099980;
      baseHeight = this.textHeight;
    }

    var newWidth = this.canvas.clientWidth / baseWidth;
    var newHeight = this.canvas.clientHeight / baseHeight;

    if (newWidth < newHeight) {
      this.currentScale = newWidth;
    } else {
      this.currentScale = newHeight;
    }

    // move to the top
    this.ctx.translate(0, - (topOffset * this.currentScale));

    this.ctx.scale(this.currentScale, this.currentScale);

    this.currentScaledCanvasWidth = this.clientWidth / this.currentScale;
  };

  /**
  * Renders a frame and automatically subscribes to the next.
  * @param  {DOMHighResTimeStamp} timestamp
  */
  MagnetLogo.prototype.renderFrame = function(timestamp) {
    this.checkResize();

    this.clear();

    this.setcurrentScale();
    this.center();

    this.updateFrameValues(timestamp);

    this.drawBackground();
    this.drawManta();
    this.drawText();

    // Request next frame
    if (this.animating) {
      window.requestAnimationFrame(window.animationCallback);
    }
  };

  /**
  * Updates the frame values for a given timestamp
  */
  MagnetLogo.prototype.updateFrameValues = function(timestamp) {
    var lambda = (timestamp % 2000) / 2000;

    // Animation time
    var sinTime = (Math.sin(2 * Math.PI * lambda) + 1) / 2;
    this.cosTime = (Math.cos(2 * Math.PI * lambda) + 1) / 2;
    this.triTime = Math.abs(lambda - 0.5);

    // Animation coords
    this.centerX = (this.logoW + 20) / 2;
    this.flipFactor = (1 - 0.1 * sinTime);
    this.horizontalFactor = (0.7 + 0.3 * sinTime);
  };

  /**
  * for a given x coord, obtain the translated coord
  */
  MagnetLogo.prototype.leftTransform = function(x) {
    var toCenter = this.centerX - x;
    var distanceFactor = toCenter / this.centerX;

    var horizontalFactor = 1 - ((1 - this.horizontalFactor) * distanceFactor);

    return this.centerX - (horizontalFactor * toCenter);
  };

  /**
  * for a given x coord, obtain the translated coord
  */
  MagnetLogo.prototype.rightTransform = function(x) {
    var fromCenter = x - this.centerX;
    var distanceFactor = fromCenter / this.centerX;

    var horizontalFactor = 1 - ((1 - this.horizontalFactor) * distanceFactor);
    return this.centerX + (horizontalFactor * fromCenter);
  };

  /**
  * for a given x coord, obtain the flip translated coord
  */
  MagnetLogo.prototype.flipTransform = function(x) {
    var distance = x - this.centerX;
    distance = this.flipFactor * distance;
    return this.centerX + distance;
  };

  MagnetLogo.prototype.stop = function() {
    this.animating = false;
  };

  /**
  * Resets transformation and clears the canvas.
  */
  MagnetLogo.prototype.clear = function() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  MagnetLogo.prototype.render = function(options) {
    var k;
    options = options || {};

    this.backgroundEnabled = true;
    this.mantaEnabled = true;
    this.textEnabled = true;

    for (k in options) {
      this[k] = options[k];
    }

    this.fitContainer();
    this.center();

    this.draw();
  };

  MagnetLogo.prototype.draw = function() {
    if (this.backgroundEnabled) {
      this.drawBackground();
    }
    if (this.mantaEnabled) {
      this.drawManta();
    }
    if (this.textEnabled) {
      this.drawText();
    }
  };

  MagnetLogo.prototype.rotate = function() {

    var width = this.logoW;
    var height = this.logoH;

    // Move registration point to the center of the canvas
    this.ctx.translate(width / 2, height / 2);

    this.currentAngle += this.deltaAngle;

    if (this.currentAngle > 2 * Math.PI) {
      this.currentAngle -= 2 * Math.PI;
    }

    // Rotate 1 degree
    this.ctx.rotate(this.currentAngle);

    // Move registration point back to the top left corner of canvas
    this.ctx.translate(-width / 2, -height / 2);
  };

  /**
  * Draws a moving background.
  */
  MagnetLogo.prototype.drawBackground = function(color) {
    var ctx = this.ctx;
    this.backgroundEnabled = true;

    if (color) {
      this.backgroundColor = color;
    }

    // #rectBackground
    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.miterLimit = 4;
    ctx.lineWidth = 3.000000;
    ctx.fillStyle = this.backgroundColor;
    ctx.rect(0.000000, 0.000000, this.logoW, this.backgroundHeight);
    ctx.fill();
  };

  MagnetLogo.prototype.drawManta = function(color) {
    this.mantaEnabled = true;

    this.drawPerimeter(color);
    this.drawRightEye();
    this.drawLeftEye();
    this.drawMantaGill();

    // Global movement correction
    this.ctx.translate(0, 30 * this.cosTime);
  };

  MagnetLogo.prototype.drawPerimeter = function(color) {
    var ctx = this.ctx;

    if (color) {
      this.mantaColor = color;
    }

    // #layerManta

    // #pathMantaPerimeter
    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.strokeStyle = 'rgb(255, 255, 255)';
    ctx.lineCap = 'butt';
    ctx.miterLimit = 4;
    ctx.lineWidth = 3.000000;
    ctx.fillStyle = this.mantaColor;

    // Global movement
    this.ctx.translate(0, - 30 * this.cosTime);

    // Left wing
    this.ctx.moveTo(this.leftTransform(73.977794), 282.246470);
    this.ctx.bezierCurveTo(
      this.leftTransform(73.883624), 257.774170,
      this.leftTransform(126.304670), 235.789760,
      this.leftTransform(167.909670), 213.081560);
    this.ctx.bezierCurveTo(
      this.leftTransform(210.484640), 190.947100,
      this.leftTransform(263.150880), 157.254600,
      this.leftTransform(269.623680), 148.155170);

    // Head
    this.ctx.bezierCurveTo(
      275.191880, 140.327420,
      269.839980, 133.310800,
      276.059650, 127.506190
    );
    this.ctx.bezierCurveTo(
      286.595280, 117.673640,
      309.903650, 127.080550,
      309.903650, 127.080550
    );
    this.ctx.bezierCurveTo(
      329.383360, 120.770220,
      336.119160, 122.161820,
      344.073280, 127.680550
    );
    this.ctx.bezierCurveTo(
      350.299990, 132.000770,
      344.896370, 139.256320,
      this.rightTransform(350.414360), 148.467920
    );

    // this.rightTransform wing
    this.ctx.bezierCurveTo(
      this.rightTransform(353.756740), 154.047600,
      this.rightTransform(384.724500), 174.504720,
      this.rightTransform(411.774040), 190.786410);
    this.ctx.bezierCurveTo(
      this.rightTransform(442.391090), 209.215460,
      this.rightTransform(501.558930), 237.365520,
      this.rightTransform(523.480400), 252.805020);
    this.ctx.bezierCurveTo(
      this.rightTransform(529.622190), 257.130740,
      this.rightTransform(546.508970), 268.007830,
      this.rightTransform(546.180780), 282.695200);
    this.ctx.bezierCurveTo(
      this.rightTransform(525.054890), 282.146470,
      this.rightTransform(501.006500), 280.786330,
      this.rightTransform(481.938570), 289.908330);
    this.ctx.bezierCurveTo(
      this.rightTransform(434.929310), 312.397310,
      this.rightTransform(410.960720), 336.764950,
      this.rightTransform(394.599010), 349.718160);

    // Tail
    this.ctx.bezierCurveTo(
      this.rightTransform(380.442620), 360.925470,
      this.rightTransform(336.504020), 402.897790,
      this.rightTransform(319.965380), 411.704360);

    this.ctx.bezierCurveTo(
      this.flipTransform(315.274030), 460.083760,
      this.flipTransform(277.985540), 490.298510,
      this.flipTransform(219.356590), 490.313020);
    this.ctx.bezierCurveTo(
      this.flipTransform(164.705390), 490.326520,
      this.flipTransform(106.655900), 472.630580,
      this.flipTransform(84.580471), 433.491850);
    this.ctx.bezierCurveTo(
      this.flipTransform(72.602628), 412.255680,
      this.flipTransform(69.306950), 383.452180,
      this.flipTransform(80.690676), 364.029490);
    this.ctx.bezierCurveTo(
      this.flipTransform(90.442479), 347.391150,
      this.flipTransform(105.261980), 344.896970,
      this.flipTransform(113.634930), 344.636640);
    this.ctx.bezierCurveTo(
      this.flipTransform(94.247561), 349.988680,
      this.flipTransform(86.284044), 362.681030,
      this.flipTransform(84.895140), 364.999900);
    this.ctx.bezierCurveTo(
      this.flipTransform(68.736161), 391.978430,
      this.flipTransform(81.820690), 427.131040,
      this.flipTransform(97.898581), 443.943260);
    this.ctx.bezierCurveTo(
      this.flipTransform(118.874950), 465.877680,
      this.flipTransform(155.320920), 483.254050,
      this.flipTransform(217.471650), 483.228330);
    this.ctx.bezierCurveTo(
      this.flipTransform(295.609590), 483.196030,
      302.747630, 434.598940,
      301.575330, 411.122340);


    // this.leftTransform wing
    this.ctx.bezierCurveTo(
      this.leftTransform(289.352120), 408.535100,
      this.leftTransform(268.100100), 385.143590,
      this.leftTransform(218.117950), 343.677970);
    this.ctx.bezierCurveTo(
      this.leftTransform(198.001420), 326.989120,
      this.leftTransform(154.068400), 293.230440,
      this.leftTransform(126.355340), 286.487540);
    this.ctx.bezierCurveTo(
      this.leftTransform(106.983590), 281.774170,
      this.leftTransform(88.442594), 282.034780,
      this.leftTransform(73.977794), 282.246470);

    this.ctx.fill();
    this.ctx.stroke();
  };

  MagnetLogo.prototype.drawRightEye = function() {
    var ctx = this.ctx;

    // #pathMataRightEye
    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.lineWidth = 1.000000;
    ctx.fillStyle = 'rgb(255, 255, 255)';

    ctx.moveTo(this.rightTransform(338.300000), 149.099980);
    ctx.bezierCurveTo(
      this.rightTransform(345.250000), 163.849980,
      this.rightTransform(342.600000), 168.199980,
      this.rightTransform(343.100000), 170.199980
    );
    ctx.bezierCurveTo(
      this.rightTransform(343.600000), 172.199980,
      this.rightTransform(345.527290), 171.473970,
      this.rightTransform(346.350000), 170.749980
    );
    ctx.bezierCurveTo(
      this.rightTransform(347.766970), 169.503030,
      this.rightTransform(357.100000), 158.749980,
      this.rightTransform(338.300000), 149.099980
    );
    ctx.fill();
  };

  MagnetLogo.prototype.drawLeftEye = function() {
    var ctx = this.ctx;

    // #pathMantaLeftEye
    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.lineWidth = 1.000000;
    ctx.fillStyle = 'rgb(255, 255, 255)';

    ctx.moveTo(this.leftTransform(282.106930), 149.151200);
    ctx.bezierCurveTo(
      this.leftTransform(275.156930), 163.901200,
      this.leftTransform(277.806930), 168.251200,
      this.leftTransform(277.306930), 170.251200
    );
    ctx.bezierCurveTo(
      this.leftTransform(276.806930), 172.251200,
      this.leftTransform(274.879640), 171.525190,
      this.leftTransform(274.056930), 170.801200
    );
    ctx.bezierCurveTo(
      this.leftTransform(272.639960), 169.554250,
      this.leftTransform(263.306930), 158.801200,
      this.leftTransform(282.106930), 149.151200
    );
    ctx.fill();
  };

  MagnetLogo.prototype.drawMantaGill = function() {
    var ctx = this.ctx;

    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.lineWidth = 1.000000;
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.moveTo(345.810920, 210.370830);
    ctx.bezierCurveTo(
      354.767600, 198.585720,
      361.078010, 184.850690,
      354.596200, 163.166080
    );
    ctx.bezierCurveTo(
      366.717020, 179.104580,
      376.198660, 206.571000,
      344.596710, 232.698250
    );
    ctx.bezierCurveTo(
      354.024800, 219.145370,
      354.260500, 215.220580,
      354.614050, 208.738770
    );
    ctx.bezierCurveTo(
      352.892730, 210.760090,
      349.182150, 211.288680,
      345.810920, 210.370830
    );
    ctx.fill();
  };

  /**
  * MagnetLogo.drawText - Draws the "MAGNET" text.
  */
  MagnetLogo.prototype.drawText = function(color) {
    var ctx = this.ctx;

    this.textEnabled = true;

    if (color) {
      this.textColor = color;
    }

    // #layerText

    // #pathM
    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.lineWidth = 1.000000;
    ctx.fillStyle = this.textColor;
    ctx.moveTo(5.200000, 627.099980);
    ctx.lineTo(16.200000, 627.099980);
    ctx.lineTo(33.300000, 676.799980);
    ctx.lineTo(50.900000, 626.999980);
    ctx.lineTo(62.000000, 626.999980);
    ctx.lineTo(65.700000, 688.399980);
    ctx.lineTo(57.300000, 688.399980);
    ctx.lineTo(54.800000, 635.499980);
    ctx.lineTo(35.800000, 687.999980);
    ctx.lineTo(29.300000, 687.999980);
    ctx.lineTo(11.700000, 635.099980);
    ctx.lineTo(8.900000, 688.299980);
    ctx.lineTo(1.000000, 688.299980);
    ctx.fill();

    // #pathA
    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.lineWidth = 1.000000;
    ctx.fillStyle = color;
    ctx.moveTo(145.500000, 626.900390);
    ctx.lineTo(124.099610, 688.199220);
    ctx.lineTo(133.099610, 688.300780);
    ctx.lineTo(139.500000, 669.300780);
    ctx.lineTo(161.900390, 669.300780);
    ctx.lineTo(168.400390, 688.300780);
    ctx.lineTo(177.500000, 688.300780);
    ctx.lineTo(155.900390, 626.900390);
    ctx.lineTo(145.500000, 626.900390);
    ctx.moveTo(150.199220, 634.500000);
    ctx.lineTo(160.099610, 662.699220);
    ctx.lineTo(141.199220, 662.699220);
    ctx.lineTo(150.199220, 634.500000);
    ctx.fill();

    // #pathG
    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.lineWidth = 1.000000;
    ctx.fillStyle = color;
    ctx.moveTo(283.100000, 629.399980);
    ctx.lineTo(280.900000, 636.199980);
    ctx.bezierCurveTo(
      280.900000, 636.199980,
      274.402680, 633.299980,
      266.800000, 633.299980
    );
    ctx.bezierCurveTo(
      259.197320, 633.299980,
      241.300000, 637.468290,
      241.300000, 657.999980
    );
    ctx.bezierCurveTo(
      241.300000, 678.531670,
      258.389840, 682.199980,
      266.300000, 682.199980
    );
    ctx.bezierCurveTo(
      274.210160, 682.199980,
      276.700000, 680.499980,
      276.700000, 680.499980
    );
    ctx.lineTo(276.700000, 662.799980);
    ctx.lineTo(264.000000, 662.799980);
    ctx.lineTo(264.000000, 656.099980);
    ctx.lineTo(285.000000, 656.099980);
    ctx.lineTo(285.000000, 685.499980);
    ctx.bezierCurveTo(
      285.000000, 685.499980,
      277.252910, 689.099980,
      264.900000, 689.099980
    );
    ctx.bezierCurveTo(
      252.547090, 689.099980,
      232.400000, 683.421200,
      232.400000, 658.399980
    );
    ctx.bezierCurveTo(
      232.400000, 633.378760,
      253.885090, 626.499980,
      266.500000, 626.499980
    );
    ctx.bezierCurveTo(
      279.114910, 626.499980,
      283.100000, 629.399980,
      283.100000, 629.399980
    );
    ctx.fill();

    // #pathN
    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.lineWidth = 1.000000;
    ctx.fillStyle = color;
    ctx.moveTo(348.100000, 688.299980);
    ctx.lineTo(348.100000, 626.899980);
    ctx.lineTo(357.500000, 626.899980);
    ctx.lineTo(388.500000, 674.799980);
    ctx.lineTo(388.200000, 627.099980);
    ctx.lineTo(396.000000, 627.099980);
    ctx.lineTo(396.000000, 688.099980);
    ctx.lineTo(387.000000, 688.099980);
    ctx.lineTo(355.600000, 637.699980);
    ctx.lineTo(355.600000, 688.399980);
    ctx.fill();

    // #pathE
    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.lineWidth = 1.000000;
    ctx.fillStyle = color;
    ctx.moveTo(461.000000, 626.899980);
    ctx.lineTo(495.400000, 626.899980);
    ctx.lineTo(495.400000, 634.199980);
    ctx.lineTo(469.500000, 634.199980);
    ctx.lineTo(469.500000, 652.799980);
    ctx.lineTo(494.000000, 652.799980);
    ctx.lineTo(494.000000, 659.999980);
    ctx.lineTo(469.500000, 659.999980);
    ctx.lineTo(469.500000, 681.399980);
    ctx.lineTo(497.100000, 681.399980);
    ctx.lineTo(497.100000, 688.299980);
    ctx.lineTo(461.000000, 688.299980);
    ctx.fill();

    // #pathT
    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.lineWidth = 1.000000;
    ctx.fillStyle = color;
    ctx.moveTo(550.900000, 626.899980);
    ctx.lineTo(598.400000, 626.899980);
    ctx.lineTo(598.400000, 634.299980);
    ctx.lineTo(579.000000, 634.299980);
    ctx.lineTo(579.000000, 688.199980);
    ctx.lineTo(570.300000, 688.199980);
    ctx.lineTo(570.300000, 634.199980);
    ctx.lineTo(550.900000, 634.199980);
    ctx.fill();
  };

  window.MagnetLogo = MagnetLogo;
}());
