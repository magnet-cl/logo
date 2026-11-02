# Mantenimiento

## Regenerar `dist/logo.min.js`

`dist/logo.min.js` se genera a partir de `dist/logo.js`. Hay que regenerarlo
cada vez que cambie `logo.js`, para que ambos tengan la misma API:

```sh
npx terser dist/logo.js --compress --mangle -o dist/logo.min.js
```

El repo no tiene `package.json` ni paso de compilación, por eso se usa `npx`.
Después de regenerar, conviene abrir una página con el minificado y comprobar
que el logo se ve igual (por ejemplo cambiando `dist/logo.js` por
`dist/logo.min.js` en una copia de `index.html`). Se commitean los dos
archivos juntos.

## Publicación

La página la sirve la rama `gh-pages` (el archivo `CNAME` apunta a
`logo.magnet.cl`). Como es todo HTML y JavaScript estático, publicar es
commitear y hacer push a esa rama.

## Estilo de código

Hay una configuración de ESLint (`.eslintrc`, basada en `airbnb-base`). El
código de `logo.js` y de los scripts de las páginas usa JavaScript clásico
(`var`, funciones, sin módulos), con comillas simples y líneas de hasta 80
columnas, y `'use strict'` en los scripts de las páginas. Hay que mantenerlo
así para que siga funcionando en el navegador sin compilar.

## Ajustar los gills de Manta

Para cambiar el aspecto de las dos líneas del torso:

1. Abrir `gills.html`.
2. En cada fila, elegir la variante que guste. Hay una fila por parámetro
   (grosor, posición X, posición Y y largo) y por gill. Cada fila muestra
   variaciones de ese parámetro partiendo de la combinación actual.
3. Las variantes que harían que un gill se salga del cuerpo se ajustan al
   máximo posible y se marcan **ajustado**. El margen mínimo al borde es
   `MIN_MARGIN` (0,3 unidades) en `javascripts/gills.js`.
4. A la izquierda se ve la combinación completa y el código con lo que
   difiere del valor por defecto de Manta.
5. Para hacerla el valor por defecto, actualizar `MagnetLogo.mantaGills` en
   `dist/logo.js` con esos valores y regenerar el minificado.

Los botones **Valor de Manta** y **Gills originales** vuelven al valor por
defecto actual y a los gills tal como se trazaron.

> Al actualizar `mantaGills`, hay que escribir los valores **completos** de la
> combinación, no solo el código copiado: ese código muestra solo las
> diferencias con el valor por defecto anterior.

## Volver a trazar la mantarraya de Manta

`MagnetLogo.mantaRayPaths` sale de una imagen. Si Manta cambia su logo, o el
trazado necesita mejoras, hay que repetir el proceso. **El script que lo
generó no está en el repositorio**; esta es la receta.

**Fuente:** el PNG de 814 × 814 px con la mantarraya y el texto "MANTA". Solo se
usa la parte de la mantarraya (se descartan las filas del texto, aquí las
primeras 600). Como la imagen es de baja resolución, el trazado directo sale
con escalones; por eso se suaviza.

**Proceso** (se probó con Python y OpenCV):

1. Ampliar la imagen 4 veces con interpolación bicúbica (`K = 4`) y aplicar un
   desenfoque gaussiano de σ = 1,4 · K.
2. Umbralizar (valores oscuros < 128) y extraer los contornos con
   `findContours` en modo jerárquico. Quedan tres contornos: el cuerpo y los
   dos gills (los huecos). Se descartan los de área despreciable.
3. Suavizar cada contorno con un filtro gaussiano a lo largo de sus puntos, con
   una σ distinta según la zona. Se ajustó mirando el resultado ampliado:

   | Zona | σ (en puntos del contorno) |
   |------|----------------------------|
   | Cuerpo en general | 1,8 · K |
   | + cola (por debajo de y ≈ 385 de la imagen original) | + 7 · K |
   | + borde superior del ala izquierda y entre los cuernos | + 6 · K |
   | + borde inferior del ala derecha | + 7 · K |
   | Gill derecho | 2,6 · K |
   | Gill izquierdo | 5 · K |

   Las puntas de las alas y los cuernos quedan fuera del suavizado extra para
   no redondearlos.
4. Simplificar cada contorno con `approxPolyDP` (ε = 0,04 · K). Hay que
   conservar suficientes puntos donde el contorno se curva más: con pocos, la
   spline hace un quiebre (pasó en la punta del ala izquierda).
5. Escalar y centrar el cuerpo en la caja del isotipo
   (`MagnetLogo.isotypeWidth` × `MagnetLogo.isotypeHeight`, con el margen de
   `drawingPadding`), aplicando la misma transformación a los gills, y
   redondear a 3 decimales.
6. Reemplazar `MagnetLogo.mantaRayPaths` en `dist/logo.js` por el resultado.
   El orden importa: `[cuerpo, gill derecho, gill izquierdo]`.
7. Regenerar el minificado y revisar el logo ampliado (3×). Es más importante
   comprobar tramos largos y puntas que el conjunto.

Si se vuelve a trazar, probablemente haya que revisar también
`MagnetLogo.mantaGills` y los rangos de `gills.html`, porque dependen de la
geometría de cada gill.

## Límites conocidos

- El texto "MANTA" depende de la fuente del equipo, tanto en canvas como en
  SVG (ver [arquitectura.md](arquitectura.md#texto-manta-drawcustomtext)).
- El ícono de Font Awesome del generador solo se dibuja en el PNG.
- El PNG descargado tiene la resolución de la pantalla (ver
  [generador.md](generador.md#download-png)).
