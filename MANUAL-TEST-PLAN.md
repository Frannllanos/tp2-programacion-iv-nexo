# Plan de pruebas manual - Sprint 1 y 2

Ejecutar después de configurar MongoDB y Cloudinary.

## 1. Health

- `GET /api/health` -> 200.

## 2. Registro

Caso válido:
- completar todos los campos;
- contraseña `Clave123` o equivalente;
- adjuntar imagen menor a 5 MB;
- esperar 201;
- verificar en MongoDB que existe el usuario y que solo se guardó `contrasenaHash`;
- verificar que `fotoPerfilUrl` sea una URL remota.

Casos inválidos:
- correo incorrecto -> 400;
- contraseña sin mayúscula -> 400;
- contraseña sin número -> 400;
- contraseña menor a 8 -> 400;
- contraseñas distintas -> 400;
- sin imagen -> 400;
- correo repetido -> 409;
- username repetido -> 409.

## 3. Login

- login por correo correcto -> 200;
- login por username correcto -> 200;
- contraseña incorrecta -> 401;
- usuario inexistente -> 401;
- comprobar que la respuesta no contiene `contrasenaHash`.

## 4. Publicaciones

- crear sin imagen -> 201;
- crear con imagen -> 201 y URL de Cloudinary;
- título vacío -> 400;
- listar por fecha -> 200, recientes primero;
- listar por likes -> 200, mayor likesCount primero;
- `offset=0&limit=2` devuelve máximo 2;
- filtrar por `usuarioId` devuelve solo publicaciones del usuario.

## 5. Me gusta

- usuario A da like -> 200 y `likesCount + 1`;
- usuario A repite like -> 409;
- usuario A quita like -> 200 y `likesCount - 1`;
- usuario A vuelve a quitarlo -> 400.

## 6. Baja lógica

- autor elimina su publicación -> 204;
- la publicación queda `activa=false` en MongoDB;
- ya no aparece en GET;
- otro usuario intenta eliminarla -> 403;
- usuario con `perfil=administrador` puede eliminarla desde la API.

## 7. Frontend

- sin sesión temporal, las pantallas siguen siendo navegables como pide Sprint 1; las acciones personales invitan a iniciar sesión;
- registro muestra mensajes por campo;
- registro muestra preview de foto;
- login acepta correo o username;
- feed crea posts, ordena, pagina, da/quita likes y elimina propios;
- no se usa `alert()`;
- Mi Perfil muestra datos, foto y máximo 3 publicaciones recientes;
- refrescar navegador mantiene sesión temporal de Sprint 1-2.

## 8. Regresión de alcance

Confirmar que todavía NO existen:
- JWT;
- cookies de autenticación;
- refresh token;
- controller de comentarios;
- dashboard;
- PWA;
- pipes propias;
- directivas propias.
