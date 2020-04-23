(function() {
  /**
   * Magnet logo class constructor.
   * @constructor
   * @param {Object} element - Target HTMLCanvasElement or the
   * HTMLElementelement where to put a Canvas.
   */
  function MagnetLogo(element, options) {

    // check if the element is a canvas. If not, create a new canvas and
    // place it inside the given element
    if (element.tagName === 'CANVAS') {
      this.canvas = element;
    } else {
      this.canvas = document.createElement('canvas');
      element.appendChild(this.canvas);
    }

    this.setup(element, options);
  }

  // ratios are width / height
  MagnetLogo.drawginPadding = 1.629822;
  MagnetLogo.isotypeHeight = 53.466718 + MagnetLogo.drawginPadding;
  MagnetLogo.isologotypeHeight = 66.56860 + MagnetLogo.drawginPadding;
  MagnetLogo.logotypeHeight = (
    MagnetLogo.isologotypeHeight -
    58.101936 +
    MagnetLogo.drawginPadding
  );

  MagnetLogo.isotypeWidth = 57.996102 + MagnetLogo.drawginPadding;
  MagnetLogo.isologotypeWidth = MagnetLogo.isotypeWidth;
  MagnetLogo.logotypeWidth = MagnetLogo.isotypeWidth;

  MagnetLogo.logotypeRatio = (
    MagnetLogo.logotypeWidth / MagnetLogo.logotypeHeight
  );
  MagnetLogo.isotypeRatio = (
    MagnetLogo.isotypeWidth / MagnetLogo.isotypeHeight
  );
  MagnetLogo.verticalIsologotypeRatio = (
    MagnetLogo.isologotypeWidth / MagnetLogo.isologotypeHeight
  );

  MagnetLogo.horizontalTextScale = 2.6;
  MagnetLogo.horizontalIsologotypeRatio = (
    MagnetLogo.isologotypeWidth * (1 + MagnetLogo.horizontalTextScale) /
    MagnetLogo.isologotypeHeight
  );

  /**
   * MagnetLogo.setup - Sets the values used to draw a the Magnet logo
   */
  MagnetLogo.prototype.setup = function(element, options) {
    this.ctx = this.canvas.getContext('2d');

    this.setDefaults(element);
    this.setOptions(options);
  };

  /**
   * MagnetLogo.optionSetup - Loads an object with options.
   * @param {Object} options - The options object.
   */
  MagnetLogo.prototype.setOptions = function(options) {
    var i;

    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;

    // Force options to be an object
    options = options || {};

    // set all the attributes
    for (i in options) {
      if (options.hasOwnProperty(i)) {
        this[i] = options[i];
      }
    }

    if (options.fitToClientSize) {
      this.width = this.canvas.clientWidth;
      this.height = this.canvas.clientHeight;
    }

    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    this.canvas.height = (
      this.height + this.marginBottom + this.marginTop
    ) * dpr;
    this.canvas.width = (
      this.width + this.marginRight + this.marginLeft
    ) * dpr;

    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    var ctx = this.canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    this.canvas.style.width = (
      this.width + this.marginRight + this.marginLeft
    ) + 'px';

    this.canvas.style.height = (
      this.height + this.marginBottom + this.marginTop
    ) + 'px';

    // There are 3 heights:
    // Logotype
    // Vertical Isologotype
    // Isotype and Horizontal Isotype

    // there are 2 widths
    // Vertical width
    // Horizontal width

    this.drawingWidth = MagnetLogo.isotypeWidth;

    //if there is no maanta, assume there is only text
    if (!this.mantaEnabled) {
      this.drawingHeight = MagnetLogo.logotypeHeight;
    } else if (this.textEnabled) {
      // there is text and manta
      if (this.horizontal) {
        this.drawingHeight = MagnetLogo.isotypeHeight;
        this.drawingWidth *= 3.65;
      } else {
        this.drawingHeight = MagnetLogo.isologotypeHeight;
      }
    } else {
      // there is only a manta
      this.drawingHeight = MagnetLogo.isotypeHeight;
    }
  };

  /**
   * MagnetLogo.setDefaults - Set the default draw values for the logo.
   * @param {Object} element - The options object.
   */
  MagnetLogo.prototype.setDefaults = function(element) {
    // set the colors
    this.backgroundColor = 'rgb(255, 255, 255)';
    this.mantaColor = 'rgb(0, 131, 186)';
    this.textColor = 'rgb(102, 102, 102)';
    this.borderColor = 'rgb(0, 131, 186)';
    this.eyesColor = 'rgb(255, 255, 255)';

    this.width = element.clientWidth;
    this.marginBottom = 0;
    this.marginLeft = 0;
    this.marginRight = 0;
    this.marginTop = 0;
    this.height = element.clientHeight;

    this.canvas.height = this.height;
    this.canvas.width = this.width;

    // enables the 3 segments of drawing
    this.backgroundEnabled = true;
    this.mantaEnabled = true;
    this.textEnabled = true;

    this.scale = 1;

    // set the default render behaviour
    this.logoSize = 'contain';
    this.position = 'center';

    this.horizontal = false;
  };

  /**
   * MagnetLogo.render - Loads an object with options and renders the logo again
   * into the canvas
   * @param {Object} options - The options object.
   */
  MagnetLogo.prototype.render = function(options) {
    this.setOptions(options);

    if (this.logoSize === 'contain') {
      this.fitContainer();
    }

    if (this.position === 'center') {
      this.center();
    }

    this.drawBackground();
    this.drawManta();
    this.drawText();
  };

  /**
   * MagnetLogo.fitContainer - changes the scale of the image to be drawn
   * completly within the canvas
   */
  MagnetLogo.prototype.fitContainer = function() {
    // by default there is no separation between the canvas and the logo
    var topOffset = 0;

    if (this.textEnabled && !this.mantaEnabled) {
      // since we are only rendering the text, we need to move the text up
      topOffset = MagnetLogo.isotypeHeight + MagnetLogo.drawginPadding;
    }

    var newWidthScale = this.width / this.drawingWidth;
    var newHeightScale = this.height / this.drawingHeight;

    if (newWidthScale < newHeightScale) {
      this.scale = newWidthScale;
    } else {
      this.scale = newHeightScale;
    }

    // move to the top
    this.ctx.translate(0, -1 * (topOffset * this.scale));

    this.ctx.scale(this.scale, this.scale);
  };

  /**
   * MagnetLogo.center - Aligns the logo with the canvas center.
   */
  MagnetLogo.prototype.center = function() {
    var oy;

    var ox = this.marginLeft + (
      this.width - this.scale * this.drawingWidth) /
      2 / this.scale;

    oy = this.marginTop + (
      this.height - this.scale * this.drawingHeight) /
      2 / this.scale;

    this.ctx.translate(ox, oy);
  };

  /**
   * MagnetLogo.clear - Resets transformation and clears the canvas.
   */
  MagnetLogo.prototype.clear = function() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  /**
   * MagnetLogo.leftTransform - For a given x coord, obtain the translated coord
   */
  MagnetLogo.prototype.leftTransform = function(x) {
    var toCenter = this.centerX - x;
    var distanceFactor = toCenter / this.centerX;

    var horizontalFactor = 1 - ((1 - this.horizontalFactor) * distanceFactor);

    return this.centerX - (horizontalFactor * toCenter);
  };

  /**
   * MagnetLogo.rightTransform - For a given x coord, obtain the translated coord
   */
  MagnetLogo.prototype.rightTransform = function(x) {
    var fromCenter = x - this.centerX;
    var distanceFactor = fromCenter / this.centerX;

    var horizontalFactor = 1 - ((1 - this.horizontalFactor) * distanceFactor);
    return this.centerX + (horizontalFactor * fromCenter);
  };

  /**
   * MagnetLogo.rightTransform - For a given x coord, obtain the flip translated
   * coord
   */
  MagnetLogo.prototype.flipTransform = function(x) {
    var distance = x - this.centerX;
    distance = this.horizontalFactor * distance;
    return this.centerX + distance;
  };

  /**
   * MagnetLogo.rightTransform - For a given y coord, tip of the tail
   */
  MagnetLogo.prototype.tailY = function(y) {
    return (this.horizontalFactor - 0.7) * 50 + y;
  };

  /**
   * MagnetLogo.drawBackground - Draws the background of the logo
   */
  MagnetLogo.prototype.drawBackground = function(color) {
    var ctx = this.ctx;

    if (!this.backgroundEnabled) {
      return;
    }

    if (color) {
      this.backgroundColor = color;
    }

    // #rectBackground
    ctx.beginPath();
    ctx.globalAlpha = 0.97;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.miterLimit = 4;
    ctx.fillStyle = this.backgroundColor;
    ctx.rect(
      -this.drawingWidth,
      -this.drawingHeight,
      3 * this.drawingWidth,
      3 * this.drawingHeight
    );

    ctx.fill();
    ctx.globalAlpha = 1;
  };

  /**
   * MagnetLogo.drawManta - Draws the mantaray
   */
  MagnetLogo.prototype.drawManta = function() {
    if (!this.mantaEnabled) {
      return;
    }

    this.drawPerimeter();
    this.drawRightEye();
    this.drawLeftEye();
    this.drawMantaGill();

    // Global movement correction
    this.ctx.translate(0, 30 * this.cosTime);
  };

  /**
   * MagnetLogo.drawPerimeter - Draws the perimieter of the mantaray
   */
  MagnetLogo.prototype.drawPerimeter = function(color, borderColor) {
    var ctx = this.ctx;

    if (borderColor) {
      this.borderColor = borderColor;
    }

    if (color) {
      this.mantaColor = color;
    }

    // #layerManta

    // #pathMantaPerimeter
    ctx.beginPath();
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = 0.100000;
    ctx.fillStyle = this.mantaColor;

    // Global movement

    // Right wing
    this.ctx.moveTo(56.239551, 24.193331);
    this.ctx.bezierCurveTo(
      49.042884, 24.172161, 42.163718, 27.114302, 37.189551, 32.130718
    );
    this.ctx.bezierCurveTo(
      34.162718, 35.178718, 31.792051, 39.073384, 30.500884, 43.476051
    );
    this.ctx.bezierCurveTo(
      29.823551, 45.762051, 28.595884, 47.772884, 27.029636, 49.360384
    );
    this.ctx.bezierCurveTo(
      24.447331, 51.963884, 20.891359, 53.466718, 17.166026, 53.466718
    );
    this.ctx.bezierCurveTo(
      17.039054, 53.466718, 16.912054, 53.466718, 16.785054, 53.466718
    );
    // tip of tial
    this.ctx.bezierCurveTo(
      16.615720, 53.466718, 16.467554, 53.318551, 16.467554, 53.128051
    );
    this.ctx.bezierCurveTo(
      16.467554, 52.958718, 16.615720, 52.810551, 16.785054, 52.810551
    );
    this.ctx.bezierCurveTo(
      19.325026, 52.810551, 21.864997, 51.921551, 23.918164, 50.101218
    );
    this.ctx.bezierCurveTo(
      25.505636, 48.683051, 26.585136, 46.883884, 27.114302, 44.957718
    );
    this.ctx.bezierCurveTo(
      27.918636, 42.079051, 27.495302, 38.946384, 25.823136, 36.342884
    );
    this.ctx.bezierCurveTo(
      21.039497, 29.019218, 12.784582, 24.193331, 3.386638, 24.193331
    );
    this.ctx.lineTo(3.386638, 24.193331);
    this.ctx.lineTo(3.407805, 24.193331);
    this.ctx.bezierCurveTo(
      2.434150, 24.193331, 1.629822, 23.410164, 1.629822, 22.436497
    );
    this.ctx.bezierCurveTo(
      1.629822, 21.229997, 2.222483, 20.171692, 3.132639, 19.536692
    );
    this.ctx.lineTo(3.132639, 19.536692);

    // left lip
    this.ctx.lineTo(23.579497, 5.312805);
    this.ctx.lineTo(23.579497, 5.312805);
    this.ctx.bezierCurveTo(
      24.172164, 4.868305, 24.553164, 4.169805, 24.553164, 3.365472
    );
    this.ctx.bezierCurveTo(
      24.553164, 2.412983, 25.336302, 1.629822, 26.309969, 1.629822
    );
    // right lip
    this.ctx.bezierCurveTo(
      27.643469, 1.629822, 28.871051, 2.137816, 29.823551, 2.963305
    );
    this.ctx.bezierCurveTo(
      30.754884, 2.137816, 31.982551, 1.629822, 33.316051, 1.629822
    );
    this.ctx.bezierCurveTo(
      34.289718, 1.629822, 35.072884, 2.412983, 35.072884, 3.365472
    );
    this.ctx.bezierCurveTo(
      35.072884, 4.169805, 35.453884, 4.868305, 36.046551, 5.312805
    );
    this.ctx.lineTo(36.046551, 5.312805);
    this.ctx.lineTo(56.493551, 19.536692);
    this.ctx.lineTo(56.493551, 19.536692);
    this.ctx.bezierCurveTo(
      57.403436, 20.171692, 57.996102, 21.229997, 57.996102, 22.436497
    );
    this.ctx.bezierCurveTo(
      57.996102, 23.410164, 57.212936, 24.193331, 56.239551, 24.193331
    );
    this.ctx.fill();

    this.ctx.fill();
    this.ctx.stroke();
  };

  /**
   * MagnetLogo.drawRightEye - Draws the right eye of the mantaray
   */
  MagnetLogo.prototype.drawRightEye = function() {
    var ctx = this.ctx;

    // #pathMataRightEye
    ctx.beginPath();
    ctx.fillStyle = this.eyesColor;
    ctx.moveTo(33.104384, 5.079972);
    ctx.bezierCurveTo(
      33.040884, 5.460972, 33.019714, 5.820777, 33.019714, 6.201777
    );
    ctx.bezierCurveTo(
      33.019714, 6.879110, 33.104384, 7.514110, 33.252547, 8.106777
    );
    ctx.bezierCurveTo(
      33.591214, 7.746944, 33.802880, 7.238944, 33.802880, 6.667444
    );
    ctx.bezierCurveTo(
      33.802880, 6.032444, 33.548880, 5.482138, 33.104380, 5.079972
    );
    ctx.fill();
  };

  /**
   * MagnetLogo.drawLeftEye - Draws the left eye of the mantaray
   */
  MagnetLogo.prototype.drawLeftEye = function() {
    var ctx = this.ctx;

    // #pathMantaLeftEye
    ctx.beginPath();
    ctx.fillStyle = this.eyesColor;
    ctx.moveTo(26.542802, 5.079972);
    ctx.bezierCurveTo(
      26.585132, 5.460972, 26.606302, 5.820777, 26.606302, 6.201777
    );
    ctx.bezierCurveTo(
      26.606302, 6.879110, 26.542802, 7.514110, 26.394636, 8.106777
    );
    ctx.bezierCurveTo(
      26.034802, 7.746944, 25.823136, 7.238944, 25.823136, 6.667444
    );
    ctx.bezierCurveTo(
      25.823136, 6.032444, 26.098302, 5.482138, 26.542802, 5.079972
    );
    ctx.fill();
  };

  /**
   * MagnetLogo.drawMantaGill - Draws the gill of the mantaray
   */
  MagnetLogo.prototype.drawMantaGill = function() {
    var ctx = this.ctx;

    ctx.beginPath();
    ctx.fillStyle = this.eyesColor;
    ctx.moveTo(35.305718, 6.730944);
    ctx.bezierCurveTo(
      35.411551, 6.879110, 35.517384, 7.027277, 35.602051, 7.196610
    );
    ctx.bezierCurveTo(
      35.983051, 7.852777, 36.173551, 8.551277, 36.215884, 9.249777
    );
    ctx.bezierCurveTo(
      36.300554, 10.625582, 35.750218, 12.001415, 34.713051, 12.953915
    );
    ctx.bezierCurveTo(
      35.030551, 12.848082, 35.326884, 12.721082, 35.623218, 12.551749
    );
    ctx.bezierCurveTo(
      36.025384, 12.318915, 36.385218, 12.022582, 36.681551, 11.705082
    );
    ctx.bezierCurveTo(
      36.575718, 12.996249, 35.919551, 14.223887, 34.818884, 15.028220
    );
    ctx.bezierCurveTo(
      34.988218, 14.964720, 35.157551, 14.880054, 35.305718, 14.795387
    );
    ctx.bezierCurveTo(
      36.977884, 13.842887, 37.803384, 12.022582, 37.612884, 10.223415
    );
    ctx.bezierCurveTo(
      37.528214, 9.609582, 37.337718, 8.995777, 37.020218, 8.445444
    );
    ctx.bezierCurveTo(
      36.596884, 7.704610, 36.004218, 7.133110, 35.305718, 6.730944
    );
    ctx.fill();

  };

  /**
   * MagnetLogo.drawText - Draws the "MAGNET" text.
   */
  MagnetLogo.prototype.drawText = function(color) {
    var ctx = this.ctx;

    if (!this.textEnabled) {
      return;
    }

    if (this.mantaEnabled && this.horizontal) {
      this.ctx.scale(
        MagnetLogo.horizontalTextScale,
        MagnetLogo.horizontalTextScale
      );
      this.ctx.translate(25, -52);
    }

    if (color) {
      this.textColor = color;
    }

    // #layerText

    // #path M
    ctx.beginPath();
    ctx.fillStyle = this.textColor;
    ctx.moveTo(6.053610, 63.435936);
    ctx.bezierCurveTo(
      6.117110, 63.584102, 6.159444, 63.711102, 6.222944, 63.838102
    );
    ctx.bezierCurveTo(
      6.265277, 63.711102, 6.328777, 63.562936, 6.392277, 63.435936
    );
    ctx.bezierCurveTo(
      6.455777, 63.287769, 6.498110, 63.160769, 6.582777, 63.033769
    );
    ctx.lineTo(9.080444, 58.355936);
    ctx.bezierCurveTo(
      9.101611, 58.292436, 9.143944, 58.250102, 9.165111, 58.207769
    );
    ctx.bezierCurveTo(
      9.207444, 58.186599, 9.249778, 58.165439, 9.270944, 58.144269
    );
    ctx.bezierCurveTo(
      9.313277, 58.123099, 9.376777, 58.123099, 9.419111, 58.101939
    );
    ctx.bezierCurveTo(
      9.461444, 58.101939, 9.524944, 58.101939, 9.588416, 58.101939
    );

    ctx.lineTo(10.773749, 58.101939);
    ctx.lineTo(10.773749, 66.547439);
    ctx.lineTo(9.397944, 66.547439);
    ctx.lineTo(9.397944, 61.107605);
    ctx.bezierCurveTo(
      9.397944, 61.001772, 9.397944, 60.895939, 9.397944, 60.768939
    );
    ctx.bezierCurveTo(
      9.419111, 60.641939, 9.419111, 60.514939, 9.440277, 60.409105
    );
    ctx.lineTo(6.879110, 65.192772);
    ctx.bezierCurveTo(
      6.815610, 65.298605, 6.752110, 65.383272, 6.646277, 65.446772
    );
    ctx.bezierCurveTo(
      6.561610, 65.510272, 6.455777, 65.531442, 6.328777, 65.531442
    );
    ctx.lineTo(6.117110, 65.531442);
    ctx.bezierCurveTo(
      5.990110, 65.531442, 5.884277, 65.510272, 5.778444, 65.446772
    );
    ctx.bezierCurveTo(
      5.693805, 65.383272, 5.609138, 65.298605, 5.545638, 65.192772
    );
    ctx.lineTo(2.963305, 60.387936);
    ctx.bezierCurveTo(
      2.984472, 60.514936, 2.984472, 60.641936, 3.005638, 60.768936
    );
    ctx.bezierCurveTo(
      3.005638, 60.895936, 3.005638, 61.001769, 3.005638, 61.107602
    );
    ctx.lineTo(3.005638, 66.568602);
    ctx.lineTo(1.629822, 66.568602);
    ctx.lineTo(1.629822, 58.101936);
    ctx.lineTo(2.815147, 58.101936);
    ctx.bezierCurveTo(
      2.878639, 58.101936, 2.942138, 58.101936, 2.984472, 58.123106
    );
    ctx.bezierCurveTo(
      3.047972, 58.123106, 3.090305, 58.123106, 3.132638, 58.144276
    );
    ctx.bezierCurveTo(
      3.174971, 58.165446, 3.196138, 58.186606, 3.238472, 58.228946
    );
    ctx.bezierCurveTo(
      3.280805, 58.250116, 3.301972, 58.292446, 3.344305, 58.355946
    );
    ctx.lineTo(5.863110, 63.054946);
    ctx.bezierCurveTo(
      5.926610, 63.181946, 5.990110, 63.308946, 6.053610, 63.435946
    );
    ctx.fill();

    // #pathA
    ctx.beginPath();
    ctx.fillStyle = this.textColor;
    ctx.moveTo(21.737997, 66.568602);
    ctx.lineTo(20.531526, 66.568602);
    ctx.bezierCurveTo(
      20.383359, 66.568602, 20.277526, 66.526272, 20.192859, 66.462769
    );
    ctx.bezierCurveTo(
      20.108189, 66.399269, 20.044692, 66.314602, 20.002359, 66.208769
    );
    ctx.lineTo(19.367359, 64.473102);
    ctx.lineTo(15.874887, 64.473102);
    ctx.lineTo(15.239887, 66.208769);
    ctx.bezierCurveTo(
      15.197557, 66.293439, 15.134054, 66.378102, 15.049387, 66.441602
    );
    ctx.bezierCurveTo(
      14.964717, 66.526272, 14.837720, 66.568602, 14.710720, 66.568602
    );
    ctx.lineTo(13.483054, 66.568602);
    ctx.lineTo(16.806220, 58.101936);
    ctx.lineTo(18.414859, 58.101936);
    ctx.lineTo(21.737997, 66.568602);
    ctx.moveTo(16.277054, 63.372436);
    ctx.lineTo(18.965192, 63.372436);
    ctx.lineTo(17.928026, 60.557269);
    ctx.bezierCurveTo(
      17.885696, 60.430269, 17.843356, 60.282102, 17.779859, 60.112769
    );
    ctx.bezierCurveTo(
      17.716359, 59.943436, 17.674026, 59.774102, 17.610526, 59.562436
    );
    ctx.bezierCurveTo(
      17.568196, 59.752936, 17.504692, 59.943436, 17.462359, 60.112769
    );
    ctx.bezierCurveTo(
      17.398859, 60.303269, 17.356526, 60.451436, 17.293026, 60.578436
    );
    ctx.lineTo(16.277054, 63.372436);
    ctx.fill();

    // #path G
    ctx.beginPath();
    ctx.fillStyle = this.textColor;
    ctx.moveTo(27.516469, 65.404436);
    ctx.bezierCurveTo(
      27.876302, 65.404436, 28.172636, 65.362106, 28.426551, 65.298602
    );
    ctx.bezierCurveTo(
      28.701718, 65.235102, 28.955718, 65.150436, 29.188551, 65.044602
    );
    ctx.lineTo(29.188551, 63.499436);
    ctx.lineTo(28.130302, 63.499436);
    ctx.bezierCurveTo(
      28.024469, 63.499436, 27.939802, 63.478266, 27.897469, 63.414766
    );
    ctx.bezierCurveTo(
      27.833969, 63.351266, 27.791636, 63.287766, 27.791636, 63.203099
    );
    ctx.lineTo(27.791636, 62.314099);
    ctx.lineTo(30.606718, 62.314099);
    ctx.lineTo(30.606718, 65.743099);
    ctx.bezierCurveTo(
      30.395051, 65.891266, 30.183384, 66.018266, 29.950551, 66.145266
    );
    ctx.bezierCurveTo(
      29.717718, 66.251099, 29.463718, 66.356933, 29.209718, 66.420433
    );
    ctx.bezierCurveTo(
      28.934551, 66.505103, 28.659384, 66.547433, 28.363051, 66.589766
    );
    ctx.bezierCurveTo(
      28.066802, 66.632096, 27.728136, 66.653266, 27.389469, 66.653266
    );
    ctx.bezierCurveTo(
      26.775636, 66.653266, 26.204136, 66.547433, 25.674969, 66.335766
    );
    ctx.bezierCurveTo(
      25.166969, 66.102933, 24.722497, 65.806599, 24.341497, 65.425599
    );
    ctx.bezierCurveTo(
      23.960497, 65.044599, 23.664164, 64.600099, 23.452497, 64.070933
    );
    ctx.bezierCurveTo(
      23.240831, 63.541766, 23.134997, 62.949099, 23.134997, 62.335266
    );
    ctx.bezierCurveTo(
      23.134997, 61.700266, 23.240831, 61.107599, 23.452497, 60.578433
    );
    ctx.bezierCurveTo(
      23.642997, 60.049266, 23.939331, 59.604766, 24.320331, 59.202599
    );
    ctx.bezierCurveTo(
      24.701331, 58.821599, 25.166969, 58.525266, 25.717302, 58.313599
    );
    ctx.bezierCurveTo(
      26.246469, 58.101933, 26.860302, 58.017266, 27.537636, 58.017266
    );
    ctx.bezierCurveTo(
      28.214969, 58.017266, 28.828718, 58.101936, 29.315551, 58.313599
    );
    ctx.bezierCurveTo(
      29.823551, 58.525266, 30.246884, 58.779266, 30.606718, 59.117933
    );
    ctx.lineTo(30.162218, 59.837599);
    ctx.bezierCurveTo(
      30.056384, 59.964599, 29.950551, 60.049266, 29.802384, 60.049266
    );
    ctx.bezierCurveTo(
      29.696551, 60.049266, 29.611884, 60.006936, 29.506051, 59.943433
    );
    ctx.bezierCurveTo(
      29.379051, 59.879933, 29.252051, 59.795266, 29.125051, 59.731766
    );
    ctx.bezierCurveTo(
      28.998051, 59.647096, 28.849884, 59.583599, 28.701718, 59.541266
    );
    ctx.bezierCurveTo(
      28.532384, 59.477766, 28.363051, 59.435433, 28.172636, 59.393099
    );
    ctx.bezierCurveTo(
      27.960969, 59.371929, 27.749302, 59.350769, 27.495302, 59.350769
    );
    ctx.bezierCurveTo(
      27.071969, 59.350769, 26.690969, 59.414269, 26.352302, 59.562436
    );
    ctx.bezierCurveTo(
      26.013636, 59.710602, 25.738469, 59.901102, 25.484469, 60.155102
    );
    ctx.bezierCurveTo(
      25.251636, 60.430269, 25.082302, 60.726602, 24.934136, 61.107602
    );
    ctx.bezierCurveTo(
      24.807136, 61.467436, 24.743664, 61.869602, 24.743664, 62.335269
    );
    ctx.bezierCurveTo(
      24.743664, 62.822102, 24.828304, 63.245436, 24.955302, 63.626436
    );
    ctx.bezierCurveTo(
      25.082302, 64.007436, 25.272802, 64.324936, 25.526802, 64.600102
    );
    ctx.bezierCurveTo(
      25.780802, 64.854102, 26.055969, 65.044602, 26.394636, 65.192769
    );
    ctx.bezierCurveTo(
      26.733302, 65.340936, 27.114302, 65.404436, 27.516469, 65.404436
    );
    ctx.fill();

    // #pathN
    ctx.beginPath();
    ctx.fillStyle = this.textColor;
    ctx.moveTo(34.374384, 58.123102);
    ctx.bezierCurveTo(
      34.416714, 58.123102, 34.459054, 58.144272, 34.480218, 58.144272
    );
    ctx.bezierCurveTo(
      34.522548, 58.165442, 34.564888, 58.186602, 34.607218, 58.228942
    );
    ctx.bezierCurveTo(
      34.628388, 58.271272, 34.670718, 58.313612, 34.713051, 58.355942
    );
    ctx.lineTo(39.158051, 64.007442);
    ctx.bezierCurveTo(
      39.136881, 63.880442, 39.115721, 63.732275, 39.115721, 63.605275
    );
    ctx.bezierCurveTo(
      39.115721, 63.478275, 39.115721, 63.351275, 39.115721, 63.245442
    );
    ctx.lineTo(39.115721, 58.101942);
    ctx.lineTo(40.491554, 58.101942);
    ctx.lineTo(40.491554, 66.568608);
    ctx.lineTo(39.687221, 66.568608);
    ctx.bezierCurveTo(
      39.560221, 66.568608, 39.454387, 66.547438, 39.369721, 66.505108
    );
    ctx.bezierCurveTo(
      39.285051, 66.462778, 39.221554, 66.399275, 39.136887, 66.293442
    );
    ctx.lineTo(34.713054, 60.663108);
    ctx.bezierCurveTo(
      34.734224, 60.790108, 34.734224, 60.917108, 34.734224, 61.022942
    );
    ctx.bezierCurveTo(
      34.734224, 61.149942, 34.755394, 61.276942, 34.755394, 61.361608
    );
    ctx.lineTo(34.755394, 66.568608);
    ctx.lineTo(33.358394, 66.568608);
    ctx.lineTo(33.358394, 58.101942);
    ctx.lineTo(34.183894, 58.101942);
    ctx.bezierCurveTo(
      34.268564, 58.101942, 34.310894, 58.101942, 34.374394, 58.123112
    );
    ctx.fill();

    // #path E
    ctx.beginPath();
    ctx.fillStyle = this.textColor;
    ctx.moveTo(48.577218, 58.101936);
    ctx.lineTo(48.577218, 59.350769);
    ctx.lineTo(44.830718, 59.350769);
    ctx.lineTo(44.830718, 61.700269);
    ctx.lineTo(47.794051, 61.700269);
    ctx.lineTo(47.794051, 62.906769);
    ctx.lineTo(44.830718, 62.906769);
    ctx.lineTo(44.830718, 65.298602);
    ctx.lineTo(48.577218, 65.298602);
    ctx.lineTo(48.577218, 66.568602);
    ctx.lineTo(43.243218, 66.568602);
    ctx.lineTo(43.243218, 58.101936);
    ctx.lineTo(48.577218, 58.101936);
    ctx.fill();

    // #pathT
    ctx.beginPath();
    ctx.fillStyle = this.textColor;
    // Bottom of the T
    ctx.moveTo(57.996102, 58.101936);
    ctx.lineTo(57.996102, 59.393102);
    ctx.lineTo(55.456384, 59.393102);
    // Top of the T
    ctx.lineTo(55.456384, 66.568602);
    ctx.lineTo(53.890051, 66.568602);
    ctx.lineTo(53.890051, 59.393102);
    ctx.lineTo(51.328884, 59.393102);
    ctx.lineTo(51.328884, 58.101936);
    ctx.lineTo(57.996102, 58.101936);
    ctx.fill();
  };

  window.MagnetLogo = MagnetLogo;

}());
