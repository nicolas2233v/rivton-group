# Galería, navegación, footer y oficina — 21/11/2026

Alcance solicitado por el usuario: galería táctil estable, miniaturas bajo la imagen principal, ficha desktop más compacta, footer con marcas y enlaces comerciales, navegación que se vuelve flotante al desplazarse y fotografías reales de la oficina en Nosotros y Contacto. Se conserva TanStack Start, la coreografía de Inicio y la navegación inferior mobile. Solo se actualiza el preview protegido de la rama codex/rivton-platform.

## Implementación

- PropertyGallery utiliza la dependencia Embla 8 ya instalada. Cada foto conserva su nodo de imagen; no se intercambia el src de un único elemento al navegar. Las selecciones de flechas, teclado, miniaturas y arrastre se sincronizan con el índice del carrusel, sin cierres con un índice anterior. Se cargan anticipadamente las fotos adyacentes, se reconoce una imagen ya cargada antes de hidratar y hay estado de carga/error. No hay autoplay. Se conserva el desplazamiento vertical y pinch zoom; las acciones por teclado/botón respetan reduced motion.
- Las miniaturas están dentro del bloque de galería, inmediatamente debajo de la foto, con desplazamiento horizontal y selección accesible. La descripción ocupa el espacio bajo la galería en desktop; en mobile mantiene el orden fotos, información y descripción.
- El header comienza amplio y transparente, y a partir de 72 px de scroll se contrae a una barra de hasta 960 px con fondo translúcido, borde y blur de los tokens actuales. En mobile mantiene márgenes laterales y botones existentes. No se agregan los mensajes promocionales ni los colores de Henry.
- Footer con navegación, oficina, horarios y email administrados; iconos de Instagram y WhatsApp con enlaces tomados de la configuración; acceso mediante el logo de Tempo Hogar a la URL configurada. No se envían mensajes al abrir estos enlaces ni se registran consultas confirmadas por un clic.
- El logo de Tempo Hogar se obtuvo del recurso publicado en https://www.tempohogar.com.ar/media/tempo-hogar/logo-beige.png y se redujo a 384×384 conservando la imagen completa. Los pictogramas provienen de los SVG de marca distribuidos por Simple Icons (instagram.svg y whatsapp.svg); son archivos estáticos de paths, sin código activo. No se agregaron librerías ni scripts de terceros.

## Datos de oficina publicados en staging

- Nosotros, revisión 3: se conserva la foto grupal en el hero. Se agregan los elementos office y office-photo-reunion, office-photo-atencion y office-photo-trabajo, renderizados por la página y editables con los controles existentes de imagen/texto/responsive/visibilidad del constructor.
- Contacto, revisión 2: el campo image del encabezado, que ya se renderizaba en la columna de contacto, referencia la foto real de la fachada. Se conservan formulario, enlaces y datos existentes.
- Las publicaciones se realizaron con la sesión del propietario, los endpoints existentes, validación Zod y control de revisión. No se escribieron directamente documentos publicados en SQL ni se modificaron migraciones.

## Evidencia local

- Tipado TypeScript: aprobado.
- Build de producción: aprobado.
- Suite unitaria: 45 pruebas aprobadas en 8 archivos, ejecutada en un solo worker. Las primeras ejecuciones tuvieron errores del aislamiento al renombrar temporales y resolución transitoria de módulos en workers paralelos; no se presentan esas ejecuciones como aprobadas.
- Pruebas nuevas de navegador: navegación rápida (19 clics), imagen seleccionada realmente cargada, teclado, ubicación de miniaturas, swipe mediante eventos táctiles de Chromium, transición del header y enlace/logo de Tempo. Desktop, mobile y mobile corto aprobados; en horizontal se corrigió el gesto de prueba que inicialmente apuntaba fuera de la pantalla. El caso táctil de desktop se omite expresamente.
- Las capturas anteriores de regresión visual no se regeneran automáticamente: footer, header, ficha y galería son cambios visuales pedidos expresamente. La coreografía de escenas de Inicio no se modifica.

La comprobación sobre el despliegue protegido con el catálogo y las fotos reales se registra por separado tras publicar este commit. No se declara QA completa, compatibilidad universal ni aprobación de producción.
## Ampliación: Contacto y Publicar

A pedido del usuario se revisaron también ambas páginas en desktop. Publicar ahora tiene una columna editorial con la imagen existente de proporción controlada y un formulario en tarjeta a su lado; se evita colocar picture con display:contents como elemento directo de la grilla, que dejaba media pantalla vacía. Contacto presenta el formulario en tarjeta y la foto real de la fachada, dirección, horarios y canales de atención en un panel separado. Se respetan los textos publicados, campos, destinos, consentimiento y envío existentes.

La grilla compartida del formulario se aplica solo dentro de inquiry-form: dos columnas desde 640 px, mensaje y consentimiento de ancho completo y una columna en pantallas pequeñas. Los campos vacíos del fallback local se normalizan a strings para mostrar validaciones en castellano. No se cambian las respuestas ni la persistencia de formularios reales.

Verificación final de navegador local: 23 pruebas aprobadas y un caso táctil de desktop omitido en la ejecución conjunta de gallery-navigation e inquiry-layout, sin resultados inesperados ni flaky. Incluye las cuatro resoluciones, validación de formularios sin enviar datos, geometría desktop, swipe, teclado, clics rápidos, header, footer, visibilidad de escenas y retorno del foco al buscador. Las capturas visuales antiguas fallan por los cambios visuales expresamente solicitados del header; no se ocultó ese resultado ni se sobrescribieron sus baselines.
