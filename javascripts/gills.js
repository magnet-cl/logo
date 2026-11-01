(function() {
  'use strict';

  var MANTA_COLOR = '#003B54';
  var GILL_COLOR = '#FFFFFF';

  // minimum distance (logo units) between a gill and the edge of the body
  var MIN_MARGIN = 0.3;

  // region of the torso shown in the thumbnails, in logo units
  var VIEW = {x: 15, y: 9, width: 28, height: 30};
  var THUMB_SCALE = 4.5;

  var SIDES = [
    {key: 'left', title: 'Gill izquierdo'},
    {key: 'right', title: 'Gill derecho'}
  ];

  var PARAMS = [
    {
      key: 'thickness',
      title: 'Grosor',
      values: [0.5, 0.75, 1, 1.75, 2.5],
      format: function(v) { return '×' + v; }
    },
    {
      key: 'dx',
      title: 'Posición X',
      values: [-2, -1, 0, 1, 2],
      format: function(v) { return (v > 0 ? '+' : '') + v; }
    },
    {
      key: 'dy',
      title: 'Posición Y',
      values: [-2, -1, 0, 1, 2],
      format: function(v) { return (v > 0 ? '+' : '') + v; }
    },
    {
      key: 'length',
      title: 'Largo',
      values: [0.6, 0.8, 1, 1.2, 1.4],
      format: function(v) { return '×' + v; }
    }
  ];

  var state;

  function copyGills(gills) {
    return {
      left: Object.assign({}, MagnetLogo.defaultGill, gills.left),
      right: Object.assign({}, MagnetLogo.defaultGill, gills.right)
    };
  }

  // the Manta default, as used by the logo
  function mantaState() {
    return copyGills(MagnetLogo.mergeGills());
  }

  // the gills exactly as they were traced
  function originalState() {
    return copyGills({});
  }

  function isValid(gills, side) {
    var shape = MagnetLogo.mantaRayShape(gills);
    var margin = MagnetLogo.gillsMargin(shape, [MagnetLogo.gillIndexes[side]]);

    return margin >= MIN_MARGIN;
  }

  function withValue(side, key, value) {
    var gills = {
      left: Object.assign({}, state.left),
      right: Object.assign({}, state.right)
    };

    gills[side][key] = value;

    return gills;
  }

  // Returns the closest value to the requested one that keeps the gill inside
  // of the body, going from the currently selected value.
  function fit(side, key, requested) {
    if (isValid(withValue(side, key, requested), side)) {
      return {value: requested, adjusted: false};
    }

    var good = state[side][key];
    var bad = requested;
    var i;

    for (i = 0; i < 14; i++) {
      var middle = (good + bad) / 2;

      if (isValid(withValue(side, key, middle), side)) {
        good = middle;
      } else {
        bad = middle;
      }
    }

    // round to 2 decimals, moving towards the current value while invalid
    var current = state[side][key];
    var direction = current < requested ? -1 : 1;
    var value = Math.round(good * 100) / 100;

    while (value !== current && !isValid(withValue(side, key, value), side)) {
      value = Math.round((value + direction * 0.01) * 100) / 100;
    }

    return {value: value, adjusted: true};
  }

  function drawThumbnail(canvas, gills) {
    var logo = new MagnetLogo(canvas);

    logo.setOptions({
      width: VIEW.width * THUMB_SCALE,
      height: VIEW.height * THUMB_SCALE,
      mantaColor: MANTA_COLOR,
      eyesColor: GILL_COLOR
    });
    logo.gills = gills;

    var dpr = window.devicePixelRatio || 1;
    var s = THUMB_SCALE * dpr;

    logo.ctx.setTransform(s, 0, 0, s, -VIEW.x * s, -VIEW.y * s);
    logo.drawMantaRay();
  }

  // the options that differ from the Manta default; the rest of the keys are
  // inherited from it
  function getOptions() {
    var base = mantaState();
    var gills = {};

    SIDES.forEach(function(side) {
      var changes = {};

      Object.keys(MagnetLogo.defaultGill).forEach(function(key) {
        if (state[side.key][key] !== base[side.key][key]) {
          changes[key] = state[side.key][key];
        }
      });

      if (Object.keys(changes).length) {
        gills[side.key] = changes;
      }
    });

    return gills;
  }

  function renderSummary() {
    var gills = getOptions();
    var canvas = document.getElementById('summary');
    var logo = new MagnetLogo(canvas);

    logo.render({
      width: 240,
      height: 276,
      mantaShape: 'manta',
      text: 'MANTA',
      mantaColor: MANTA_COLOR,
      textColor: MANTA_COLOR,
      eyesColor: GILL_COLOR,
      backgroundEnabled: false,
      gills: copyGills(state)
    });

    var code = Object.keys(gills).length ?
      'logo.render({\n  mantaShape: \'manta\',\n  text: \'MANTA\',\n' +
      '  gills: ' + JSON.stringify(gills, null, 2).replace(/\n/g, '\n  ') +
      '\n});' :
      '// igual al valor por defecto de Manta';

    document.getElementById('code').textContent = code;
  }

  function render() {
    var container = document.getElementById('options');

    container.innerHTML = '';

    SIDES.forEach(function(side) {
      var heading = document.createElement('h3');

      heading.textContent = side.title;
      container.appendChild(heading);

      PARAMS.forEach(function(param) {
        var row = document.createElement('div');
        var title = document.createElement('h4');
        var variants = document.createElement('div');

        row.className = 'gill-row';
        variants.className = 'variants';
        title.textContent = param.title;
        row.appendChild(title);
        row.appendChild(variants);
        container.appendChild(row);

        var results = param.values.map(function(requested) {
          return fit(side.key, param.key, requested);
        });
        var current = state[side.key][param.key];

        // the selected value must always be one of the variants
        var found = results.some(function(result) {
          return Math.abs(result.value - current) < 1e-9;
        });

        if (!found) {
          var closest = 0;

          results.forEach(function(result, i) {
            if (Math.abs(result.value - current) <
                Math.abs(results[closest].value - current)) {
              closest = i;
            }
          });

          results[closest] = {value: current, adjusted: false};
        }

        results.forEach(function(result) {
          var button = document.createElement('button');
          var canvas = document.createElement('canvas');
          var label = document.createElement('span');

          button.type = 'button';
          button.className = 'variant';

          if (Math.abs(state[side.key][param.key] - result.value) < 1e-9) {
            button.className += ' selected';
          }

          label.textContent = param.format(result.value);

          button.appendChild(canvas);
          button.appendChild(label);

          if (result.adjusted) {
            var note = document.createElement('span');

            note.className = 'adjusted';
            note.textContent = 'ajustado';
            button.appendChild(note);
          }

          variants.appendChild(button);

          drawThumbnail(canvas, withValue(side.key, param.key, result.value));

          button.onclick = function() {
            state[side.key][param.key] = result.value;
            render();
          };
        });
      });
    });

    renderSummary();
  }

  document.getElementById('reset-btn').onclick = function() {
    state = mantaState();
    render();
  };

  document.getElementById('original-btn').onclick = function() {
    state = originalState();
    render();
  };

  document.getElementById('copy-btn').onclick = function() {
    var text = document.getElementById('code').textContent;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  state = mantaState();
  render();
}());
