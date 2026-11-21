# Carga comercial y marca — 21/11/2026

Cambios de contenido realizados únicamente en el entorno protegido de pruebas existente, mediante la sesión real del propietario y los endpoints de guardado, publicación y medios de la aplicación. No se modificaron main, DNS, WordPress, migraciones ni el sitio comercial. No se necesitó volver a desplegar el frontend.

## Contenido persistido y publicado

- Casa premium amoblada en Jardín Claret: ID 2b028e64-09d7-468f-8305-1a161562a83f; revisión 2; 22 fotos. Venta, USD 490.000, Córdoba Capital/Jardín Claret, 4 dormitorios, 4 baños, cochera 1, terreno 426,30 m². Cubierta total calculada: 181,05 + 113,42 = 294,47 m²; ambos valores originales se conservan en la descripción.
- Casa con pileta y quincho en Córdoba Capital: ID 0a51a678-b04c-487c-a0da-8b9c8ee831d2; revisión 1; 29 fotos. Venta, precio a consultar, 3 dormitorios, 2 baños, cochera 2, terreno 450 m², cubierta 221 m². No se asignó barrio, dirección ni coordenadas. La posibilidad de incluir ciertos muebles se conserva en la descripción; no se declara completamente amoblada.
- Home: revisión 3; Nosotros: revisión 2. Se reemplazó exclusivamente la referencia de imagen del bloque de equipo por la grupal mirando a cámara elegida por el usuario. Se conservaron textos, escenas de scroll, botones, orden y overrides existentes.
- Configuración global: revisión 5. Logos y favicon oficiales, extraídos del PDF proporcionado. El símbolo proviene de la página 8, el logotipo de la página 12. Se retiraron los fondos de diapositiva del SVG intermedio y se rasterizaron los trazados y letras originales; no se reconstruyó la marca con una tipografía aproximada. No se publicaron SVG ni scripts.
- El logo blanco transparente se usa en header, menú y footer oscuros. La variante negra también está en biblioteca. Favicon cuadrado con símbolo blanco sobre negro, validado visualmente a 32 px. Los archivos PNG de referencia se incluyen junto a esta evidencia. La aplicación entrega las variantes WebP saneadas por el servidor.

## Biblioteca e integridad

Se cargaron los 60 archivos fotográficos únicos del envío, por la API autenticada con validación MIME, conversión WebP y eliminación de EXIF. Las 8 fotos de oficina/equipo están disponibles en la biblioteca privada; solo la elegida se publicó en el sitio. La foto del quincho moderno repetida entre envíos pertenece a Jardín Claret y no figura en la segunda casa. El baño clásico enviado entre las fotos de la primera casa quedó sin asignar, para confirmar su pertenencia. No se eliminaron originales ni registros anteriores.

No se inventaron domicilios, coordenadas, cargos, fotos individuales ni información comercial. El inmueble de prueba archivado previo permanece intacto. Se respetaron IDs, referencias y control de concurrencia al guardar; se conservaron revisiones y auditoría mediante las funciones existentes.

## Verificación ejecutada

- Guardado real de las dos propiedades y páginas mediante el servidor de la aplicación; validación previa con los contratos Zod existentes.
- Publicación de Jardín Claret desde el botón real del administrador, confirmada por UI y respuesta; los demás documentos mediante esa misma función autenticada y CAS.
- Lectura de base de datos confirmó las cinco revisiones publicadas indicadas arriba.
- Chromium sin sesión administrativa: HTTP 200 en Inicio, Nosotros, catálogo y las dos fichas; títulos únicos, staging noindex y cero errores JavaScript en esas navegaciones.
- Las 51 referencias de galería devolvieron HTTP 200 sin sesión administrativa; la foto sin asignar devolvió 404 en ese mismo contexto. La biblioteca no se volvió pública.
- Favicon publicado respondió HTTP 200 con image/webp. Logo verificado visualmente sobre fondos claros/oscuros y símbolo a 32 px.
- Capturas desktop 1440×1000 y mobile 390×844; sin overflow horizontal en Nosotros, catálogo y ambas fichas. Se inspeccionaron las capturas del catálogo y Nosotros; las cuatro personas quedan visibles en ambas resoluciones.
- public-checks.json conserva la observación inmediata del DOM: las entradas de images incluyen imágenes lazy que aún no se habían solicitado al capturar; no equivalen a respuestas HTTP fallidas. Todas las referencias de las galerías se comprobaron además por HTTP.

Esta entrega modifica datos del CMS, no código de ejecución. La compilación, tipado y regresión de la versión desplegada constan en ajustes-entrega-2026-11-21.md; no se presentan como nuevas ejecuciones de esta carga.

## Pendientes concretos

Confirmar barrio de la segunda casa si se desea mostrarlo y pertenencia de la foto de baño sin asignar. Direcciones exactas son opcionales y no se publican por defecto. Se mantiene pendiente la revisión jurídica/comercial para producción: la política actual fue aprobada únicamente para pruebas. No se realizaron envíos a WhatsApp, emails ni reservas de Calendly.

La verificación adicional confirmó el filtro URL dormitorios=4 (solo Jardín Claret), persistencia de favoritos y avance de la galería. Tras recorrer Inicio para activar el lazy loading no quedaron imágenes cargadas con error. Ver interaction-checks.json.
