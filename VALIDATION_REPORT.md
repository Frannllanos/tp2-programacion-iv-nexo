# Informe de validación de la entrega generada

## Alcance revisado

Se implementó únicamente Sprint 1 y Sprint 2 del TP #2.

## Controles estáticos realizados

- Todos los `.json` se parsean correctamente.
- Todos los imports relativos apuntan a archivos existentes.
- Todos los `templateUrl` y `styleUrl` declarados apuntan a archivos existentes.
- No existe ninguna llamada a `alert()`.
- No existe implementación de JWT, `JwtService`, `cookie-parser` ni refresh token en el código fuente.
- Se verificó sintaxis TypeScript con el compilador disponible en el entorno; no se detectaron errores sintácticos.
- Se revisaron manualmente los flujos principales: registro, login, publicación, listado, paginación, likes y baja lógica.

## Lo que todavía requiere la siguiente etapa

Este ZIP no incluye credenciales ni infraestructura externa. Para realizar una prueba end-to-end faltan:

1. `npm install` para descargar dependencias.
2. Crear/configurar MongoDB (local o Atlas).
3. Crear/configurar Cloudinary.
4. Completar `backend/.env`.
5. Ejecutar frontend y backend.
6. Corregir cualquier incompatibilidad puntual que aparezca al instalar las versiones exactas resueltas por npm.
7. Realizar las pruebas de `MANUAL-TEST-PLAN.md`.
8. Configurar URLs de producción y desplegar.

El entorno usado para generar el ZIP no tuvo acceso operativo al registry de npm, por lo que no fue posible ejecutar un `npm install` y build real. Por eso la próxima etapa debe comenzar instalando dependencias y levantando MongoDB/Cloudinary antes de considerar la entrega cerrada.
