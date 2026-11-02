# El generador web

El generador está al final de `index.html`, en la sección **Logo Generator**.
Permite configurar un logo, verlo en un canvas y descargarlo.

## Pestañas Magnet / Manta

Encima del formulario hay dos pestañas. Cambiar de pestaña:

- Cambia la marca del logo: Magnet (mantarraya animada de Magnet y texto
  "MAGNET") o Manta (su propia mantarraya y texto "MANTA").
- Reemplaza los colores del formulario por los de la marca:

  | | Magnet | Manta |
  |---|--------|-------|
  | Manta color | `#0083BA` | `#003B54` |
  | Text color | `#666666` | `#003B54` |
  | Border color | `#0083BA` | `#003B54` |

  Después puedes editar los colores a mano. Cambiar de pestaña vuelve a
  poner los de la marca, descartando lo que hubieras escrito en esos dos
  campos.
- Renombra el campo **Eyes color**. En Magnet pinta los ojos de la mantarraya;
  en Manta pinta las líneas del torso, por eso pasa a llamarse **Gill lines
  color**.

## Campos del formulario

| Campo | Efecto |
|-------|--------|
| Width / Height | Tamaño del logo en píxeles CSS (sin contar márgenes). |
| margin-top / bottom / left / right | Espacio alrededor del logo. Aumenta el tamaño total del canvas. |
| Total height / Total width | Tamaño final del canvas: logo más márgenes. Es de solo lectura. |
| Eyes color / Gill lines color | Ojos (Magnet) o líneas del torso (Manta). |
| Manta color | Color del cuerpo de la mantarraya. |
| Text color | Color del texto. |
| Border color | Borde de la mantarraya, en ambas marcas. Se dibuja solo si es distinto del color del cuerpo (ver abajo). |
| Background color | Color de fondo. `transparent` deja el fondo sin pintar. |
| Vertical / Horizontal Text | Texto debajo de la mantarraya, o a su derecha. |
| Fixed aspect ratio | Mantiene la proporción al cambiar Width o Height (ver abajo). |
| Draw background / manta / text | Activa o desactiva cada parte del logo. |

### Dibujar solo el borde

Para obtener solo el contorno de la mantarraya (en Magnet o en Manta), pon
**Manta color** en `transparent` y deja un **Border color** distinto. En Manta,
pon también **Gill lines color** en `transparent`; si no, las líneas del torso
se verían rellenas. El borde se dibuja centrado sobre el contorno del cuerpo y
no rodea a los gills.

En Manta, si el borde tiene el mismo color que el cuerpo (el caso por defecto)
no se dibuja, para no engrosar el logo.

### Proporción fija

Con **Fixed aspect ratio** activado, al cambiar Width se recalcula Height, y al
revés. La proporción depende de qué partes se dibujan: solo la mantarraya, solo
el texto, o ambas en vertical u horizontal. Las proporciones están en la
librería (`MagnetLogo.isotypeRatio`, `logotypeRatio`,
`verticalIsologotypeRatio` y `horizontalIsologotypeRatio`) y son las mismas
para ambas marcas.

Si lo desactivas, puedes poner cualquier Width y Height. El logo se ajusta
dentro del canvas sin deformarse y queda centrado.

## Descargas

Debajo del canvas hay dos botones. El archivo se llama `magnet-logo.*` o
`manta-logo.*` según la pestaña activa.

### Download PNG

Descarga lo que se ve en el canvas, incluido el fondo transparente si lo
elegiste.

- La resolución real depende de la pantalla: el canvas tiene el tamaño
  indicado multiplicado por `window.devicePixelRatio`. En una pantalla HiDPI
  (ratio 2) un logo de 600 px se descarga de 1200 px de ancho.
- Incluye el ícono de Font Awesome si lo configuraste.

### Download SVG

Descarga un SVG vectorial, que escala sin perder calidad. Se genera con
`MagnetLogo.toSVG` a partir de las mismas opciones del formulario
([arquitectura.md](arquitectura.md#exportación-a-svg)).

Dos limitaciones:

- **El texto "MANTA" es texto SVG, no curvas.** Usa la misma fuente que el
  canvas (PT Sans, con Open Sans, Helvetica o Arial como alternativas), así
  que en un equipo sin esa fuente se verá con otra. El texto "MAGNET" no tiene
  este problema porque ya son curvas. Para usar el SVG como archivo de marca
  conviene convertir el texto a curvas en Inkscape o Illustrator.
- **El ícono de Font Awesome no se incluye en el SVG**, porque su tipografía no
  viaja dentro del archivo. Solo aparece en el PNG.

## Ícono de Font Awesome

La sección **Font Awesome icon** dibuja un ícono sobre el logo (por ejemplo
sobre la mantarraya; las posiciones por defecto la ubican sobre la mantarraya de Magnet). Se escribe la clase (por ejemplo
`fas fa-user`), su color, su posición (top y left) y su tamaño en píxeles. Se
dibuja directamente sobre el canvas con `fillText`, por eso solo aparece en el
PNG.

## Variaciones de los gills de Manta

`gills.html` es una página aparte para ajustar las dos líneas del torso de la
mantarraya de Manta. Ver [mantenimiento.md](mantenimiento.md#ajustar-los-gills-de-manta).
