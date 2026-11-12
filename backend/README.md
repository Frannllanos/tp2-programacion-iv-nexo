# Backend NEXO

NestJS + Mongoose + MongoDB.

## Configuración

Copiar `.env.example` a `.env` y configurar credenciales.

## Decisiones Sprint 1-2

- `ValidationPipe` global con whitelist y rechazo de propiedades no declaradas.
- Controllers livianos; lógica en services.
- DTOs como clases para `class-validator`.
- Contraseñas con bcrypt (`hash` + `compare`), nunca se devuelven al cliente.
- Baja de publicación lógica mediante `activa=false`.
- `usuarioId` se recibe temporalmente en operaciones sensibles porque JWT corresponde al Sprint 3.
- Imágenes: Multer en memoria -> Sharp -> Cloudinary -> URL en MongoDB.
