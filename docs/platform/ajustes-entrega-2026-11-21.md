# Ajustes para conservar la versión aprobada — 21/11/2026

Solicitud: conservar el diseño y las interacciones de Lovable, conectar las consultas y facilitar la carga de propiedades y fotos reales. No se modifica WordPress, DNS, main ni el sitio comercial actual.

## Cambios

- Cada página reutiliza el snapshot validado del loader raíz. La Home deja de solicitar nuevamente todo el contenido para destacadas, novedades y equipo. No se agrega una caché compartida que pueda mezclar borradores o sesiones.
- Contacto y Publicar conservan los campos, clases y botones aprobados. Los valores iniciales de una consulta de propiedad se mapean correctamente al contrato persistido.
- El formulario valida campos y consentimiento, muestra errores accesibles, conserva el identificador al reintentar un envío sin cambios y evita confirmar consultas antes de su persistencia. Modificar una consulta permite iniciar un envío nuevo.
- Los filtros adicionales conservan su visibilidad inicial. Comprar/Alquilar mantienen el texto aprobado cuando el catálogo conserva sus etiquetas iniciales.
- La política y tres formularios se publicaron en staging con aprobación explícita del usuario. Se conservaron revisiones anteriores y auditoría. Las consultas se guardan, el email automático permanece deshabilitado y WhatsApp requiere la acción posterior del visitante.

## Verificación local

- 45 pruebas unitarias aprobadas; nuevas pruebas para validación, consentimiento, reintentos, valores iniciales y reutilización del snapshot.
- Tipado y compilación: ver informes de esta entrega en evidence/.
- 32 capturas aprobadas sin diferencias. La ejecución completa tuvo 65 casos aprobados, 1 omitido y 2 fallos (arranque de navegador y cierre de archivo de trazas de Windows). Se repitieron los ocho casos de acceso/movimiento reducido en las cuatro resoluciones, sin captura de trazas y con las mismas aserciones: 8 aprobados.
- PostgreSQL local verificó la actualización atómica de política/formularios, el historial, la ocultación de destinatarios y el guardado de una consulta con consentimiento.

## Alcance pendiente

Las propiedades, las nuevas fotos de inmuebles y Nosotros y cualquier corrección de contacto se cargarán a partir del material real del usuario. No se sustituyen por publicaciones ni imágenes ficticias. La revisión jurídica y de proveedores sigue pendiente para la entrega comercial; la aprobación de la política fue exclusivamente para pruebas. La revisión de conservación a los 12 meses es un procedimiento manual, no una eliminación automática implementada.

La evidencia remota de formularios y rendimiento se incorporará después del despliegue del commit verificado. Los tiempos de laboratorio de una sesión no son métricas de usuarios reales ni certifican Core Web Vitals.


La CLI de Git utilizaba una conexión sin permiso de escritura. El usuario reconectó GitHub con la cuenta nicolas2233v, cuyo acceso de escritura fue verificado. Los archivos se publican mediante el conector sobre la rama existente, conservando su commit padre y sin cambiar main.
