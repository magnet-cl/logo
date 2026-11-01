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
  MagnetLogo.drawingPadding = 1.629822;
  MagnetLogo.isotypeHeight = 53.466718 + MagnetLogo.drawingPadding;
  MagnetLogo.isologotypeHeight = 66.56860 + MagnetLogo.drawingPadding;
  MagnetLogo.logotypeHeight = (
    MagnetLogo.isologotypeHeight -
    58.101936 +
    MagnetLogo.drawingPadding
  );

  MagnetLogo.isotypeWidth = 57.996102 + MagnetLogo.drawingPadding;
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

    this.cssWidth =  this.width + this.marginLeft + this.marginRight;
    this.cssHeight = this.height + this.marginTop + this.marginBottom;

    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    this.canvas.height = this.cssHeight * dpr;
    this.canvas.width = this.cssWidth * dpr;

    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    var ctx = this.canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    this.canvas.style.width = this.cssWidth + 'px';
    this.canvas.style.height = this.cssHeight + 'px';

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
    this.backgroundColor = 'transparent';
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

    // text drawn beside/below the manta: 'MAGNET' (vector paths) or any
    // other string such as 'MANTA' (drawn with a bold sans-serif font)
    this.text = 'MAGNET';

    // mantaray shape: 'magnet' (animated vector) or 'manta' (Manta logo)
    this.mantaShape = 'magnet';

    // adjustments of the two gill lines of the Manta mantaray, see
    // MagnetLogo.defaultGill. Example: {left: {thickness: 2}, right: {dx: 1}}.
    // It is merged over MagnetLogo.mantaGills, the Manta default
    this.gills = null;
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

    this.setPosition();

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
      topOffset = MagnetLogo.isotypeHeight + MagnetLogo.drawingPadding;
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
   * MagnetLogo.setPosition - Aligns the logo with the canvas center.
   */
  MagnetLogo.prototype.setPosition = function() {
    if (this.position != 'center') {
      this.paddingLeft = 0;
      this.paddingTop = 0;
      return;
    }
    this.paddingLeft = (
      this.marginLeft + (this.width - this.scale * this.drawingWidth) / 2
    ) / this.scale;

    this.paddingTop = (
      this.marginTop + (this.height - this.scale * this.drawingHeight) / 2
    ) / this.scale;

    this.ctx.translate(this.paddingLeft, this.paddingTop);
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
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.miterLimit = 4;
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(
      -this.paddingLeft,
      -this.paddingTop,
      this.canvas.width,
      this.canvas.height
    );

    ctx.fill();
  };

  /**
   * MagnetLogo.drawManta - Draws the mantaray
   */
  MagnetLogo.prototype.drawManta = function() {
    if (!this.mantaEnabled) {
      return;
    }

    if (this.mantaShape === 'manta') {
      this.drawMantaRay();
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
    if (this.borderColor == this.mantaColor) {
      ctx.lineWidth = 0.010000;
    } else {
      ctx.lineWidth = 0.500000;
    }

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

    if (this.text && this.text !== 'MAGNET') {
      this.drawCustomText(this.text);
      return;
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

  // Traced outline of the Manta company mantaray. The first path is the
  // body; the others are the gill slits (cut out with the even-odd rule).
  MagnetLogo.mantaRayPaths = [[[59.179,26.908],[59.066,26.676],[58.934,26.445],[58.674,26.033],[58.367,25.569],[58.204,25.337],[57.896,24.925],[57.734,24.719],[57.603,24.565],[56.914,23.822],[56.252,23.186],[55.995,22.958],[55.428,22.482],[55.042,22.168],[54.81,21.989],[54.295,21.624],[53.6,21.18],[53.11,20.845],[52.776,20.624],[52.364,20.363],[51.926,20.107],[51.642,19.953],[51.179,19.712],[50.69,19.439],[49.865,18.997],[49.016,18.588],[48.295,18.269],[47.136,17.659],[46.492,17.332],[46.209,17.176],[45.384,16.69],[45.127,16.529],[44.818,16.325],[44.638,16.194],[44.457,16.052],[44.254,15.879],[44.106,15.743],[43.968,15.598],[43.795,15.396],[43.621,15.165],[43.494,14.959],[43.345,14.65],[43.293,14.521],[43.25,14.392],[43.226,14.289],[43.21,14.186],[43.197,13.954],[43.201,13.594],[43.212,13.465],[43.233,13.336],[43.267,13.207],[43.305,13.104],[43.353,13.001],[43.422,12.873],[43.591,12.615],[43.978,12.126],[44.156,11.868],[44.294,11.637],[44.436,11.379],[44.597,11.07],[44.72,10.812],[44.788,10.658],[44.845,10.503],[44.947,10.169],[45.002,9.963],[45.027,9.834],[45.041,9.705],[45.047,9.551],[45.042,9.396],[45.025,9.241],[44.99,9.087],[44.931,8.907],[44.85,8.701],[44.764,8.52],[44.676,8.366],[44.574,8.211],[44.476,8.083],[44.343,7.932],[44.197,7.787],[44.045,7.653],[43.891,7.534],[43.762,7.451],[43.607,7.369],[43.427,7.293],[43.274,7.241],[43.104,7.207],[43.019,7.206],[42.965,7.216],[42.92,7.236],[42.878,7.277],[42.86,7.318],[42.854,7.367],[42.859,7.424],[42.876,7.486],[42.937,7.624],[43.009,7.749],[43.271,8.16],[43.426,8.443],[43.513,8.649],[43.56,8.829],[43.575,8.958],[43.579,9.113],[43.569,9.267],[43.548,9.396],[43.507,9.551],[43.445,9.731],[43.372,9.911],[43.309,10.04],[43.235,10.168],[43.149,10.296],[43.051,10.419],[42.945,10.536],[42.832,10.643],[42.714,10.739],[42.593,10.826],[42.446,10.917],[42.298,10.996],[42.148,11.064],[41.948,11.142],[41.797,11.19],[41.619,11.237],[41.441,11.274],[41.262,11.299],[41.109,11.312],[40.877,11.319],[40.646,11.312],[40.388,11.289],[40.131,11.254],[39.719,11.18],[38.714,10.972],[38.122,10.858],[37.298,10.713],[36.809,10.637],[36.628,10.618],[36.448,10.609],[35.469,10.602],[35.315,10.591],[35.16,10.572],[34.877,10.518],[34.466,10.417],[34.315,10.358],[34.199,10.282],[34.1,10.181],[34.025,10.062],[33.978,9.936],[33.962,9.859],[33.956,9.782],[33.965,9.654],[34.003,9.499],[34.069,9.319],[34.181,9.061],[34.27,8.881],[34.369,8.701],[34.468,8.546],[34.561,8.417],[34.686,8.263],[34.846,8.086],[35.338,7.592],[35.48,7.439],[35.563,7.336],[35.616,7.258],[35.659,7.181],[35.689,7.105],[35.709,7.004],[35.705,6.933],[35.684,6.866],[35.631,6.791],[35.576,6.747],[35.488,6.706],[35.39,6.683],[35.263,6.671],[35.109,6.673],[34.954,6.685],[34.8,6.71],[34.671,6.74],[34.388,6.834],[33.95,7.021],[33.615,7.185],[33.306,7.367],[33.049,7.542],[32.482,7.955],[32.302,8.1],[32.124,8.262],[31.904,8.478],[31.721,8.677],[31.549,8.881],[31.118,9.422],[30.665,10.014],[30.534,10.169],[30.39,10.323],[30.163,10.547],[29.958,10.727],[29.752,10.882],[29.52,11.033],[29.185,11.219],[28.799,11.402],[28.413,11.563],[27.975,11.721],[27.589,11.837],[27.203,11.93],[26.816,12.001],[26.404,12.053],[25.992,12.083],[25.555,12.096],[25.065,12.094],[24.602,12.077],[24.164,12.046],[23.7,11.999],[23.159,11.929],[22.619,11.847],[22.129,11.762],[21.64,11.667],[20.378,11.391],[19.528,11.187],[17.52,10.677],[16.438,10.423],[14.172,9.944],[13.141,9.735],[12.626,9.642],[12.111,9.56],[10.0,9.262],[9.175,9.165],[8.017,9.058],[7.527,9.022],[7.115,9.002],[6.703,8.997],[6.291,9.005],[5.828,9.029],[5.338,9.069],[4.849,9.122],[4.36,9.189],[3.845,9.275],[3.407,9.365],[3.02,9.461],[2.583,9.589],[2.222,9.71],[1.946,9.823],[1.856,9.873],[1.801,9.916],[1.763,9.964],[1.749,9.998],[1.749,10.048],[1.774,10.096],[1.818,10.137],[1.877,10.172],[2.428,10.39],[2.763,10.533],[3.072,10.674],[3.819,11.046],[4.54,11.434],[5.029,11.715],[5.493,11.997],[5.956,12.294],[6.42,12.608],[6.909,12.957],[7.45,13.363],[8.017,13.808],[8.48,14.191],[9.485,15.063],[9.69,15.249],[10.069,15.628],[10.413,16.015],[11.041,16.761],[11.503,17.328],[11.995,17.895],[12.524,18.564],[12.695,18.796],[13.199,19.543],[13.649,20.187],[14.217,21.088],[15.095,22.53],[15.388,22.994],[15.923,23.895],[16.324,24.59],[16.832,25.517],[17.253,26.239],[18.186,27.964],[18.48,28.531],[19.045,29.509],[19.247,29.844],[19.415,30.102],[19.996,30.951],[20.246,31.286],[20.735,31.878],[21.085,32.29],[21.318,32.545],[21.847,33.09],[21.937,33.192],[22.016,33.295],[22.129,33.475],[22.215,33.656],[22.288,33.862],[22.343,34.093],[22.368,34.274],[22.381,34.48],[22.379,34.686],[22.363,34.892],[22.327,35.149],[22.29,35.355],[22.13,36.05],[22.052,36.334],[21.957,36.643],[21.734,37.287],[21.454,38.008],[21.135,38.755],[20.809,39.45],[20.467,40.119],[20.052,40.866],[19.622,41.587],[19.225,42.206],[18.831,42.772],[18.403,43.338],[17.964,43.876],[17.496,44.408],[17.004,44.93],[16.492,45.439],[15.941,45.954],[15.406,46.424],[14.892,46.845],[14.378,47.235],[13.863,47.594],[13.348,47.924],[12.832,48.229],[12.317,48.509],[11.777,48.777],[11.236,49.017],[10.67,49.239],[10.212,49.4],[9.361,49.674],[9.11,49.763],[9.006,49.808],[8.944,49.846],[8.927,49.873],[8.936,49.885],[8.954,49.893],[9.036,49.903],[9.184,49.898],[9.38,49.877],[9.612,49.842],[10.137,49.738],[10.721,49.594],[11.262,49.438],[11.777,49.268],[12.292,49.075],[12.807,48.86],[13.296,48.635],[13.811,48.378],[14.326,48.1],[14.841,47.8],[15.33,47.495],[15.794,47.185],[16.283,46.839],[16.798,46.453],[17.364,46.005],[17.902,45.553],[18.409,45.098],[18.879,44.645],[19.332,44.175],[19.787,43.67],[20.217,43.158],[20.663,42.592],[21.064,42.051],[21.425,41.536],[21.763,41.021],[22.077,40.506],[22.344,40.042],[22.655,39.476],[23.192,38.471],[23.873,37.16],[24.041,36.857],[24.174,36.638],[24.334,36.406],[24.541,36.144],[24.796,35.853],[25.203,35.362],[25.333,35.219],[25.492,35.067],[25.763,34.832],[26.002,34.645],[26.251,34.468],[26.535,34.29],[26.855,34.11],[27.232,33.914],[28.98,33.064],[29.443,32.819],[29.881,32.574],[30.396,32.268],[30.963,31.911],[33.435,30.269],[34.105,29.837],[34.697,29.469],[35.315,29.106],[35.933,28.767],[36.577,28.436],[37.221,28.129],[37.787,27.88],[38.354,27.651],[38.972,27.421],[39.641,27.191],[40.285,26.986],[40.981,26.782],[41.753,26.572],[42.474,26.39],[43.041,26.26],[43.582,26.149],[44.123,26.052],[44.689,25.964],[45.41,25.87],[46.183,25.782],[46.852,25.72],[47.445,25.679],[47.857,25.661],[48.243,25.652],[48.655,25.651],[49.067,25.658],[49.917,25.698],[50.973,25.78],[51.874,25.873],[52.75,25.99],[53.651,26.14],[54.527,26.313],[54.887,26.394],[55.171,26.466],[55.634,26.595],[56.227,26.774],[56.69,26.934],[57.257,27.155],[57.694,27.342],[57.978,27.475],[58.184,27.579],[58.441,27.727],[59.085,28.127],[59.238,28.215],[59.359,28.264],[59.424,28.274],[59.462,28.27],[59.494,28.257],[59.52,28.236],[59.539,28.207],[59.555,28.151],[59.554,28.037],[59.529,27.887],[59.478,27.681],[59.404,27.449],[59.314,27.217]],[[35.424,19.046],[35.432,19.058],[35.432,19.077],[35.398,19.15],[35.325,19.25],[35.223,19.367],[34.982,19.619],[33.986,20.625],[33.556,21.088],[33.265,21.423],[32.378,22.504],[31.24,23.998],[31.054,24.256],[30.859,24.539],[30.269,25.44],[29.841,26.058],[29.673,26.316],[29.22,27.063],[28.7,27.887],[28.084,28.943],[27.867,29.329],[27.397,30.205],[26.931,31.054],[26.599,31.724],[26.256,32.445],[25.676,33.601],[25.58,33.767],[25.5,33.883],[25.432,33.949],[25.408,33.958],[25.395,33.954],[25.382,33.924],[25.383,33.866],[25.4,33.767],[25.431,33.651],[25.523,33.372],[25.673,32.986],[25.996,32.239],[26.718,30.72],[27.378,29.432],[27.685,28.865],[27.909,28.479],[28.625,27.294],[28.872,26.908],[30.001,25.26],[31.259,23.534],[31.613,23.071],[32.337,22.195],[32.581,21.912],[33.1,21.345],[33.503,20.856],[33.659,20.676],[33.876,20.444],[34.373,19.932],[34.801,19.51],[35.129,19.21],[35.245,19.12],[35.325,19.069],[35.387,19.044]],[[28.565,15.127],[28.573,15.148],[28.559,15.192],[28.456,15.36],[27.779,16.272],[27.318,16.942],[26.989,17.457],[26.699,17.946],[26.326,18.641],[25.918,19.465],[25.487,20.393],[25.318,20.779],[25.181,21.114],[24.971,21.68],[24.718,22.453],[24.471,23.251],[24.273,23.972],[24.082,24.771],[23.789,26.136],[23.639,26.96],[23.512,27.798],[23.47,28.027],[23.43,28.181],[23.391,28.282],[23.352,28.341],[23.336,28.352],[23.316,28.352],[23.302,28.341],[23.286,28.313],[23.266,28.229],[23.257,28.108],[23.259,27.962],[23.287,27.625],[23.381,26.857],[23.447,26.393],[23.545,25.826],[23.651,25.26],[23.822,24.41],[23.928,23.921],[24.037,23.457],[24.176,22.916],[24.306,22.453],[24.424,22.067],[24.561,21.654],[24.718,21.217],[24.886,20.779],[25.055,20.367],[25.237,19.955],[25.454,19.491],[25.684,19.028],[25.873,18.667],[26.061,18.332],[26.277,17.972],[26.505,17.611],[26.782,17.199],[27.06,16.813],[27.376,16.401],[27.749,15.94],[28.042,15.596],[28.28,15.342],[28.459,15.181],[28.526,15.137]]];

  // Default adjustment of a gill line:
  //  - dx, dy: displacement, in logo units (the isotype is ~58 units wide)
  //  - length: scale along the gill's main axis (1 = traced length)
  //  - thickness: scale across the gill's main axis (1 = traced thickness)
  MagnetLogo.defaultGill = {dx: 0, dy: 0, length: 1, thickness: 1};

  // Default adjustment of the gills of the Manta logo. The `gills` option is
  // merged over it, side by side and key by key: {left: {length: 1}} only
  // changes the length of the left gill. To get a gill exactly as it was
  // traced, pass MagnetLogo.defaultGill for it.
  MagnetLogo.mantaGills = {
    left: {length: 1.2, thickness: 0.75},
    right: {dx: 2, dy: -2}
  };

  // index of each gill in MagnetLogo.mantaRayPaths (0 is the body)
  MagnetLogo.gillIndexes = {right: 1, left: 2};

  /**
   * MagnetLogo.transformGill - Returns the points of a gill line after
   * applying an adjustment.
   * @param {Array} points - The traced points of the gill.
   * @param {Object} params - Any of dx, dy, length, thickness.
   */
  MagnetLogo.transformGill = function(points, params) {
    var gill = {};
    var i;

    for (i in MagnetLogo.defaultGill) {
      if (MagnetLogo.defaultGill.hasOwnProperty(i)) {
        gill[i] = params && params[i] !== undefined ?
          params[i] : MagnetLogo.defaultGill[i];
      }
    }

    var n = points.length;
    var cx = 0;
    var cy = 0;

    points.forEach(function(point) {
      cx += point[0] / n;
      cy += point[1] / n;
    });

    // main axis of the gill (principal axis of its points)
    var sxx = 0;
    var sxy = 0;
    var syy = 0;

    points.forEach(function(point) {
      var x = point[0] - cx;
      var y = point[1] - cy;

      sxx += x * x;
      sxy += x * y;
      syy += y * y;
    });

    var angle = 0.5 * Math.atan2(2 * sxy, sxx - syy);
    var ux = Math.cos(angle);
    var uy = Math.sin(angle);

    return points.map(function(point) {
      var x = point[0] - cx;
      var y = point[1] - cy;
      var along = (x * ux + y * uy) * gill.length;
      var across = (-x * uy + y * ux) * gill.thickness;

      return [
        cx + along * ux - across * uy + gill.dx,
        cy + along * uy + across * ux + gill.dy
      ];
    });
  };

  /**
   * MagnetLogo.mergeGills - Merges the given gill adjustments over the
   * default ones of the Manta logo (MagnetLogo.mantaGills).
   * @param {Object} gills - Optional adjustments: {left: {...}, right: {...}}
   */
  MagnetLogo.mergeGills = function(gills) {
    var merged = {};

    gills = gills || {};

    ['right', 'left'].forEach(function(side) {
      merged[side] = Object.assign(
        {}, MagnetLogo.mantaGills[side], gills[side]
      );
    });

    return merged;
  };

  /**
   * MagnetLogo.mantaRayShape - Returns the outline paths of the Manta
   * mantaray: the body first, then the right and the left gill lines.
   * @param {Object} gills - Optional adjustments: {left: {...}, right: {...}}
   */
  MagnetLogo.mantaRayShape = function(gills) {
    var shape = MagnetLogo.mantaRayPaths.slice();

    gills = gills || {};

    ['right', 'left'].forEach(function(side) {
      var index = MagnetLogo.gillIndexes[side];

      if (gills[side]) {
        shape[index] = MagnetLogo.transformGill(shape[index], gills[side]);
      }
    });

    return shape;
  };

  /**
   * MagnetLogo.gillsMargin - Distance from every point of the shape's gill
   * lines to the edge of the mantaray body, in logo units. Negative or small
   * values mean a gill is outside of, or too close to, the body edge.
   * @param {Array} shape - The result of MagnetLogo.mantaRayShape.
   * @param {Array} indexes - Optional indexes of the gills to check, by
   * default both.
   */
  MagnetLogo.gillsMargin = function(shape, indexes) {
    var body = shape[0];
    var margin = Infinity;

    function inside(x, y) {
      var result = false;
      var i;
      var j;

      for (i = 0, j = body.length - 1; i < body.length; j = i++) {
        var a = body[i];
        var b = body[j];

        if ((a[1] > y) !== (b[1] > y) &&
            x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) {
          result = !result;
        }
      }

      return result;
    }

    (indexes || [1, 2]).forEach(function(index) {
      shape[index].forEach(function(point) {
        var nearest = Infinity;

        body.forEach(function(edge) {
          var dx = edge[0] - point[0];
          var dy = edge[1] - point[1];

          nearest = Math.min(nearest, Math.sqrt(dx * dx + dy * dy));
        });

        margin = Math.min(
          margin, inside(point[0], point[1]) ? nearest : -nearest
        );
      });
    });

    return margin;
  };

  /**
   * MagnetLogo.traceSpline - Adds a closed Catmull-Rom spline through the
   * given points to the current path of a context, as beziers.
   */
  MagnetLogo.traceSpline = function(ctx, pts) {
    var n = pts.length;
    var i;

    ctx.moveTo(pts[0][0], pts[0][1]);

    for (i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n];
      var p1 = pts[i];
      var p2 = pts[(i + 1) % n];
      var p3 = pts[(i + 2) % n];

      ctx.bezierCurveTo(
        p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
        p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
        p2[0], p2[1]
      );
    }

    ctx.closePath();
  };

  /**
   * MagnetLogo.drawMantaRay - Draws the mantaray of the Manta logo
   */
  MagnetLogo.prototype.drawMantaRay = function() {
    var ctx = this.ctx;
    var shape = MagnetLogo.mantaRayShape(MagnetLogo.mergeGills(this.gills));

    ctx.beginPath();
    shape.forEach(function(pts) {
      MagnetLogo.traceSpline(ctx, pts);
    });
    ctx.fillStyle = this.mantaColor;
    ctx.fill('evenodd');

    // the gill lines are cut out of the body; fill them with the eyes color
    // (unless it is transparent, in which case they stay as holes)
    if (this.eyesColor && this.eyesColor !== 'transparent') {
      shape.slice(1).forEach(function(pts) {
        ctx.beginPath();
        MagnetLogo.traceSpline(ctx, pts);
        ctx.fillStyle = this.eyesColor;
        ctx.fill();
      }, this);
    }
  };

  /**
   * MagnetLogo.drawCustomText - Draws an arbitrary word (e.g. "MANTA") in the
   * same area and with the same width as the "MAGNET" text.
   */
  MagnetLogo.prototype.drawCustomText = function(text) {
    var ctx = this.ctx;
    var textTop = 58.101936;
    var textHeight = 66.568602 - textTop;
    var fontFamily = '"PT Sans", "Open Sans", Helvetica, Arial, sans-serif';

    ctx.save();
    ctx.fillStyle = this.textColor;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    // cap height is ~0.7em; letters are spaced like the Magnet logotype
    var fontSize = textHeight / 0.7;
    ctx.font = '700 ' + fontSize + 'px ' + fontFamily;

    var spacing = fontSize * 0.12;
    var widths = [];
    var total = 0;
    var i;

    for (i = 0; i < text.length; i++) {
      widths.push(ctx.measureText(text[i]).width);
      total += widths[i];
    }
    total += spacing * (text.length - 1);

    // scale horizontally so the word spans the same width as the isotype
    var targetWidth = MagnetLogo.isotypeWidth - 2 * MagnetLogo.drawingPadding;
    ctx.translate(MagnetLogo.drawingPadding, 0);
    ctx.scale(targetWidth / total, 1);

    var x = 0;
    for (i = 0; i < text.length; i++) {
      ctx.fillText(text[i], x, textTop + textHeight);
      x += widths[i] + spacing;
    }

    ctx.restore();
  };

  /**
   * MagnetLogo.SvgContext - Minimal CanvasRenderingContext2D look-alike that
   * records the drawing operations used by MagnetLogo as SVG elements.
   */
  function SvgContext() {
    this.measureCtx = document.createElement('canvas').getContext('2d');
    this.reset();
  }

  SvgContext.round = function(n) {
    return Math.round(n * 10000) / 10000;
  };

  SvgContext.escape = function(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  };

  SvgContext.prototype.reset = function() {
    this.elements = [];
    this.stack = [];
    this.matrix = [1, 0, 0, 1, 0, 0];
    this.path = '';
    this.fillStyle = '#000000';
    this.strokeStyle = '#000000';
    this.lineWidth = 1;
    this.lineJoin = 'miter';
    this.lineCap = 'butt';
    this.miterLimit = 10;
    this.font = '10px sans-serif';
    this.textAlign = 'start';
    this.textBaseline = 'alphabetic';
  };

  SvgContext.prototype.save = function() {
    this.stack.push({
      matrix: this.matrix.slice(),
      fillStyle: this.fillStyle,
      strokeStyle: this.strokeStyle,
      lineWidth: this.lineWidth,
      font: this.font,
      textAlign: this.textAlign,
      textBaseline: this.textBaseline
    });
  };

  SvgContext.prototype.restore = function() {
    var state = this.stack.pop();

    if (state) {
      for (var i in state) {
        if (state.hasOwnProperty(i)) {
          this[i] = state[i];
        }
      }
    }
  };

  SvgContext.prototype.transform = function(a, b, c, d, e, f) {
    var m = this.matrix;

    // like a real canvas, ignore transforms with non-finite values
    if (![a, b, c, d, e, f].every(isFinite)) {
      return;
    }

    this.matrix = [
      m[0] * a + m[2] * b, m[1] * a + m[3] * b,
      m[0] * c + m[2] * d, m[1] * c + m[3] * d,
      m[0] * e + m[2] * f + m[4], m[1] * e + m[3] * f + m[5]
    ];
  };

  SvgContext.prototype.scale = function(x, y) {
    this.transform(x, 0, 0, y, 0, 0);
  };

  SvgContext.prototype.translate = function(x, y) {
    this.transform(1, 0, 0, 1, x, y);
  };

  SvgContext.prototype.setTransform = function(a, b, c, d, e, f) {
    if (![a, b, c, d, e, f].every(isFinite)) {
      return;
    }

    this.matrix = [a, b, c, d, e, f];
  };

  SvgContext.prototype.beginPath = function() {
    this.path = '';
  };

  SvgContext.prototype.closePath = function() {
    this.path += 'Z';
  };

  SvgContext.prototype.moveTo = function(x, y) {
    var r = SvgContext.round;
    this.path += 'M' + r(x) + ' ' + r(y);
  };

  SvgContext.prototype.lineTo = function(x, y) {
    var r = SvgContext.round;
    this.path += 'L' + r(x) + ' ' + r(y);
  };

  SvgContext.prototype.bezierCurveTo = function(x1, y1, x2, y2, x, y) {
    var r = SvgContext.round;
    this.path += 'C' + [x1, y1, x2, y2, x, y].map(r).join(' ');
  };

  SvgContext.prototype.transformAttr = function() {
    return ' transform="matrix(' +
      this.matrix.map(SvgContext.round).join(' ') + ')"';
  };

  SvgContext.prototype.fill = function(rule) {
    if (!this.path || this.fillStyle === 'transparent') {
      return;
    }

    this.elements.push(
      '<path d="' + this.path + '" fill="' +
      SvgContext.escape(this.fillStyle) + '"' +
      (rule === 'evenodd' ? ' fill-rule="evenodd"' : '') +
      this.transformAttr() + '/>'
    );
  };

  SvgContext.prototype.stroke = function() {
    if (!this.path || this.strokeStyle === 'transparent') {
      return;
    }

    this.elements.push(
      '<path d="' + this.path + '" fill="none" stroke="' +
      SvgContext.escape(this.strokeStyle) + '" stroke-width="' +
      SvgContext.round(this.lineWidth) + '" stroke-linejoin="' +
      this.lineJoin + '" stroke-linecap="' + this.lineCap +
      '" stroke-miterlimit="' + this.miterLimit + '"' +
      this.transformAttr() + '/>'
    );
  };

  SvgContext.prototype.fillRect = function(x, y, width, height) {
    var r = SvgContext.round;

    if (this.fillStyle === 'transparent') {
      return;
    }

    this.elements.push(
      '<rect x="' + r(x) + '" y="' + r(y) + '" width="' + r(width) +
      '" height="' + r(height) + '" fill="' +
      SvgContext.escape(this.fillStyle) + '"' + this.transformAttr() + '/>'
    );
  };

  SvgContext.prototype.clearRect = function() {
    // the SVG is always built from scratch, nothing to clear
  };

  SvgContext.prototype.measureText = function(text) {
    this.measureCtx.font = this.font;
    return this.measureCtx.measureText(text);
  };

  SvgContext.prototype.fillText = function(text, x, y) {
    var r = SvgContext.round;

    this.elements.push(
      '<text x="' + r(x) + '" y="' + r(y) + '" fill="' +
      SvgContext.escape(this.fillStyle) + '" style="font: ' +
      SvgContext.escape(this.font) + '"' + this.transformAttr() + '>' +
      SvgContext.escape(text) + '</text>'
    );
  };

  /**
   * MagnetLogo.toSVG - Renders a logo with the given options (the same ones
   * accepted by MagnetLogo.render) and returns it as an SVG string.
   * @param {Object} options - The options object.
   * @returns {string} The SVG document.
   */
  MagnetLogo.toSVG = function(options) {
    var svgCtx = new SvgContext();
    var canvas = {
      tagName: 'CANVAS',
      clientWidth: 0,
      clientHeight: 0,
      style: {},
      getContext: function() {
        return svgCtx;
      }
    };

    // changing the size of a canvas resets its transform and content
    ['width', 'height'].forEach(function(property) {
      var value = 0;

      Object.defineProperty(canvas, property, {
        get: function() {
          return value;
        },
        set: function(newValue) {
          value = newValue;
          svgCtx.reset();
        }
      });
    });

    var logo = new MagnetLogo(canvas);
    logo.render(options);

    // the context is scaled by the device pixel ratio, undo it
    var dpr = window.devicePixelRatio || 1;
    var width = logo.cssWidth;
    var height = logo.cssHeight;

    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + width +
      '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height +
      '">\n<g transform="scale(' + (1 / dpr) + ')">\n' +
      svgCtx.elements.join('\n') + '\n</g>\n</svg>\n';
  };

  window.MagnetLogo = MagnetLogo;

}());
