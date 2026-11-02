# Usar la librería `MagnetLogo`

`dist/logo.js` define una única clase global, `window.MagnetLogo`. No tiene
dependencias. Para producción hay una versión minificada, `dist/logo.min.js`,
con la misma API.

## Crear y dibujar un logo

```js
var logo = new MagnetLogo(elemento, opcionesOpcionales);
logo.render(opciones);
```

- `elemento` puede ser un `<canvas>` o cualquier otro elemento. Si no es un
  canvas, se crea uno dentro de él.
- Sin opciones, el logo ocupa el tamaño del elemento (`clientWidth` por
  `clientHeight`).
- `render(opciones)` aplica las opciones y vuelve a dibujar. Se puede llamar
  varias veces sobre la misma instancia.
- El tamaño del canvas es `width + marginLeft + marginRight` por
  `height + marginTop + marginBottom`, multiplicado por
  `window.devicePixelRatio` para que se vea nítido en pantallas HiDPI. Después
  de `render`, `logo.cssWidth` y `logo.cssHeight` tienen el tamaño final en
  píxeles CSS.

## Opciones

### Tamaño y posición

| Opción | Por defecto | Descripción |
|--------|-------------|-------------|
| `width`, `height` | tamaño del elemento | Tamaño del logo en píxeles CSS, sin márgenes. |
| `marginTop`, `marginBottom`, `marginLeft`, `marginRight` | `0` | Espacio alrededor del logo; agranda el canvas. |
| `fitToClientSize` | `false` | Si es `true`, toma `width` y `height` del tamaño actual del canvas. |
| `logoSize` | `'contain'` | `'contain'` escala el logo para que quepa completo dentro del canvas, sin deformarlo. Con otro valor no se escala. |
| `position` | `'center'` | `'center'` centra el logo en el canvas. |
| `horizontal` | `false` | Texto a la derecha de la mantarraya, en vez de debajo. |

### Qué se dibuja

| Opción | Por defecto | Descripción |
|--------|-------------|-------------|
| `backgroundEnabled` | `true` | Dibuja el fondo. |
| `mantaEnabled` | `true` | Dibuja la mantarraya. |
| `textEnabled` | `true` | Dibuja el texto. |

Combinándolas se obtienen las variantes: logo completo, solo mantarraya (isotipo),
solo texto (logotipo), y horizontal o vertical.

### Colores

| Opción | Por defecto | Descripción |
|--------|-------------|-------------|
| `backgroundColor` | `'transparent'` | Color de fondo. |
| `mantaColor` | `rgb(0, 131, 186)` | Cuerpo de la mantarraya. |
| `textColor` | `rgb(102, 102, 102)` | Texto. |
| `borderColor` | `rgb(0, 131, 186)` en Magnet; el color de `mantaColor` en Manta | Borde de la mantarraya. En Manta solo se dibuja si es distinto de `mantaColor`. |
| `eyesColor` | `rgb(255, 255, 255)` | Ojos de la mantarraya de Magnet; líneas del torso (gills) de Manta. |

Los colores aceptan cualquier valor de color de CSS.

### Marca

| Opción | Por defecto | Descripción |
|--------|-------------|-------------|
| `text` | `'MAGNET'` | Texto del logo. `'MAGNET'` usa las letras vectoriales de Magnet; cualquier otro valor (por ejemplo `'MANTA'`) se dibuja con una tipografía. |
| `mantaShape` | `'magnet'` | `'magnet'` o `'manta'`: qué mantarraya se dibuja. |
| `gills` | `null` | Ajuste de las dos líneas del torso de la mantarraya de Manta. Ver abajo. |

Para el logo de Manta se usan juntas `mantaShape: 'manta'` y `text: 'MANTA'`.

## Ejemplos

```js
// logo completo de Magnet
new MagnetLogo(document.getElementById('logo')).render();

// solo la mantarraya
logo.render({backgroundEnabled: false, textEnabled: false});

// solo el texto
logo.render({mantaEnabled: false, backgroundEnabled: false});

// layout horizontal
logo.render({horizontal: true});

// solo el contorno de la mantarraya de Manta
logo.render({
  mantaShape: 'manta',
  textEnabled: false,
  mantaColor: 'transparent',
  borderColor: '#003B54',
  eyesColor: 'transparent'
});

// logo de Manta con márgenes y fondo de color
logo.render({
  mantaShape: 'manta',
  text: 'MANTA',
  mantaColor: '#003B54',
  textColor: '#003B54',
  eyesColor: '#FFFFFF',
  backgroundColor: '#F2F9FC',
  width: 600,
  height: 689,
  marginTop: 20
});
```

## Gills de Manta

La mantarraya de Manta tiene dos líneas en el torso (los *gills*). La opción
`gills` ajusta cada una por separado con estos valores:

| Clave | Por defecto | Descripción |
|-------|-------------|-------------|
| `dx` | `0` | Desplazamiento horizontal, en unidades del logo (el logo mide ~58 de ancho). Positivo es hacia la derecha. |
| `dy` | `0` | Desplazamiento vertical, en las mismas unidades. Positivo es hacia abajo. |
| `length` | `1` | Multiplicador del largo respecto al gill original trazado. |
| `thickness` | `1` | Multiplicador del grosor respecto al gill original trazado. |

```js
logo.render({
  mantaShape: 'manta',
  text: 'MANTA',
  gills: {
    left:  {length: 1.2, thickness: 0.75},  // gill izquierdo
    right: {dx: 2, dy: -2}                  // gill derecho
  }
});
```

- *Izquierdo* y *derecho* se miran desde quien ve el logo.
- Los valores son **absolutos respecto al gill trazado**, no se acumulan:
  `length: 1.2` es "1.2 veces el original".
- `gills` se **combina** con el valor por defecto de Manta
  (`MagnetLogo.mantaGills`), por lado y por clave. Lo que no indiques se
  hereda de ahí. Por ejemplo `{left: {thickness: 1}}` solo cambia el grosor del
  gill izquierdo.
- Para dejar un gill exactamente como se trazó, pasa los valores neutros:
  `{left: MagnetLogo.defaultGill, right: MagnetLogo.defaultGill}`.
- Un gill no debería salirse del cuerpo de la mantarraya. La librería no lo
  impide; `gills.html` sí lo controla (ver
  [mantenimiento.md](mantenimiento.md#ajustar-los-gills-de-manta)).

## Exportar a SVG

```js
var svg = MagnetLogo.toSVG({
  mantaShape: 'manta',
  text: 'MANTA',
  width: 600,
  height: 689
});
// svg es un string con el documento SVG completo
```

`MagnetLogo.toSVG(opciones)` acepta las mismas opciones que `render`, con
`width` y `height` obligatorios, ya que no hay canvas del cual tomarlos. Devuelve
el SVG como texto, con dibujo vectorial. El texto de Manta sale como `<text>`
(depende de la fuente del equipo que lo abra), no como curvas.

## Proporciones

La librería expone la proporción (ancho / alto) de cada variante, útil para
calcular un tamaño a partir del otro:

| Constante | Variante |
|-----------|----------|
| `MagnetLogo.isotypeRatio` | Solo mantarraya. |
| `MagnetLogo.logotypeRatio` | Solo texto. |
| `MagnetLogo.verticalIsologotypeRatio` | Mantarraya y texto, en vertical. |
| `MagnetLogo.horizontalIsologotypeRatio` | Mantarraya y texto, en horizontal. |

Son las mismas para Magnet y Manta.
