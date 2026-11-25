# API - Sprint 1 y 2

Base local: `http://localhost:3000/api`

## Salud

### GET `/health`

Respuesta `200`.

## Autenticación

### POST `/auth/registro`

`multipart/form-data`

Campos:

- `nombre`
- `apellido`
- `correo`
- `nombreUsuario`
- `contrasena`
- `repetirContrasena`
- `fechaNacimiento`
- `descripcion`
- `imagenPerfil` (archivo obligatorio)

Respuestas principales:

- `201`: usuario creado.
- `400`: validación/imagen inválida.
- `409`: correo o username existente.

### POST `/auth/login`

JSON:

```json
{
  "identificador": "usuario_o_correo",
  "contrasena": "Clave123"
}
```

- `200`: usuario válido.
- `401`: credenciales incorrectas.

## Usuarios

### GET `/usuarios/:id`

Obtiene datos públicos del usuario.

## Publicaciones

### POST `/publicaciones`

`multipart/form-data`

- `usuarioId`
- `titulo`
- `descripcion`
- `imagen` opcional

### GET `/publicaciones`

Query params:

- `orden=fecha|likes`
- `offset=0`
- `limit=6` (máximo 50)
- `usuarioId=<mongoId>` opcional

Ejemplo:

```text
GET /api/publicaciones?orden=likes&offset=0&limit=6
```

### DELETE `/publicaciones/:id?usuarioId=<actorId>`

Baja lógica. Solo autor o administrador.

### POST `/publicaciones/:id/me-gusta`

```json
{
  "usuarioId": "..."
}
```

### DELETE `/publicaciones/:id/me-gusta`

```json
{
  "usuarioId": "..."
}
```

> En Sprint 3, `usuarioId` como identidad del actor se reemplaza por la identidad obtenida del JWT.

## Sprint 4 - Administracion de usuarios

Todas estas rutas requieren `Authorization: Bearer <JWT>` y perfil `administrador`.

- `GET /api/usuarios`: lista usuarios.
- `POST /api/usuarios`: crea un usuario o administrador. Recibe `multipart/form-data` con los mismos campos del registro, `perfil` e `imagenPerfil`.
- `DELETE /api/usuarios/:id`: baja logica del usuario.
- `POST /api/usuarios/:id/habilitar`: alta logica de un usuario deshabilitado.

## Sprint 4 - Estadisticas

Todas estas rutas requieren JWT de administrador y parametros `desde=YYYY-MM-DD&hasta=YYYY-MM-DD`.

- `GET /api/publicaciones/estadisticas/publicaciones-por-usuario`
- `GET /api/publicaciones/estadisticas/comentarios-por-dia`
- `GET /api/publicaciones/estadisticas/comentarios-por-publicacion`
