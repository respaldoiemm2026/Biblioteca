# Backend - Biblioteca Isaac

API REST (Express + Prisma + PostgreSQL) para la gestión de una biblioteca:
usuarios, autores, editoriales, libros, categorías, préstamos y roles.

## Requisitos

- Node.js
- Una base de datos PostgreSQL (por ejemplo, Neon)

## Configuración

1. Instalar dependencias:

   ```
   npm install
   ```

2. Copiar `.env.example` a `.env` y completar los valores reales
   (`DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).

3. Aplicar las migraciones:

   ```
   npx prisma migrate deploy
   ```

4. Poblar los roles (`admin`, `bibliotecario`, `usuario`) y crear el usuario
   admin inicial (usa `ADMIN_EMAIL`/`ADMIN_PASSWORD` del `.env`):

   ```
   npm run seed
   ```

## Ejecutar

```
npm start        # producción
npm run dev      # desarrollo, con nodemon
```

El servidor queda escuchando en `http://localhost:3000`.

## Autenticación

- `POST /auth/register` — registro público. Siempre crea el usuario con rol
  `usuario` (no se puede auto-asignar `admin`).
- `POST /auth/login` — devuelve el JWT en el body y lo setea además como
  cookie httpOnly `token`.
- `GET /auth/me` — datos del usuario autenticado (requiere sesión).
- `POST /auth/logout` — invalida el token en la base de datos y limpia la
  cookie (requiere sesión).

El resto de rutas acepta el token vía cookie `token` o header
`Authorization: Bearer <token>`.

## Rutas protegidas (requieren rol `admin`)

`usuario`, `autor`, `categoria`, `editorial`, `libro`, `libroCategoria`,
`prestamo`, `detallePrestamo`, `roles` — CRUD completo (GET/POST/PUT/DELETE)
solo para usuarios con rol `admin`. El rol `bibliotecario` existe en el
modelo de datos pero todavía no tiene permisos especiales asignados.

## Despliegue

### Backend en Render (Web Service)

- **Root Directory:** `back_end`
- **Build Command:** `npm install && npm run build`
  (`prisma generate` + `prisma migrate deploy`)
- **Start Command:** `npm start`
- **Health Check Path:** `/health`
- **Variables de entorno:** `DATABASE_URL`, `JWT_SECRET` (nuevo, largo y
  aleatorio), `JWT_EXPIRES_IN`, `NODE_ENV=production` y `FRONTEND_URL`
  (la URL de Vercel). `PORT` la define Render.
- El seed se ejecuta **una sola vez** desde tu equipo, apuntando el `.env`
  a la base de producción: `npm run seed`.

### Frontend en Vercel

- **Root Directory:** `front_end`, Framework Preset: *Other*, sin build command.
- En `front_end/vercel.json` reemplaza `https://TU-BACKEND.onrender.com`
  por la URL real del servicio de Render.
- El frontend llama a `/api/...`, que Vercel reenvía al backend. Así la
  cookie de sesión queda en el mismo dominio que el frontend. En local
  (`localhost`/`127.0.0.1`) `Script/config.js` usa `http://localhost:3000`.
