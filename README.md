# NEXO - TP #2 Programación IV

Repositorio único con los dos proyectos exigidos por el TP:

- `frontend/`: Angular.
- `backend/`: NestJS + MongoDB/Mongoose.

## Alcance de esta entrega

Este repositorio contiene la implementacion acumulada de los **Sprint 1, 2, 3 y 4** del TP.

### Sprint 1-2

- Registro, login, publicaciones, Mi Perfil, imagenes, likes, paginacion y baja logica.

### Sprint 3

- Autenticacion JWT, autorizar/refrescar, guards e interceptor 401.
- Vista individual de publicacion con comentarios paginados y editables.
- Pantalla de validacion de sesion.

### Sprint 4

- Administracion de usuarios con alta/baja logica y roles.
- Administradores pueden dar de baja cualquier publicacion.
- Dashboard de estadisticas con rango de fechas y tres tipos de graficos.
- PWA, 3 pipes propias y 3 directivas propias.
- JWT ajustado a 3 minutos y aviso 1 minuto antes segun la correccion final del profesor.

Ver [`SPRINT4-CHECKLIST.md`](./SPRINT4-CHECKLIST.md) para el detalle.

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

## Autenticacion actual

La aplicacion usa JWT. En el navegador se conserva una unica entrada `nexo_sesion`, que contiene el objeto `usuario` y el `token`. Al iniciar o recargar la aplicacion se muestra una vez la pantalla de carga mientras se determina o valida la sesion. Las rutas sensibles del backend validan el token y las rutas administrativas validan ademas el rol `administrador`.

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
