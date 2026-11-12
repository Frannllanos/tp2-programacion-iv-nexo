# NEXO - TP #2 Programación IV

Repositorio único con los dos proyectos exigidos por el TP:

- `frontend/`: Angular.
- `backend/`: NestJS + MongoDB/Mongoose.

## Alcance de esta entrega

Este repositorio implementa **Sprint 1 y Sprint 2 únicamente**. No se implementan JWT, cookies, refresh token, comentarios editables, dashboard, PWA, pipes/directivas propias ni requerimientos de Sprint 3/4/5/6.

### Sprint 1

- Angular con pantallas Registro, Login, Publicaciones y Mi Perfil.
- Navegación, diseño responsive y favicon propio.
- Formularios reactivos con validaciones y mensajes.
- NestJS con módulos `autenticacion`, `usuarios` y `publicaciones`.
- Registro con contraseña hasheada y foto de perfil.
- Login por correo o nombre de usuario.
- MongoDB/Mongoose preparado.
- Cloudinary + Multer + Sharp preparados para archivos.
- Códigos HTTP coherentes.

### Sprint 2

- Alta de publicaciones con título, descripción e imagen opcional.
- Listado ordenado por fecha o cantidad de likes.
- Paginación con `offset` y `limit`.
- Publicación como componente Angular independiente.
- Dar/quitar Me Gusta con máximo un like por usuario.
- Baja lógica de publicaciones.
- Eliminación autorizada para autor o administrador en backend.
- Mi Perfil con todos los datos y últimas 3 publicaciones.
- Estructura de comentarios visible en Mi Perfil, sin implementar todavía el controller de comentarios (corresponde a Sprint 3).

## Requisitos

Recomendado:

- Node.js compatible con Angular 22: `^22.22.3`, `^24.15.0` o `>=26`.
- npm 10+.
- MongoDB local o MongoDB Atlas.
- Cuenta de Cloudinary para almacenar imágenes.

## Instalación

> **Importante:** el ZIP no incluye `node_modules`. Antes de evaluar errores de imports como `@angular/core`, `@angular/forms` o `@angular/router`, hay que instalar las dependencias.

Desde la raíz del repositorio (la carpeta que contiene `frontend`, `backend` y el `package.json` principal):

```bash
npm install
```

Ese único comando instala las dependencias de la raíz y de los dos workspaces (`frontend` y `backend`). Si VS Code sigue mostrando imports en rojo después de terminar, ejecutar `TypeScript: Restart TS Server` desde la paleta de comandos o reiniciar VS Code.

Crear el archivo de entorno del backend:

```bash
cp backend/.env.example backend/.env
```

En Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Completar `backend/.env` con MongoDB y Cloudinary.

## Desarrollo

Levantar ambos proyectos:

```bash
npm run dev
```

O por separado:

```bash
npm run start:front
npm run start:back
```

Direcciones locales por defecto:

- Angular: `http://localhost:4200`
- NestJS: `http://localhost:3000/api`
- Health: `http://localhost:3000/api/health`

## Nota importante sobre autenticación en Sprint 1-2

El TP recién exige JWT en Sprint 3. Sprint 1 pide navegación sin límites de accesibilidad. Para poder demostrar acciones asociadas a un usuario en Sprint 2, el frontend conserva temporalmente el **objeto de usuario devuelto por el login** en `localStorage`.

Esto **NO es autenticación segura de backend** y está señalado en el código como deuda intencional de Sprint 3. En Sprint 3 se reemplaza por JWT/cookie, guard de NestJS y autorización basada en token.

## Imágenes

El flujo preparado sigue la arquitectura vista en clase:

`Angular FormData -> NestJS -> Multer (memoria) -> Sharp (decodificación/normalización) -> Cloudinary -> URL en MongoDB`

La extensión y el `mimetype` enviados por el navegador no se consideran suficientes. Sharp intenta decodificar los bytes reales antes de subir la imagen.

## MongoDB

El proyecto no contiene credenciales reales. La conexión se configura con `MONGODB_URI` en `.env`.

Ejemplo local:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/red_social_tp2
```

## Deploy

El frontend incluye `public/_redirects` para que las rutas de Angular funcionen en Netlify.

Antes del deploy se debe:

1. desplegar el backend;
2. configurar MongoDB Atlas y Cloudinary;
3. colocar la URL pública del backend en `frontend/src/environments/environment.production.ts`;
4. definir `FRONTEND_URL` en el backend con el dominio del frontend;
5. compilar y probar ambos proyectos.

Ver también:

- [`SPRINTS-1-2-CHECKLIST.md`](./SPRINTS-1-2-CHECKLIST.md)
- [`API.md`](./API.md)
- [`ARCHITECTURE.md`](./ARCHITECTURE.md)
