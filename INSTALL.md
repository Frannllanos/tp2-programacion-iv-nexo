# Instalación inicial del proyecto

Este repositorio usa **npm workspaces**: `frontend` y `backend` viven en la misma carpeta raíz, pero cada uno tiene su propio `package.json`.

## 1. Verificar Node

Angular 22 requiere una versión compatible de Node.js:

- `22.22.3` o superior dentro de la rama 22;
- `24.15.0` o superior dentro de la rama 24;
- o Node 26.

Ejecutar:

```bash
node -v
npm -v
```

## 2. Instalar dependencias

Pararse en la carpeta raíz, donde están:

```text
frontend/
backend/
package.json
```

Ejecutar una sola vez:

```bash
npm install
```

No hay que instalar `@angular/core`, `@angular/forms` ni `@angular/router` a mano: ya están declarados en `frontend/package.json` y `npm install` los instala.

## 3. Si VS Code sigue mostrando "Cannot find module '@angular/...'"

Después de que `npm install` termine correctamente:

1. `Ctrl + Shift + P`.
2. Ejecutar `TypeScript: Restart TS Server`.
3. Si persiste, cerrar y volver a abrir VS Code sobre la **carpeta raíz del repositorio**.

## 4. Configuración TypeScript 6

Los `tsconfig.json` ya fueron actualizados para TypeScript 6:

- se eliminó `baseUrl`, deprecado en TypeScript 6;
- se eliminó `downlevelIteration`, también deprecado;
- el frontend usa `module: preserve` + `moduleResolution: bundler`;
- el backend declara `rootDir: ./src` y `types: ["node"]`.

## 5. Levantar el proyecto

Cuando estén configurados `.env`, MongoDB y Cloudinary:

```bash
npm run dev
```

También se pueden levantar por separado:

```bash
npm run start:front
npm run start:back
```
