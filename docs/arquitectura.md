# Cómo funciona por dentro

Todo el dibujo está en `dist/logo.js`. Este documento explica sus piezas.

## Flujo de `render`

```
new MagnetLogo(elemento)  →  setup  →  setDefaults + setOptions
logo.render(opciones)     →  setOptions
                             fitContainer   (escala para que quepa)
                             setPosition    (centra)
                             drawBackground
                             drawManta      (mantarraya)
                             drawText
```

1. **`setOptions`** copia las opciones a la instancia, calcula el tamaño del
   canvas (CSS multiplicado por `devicePixelRatio`) y escala el contexto por
   ese mismo factor, de modo que el resto del código dibuja en píxeles CSS.
   También decide el tamaño del dibujo (`drawingWidth` y `drawingHeight`)
   según qué partes se dibujan: solo texto, mantarraya, mantarraya con texto
   en vertical u horizontal.
2. **`fitContainer`** calcula una escala para que el dibujo quepa completo en
   el canvas sin deformarse (`logoSize: 'contain'`).
3. **`setPosition`** centra el dibujo (`position: 'center'`).
4. Se dibuja en orden: fondo, mantarraya, texto.

### Unidades del dibujo

El logo se define en unas "unidades de logo" propias: el isotipo (la
mantarraya) mide unas 58 × 53,5 unidades más un margen de 1,63
(`MagnetLogo.drawingPadding`). El código dibuja siempre en esas unidades y la
escala de `fitContainer` las convierte a píxeles. Las constantes
`MagnetLogo.isotypeWidth`, `isotypeHeight`, `isologotypeHeight` y
`logotypeHeight` describen las cajas de cada variante, y de ellas salen las
proporciones (`*Ratio`).

Por eso los desplazamientos de los gills (`dx`, `dy`) están en esas unidades y
no en píxeles.

## La mantarraya de Magnet

Está dibujada a mano con curvas de Bézier (`drawPerimeter`, `drawRightEye`,
`drawLeftEye`, `drawMantaGill`): contorno, dos ojos y una branquia. El texto
"MAGNET" (`drawText`) también son curvas, una por letra. Nada depende de
fuentes.

## La mantarraya de Manta

### Origen

No está dibujada a mano: es el **trazado de un PNG** (`logo_mantav1.png`, 814 ×
814 px) con la mantarraya de Manta. Se convirtió a vectores una sola vez y el
resultado está incrustado en `dist/logo.js` como `MagnetLogo.mantaRayPaths`.
Cómo se hizo y cómo repetirlo está en [mantenimiento.md](mantenimiento.md).

### Datos

`MagnetLogo.mantaRayPaths` es una lista de tres contornos cerrados, cada uno
una lista de puntos `[x, y]` en unidades de logo:

| Índice | Contenido |
|--------|-----------|
| `0` | Cuerpo de la mantarraya. |
| `1` | Gill derecho. |
| `2` | Gill izquierdo. |

### Dibujo (`drawMantaRay`)

- Cada contorno se convierte en una curva suave con `MagnetLogo.traceSpline`:
  una spline Catmull-Rom cerrada que pasa por todos los puntos, escrita como
  curvas de Bézier. Hay más puntos donde el contorno se curva más (puntas de
  las alas, cuernos, cola) y menos en los tramos rectos.
- El cuerpo y los gills se rellenan juntos con la regla `evenodd`, así los
  gills quedan como **huecos** en el cuerpo.
- Luego se dibuja el **borde** del cuerpo, un trazo de 0,5 unidades centrado
  sobre el contorno, con `borderColor`. Solo se dibuja si es distinto de
  `mantaColor`; si `borderColor` no se indicó, vale `mantaColor` y no se dibuja
  nada. Con `mantaColor: 'transparent'` queda solo el contorno.
- Después cada gill se rellena con `eyesColor`, salvo que sea `transparent`:
  en ese caso se quedan como huecos y muestran el fondo.

### Texto "MANTA" (`drawCustomText`)

Cualquier `text` distinto de `'MAGNET'` se dibuja con `fillText`, con
tipografía en negrita (PT Sans, con Open Sans, Helvetica y Arial como
alternativas), espaciado de letras de 0,12 em, y se estira en horizontal para
que la **tinta** de las letras (de la punta izquierda de la M a la derecha de
la A) tenga el mismo ancho que el cuerpo de la mantarraya, de punta a punta de
las alas. Ese ancho sale de `MagnetLogo.mantaBodyBounds()`, que mide la curva
suave y no solo los puntos (la spline se pasa un poco en las puntas), y la
tinta se mide con `actualBoundingBox*` a un tamaño 100 veces mayor, porque los
navegadores redondean esas medidas a enteros en fuentes pequeñas. Es la única parte del logo que
depende de las fuentes del equipo.

## Los gills ajustables

La opción `gills` mueve, alarga o engrosa cada gill sin volver a trazar nada.
`MagnetLogo.transformGill(puntos, ajuste)` calcula, para cada gill:

1. El **centroide** de sus puntos.
2. Su **eje principal**: el ángulo del eje mayor de la nube de puntos,
   `½·atan2(2·sxy, sxx − syy)`, a partir de las covarianzas.
3. Para cada punto, sus coordenadas relativas al centroide, descompuestas en
   *a lo largo* y *a través* de ese eje. La primera se multiplica por
   `length`, la segunda por `thickness`.
4. Se vuelve a las coordenadas normales y se suma `(dx, dy)`.

`MagnetLogo.mantaGills` es el ajuste por defecto del logo de Manta.
`MagnetLogo.mergeGills(gills)` combina lo que pasa el usuario con ese valor
por defecto, por lado y por clave, y `MagnetLogo.mantaRayShape(gills)`
devuelve los tres contornos ya ajustados.

### Mantenerlos dentro del cuerpo

Como el cuerpo y los gills se rellenan con `evenodd`, un gill que sobresale
del cuerpo se pintaría del color del cuerpo en la parte de afuera. La librería
no lo impide, pero ofrece
`MagnetLogo.gillsMargin(contornos, [índices])`: la distancia mínima de los
puntos de los gills al borde del cuerpo, negativa si algún punto queda fuera.
`gills.html` la usa para limitar cada variante.

## Exportación a SVG

El código de dibujo solo usa un conjunto pequeño de operaciones del contexto
2D de canvas. `MagnetLogo.toSVG` aprovecha eso: crea un **contexto falso**
(`SvgContext`) que, en vez de pintar, anota cada operación como un elemento
SVG.

- Soporta: `beginPath`, `moveTo`, `lineTo`, `bezierCurveTo`, `closePath`,
  `fill` (incluida la regla `evenodd`), `stroke`, `fillRect`, `fillText`,
  `measureText`, `save`/`restore`, `scale`, `translate`, `setTransform` y las
  propiedades de estilo.
- Cada relleno se convierte en un `<path>` con su matriz de transformación, el
  fondo en un `<rect>` y el texto de Manta en un `<text>`.
- Se crea una instancia normal de `MagnetLogo` sobre un canvas falso, se llama
  a `render` con las mismas opciones, y se serializa lo anotado. El resultado
  tiene exactamente las mismas curvas que el canvas.
- El contexto real está escalado por `devicePixelRatio`; en el SVG se
  compensa con un `scale(1/dpr)` global.
- Como en un canvas real, se ignoran las transformaciones con valores no
  finitos. Esto importa: con la mantarraya de Magnet, `drawManta` termina con
  `translate(0, 30 * this.cosTime)`, y `cosTime` no está definido, así que el
  valor es `NaN`. Es un resto de una versión animada que no tiene efecto, y
  el contexto SVG tiene que ignorarlo igual que el canvas.

Si se agrega al dibujo una operación de canvas nueva (por ejemplo `clip` o
`arc`), hay que implementarla también en `SvgContext`, o el SVG la omitirá.

## Las páginas

- **`index.html` + `javascripts/index.js`**: ejemplos, paleta de colores y el
  generador ([generador.md](generador.md)). El formulario se lee en una sola
  función, `getCustomOptions()`, que usan tanto el dibujo del canvas como el
  botón de SVG.
- **`gills.html` + `javascripts/gills.js`**: página para comparar variaciones
  de los gills. Usa directamente `MagnetLogo.mantaRayShape` y `drawMantaRay`
  para dibujar miniaturas recortadas al torso.
