# Logo Magnet

## Usage

* Magnet logo made in canvas. Classed based and configurable.

To start, create an instance of the logo class "MagnetLogo". You can choose multiple 
settings, but by default the render method renders the full image.

```
var logo = new MagnetLogo(document.getElementById('logo'));
<br>
logo.render();
```

* You can choose to render only the mantaray

```
var logoManta = new MagnetLogo(document.getElementById('logo-manta'));
<br>
logoManta.render({
backgroundEnabled: false,
textEnabled: false
});
```

* Or only the text.

```
var logoText = new MagnetLogo(document.getElementById('logo-text'));
<br>

logoText.render({
mantaEnabled: false,
backgroundEnabled: false
});
```

* Render can take the colors of the elements as parameters and can animate with a default animation.

```
var logoAnimated = new MagnetLogo(document.getElementById('logo-animation')); 
logoAnimated.render({ backgroundColor: '#00ff00', mantaColor: '#ff0000',
textColor: '#0000ff' }); logoAnimated.animate();
```

## Defaults

Default colors are:

* background:  rgb(40, 175, 206) (#28AFCE)
* manta ray: rgb(40, 175, 206) (#28AFCE)
* text: rgb(87, 87, 87) (#575757)
* Manta border: rgb(255, 255, 255) (#ffffff)
