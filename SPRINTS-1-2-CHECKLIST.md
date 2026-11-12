# Checklist de corrección - Sprint 1 y Sprint 2

## Sprint 1 - Front

- [x] Proyecto Angular.
- [x] Registro.
- [x] Login.
- [x] Publicaciones.
- [x] Mi Perfil.
- [x] Navegación.
- [x] Favicon propio.
- [x] Diseño trabajado y responsive.
- [x] Login con validaciones y mensajes.
- [x] Contraseña: mínimo 8, una mayúscula y un número.
- [x] Registro con nombre, apellido, correo, username, contraseña, repetir contraseña, fecha de nacimiento y descripción.
- [x] Campo file para foto de perfil.
- [x] Perfil de usuario modelado (`usuario` / `administrador`).
- [ ] Deploy: requiere URL pública una vez configurados MongoDB/Cloudinary/backend.

## Sprint 1 - Back

- [x] Proyecto NestJS.
- [x] Módulo Autenticación.
- [x] Módulo Usuarios.
- [x] Módulo Publicaciones.
- [x] POST registro.
- [x] DTO + ValidationPipe.
- [x] Contraseña hasheada con bcrypt.
- [x] Foto de perfil recibida con Multer.
- [x] Inspección/normalización con Sharp.
- [x] Cloudinary preparado y URL guardada en MongoDB.
- [x] POST login por correo o username.
- [x] Login devuelve datos públicos del usuario, nunca el hash.

## Sprint 2 - Front

- [x] Listado de publicaciones.
- [x] Orden fecha por defecto.
- [x] Orden por cantidad de Me Gusta.
- [x] Paginación.
- [x] Cada publicación es un componente.
- [x] Dar y quitar Me Gusta.
- [x] Eliminar publicaciones propias.
- [x] Formulario para crear publicaciones.
- [x] Mi Perfil muestra datos y foto.
- [x] Mi Perfil muestra últimas 3 publicaciones.
- [x] Mi Perfil renderiza el área de comentarios existente en cada publicación. La API de comentarios se implementa en Sprint 3.

## Sprint 2 - Back

- [x] Alta de publicaciones.
- [x] Listado.
- [x] Baja lógica.
- [x] Imagen opcional almacenada en Cloudinary.
- [x] DELETE solo autor o administrador.
- [x] GET orden por fecha/likes.
- [x] GET filtro por usuario.
- [x] GET offset/limit.
- [x] POST Me Gusta.
- [x] Un usuario solo puede dar un Me Gusta.
- [x] DELETE Me Gusta solo si existía previamente.

## Fuera de alcance intencional

- [ ] JWT/cookies.
- [ ] Token 15 minutos.
- [ ] Autorizar/refrescar.
- [ ] Comentarios controller.
- [ ] Spinner inicial.
- [ ] Dashboard admin.
- [ ] Estadísticas.
- [ ] PWA.
- [ ] Pipes propias.
- [ ] Directivas propias.
