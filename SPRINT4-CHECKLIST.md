# Sprint 4 - Checklist final

## Correcciones previas del profesor

- [x] Al iniciar o recargar cualquier ruta se muestra una vez la pantalla de carga/spinner antes de continuar.
- [x] Local Storage conserva una sola entrada `nexo_sesion` con `usuario` + `token`, sin duplicar el usuario en claves separadas.
- [x] Mi Perfil ya no muestra comentarios debajo de las ultimas 3 publicaciones.
- [x] Las publicaciones de Mi Perfil abren el detalle completo con comentarios.
- [x] Se puede abrir una publicacion haciendo click sobre cualquier zona no interactiva de la tarjeta.
- [x] Token JWT con expiracion de 3 minutos.
- [x] Aviso de expiracion exactamente 1 minuto antes del vencimiento.

## Sprint 4 Front

- [x] Administradores pueden dar de baja cualquier publicacion desde feed y detalle.
- [x] Dashboard / usuarios exclusivo para administradores.
- [x] Listado de usuarios.
- [x] Alta de usuario con los mismos campos del registro y radio buttons usuario/administrador.
- [x] Alta y baja logica de usuarios.
- [x] Dashboard / estadisticas exclusivo para administradores.
- [x] Publicaciones por usuario en periodo configurable: grafico de barras.
- [x] Comentarios realizados por dia en periodo configurable: grafico de lineas.
- [x] Comentarios por publicacion en periodo configurable: grafico tipo torta/donut.
- [x] PWA configurada con manifest, iconos y Angular Service Worker.
- [x] 3 pipes propias: nombreCompleto, perfilEtiqueta, textoCorto.
- [x] 3 directivas propias: appAutoFocus, appAdminAccent, appNavegable.

## Sprint 4 Back

- [x] Endpoints de administracion de usuarios protegidos por JWT + rol administrador.
- [x] GET /api/usuarios: listado.
- [x] POST /api/usuarios: alta con perfil usuario/administrador.
- [x] DELETE /api/usuarios/:id: baja logica.
- [x] POST /api/usuarios/:id/habilitar: alta logica.
- [x] Login rechaza usuarios deshabilitados.
- [x] JWT guard rechaza sesiones de usuarios deshabilitados.
- [x] Endpoints GET de estadisticas protegidos por administrador.

## Antes de entregar

- [ ] Completar `ENTREGA.txt` con URL publica y credenciales reales.
- [ ] Probar login de usuario normal.
- [ ] Probar login de administrador.
- [ ] Probar que un usuario deshabilitado no pueda ingresar.
- [ ] Probar baja de publicacion ajena con administrador.
- [ ] Probar los tres graficos cambiando el rango de fechas.
- [ ] Verificar PWA en build de produccion.
