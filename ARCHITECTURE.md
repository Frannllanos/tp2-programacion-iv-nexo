# Arquitectura

## Repositorio

```text
red-social-tp2/
├── frontend/   Angular
└── backend/    NestJS
```

## Flujo HTTP

```text
Usuario
  -> Componente Angular
  -> Servicio Angular
  -> HTTP
  -> Controller NestJS
  -> DTO + ValidationPipe
  -> Service NestJS
  -> Modelo Mongoose
  -> MongoDB
```

El controller coordina HTTP; el service concentra lógica; el schema define persistencia; el DTO define y valida la forma de entrada.

## Archivos

```text
Angular FormData
  -> FileInterceptor / Multer
  -> Buffer en memoria
  -> Sharp (decodifica y normaliza)
  -> Cloudinary
  -> URL/public_id
  -> MongoDB
```

No se guarda el archivo en el disco efímero del servidor.

## Sesión temporal Sprint 1-2

Como JWT pertenece al Sprint 3 y Sprint 1 pide navegación sin límites de accesibilidad, las rutas permanecen navegables. Cuando hay login, el frontend guarda el usuario público en `localStorage` para recordar qué usuario está usando la interfaz. El backend recibe temporalmente `usuarioId` en las operaciones que necesitan conocer al actor.

Esto permite demostrar el Sprint 2, pero **no debe confundirse con autorización real**. Sprint 3 debe reemplazar esa identidad declarada por la identidad verificada desde JWT.

## Publicaciones

Una publicación contiene:

- autor (`usuarioId`);
- título;
- descripción;
- URL/public_id de imagen opcional;
- arreglo de usuarios que dieron like;
- contador de likes;
- estado `activa` para baja lógica;
- arreglo de comentarios preparado para el futuro Sprint 3;
- timestamps.

La baja lógica cambia `activa` a `false`; los listados públicos consultan solo `activa: true`.
