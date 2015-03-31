(function() {
  'use strict';

  var LogoMagnet = Class.extend({

    init: function(el) {
      var width = el.clientWidth;
      var height = el.clientHeight;
      console.log(el.clientHeight);

      this.canvas = el;
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx = this.canvas.getContext('2d');

      this.FPS = 40;

      this.currentAngle = 0;
      this.deltaAngle = Math.PI / 180;

      this.ctx.translate(width / 4, 0);
    },

    animate: function() {
      var self = this;

      this.interval = setInterval(function() {
        self.ctx.save();
        self.clear();
        self.resize();
        self.rotate();
        self.draw();
        self.ctx.restore();
        self.ctx.setTransform(1, 0, 0, 1, 0, 0);
      }, 1000 / this.FPS);
    },

    resize: function() {
      var size = Math.sin(Date.now() / 1000) + 1;
      this.ctx.scale(size, size);
      var auxColor;

      if (size > 1.5) {
        auxColor = this.backgroundColor;

        this.backgroundColor = this.mantaColor;
        this.mantaColor = this.textColor;
        this.textColor = auxColor;
      }
    },

    stop: function() {
      clearInterval(this.interval);
    },

    clear: function() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    draw: function() {
      if (this.backgroundColor) {
        this.renderBackground();
      }
      if (this.mantaColor) {
        this.renderManta();
      }
      if (this.renderText) {
        this.renderText();
      }
    },

    rotate: function() {

      var width = this.canvas.width;
      var height = this.canvas.height;

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
    },

    renderBackground: function(color) {
      var ctx = this.ctx;

      if (!this.backgroundColor) {
        this.backgroundColor = color || 'rgb(40, 175, 206)';
      }
      // #layerBackground

      // #rectBackground
      ctx.beginPath();
      ctx.lineJoin = 'miter';
      ctx.lineCap = 'butt';
      ctx.miterLimit = 4;
      ctx.lineWidth = 3.000000;
      ctx.fillStyle = this.backgroundColor;
      ctx.rect(0.000000, 0.000000, 600.000000, 600.000000);
      ctx.fill();
    },

    renderManta: function(color) {
      this.renderPerimeter(color);
      this.renderRightEye();
      this.renderLeftEye();
      this.renderMantaGill();
    },

    renderPerimeter: function(color) {
      var ctx = this.ctx;

      if (!this.mantaColor) {
        this.mantaColor = color || 'rgb(40, 175, 206)';
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
      ctx.moveTo(73.977794, 282.246470);
      ctx.bezierCurveTo(73.883624, 257.774170, 126.304670, 235.789760, 167.909670, 213.081560);
      ctx.bezierCurveTo(210.484640, 190.947100, 263.150880, 157.254600, 269.623680, 148.155170);
      ctx.bezierCurveTo(275.191880, 140.327420, 269.839980, 133.310800, 276.059650, 127.506190);
      ctx.bezierCurveTo(286.595280, 117.673640, 309.903650, 127.080550, 309.903650, 127.080550);
      ctx.bezierCurveTo(329.383360, 120.770220, 336.119160, 122.161820, 344.073280, 127.680550);
      ctx.bezierCurveTo(350.299990, 132.000770, 344.896370, 139.256320, 350.414360, 148.467920);
      ctx.bezierCurveTo(353.756740, 154.047600, 384.724500, 174.504720, 411.774040, 190.786410);
      ctx.bezierCurveTo(442.391090, 209.215460, 501.558930, 237.365520, 523.480400, 252.805020);
      ctx.bezierCurveTo(529.622190, 257.130740, 546.508970, 268.007830, 546.180780, 282.695200);
      ctx.bezierCurveTo(525.054890, 282.146470, 501.006500, 280.786330, 481.938570, 289.908330);
      ctx.bezierCurveTo(434.929310, 312.397310, 410.960720, 336.764950, 394.599010, 349.718160);
      ctx.bezierCurveTo(380.442620, 360.925470, 336.504020, 402.897790, 319.965380, 411.704360);
      ctx.bezierCurveTo(315.274030, 460.083760, 277.985540, 490.298510, 219.356590, 490.313020);
      ctx.bezierCurveTo(164.705390, 490.326520, 106.655900, 472.630580, 84.580471, 433.491850);
      ctx.bezierCurveTo(72.602628, 412.255680, 69.306950, 383.452180, 80.690676, 364.029490);
      ctx.bezierCurveTo(90.442479, 347.391150, 106.636980, 344.334470, 116.447430, 344.324140);
      ctx.bezierCurveTo(98.060061, 345.801180, 86.567091, 361.601140, 84.770140, 364.937400);
      ctx.bezierCurveTo(68.768427, 394.646550, 82.181973, 426.775320, 97.898581, 443.943260);
      ctx.bezierCurveTo(116.813410, 464.604760, 155.320920, 483.254050, 217.471650, 483.228330);
      ctx.bezierCurveTo(295.609590, 483.196030, 302.747630, 434.598940, 301.575330, 411.122340);
      ctx.bezierCurveTo(289.352120, 408.535100, 268.100100, 385.143590, 218.117950, 343.677970);
      ctx.bezierCurveTo(198.001420, 326.989120, 154.068400, 293.230440, 126.355340, 286.487540);
      ctx.bezierCurveTo(106.983590, 281.774170, 88.442594, 282.034780, 73.977794, 282.246470);
      ctx.fill();
      ctx.stroke(); },
    renderRightEye: function() {
      var ctx = this.ctx;

      // #pathMataRightEye
      ctx.beginPath();
      ctx.lineJoin = 'miter';
      ctx.lineCap = 'butt';
      ctx.lineWidth = 1.000000;
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.moveTo(338.300000, 149.099980);
      ctx.bezierCurveTo(345.250000, 163.849980, 342.600000, 168.199980, 343.100000, 170.199980);
      ctx.bezierCurveTo(343.600000, 172.199980, 345.527290, 171.473970, 346.350000, 170.749980);
      ctx.bezierCurveTo(347.766970, 169.503030, 357.100000, 158.749980, 338.300000, 149.099980);
      ctx.fill();
    },

    renderLeftEye: function() {
      var ctx = this.ctx;

      // #pathMantaLeftEye
      ctx.beginPath();
      ctx.lineJoin = 'miter';
      ctx.lineCap = 'butt';
      ctx.lineWidth = 1.000000;
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.moveTo(282.106930, 149.151200);
      ctx.bezierCurveTo(275.156930, 163.901200, 277.806930, 168.251200, 277.306930, 170.251200);
      ctx.bezierCurveTo(276.806930, 172.251200, 274.879640, 171.525190, 274.056930, 170.801200);
      ctx.bezierCurveTo(272.639960, 169.554250, 263.306930, 158.801200, 282.106930, 149.151200);
      ctx.fill();
    },

    renderMantaGill: function() {
      var ctx = this.ctx;

      // #pathMantaGill
      ctx.beginPath();
      ctx.lineJoin = 'miter';
      ctx.lineCap = 'butt';
      ctx.lineWidth = 1.000000;
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.moveTo(345.810920, 210.370830);
      ctx.bezierCurveTo(354.767600, 198.585720, 361.078010, 184.850690, 354.596200, 163.166080);
      ctx.bezierCurveTo(366.717020, 179.104580, 376.198660, 206.571000, 344.596710, 232.698250);
      ctx.bezierCurveTo(354.024800, 219.145370, 354.260500, 215.220580, 354.614050, 208.738770);
      ctx.bezierCurveTo(352.892730, 210.760090, 349.182150, 211.288680, 345.810920, 210.370830);
      ctx.fill();
    },

    renderText: function(color) {
      var ctx = this.ctx;

      if (!this.textColor) {
        this.textColor = color || 'rgb(87, 87, 87)';
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
      ctx.bezierCurveTo(280.900000, 636.199980, 274.402680, 633.299980, 266.800000, 633.299980);
      ctx.bezierCurveTo(259.197320, 633.299980, 241.300000, 637.468290, 241.300000, 657.999980);
      ctx.bezierCurveTo(241.300000, 678.531670, 258.389840, 682.199980, 266.300000, 682.199980);
      ctx.bezierCurveTo(274.210160, 682.199980, 276.700000, 680.499980, 276.700000, 680.499980);
      ctx.lineTo(276.700000, 662.799980);
      ctx.lineTo(264.000000, 662.799980);
      ctx.lineTo(264.000000, 656.099980);
      ctx.lineTo(285.000000, 656.099980);
      ctx.lineTo(285.000000, 685.499980);
      ctx.bezierCurveTo(285.000000, 685.499980, 277.252910, 689.099980, 264.900000, 689.099980);
      ctx.bezierCurveTo(252.547090, 689.099980, 232.400000, 683.421200, 232.400000, 658.399980);
      ctx.bezierCurveTo(232.400000, 633.378760, 253.885090, 626.499980, 266.500000, 626.499980);
      ctx.bezierCurveTo(279.114910, 626.499980, 283.100000, 629.399980, 283.100000, 629.399980);
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
    }
  });

  window.LogoMagnet = LogoMagnet;
}());
