# Generador de logos de Magnet y Manta

Esta página y librería generan los logos de dos empresas: **Magnet** y
**Manta**. Ambos se dibujan con la misma clase, `MagnetLogo`, sobre un
`<canvas>`, y se pueden descargar como PNG o como SVG vectorial.

Se publica en <https://logo.magnet.cl> (archivo `CNAME`, rama `gh-pages`).

## Contenido de esta documentación

| Documento | Para qué sirve |
|-----------|----------------|
| [generador.md](generador.md) | Cómo usar el generador web (`index.html`): pestañas, formulario y descargas. |
| [uso.md](uso.md) | Cómo usar la librería `MagnetLogo` desde código: opciones, ejemplos y `toSVG`. |
| [arquitectura.md](arquitectura.md) | Cómo funciona por dentro: dibujo, la mantarraya de Manta, los gills y el SVG. |
| [mantenimiento.md](mantenimiento.md) | Cómo regenerar el minificado, ajustar los gills y volver a trazar la mantarraya. |

## Mapa de archivos

| Archivo | Qué es |
|---------|--------|
| `dist/logo.js` | La librería `MagnetLogo`. Es el código fuente: se edita directamente. |
| `dist/logo.min.js` | Versión minificada de `logo.js`. Se regenera, no se edita (ver [mantenimiento.md](mantenimiento.md)). |
| `index.html` | Página principal: ejemplos, paleta de colores y generador de logos. |
| `javascripts/index.js` | Lógica de `index.html`: ejemplos, formulario, pestañas y descargas. |
| `gills.html` | Página para comparar variaciones de los gills (líneas del torso) de Manta. |
| `javascripts/gills.js` | Lógica de `gills.html`. |
| `stylesheets/` | Estilos de la página (tema Cayman de GitHub Pages y ajustes propios). |
| `images/logo.png` | Imagen usada como vista previa (`og:image`). |
| `CNAME` | Dominio de la página: `logo.magnet.cl`. |

No hay paso de compilación: la librería y las páginas se cargan tal cual en el
navegador. El único artefacto generado es `dist/logo.min.js`.

## Inicio rápido

```html
<canvas id="logo" style="width:100%;"></canvas>
<script src="dist/logo.js"></script>
<script>
  // logo de Magnet (por defecto)
  new MagnetLogo(document.getElementById('logo')).render();

  // logo de Manta
  new MagnetLogo(document.getElementById('logo')).render({
    mantaShape: 'manta',
    text: 'MANTA',
    mantaColor: '#003B54',
    textColor: '#003B54'
  });
</script>
```

Más ejemplos y todas las opciones en [uso.md](uso.md).
